export function Hero() {
  return (
    <header style={{ paddingTop: "72px", paddingBottom: "64px" }}>
      <p
        style={{
          fontSize: "14px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#ABABAB",
          fontWeight: 500,
          marginBottom: "32px",
        }}
      >
        Mercado Pago · Onboarding Técnico
      </p>

      <h1
        style={{
          fontFamily: "'Pixelify Sans', sans-serif",
          fontSize: "clamp(32px, 5.5vw, 60px)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          color: "#000000",
          lineHeight: 1.1,
          margin: 0,
          marginBottom: "28px",
        }}
      >
        Guia de Instalação
        <br />
        <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#000000" }}>Claude Meli</span>
          <img
            src="/logo.svg"
            alt=""
            style={{ height: "0.85em", width: "auto", display: "inline-block" }}
          />
        </span>
      </h1>

      <p
        style={{
          fontSize: "16px",
          color: "#6E6E6A",
          maxWidth: "480px",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        Siga os passos para instalar, autenticar e configurar o Claude Code no
        seu ambiente de desenvolvimento.
      </p>
    </header>
  );
}
