import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "마이링크 - 단 하나의 프로필 링크로 나를 브랜딩하세요";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: "#020617", // bg-slate-950
          backgroundImage: "radial-gradient(circle at 50% 0%, #1e1b4b 0%, #020617 70%)", // Subtle top glow to mimic the hero background
        }}
      >
        {/* Hero Card Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "800px",
            height: "480px",
            backgroundColor: "rgba(15, 23, 42, 0.8)", // bg-slate-900/80
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "40px", // rounded-[2.5rem]
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            position: "relative",
            overflow: "hidden",
            padding: "40px",
          }}
        >
          {/* Inner Light effects */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              left: "-50px",
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(15,23,42,0) 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(15,23,42,0) 70%)",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            {/* Logo area */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "120px",
                height: "120px",
                borderRadius: "28px", // rounded-[1.25rem]
                background: "linear-gradient(135deg, #5B5FC7 0%, #9333ea 100%)", // from-[#5B5FC7] to-purple-600
                border: "2px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 0 40px -10px rgba(91, 95, 199, 0.5)",
                marginBottom: "40px",
              }}
            >
              {/* Plus Icon (Lucide-like) */}
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "900",
                color: "#ffffff", // Simplified gradient text effect by using white and text shadow
                letterSpacing: "-0.05em",
                margin: 0,
                marginBottom: "24px",
                textShadow: "0 2px 20px rgba(255, 255, 255, 0.3)",
              }}
            >
              MY LINK
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: "32px",
                color: "#94a3b8", // slate-400
                margin: 0,
                fontWeight: "500",
                letterSpacing: "-0.02em",
                textAlign: "center",
              }}
            >
              단 하나의 프로필 링크로 나를 브랜딩하세요.
            </p>
            <p
              style={{
                fontSize: "32px",
                color: "rgba(255, 255, 255, 0.8)", // white/80
                margin: 0,
                marginTop: "12px",
                fontWeight: "500",
                letterSpacing: "-0.02em",
                textAlign: "center",
              }}
            >
              구글 계정으로 1초 만에 시작하기
            </p>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
