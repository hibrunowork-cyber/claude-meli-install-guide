import { UnicornBackground } from "@/components/ui/unicorn-background";
import { SlideShow } from "@/components/SlideShow";
import { PasswordGate } from "@/components/PasswordGate";

export default function Home() {
  return (
    <PasswordGate>
      <div style={{ background: "#0F0F0D", height: "100vh", overflow: "hidden" }}>
        <UnicornBackground />
        <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
          <SlideShow />
        </div>
      </div>
    </PasswordGate>
  );
}
