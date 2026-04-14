import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          backgroundImage: "radial-gradient(circle at 50% 50%, #1e1b4b 0%, #09090b 100%)",
        }}
      >
        {/* Subtle Decorative Background Element */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.05)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(139, 92, 246, 0.05)",
            filter: "blur(80px)",
          }}
        />

        {/* Logo Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "24px",
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
            marginBottom: 40,
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          M
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            Mood Journal
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "#a1a1aa",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            Clarity through reflection
          </div>
        </div>

        {/* Domain Label */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 20,
            color: "#52525b",
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          mood.andrewkimani.co.ke
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
