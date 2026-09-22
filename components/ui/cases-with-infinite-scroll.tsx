"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ExternalLink, Sparkles } from "lucide-react";

export interface ClientCase {
  name: string;
  category: string;
  url: string;
  tagline: string;
  logo: string;
  accent: string;
  photo: string;
}

export const CLIENT_CASES: ClientCase[] = [
  {
    name: "Sort Marketing",
    category: "Video Production",
    url: "https://www.sortmarketing.com/",
    tagline: "Cinematic 4K Platform",
    logo: "/clients/sort-logo.png",
    accent: "#08b8f8",
    photo: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Hepki",
    category: "Task Marketplace",
    url: "https://hepki-frontend.vercel.app/",
    tagline: "On-Demand Assistance",
    logo: "/clients/hepki-logo.png",
    accent: "#3b82f6",
    photo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Detailing Adda",
    category: "Studio OS & CRM",
    url: "https://detailingadda.vercel.app/login",
    tagline: "Automotive Operations",
    logo: "/clients/detailingadda-logo.png",
    accent: "#ef4444",
    photo: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Boombastic CRM",
    category: "Sales Pipeline",
    url: "https://boombastic-crm-frontend.vercel.app/",
    tagline: "High-Velocity Bookings",
    logo: "/clients/boombastic-logo.png",
    accent: "#34d399",
    photo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "WorkPulse.in",
    category: "Compliance Engine",
    url: "https://workpulse.in/",
    tagline: "Audit Orchestration",
    logo: "/clients/workpulse-logo.png",
    accent: "#388bfd",
    photo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
  },
];

function Case() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Repeat the 5 clients 3 times to make 15 total items for smooth infinite cycling
  const repeatedCases = [...CLIENT_CASES, ...CLIENT_CASES, ...CLIENT_CASES];

  useEffect(() => {
    if (!api) {
      return;
    }

    const timer = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent((prev) => prev + 1);
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [api, current]);

  return (
    <div className="w-full py-20 lg:py-28 relative overflow-hidden border-y border-white/[0.06] bg-[#07090d]">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] pointer-events-none rounded-full blur-[100px] opacity-20 bg-[radial-gradient(ellipse_at_center,_#08b8f8_0%,_#146bff_50%,_transparent_70%)]"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08b8f8]/10 border border-[#08b8f8]/25 text-[#08b8f8] text-xs font-mono uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Production Portfolio</span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl tracking-tighter lg:max-w-2xl font-bold text-left text-white leading-tight font-[family-name:var(--font-sora)]">
                Trusted by high-output businesses{" "}
                <span className="bg-gradient-to-r from-[#08b8f8] via-[#38bdf8] to-[#146bff] bg-clip-text text-transparent">
                  worldwide.
                </span>
              </h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Real mission-critical applications and custom platforms designed, engineered, and shipped with 100% code ownership.
            </p>
          </div>

          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {repeatedCases.map((client, index) => {
                return (
                  <CarouselItem
                    className="pl-3 md:pl-4 basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    key={`${client.name}-${index}`}
                  >
                    <a
                      href={client.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col justify-between h-[250px] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#08b8f8]/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-10px_rgba(8,184,248,0.25)]"
                    >
                      {/* Real Brand Visual / Background Photo */}
                      <div className="absolute inset-0 z-0 overflow-hidden bg-[#0c1220]">
                        <img
                          src={client.photo}
                          alt={`${client.name} production preview`}
                          className="w-full h-full object-cover object-center opacity-30 group-hover:opacity-45 group-hover:scale-108 transition-all duration-700 ease-out"
                          loading="lazy"
                        />
                        {/* Dark gradient mask for optimal text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-[#07090d]/85 to-black/30" />
                        {/* Radial accent highlight on hover */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                          style={{
                            background: `radial-gradient(circle at 50% 0%, ${client.accent}, transparent 70%)`,
                          }}
                        />
                      </div>

                      {/* Top Bar with Real Brand Logo & Launch Link */}
                      <div className="relative z-10 p-5 flex items-start justify-between gap-3">
                        <div className="h-11 min-w-[48px] px-2.5 rounded-xl bg-[#080d18]/95 border border-white/15 flex items-center justify-center shadow-lg group-hover:border-[#08b8f8]/50 group-hover:shadow-[0_0_16px_rgba(8,184,248,0.25)] transition-all duration-300">
                          <img
                            src={client.logo}
                            alt={`${client.name} logo`}
                            className="h-7 w-auto max-w-[90px] object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-slate-300 group-hover:text-white group-hover:border-[#08b8f8]/40 group-hover:bg-[#08b8f8]/20 transition-all">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      {/* Bottom Info: Category, Brand Name & Tagline */}
                      <div className="relative z-10 p-5 pt-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: client.accent }}
                          />
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#08b8f8]">
                            {client.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#38bdf8] transition-colors font-[family-name:var(--font-sora)]">
                          {client.name}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                          {client.tagline}
                        </p>
                      </div>
                    </a>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export { Case };
