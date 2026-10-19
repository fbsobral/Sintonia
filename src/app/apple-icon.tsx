import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#2a2160,#0f0d1f)" }}>
        <svg viewBox="0 0 64 64" width="130" height="130">
          <defs>
            <linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d6c9ff" /><stop offset="1" stopColor="#7b61ff" /></linearGradient>
            <linearGradient id="b" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffc2a8" /><stop offset="1" stopColor="#ff5e8a" /></linearGradient>
            <clipPath id="c"><circle cx="39" cy="32" r="18" /></clipPath>
          </defs>
          <circle cx="25" cy="32" r="18" fill="none" stroke="url(#a)" strokeWidth="4.5" />
          <circle cx="39" cy="32" r="18" fill="none" stroke="url(#b)" strokeWidth="4.5" />
          <circle cx="25" cy="32" r="18" fill="#fff4d8" clipPath="url(#c)" />
        </svg>
      </div>
    ),
    size,
  );
}
