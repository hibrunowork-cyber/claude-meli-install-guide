"use client";

import { useState, useEffect } from "react";

const navItems = [
  { id: "pre-requisitos", label: "Pré-requisitos", num: "" },
  { id: "instalacao", label: "Instalação", num: "01" },
  { id: "autenticacao", label: "Autenticação", num: "02" },
  { id: "vscode", label: "VS Code", num: "03" },
  { id: "mcps", label: "MCPs", num: "04" },
  { id: "statusline", label: "Statusline", num: "05" },
  { id: "comandos", label: "Comandos", num: "06" },
  { id: "boas-praticas", label: "Boas Práticas", num: "07" },
];

export function SideNav() {
  const [activeId, setActiveId] = useState("pre-requisitos");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -75% 0px" }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Navegação lateral">
      <p
        style={{
          fontSize: "14px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#ABABAB",
          marginBottom: "20px",
          fontWeight: 500,
        }}
      >
        Neste guia
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "8px",
                  padding: "10px 0",
                  textDecoration: "none",
                  fontSize: "14px",
                  color: isActive ? "#1A1A18" : "#9E9E9B",
                  fontWeight: isActive ? 500 : 400,
                  transition: "color 0.15s ease",
                  borderLeft: isActive
                    ? "2px solid #1D4ED8"
                    : "2px solid transparent",
                  paddingLeft: "12px",
                  marginLeft: "-2px",
                }}
              >
                {item.num && (
                  <span
                    style={{
                      fontSize: "14px",
                      fontFamily: "var(--font-jetbrains-mono)",
                      color: isActive ? "#1D4ED8" : "#C8C8C4",
                      flexShrink: 0,
                    }}
                  >
                    {item.num}
                  </span>
                )}
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
