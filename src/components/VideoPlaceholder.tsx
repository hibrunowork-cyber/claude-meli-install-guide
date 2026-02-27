interface VideoPlaceholderProps {
  label: string;
  videoId?: string;
}

export function VideoPlaceholder({ label, videoId }: VideoPlaceholderProps) {
  return (
    <div
      data-video-id={videoId}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        background: "#FAFAFA",
        border: "1px dashed #D4D4D0",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "1.5px solid #D4D4D0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "14px", height: "14px", marginLeft: "2px" }}
        >
          <path d="M5 3.5L13 8L5 12.5V3.5Z" fill="#C4C4C0" />
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: "14px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#B0B0AC",
            fontWeight: 500,
            marginBottom: "4px",
          }}
        >
          Inserir vídeo aqui
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#C8C8C4",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
