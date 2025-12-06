import Check from "@/components/icons/check";
import SiteHeader from "@/components/site-header";
import { getDocSchema } from "@/lib/doc";
import { BlurReveal } from "@/registry/spell-ui/blur-reveal";
import { RichButton } from "@/registry/spell-ui/rich-button";
import Link from "next/link";

const docSchema = await getDocSchema();

export default function Home() {
  return (
    <div className="flex relative h-svh pt-14">
      <SiteHeader docSchema={docSchema} />
      <div className="flex h-full flex-row flex-nowrap items-center flex-1 justify-start container">
        <div className="flex flex-col py-12 h-full w-[600px] relative flex-nowrap justify-between">
          <div className="flex flex-col items-start w-full relative gap-6">
            <BlurReveal letterSpacing="-0.020em" className="font-medium text-5xl tracking-tight">
                Refined UI components for Design Engineers
            </BlurReveal>
            <p className="text-lg leading-6 text-muted-foreground">
              Meticulously crafted components with animations built-in. Copy, paste, perfect.
            </p>
            <div className="flex gap-4 mt-2">
              <RichButton size="lg" className="rounded-full trakcing-tight" asChild>
                <Link href={"/docs/introduction"}>Get Started</Link>
              </RichButton>
              <RichButton size="lg" color="purple" className="group rounded-full trakcing-tight pr-6" asChild>
                <Link href={"/docs/blur-reveal"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><g fill="currentColor"><circle cx="14.5" cy="8.5" r="2.5" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle><rect x="5" y="12" width="5" height="5" rx="1" ry="1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="currentColor"></rect><path d="m5.1889,3.7146l-2.1169,3.5282c-.2.3333.0401.7572.4287.7572h4.2338c.3886,0,.6287-.424.4287-.7572l-2.1169-3.5282c-.1942-.3237-.6633-.3237-.8575,0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="currentColor"></path></g></svg>
                Components
                </Link>
              </RichButton>
            </div>
          </div>
          <div className="flex-col flex gap-4">
            <p className="flex gap-2 items-center font-medium text-lg [&_svg]:text-blue-600 [&_svg]:size-6"><Check />Simple to use and customize.</p>
            <p className="flex gap-2 items-center font-medium text-lg [&_svg]:text-blue-600 [&_svg]:size-6"><Check />Thoughtfully crafted animations that feel right.</p>
            <p className="flex gap-2 items-center font-medium text-lg [&_svg]:text-blue-600 [&_svg]:size-6"><Check />Full TypeScript support.</p>
            <p className="flex gap-2 items-center font-medium text-lg [&_svg]:text-blue-600 [&_svg]:size-6"><Check />Built on modern standards.</p>
            <p className="flex gap-2 items-center font-medium text-lg [&_svg]:text-blue-600 [&_svg]:size-6"><Check />Open source and free forever.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
