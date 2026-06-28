import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ReModa — Endurnýjuð tíska";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #7624db 0%, #eb1495 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 120, fontWeight: 700, letterSpacing: -2 }}>
          <span>Re</span>
          <span style={{ color: "#fedc01" }}>Moda</span>
        </div>
        <div style={{ fontSize: 40, marginTop: 8, opacity: 0.95 }}>
          Einstök föt, nýtt líf
        </div>
        <div style={{ fontSize: 26, marginTop: 28, opacity: 0.85 }}>
          Sjálfbær tíska úr fataskápum Íslands
        </div>
      </div>
    ),
    { ...size }
  );
}
