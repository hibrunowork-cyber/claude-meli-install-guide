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
        background: "#141412",
        border: "1px dashed #2E2E2B",
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
          border: "1.5px solid #2E2E2B",
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
          <path d="M5 3.5L13 8L5 12.5V3.5Z" fill="#3A3A38" />
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: "14px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#3A3A38",
            fontWeight: 500,
            marginBottom: "4px",
          }}
        >
          Inserir vídeo aqui
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#2E2E2B",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
