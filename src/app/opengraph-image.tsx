import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "DnovaGallery | Portrait & Event Photography in Utah";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#0c0d0e",
          color: "#f8fafc",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)",
          }}
        />

        {/* Top Header / Brand Tagline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontSize: "16px",
            color: "#94a3b8",
            borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
            paddingBottom: "24px",
          }}
        >
          <span>Studio & On-Location</span>
          <span>Utah, United States</span>
        </div>

        {/* Main Title & Value Proposition */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              fontSize: "80px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            DnovaGallery
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#cbd5e1",
              maxWidth: "850px",
              lineHeight: 1.4,
              fontFamily: "sans-serif",
              fontWeight: 400,
            }}
          >
            Timeless portraits, authentic emotion, and magazine-quality editorial photography by Darianny Salas.
          </div>
        </div>

        {/* Footer info & CTA preview */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
            paddingTop: "24px",
            fontSize: "18px",
            color: "#94a3b8",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", gap: "32px" }}>
            <span>Portraits</span>
            <span>•</span>
            <span>Engagements</span>
            <span>•</span>
            <span>Events</span>
            <span>•</span>
            <span>Lifestyle</span>
          </div>
          <div
            style={{
              color: "#f8fafc",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            dnovagallery.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
