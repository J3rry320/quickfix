import contactConfig from "@/config/contact";
import { MessageCircle, Phone } from "lucide-react";

export interface FaqHelpCardProps {
  title: string;
  subtitle: string;
  serviceName: string;
  whatsappLabel?: string;
  phoneLabel?: string;
  className?: string;
}

export default function FaqHelpCard({
  title,
  subtitle,
  serviceName,
  whatsappLabel = "Chat on WhatsApp",
  phoneLabel,
  className = "",
}: FaqHelpCardProps) {
  const whatsappUrl = contactConfig.whatsapp.getDefaultUrl(
    `Hello QuickFix, I have a question regarding ${serviceName} repair.`
  );

  return (
    <div
      className={`relative w-full rounded-3xl border border-border-default bg-gradient-to-b from-mist-gray/90 via-clean-white to-clean-white p-6 sm:p-8 shadow-xs flex flex-col items-center text-center overflow-hidden group select-none ${className}`}
    >
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-flash-orange/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-electric-amber/5 rounded-full blur-2xl pointer-events-none" />

      {/* Big Responsive Question Mark SVG Illustration */}
      <div className="relative w-full flex items-center justify-center pt-2 pb-4">
        <svg
          className="w-full max-w-[180px] xs:max-w-[210px] sm:max-w-[240px] lg:max-w-[260px] h-auto transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 280 230"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Primary Orange to Amber Gradient */}
            <linearGradient id="qGrad" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FFA000" />
              <stop offset="45%" stopColor="#FF5722" />
              <stop offset="100%" stopColor="#E64A19" />
            </linearGradient>

            {/* Soft Ambient Glow Drop Shadow */}
            <filter id="qGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="10"
                floodColor="#FF5722"
                floodOpacity="0.25"
              />
            </filter>

            {/* Card Badge Shadow */}
            <filter id="badgeShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="5"
                floodColor="#181B20"
                floodOpacity="0.08"
              />
            </filter>
          </defs>

          {/* Ambient Background Concentric Rings */}
          <circle cx="140" cy="110" r="95" fill="#FF5722" fillOpacity="0.03" />
          <circle
            cx="140"
            cy="110"
            r="75"
            stroke="#FF5722"
            strokeWidth="1.2"
            strokeDasharray="5 5"
            strokeOpacity="0.2"
          />
          <circle
            cx="140"
            cy="110"
            r="55"
            stroke="#FFA000"
            strokeWidth="1"
            strokeOpacity="0.18"
          />

          {/* Soft Ground Ellipse Shadow */}
          <ellipse
            cx="140"
            cy="208"
            rx="58"
            ry="9"
            fill="#181B20"
            fillOpacity="0.07"
          />

          {/* Left Floating Mini Chat Pill */}
          <g filter="url(#badgeShadow)">
            <rect
              x="26"
              y="60"
              width="48"
              height="36"
              rx="12"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
            <path
              d="M 44,96 L 36,105 L 39,96 Z"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
            <circle cx="41" cy="78" r="3" fill="#CBD5E1" />
            <circle cx="50" cy="78" r="3" fill="#FFA000" />
            <circle cx="59" cy="78" r="3" fill="#FF5722" />
          </g>

          {/* Right Floating Verified Badge */}
          <g filter="url(#badgeShadow)">
            <circle
              cx="232"
              cy="76"
              r="20"
              fill="#181B20"
              stroke="#334155"
              strokeWidth="1.5"
            />
            <path
              d="M 225 76 L 230 81 L 240 70"
              stroke="#00C853"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Ambient Sparkles */}
          <path
            d="M 218 145 Q 222 145 222 141 Q 222 145 226 145 Q 222 145 222 149 Q 222 145 218 145 Z"
            fill="#FFA000"
          />
          <path
            d="M 58 152 Q 62 152 62 148 Q 62 152 66 152 Q 62 152 62 156 Q 62 152 58 152 Z"
            fill="#FF5722"
          />
          <circle cx="82" cy="38" r="2.5" fill="#FFA000" opacity="0.6" />
          <circle cx="214" cy="32" r="3" fill="#FF5722" opacity="0.5" />

          {/* Main 3D Question Mark Hook */}
          <path
            d="M 105 76
               C 105 50, 120 36, 140 36
               C 162 36, 178 50, 178 72
               C 178 90, 166 102, 152 112
               C 142 120, 137 128, 137 142"
            fill="none"
            stroke="url(#qGrad)"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#qGlow)"
          />

          {/* Question Mark Dot */}
          <circle
            cx="137"
            cy="182"
            r="12"
            fill="url(#qGrad)"
            filter="url(#qGlow)"
          />

          {/* Specular Inner Highlight on Hook */}
          <path
            d="M 112 74
               C 112 56, 124 44, 140 44
               C 156 44, 168 54, 169 70"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.55"
          />
          <circle cx="134" cy="178" r="3.5" fill="#FFFFFF" opacity="0.65" />
        </svg>
      </div>

      {/* Typography Callout */}
      <div className="relative z-10 mt-1 max-w-sm">
        <h3 className="font-heading text-lg sm:text-xl font-extrabold text-tech-slate tracking-tight">
          {title}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 mt-6 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5 w-full justify-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp-dark hover:bg-whatsapp-hover text-clean-white px-5 py-2.5 text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
        >
          <MessageCircle className="h-4 w-4 fill-clean-white" />
          <span>{whatsappLabel}</span>
        </a>

        <a
          href={`tel:${contactConfig.phone.value}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-clean-white border border-border-strong text-tech-slate hover:bg-mist-gray px-4 py-2.5 text-xs font-bold shadow-2xs transition-all active:scale-95 shrink-0"
        >
          <Phone className="h-4 w-4 text-flash-orange" />
          <span>{phoneLabel || contactConfig.phone.display}</span>
        </a>
      </div>
    </div>
  );
}
