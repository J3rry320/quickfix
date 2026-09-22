import { ImageResponse } from "next/og";
import { LOCALITIES_CATALOG } from "@/config/catalogue-data";
import { siteConfig } from "@/config/seo";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; locality: string }>;
}) {
  const { locality } = await params;
  const loc = LOCALITIES_CATALOG.find((l) => l.slug === locality) || {
    name: locality
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    zone: "Pune",
    dispatchTime: "30 Mins",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#080c14",
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.18), transparent 35%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.15), transparent 40%), linear-gradient(135deg, #0A0F1D 0%, #060910 100%)",
          color: "#ffffff",
          padding: "56px 64px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative grid/accents */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, #F59E0B 0%, #10B981 50%, #3B82F6 100%)",
          }}
        />

        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Brand Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "9999px",
              padding: "10px 22px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#F59E0B",
              }}
            />
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "#FFFFFF",
              }}
            >
              {siteConfig.name.toUpperCase()}
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              •
            </span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.75)",
              }}
            >
              {siteConfig.domain}
            </span>
          </div>

          {/* Warranty Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              borderRadius: "9999px",
              padding: "8px 20px",
              color: "#34D399",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            <span>🛡️ 90-DAY WARRANTY</span>
          </div>
        </div>

        {/* Main Content Body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            marginTop: "20px",
          }}
        >
          {/* Locality Zone Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                color: "#F59E0B",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              📍 {loc.name}, Pune ({loc.zone} Zone)
            </span>
          </div>

          {/* Bold Locality Headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "52px",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            <span>Doorstep Mobile Repair in</span>
            <span
              style={{
                color: "#FBBF24",
              }}
            >
              {loc.name}, Pune
            </span>
          </div>

          {/* Fast Dispatch Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "14px",
              padding: "12px 24px",
              maxWidth: "760px",
            }}
          >
            <span style={{ fontSize: "24px" }}>⚡</span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#FEF3C7",
              }}
            >
              {loc.dispatchTime} Doorstep Pickup Guarantee Across {loc.name}
            </span>
          </div>
        </div>

        {/* Footer Feature Badges Strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            marginTop: "16px",
          }}
        >
          {/* 4 Feature Items */}
          <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "rgba(255, 255, 255, 0.85)" }}>
              <span>🔧</span>
              <span style={{ fontWeight: 600 }}>Screen & Battery</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "rgba(255, 255, 255, 0.85)" }}>
              <span>✨</span>
              <span style={{ fontWeight: 600 }}>OEM Grade Parts</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "rgba(255, 255, 255, 0.85)" }}>
              <span>🔒</span>
              <span style={{ fontWeight: 600 }}>Zero Data Access</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "rgba(255, 255, 255, 0.85)" }}>
              <span>⭐</span>
              <span style={{ fontWeight: 600 }}>4.9/5 Rating</span>
            </div>
          </div>

          {/* Lab Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "15px",
              color: "rgba(255, 255, 255, 0.55)",
            }}
          >
            <span>Central Lab: Sadashiv Peth</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
