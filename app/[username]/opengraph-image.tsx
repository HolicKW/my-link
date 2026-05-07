import { ImageResponse } from "next/og";

export const alt = "사용자 프로필 - 마이링크";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const displayName = decodeURIComponent(username);
  const initial = displayName.charAt(0).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row", // 좌우 분할
          backgroundColor: "#2e1065", // 깊은 퍼플 배경
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
          {/* 사용자 아바타 (3D 느낌) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "140px",
              height: "140px",
              borderRadius: "40px",
              background: "linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 -10px 20px rgba(0,0,0,0.2), inset 0 4px 10px rgba(255,255,255,0.4)",
              marginBottom: "32px",
              border: "2px solid rgba(255,255,255,0.1)",
            }}
          >
            <span
              style={{
                fontSize: "72px",
                fontWeight: "900",
                color: "white",
                textShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              {initial}
            </span>
          </div>

          {/* 이름 */}
          <h1
            style={{
              fontSize: "76px",
              fontWeight: "900",
              color: "#ffffff",
              letterSpacing: "-0.03em",
              margin: 0,
              marginBottom: "16px",
            }}
          >
            {displayName}
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
              maxWidth: "500px",
            }}
          >
            마이링크에서 프로필을 확인하세요.
          </p>
        </div>

        {/* 우측 UI 목업 영역 (모바일 프로필 화면이 겹쳐 있는 형태) */}
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
          {/* 뒤쪽 모바일 목업 (흐릿한 뎁스 효과) */}
          <div
            style={{
              position: "absolute",
              top: "80px",
              right: "40px",
              width: "320px",
              height: "500px",
              backgroundColor: "#1e1b4b",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "32px",
              boxShadow: "-10px 20px 40px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              padding: "24px",
              transform: "scale(0.9) rotate(-2deg)",
              opacity: 0.7,
            }}
          >
            {/* Mock Profile Layout */}
            <div style={{ alignSelf: "center", width: "80px", height: "80px", borderRadius: "40px", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "16px" }} />
            <div style={{ alignSelf: "center", width: "140px", height: "16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "32px" }} />
            
            <div style={{ width: "100%", height: "48px", borderRadius: "24px", backgroundColor: "rgba(255,255,255,0.05)", marginBottom: "12px" }} />
            <div style={{ width: "100%", height: "48px", borderRadius: "24px", backgroundColor: "rgba(255,255,255,0.05)", marginBottom: "12px" }} />
            <div style={{ width: "100%", height: "48px", borderRadius: "24px", backgroundColor: "rgba(255,255,255,0.05)" }} />
          </div>

          {/* 앞쪽 주 모바일 목업 */}
          <div
            style={{
              position: "absolute",
              top: "140px",
              right: "120px",
              width: "320px",
              height: "500px",
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderTop: "1px solid rgba(255, 255, 255, 0.3)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "40px",
              boxShadow: "-30px 40px 80px rgba(0,0,0,0.6), inset 0 0 0 6px #1e293b",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 24px",
              transform: "rotate(-8deg)", // 기울임
              zIndex: 20,
            }}
          >
            {/* Avatar */}
            <div style={{ width: "80px", height: "80px", borderRadius: "40px", background: "linear-gradient(135deg, #6366f1 0%, #d946ef 100%)", marginBottom: "20px", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }} />
            {/* Name */}
            <div style={{ width: "160px", height: "18px", borderRadius: "9px", backgroundColor: "rgba(255,255,255,0.9)", marginBottom: "12px" }} />
            {/* Bio */}
            <div style={{ width: "200px", height: "12px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.4)", marginBottom: "40px" }} />
            
            {/* Links with Icons */}
            <div style={{ width: "100%", height: "56px", borderRadius: "28px", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "16px", display: "flex", alignItems: "center", paddingLeft: "16px" }}>
               <div style={{ width: "24px", height: "24px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.3)" }} />
               <div style={{ width: "120px", height: "12px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.4)", marginLeft: "12px" }} />
            </div>
            <div style={{ width: "100%", height: "56px", borderRadius: "28px", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "16px", display: "flex", alignItems: "center", paddingLeft: "16px" }}>
               <div style={{ width: "24px", height: "24px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.2)" }} />
               <div style={{ width: "140px", height: "12px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.3)", marginLeft: "12px" }} />
            </div>
            <div style={{ width: "100%", height: "56px", borderRadius: "28px", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", paddingLeft: "16px" }}>
               <div style={{ width: "24px", height: "24px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.2)" }} />
               <div style={{ width: "100px", height: "12px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.3)", marginLeft: "12px" }} />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
