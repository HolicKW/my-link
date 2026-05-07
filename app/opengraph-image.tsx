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
          background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* 프리미엄 카드 컨테이너 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "840px",
            height: "460px",
            background: "linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "48px",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
            padding: "40px",
          }}
        >
          {/* 로고 영역 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)",
              marginBottom: "32px",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>

          {/* 메인 타이틀 */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "900",
              color: "#ffffff",
              letterSpacing: "-0.04em",
              margin: 0,
              marginBottom: "16px",
            }}
          >
            MY LINK
          </h1>

          {/* 서브 텍스트 */}
          <p
            style={{
              fontSize: "30px",
              color: "#94a3b8", // slate-400
              margin: 0,
              fontWeight: "500",
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            단 하나의 프로필 링크로 나를 브랜딩하세요.
          </p>
          
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "40px",
              padding: "12px 24px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "100px",
            }}
          >
            <span style={{ fontSize: "20px", color: "#e2e8f0", fontWeight: "600", letterSpacing: "0.5px" }}>
              mylink.me
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
