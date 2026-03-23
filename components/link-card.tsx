"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { type Link } from "@/data/link";
import { ExternalLink, Globe } from "lucide-react";
import Image from "next/image";

export function LinkCard({ link }: { link: Link }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full"
    >
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-200 group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-black/20">
        <CardContent className="flex items-center gap-4 py-4 px-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
            {!imgError ? (
              <Image
                src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                alt={link.title}
                width={24}
                height={24}
                unoptimized
                onError={() => setImgError(true)}
              />
            ) : (
              <Globe className="w-5 h-5 text-white/60" />
            )}
          </div>
          <span className="flex-1 text-base font-semibold text-white">
            {link.title}
          </span>
          <ExternalLink className="w-4 h-4 text-white/40 shrink-0 transition-colors group-hover:text-white/70" />
        </CardContent>
      </Card>
    </a>
  );
}
