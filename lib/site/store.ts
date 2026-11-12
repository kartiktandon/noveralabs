// Where the admin panel saves content and uploads: your MySQL database.
// Set these in Vercel (Settings → Environment Variables), then redeploy:
//   MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
//   MYSQL_SSL_CA  the CA certificate, pasted in full (-----BEGIN CERTIFICATE----- ...), if your host gives one
// The tables are created on first use. Until the database is set up the pages show lib/site/defaults.json.
import defaults from './defaults.json';
import { normalize } from './render.mjs';

export type Content = { cases: Record<string, any>[]; more: Record<string, any>[] };
type Pool = import('mysql2/promise').Pool;

export const templates = defaults.templates;
export const storageReady = () => Boolean(process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE);

let pool: Promise<Pool> | null = null;
let tablesReady: Promise<void> | null = null;

// One small connection pool per server instance, created on first use
async function db() {
  pool ??= import('mysql2/promise').then((mysql) =>
    mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      // Some setups store a pasted certificate's line breaks as "\n"
      ssl: process.env.MYSQL_SSL_CA
        ? { ca: process.env.MYSQL_SSL_CA.replace(/\\n/g, '\n'), rejectUnauthorized: true }
        : process.env.MYSQL_SSL === 'false'
          ? undefined
          : { rejectUnauthorized: true },
      connectionLimit: 3,
      connectTimeout: 10000,
      enableKeepAlive: true,
    }),
  );
  const p = await pool;
  tablesReady ??= (async () => {
    await p.query(`CREATE TABLE IF NOT EXISTS site_content (
      id VARCHAR(32) PRIMARY KEY, data LONGTEXT NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
    await p.query(`CREATE TABLE IF NOT EXISTS site_content_history (
      id INT AUTO_INCREMENT PRIMARY KEY, data LONGTEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await p.query(`CREATE TABLE IF NOT EXISTS site_files (
      id VARCHAR(32) PRIMARY KEY, name VARCHAR(200) NOT NULL, type VARCHAR(100) NOT NULL,
      size INT NOT NULL, data LONGBLOB NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
  })().catch((e) => {
    tablesReady = null;
    throw e;
  });
  await tablesReady;
  return p;
}

const fallback = (): Content => normalize({ cases: defaults.cases, more: defaults.more });

// What the site shows: the last save from /admin, or the starting content
export async function getContent(): Promise<Content & { saved: boolean }> {
  if (!storageReady()) return { ...fallback(), saved: false };
  const [rows] = await (await db()).query("SELECT data FROM site_content WHERE id = 'main'");
  const row = (rows as { data: string }[])[0];
  if (!row) return { ...fallback(), saved: false };
  return { ...normalize(JSON.parse(row.data)), saved: true };
}

export async function saveContent(content: Content) {
  const clean = normalize(content);
  const body = JSON.stringify(clean);
  const conn = await (await db()).getConnection();
  try {
    await conn.beginTransaction();
    // Keep every version, so an old one can be restored if something is deleted by mistake
    await conn.query('INSERT INTO site_content_history (data) VALUES (?)', [body]);
    await conn.query(
      "INSERT INTO site_content (id, data) VALUES ('main', ?) ON DUPLICATE KEY UPDATE data = VALUES(data)",
      [body],
    );
    await conn.commit();
  } catch (e) {
    await conn.rollback().catch(() => {});
    throw e;
  } finally {
    conn.release();
  }
  return clean;
}

// Uploaded images and PDFs live in the database and are served from /api/files/<id>/<name>
export async function saveFile(name: string, type: string, data: ArrayBuffer) {
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 24);
  await (await db()).query('INSERT INTO site_files (id, name, type, size, data) VALUES (?, ?, ?, ?, ?)', [
    id,
    name,
    type,
    data.byteLength,
    Buffer.from(data),
  ]);
  return { url: `/api/files/${id}/${encodeURIComponent(name)}` };
}

export async function getFile(id: string) {
  const [rows] = await (await db()).query('SELECT name, type, data FROM site_files WHERE id = ?', [id]);
  return (rows as { name: string; type: string; data: Buffer }[])[0] || null;
}

// For the admin panel: is the database reachable? Returns the error message if not.
export async function checkStorage() {
  if (!storageReady()) return 'not-set-up';
  try {
    await db();
    return '';
  } catch (e) {
    return (e as Error).message || 'Could not connect to the database.';
  }
}
