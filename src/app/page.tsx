import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Work />
      <Capabilities />
      <About />
      <Contact />
    </main>
  );
}
