import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { SlideShow } from "@/components/SlideShow";

export default function Home() {
  return (
    <div style={{ background: "#0F0F0D", height: "100vh", overflow: "hidden" }}>
      <BackgroundRippleEffect cellSize={56} />
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
        <SlideShow />
      </div>
    </div>
  );
}
