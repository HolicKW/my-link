import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          backgroundColor: "#020617", // slate-950
          backgroundImage: "radial-gradient(circle at 50% 120%, #1e1b4b 0%, #020617 80%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Profile Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "860px",
            height: "400px",
            backgroundColor: "rgba(15, 23, 42, 0.5)", // slate-900 with opacity
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "40px",
            padding: "60px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Glows inside Card */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              left: "-50px",
              width: "250px",
              height: "250px",
              background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(15,23,42,0) 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-50px",
              right: "-50px",
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(15,23,42,0) 70%)",
            }}
          />

          {/* Left Side: Avatar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "180px",
              height: "180px",
              borderRadius: "90px",
              background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)", // indigo-600 to purple-600
              border: "4px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 10px 40px -10px rgba(147, 51, 234, 0.8)",
              marginRight: "60px",
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontSize: "80px",
                fontWeight: "bold",
                color: "white",
                textShadow: "0 4px 12px rgba(0,0,0,0.3)",
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
              zIndex: 10,
            }}
          >
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "900",
                color: "#f8fafc", // slate-50
                margin: 0,
                letterSpacing: "-0.03em",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              {displayName}
            </h1>
            <p
              style={{
                fontSize: "28px",
                color: "#94a3b8", // slate-400
                margin: "12px 0 32px 0",
                fontWeight: "500",
                letterSpacing: "-0.02em",
              }}
            >
              단 하나의 프로필 링크
            </p>

            {/* Mock Link Bars to visualize it's a link-tree */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "24px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "20px",
                }}
              >
                <div style={{ width: "24px", height: "24px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.2)" }} />
                <div style={{ width: "120px", height: "12px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.2)", marginLeft: "16px" }} />
              </div>
              <div
                style={{
                  width: "85%",
                  height: "48px",
                  borderRadius: "24px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "20px",
                }}
              >
                <div style={{ width: "24px", height: "24px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.15)" }} />
                <div style={{ width: "90px", height: "12px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.15)", marginLeft: "16px" }} />
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
              background: "linear-gradient(135deg, #5B5FC7 0%, #9333ea 100%)",
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
