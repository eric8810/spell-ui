"use client";

import { LogosCarousel } from "@/registry/spell-ui/logos-carousel";
import Image from "next/image";

const vercelLogo = "/logos/vercel.svg";
const googleLogo = "/logos/google.svg";
const framerLogo = "/logos/framer.svg";
const discordLogo = "/logos/discord.svg";
const phantomLogo = "/logos/phantom.svg";
const linearLogo = "/logos/linear.svg";
const notionLogo = "/logos/notion.svg";
const openseaLogo = "/logos/opensea.svg";
const shopifyLogo = "/logos/shopify.svg";
const rampLogo = "/logos/ramp.svg";

const LogoImage = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    width={96}
    height={96}
    className={`h-24 w-24 object-contain opacity-70 not-dark:invert-100 pointer-events-none select-none`}
    unoptimized
  />
);

export function Demo() {
  return (
    <div className="flex flex-col">
      <div>
        <p className="text-sm text-muted-foreground font-mono">3 LOGOS PER ROW</p>
        <LogosCarousel count={3}>
          <LogoImage src={vercelLogo} alt="Vercel logo" />
          <LogoImage src={framerLogo} alt="Framer logo" />
          <LogoImage src={discordLogo} alt="Discord logo" />
          <LogoImage src={shopifyLogo} alt="Shopify logo" />
          <LogoImage src={phantomLogo} alt="Phantom logo" />
          <LogoImage src={linearLogo} alt="Linear logo" />
          <LogoImage src={rampLogo} alt="Ramp logo" />
          <LogoImage src={openseaLogo} alt="OpenSea logo" />
          <LogoImage src={notionLogo} alt="Notion logo" />
        </LogosCarousel>
      </div>
    </div>
  );
}
