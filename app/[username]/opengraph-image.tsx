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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Profile Card Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "860px",
            height: "400px",
            background: "linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "48px",
            padding: "60px",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Left Side: Avatar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "180px",
              height: "180px",
              borderRadius: "90px",
              background: "linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)",
              border: "4px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 15px 35px rgba(79, 70, 229, 0.4)",
              marginRight: "60px",
            }}
          >
            <span
              style={{
                fontSize: "80px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {initial}
            </span>
          </div>

          {/* Right Side: Info & Mock Links */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "900",
                color: "#ffffff",
                margin: 0,
                letterSpacing: "-0.03em",
              }}
            >
              {displayName}
            </h1>
            <p
              style={{
                fontSize: "28px",
                color: "#94a3b8",
                margin: "12px 0 32px 0",
                fontWeight: "500",
                letterSpacing: "-0.02em",
              }}
            >
              마이링크에서 프로필을 확인하세요.
            </p>

            {/* Mock Link Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "24px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "20px",
                }}
              >
                <div style={{ width: "24px", height: "24px", borderRadius: "12px", background: "rgba(255,255,255,0.2)" }} />
                <div style={{ width: "120px", height: "12px", borderRadius: "6px", background: "rgba(255,255,255,0.2)", marginLeft: "16px" }} />
              </div>
              <div
                style={{
                  width: "85%",
                  height: "48px",
                  borderRadius: "24px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "20px",
                }}
              >
                <div style={{ width: "24px", height: "24px", borderRadius: "12px", background: "rgba(255,255,255,0.15)" }} />
                <div style={{ width: "90px", height: "12px", borderRadius: "6px", background: "rgba(255,255,255,0.15)", marginLeft: "16px" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            opacity: 0.6,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span style={{ fontSize: "24px", fontWeight: "bold", color: "white", letterSpacing: "1px" }}>MY LINK</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
