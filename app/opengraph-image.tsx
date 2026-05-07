import { ImageResponse } from "next/og";


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
          backgroundColor: "#0f172a", // bg-slate-900 (조금 더 밝게 변경하여 입체감 부여)
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
            backgroundColor: "#1e293b", // bg-slate-800
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "40px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
            position: "relative",
            overflow: "hidden",
            padding: "40px",
          }}
        >
          {/* Inner Decorative Elements (Satori-safe solid colors with opacity) */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              left: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "100px",
              backgroundColor: "rgba(99,102,241,0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "100px",
              backgroundColor: "rgba(168,85,247,0.1)",
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
                borderRadius: "28px",
                background: "linear-gradient(135deg, #5B5FC7 0%, #9333ea 100%)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
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
                color: "#ffffff",
                letterSpacing: "-0.05em",
                margin: 0,
                marginBottom: "24px",
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
