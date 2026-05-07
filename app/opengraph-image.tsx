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
          flexDirection: "row", // 좌우 분할
          backgroundColor: "#2e1065", // 깊은 퍼플 배경 (레퍼런스 느낌)
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* 좌측 콘텐츠 영역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "55%",
            height: "100%",
            paddingLeft: "80px",
            paddingRight: "20px",
            zIndex: 10,
          }}
        >
          {/* 입체적인 앱 아이콘 (3D 흉내) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "120px",
              height: "120px",
              borderRadius: "32px",
              backgroundColor: "#f8fafc",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 -10px 20px rgba(0,0,0,0.1)",
              marginBottom: "40px",
              position: "relative",
            }}
          >
            {/* 내부 아이콘 (색상 박스) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)",
                boxShadow: "0 10px 20px rgba(139, 92, 246, 0.4), inset 0 2px 5px rgba(255,255,255,0.4)",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          </div>

          {/* 메인 타이틀 */}
          <h1
            style={{
              fontSize: "76px",
              fontWeight: "900",
              color: "#ffffff",
              letterSpacing: "-0.03em",
              margin: 0,
              marginBottom: "20px",
            }}
          >
            MY LINK
          </h1>

          {/* 서브 텍스트 */}
          <p
            style={{
              fontSize: "32px",
              color: "#d8b4fe", // 연한 퍼플
              margin: 0,
              fontWeight: "400",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
              maxWidth: "550px",
            }}
          >
            단 하나의 프로필 링크로 나를 브랜딩하세요. 포트폴리오와 소셜 미디어를 통합하세요.
          </p>
        </div>

        {/* 우측 UI 목업 영역 (추상적인 대시보드 형태) */}
        <div
          style={{
            position: "relative",
            width: "45%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 뒤쪽 창 (대시보드 패널) */}
          <div
            style={{
              position: "absolute",
              top: "120px",
              right: "-50px",
              width: "480px",
              height: "400px",
              backgroundColor: "#1e1b4b",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              boxShadow: "-20px 20px 60px rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              padding: "24px",
              transform: "rotate(-5deg)", // 약간 기울여서 역동적인 느낌
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "6px", backgroundColor: "#ef4444", marginRight: "8px" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "6px", backgroundColor: "#eab308", marginRight: "8px" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "6px", backgroundColor: "#22c55e", marginRight: "20px" }} />
              <div style={{ width: "150px", height: "12px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.1)" }} />
            </div>

            {/* Content Lines */}
            <div style={{ display: "flex", marginBottom: "16px", alignItems: "center" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.1)", marginRight: "16px" }} />
              <div style={{ flex: 1, height: "16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.2)" }} />
            </div>
            <div style={{ display: "flex", marginBottom: "16px", alignItems: "center" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.05)", marginRight: "16px" }} />
              <div style={{ width: "60%", height: "16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.1)" }} />
            </div>
            <div style={{ display: "flex", marginBottom: "16px", alignItems: "center" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.05)", marginRight: "16px" }} />
              <div style={{ width: "80%", height: "16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.1)" }} />
            </div>
            <div style={{ display: "flex", marginBottom: "16px", alignItems: "center" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.05)", marginRight: "16px" }} />
              <div style={{ width: "40%", height: "16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.1)" }} />
            </div>
            
            {/* Stats Chart Mockup */}
            <div style={{ marginTop: "auto", display: "flex", gap: "12px" }}>
               <div style={{ flex: 1, height: "100px", borderRadius: "12px", backgroundColor: "rgba(139, 92, 246, 0.2)", border: "1px solid rgba(139, 92, 246, 0.4)" }} />
               <div style={{ flex: 1, height: "100px", borderRadius: "12px", backgroundColor: "rgba(217, 70, 239, 0.2)", border: "1px solid rgba(217, 70, 239, 0.4)" }} />
            </div>
          </div>

          {/* 앞쪽 창 (모바일 프로필 뷰) */}
          <div
            style={{
              position: "absolute",
              top: "220px",
              right: "150px",
              width: "280px",
              height: "450px",
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "32px",
              boxShadow: "-30px 30px 60px rgba(0,0,0,0.7), inset 0 0 0 6px #1e293b", // 모바일 베젤 흉내
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "32px 20px",
              transform: "rotate(-10deg)", // 더 기울여서 원근감
            }}
          >
            {/* Avatar */}
            <div style={{ width: "64px", height: "64px", borderRadius: "32px", background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", marginBottom: "16px" }} />
            {/* Name */}
            <div style={{ width: "120px", height: "16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.8)", marginBottom: "8px" }} />
            {/* Bio */}
            <div style={{ width: "160px", height: "10px", borderRadius: "5px", backgroundColor: "rgba(255,255,255,0.3)", marginBottom: "32px" }} />
            
            {/* Links */}
            <div style={{ width: "100%", height: "40px", borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "12px" }} />
            <div style={{ width: "100%", height: "40px", borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "12px" }} />
            <div style={{ width: "100%", height: "40px", borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "12px" }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
