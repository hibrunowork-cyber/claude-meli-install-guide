import { Hero } from "@/components/sections/Hero";
import { Prerequisites } from "@/components/sections/Prerequisites";
import { Installation } from "@/components/sections/Installation";
import { Authentication } from "@/components/sections/Authentication";
import { VSCodeIntegration } from "@/components/sections/VSCodeIntegration";
import { MCPs } from "@/components/sections/MCPs";
import { StatusLine } from "@/components/sections/StatusLine";
import { Commands } from "@/components/sections/Commands";
import { BestPractices } from "@/components/sections/BestPractices";
import { SideNav } from "@/components/SideNav";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div style={{ display: "flex", gap: "64px" }}>
          {/* Sidebar */}
          <aside
            style={{
              width: "180px",
              flexShrink: 0,
              display: "none",
            }}
            className="sidebar-nav"
          >
            <div
              style={{
                position: "sticky",
                top: "40px",
                paddingTop: "96px",
              }}
            >
              <SideNav />
            </div>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, minWidth: 0, maxWidth: "720px" }}>
            <Hero />

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "#EBEBЕ7",
                marginBottom: "56px",
              }}
            />

            <Prerequisites />

            {/* Sections with dividers */}
            {[
              <Installation key="installation" />,
              <Authentication key="authentication" />,
              <VSCodeIntegration key="vscode" />,
              <MCPs key="mcps" />,
              <StatusLine key="statusline" />,
              <Commands key="commands" />,
              <BestPractices key="best-practices" />,
            ].map((section, i) => (
              <div key={i}>
                <div
                  style={{
                    height: "1px",
                    background: "#F0F0ED",
                    margin: "56px 0",
                  }}
                />
                {section}
              </div>
            ))}

            <footer
              style={{
                borderTop: "1px solid #F0F0ED",
                marginTop: "80px",
                padding: "32px 0 64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#C0C0BC",
                }}
              >
                Claude Code — Guia de Instalação
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#C0C0BC",
                  fontFamily: "var(--font-jetbrains-mono)",
                }}
              >
                Mercado Pago
              </span>
            </footer>
          </main>
        </div>
      </div>

      {/* Sidebar responsive styles */}
      <style>{`
        @media (min-width: 900px) {
          .sidebar-nav {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
