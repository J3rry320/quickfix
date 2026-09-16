export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  area: string;
  deviceModel: string;
  serviceType: string;
  rating: number;
  text: string;
  initials: string;
  mediaPath?: string; // Path to real repair photo or video (e.g., "/testimonials/iphone-15-screen.jpg")
  mediaType?: "image" | "video";
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "redmi-note-8-hinjawadi",
    name: "Aniket Kulkarni",
    role: "Software Engineer",
    area: "Hinjawadi Phase 2",
    deviceModel: "Xiaomi Redmi Note 8",
    serviceType: "Full Display & Touch Screen Replacement",
    rating: 5,
    text: "Cracked my Redmi Note 8 screen during my daily commute to Hinjawadi. QuickFix technician picked it up in a tamper-proof pouch with an IMEI receipt, replaced the display assembly in their certified lab, cured it with tension bands, and tested MIUI boot before delivering it back the same day. Pristine color calibration and touch sensitivity!",
    initials: "AK",
    mediaPath: "/assets/videos/repair.mp4",
    mediaType: "video",
  },
  {
    id: "redmi-13c-5g-kothrud",
    name: "Pooja Deshmukh",
    role: "QA Analyst",
    area: "Kothrud, Pune",
    deviceModel: "Xiaomi Redmi 13C 5G",
    serviceType: "Touch Digitizer & Display Replacement",
    rating: 5,
    text: "Touch response on my Redmi 13C 5G stopped working after an accidental drop. QuickFix picked it up from my flat in Kothrud, fitted an OEM touch digitizer panel, and thoroughly tested all dialpad inputs before same-day return. Zero data wipe and 90-day warranty card included!",
    initials: "PD",
    mediaPath: "/assets/videos/repair2.mp4",
    mediaType: "video",
  },
  {
    id: "redmi-9-power-camp",
    name: "Rajesh Bhandari",
    role: "Retail Entrepreneur",
    area: "Camp / Sadashiv Peth",
    deviceModel: "Xiaomi Redmi 9 Power",
    serviceType: "Display Assembly & Frame Overhaul",
    rating: 5,
    text: "Completely shattered screen and deformed chassis on my Redmi 9 Power. QuickFix safely logged it into their Sadashiv Peth hub, completely overhauled the housing and installed an OEM display panel. Verified the pristine screen and sound before UPI payment. Exceptional workmanship in Pune!",
    initials: "RB",
    mediaPath: "/assets/videos/repair3.mp4",
    mediaType: "video",
  },
  {
    id: "xiaomi-13-pro-viman-nagar",
    name: "Sneha Joshi",
    role: "Content Creator",
    area: "Viman Nagar, Pune",
    deviceModel: "Xiaomi 13 Pro",
    serviceType: "Leica Camera Glass & Back Panel",
    rating: 5,
    text: "Shattered the Leica camera bump glass. QuickFix picked it up from Viman Nagar, replaced the optical module and ceramic back panel in their clean room lab, and brought it back the same day. No dust under the 1-inch sensor and 90-day warranty card issued on delivery.",
    initials: "SJ",
    mediaPath: "",
    mediaType: "image",
  },
  {
    id: "google-pixel-7-wakad",
    name: "Rohan Iyer",
    role: "Product Designer",
    area: "Wakad, Pune",
    deviceModel: "Google Pixel 7",
    serviceType: "USB-C Port & Mic Sub-Board",
    rating: 5,
    text: "Pixel stopped fast charging and the lower mic wasn't picking up calls. QuickFix arranged express doorstep pickup from Wakad, repaired the sub-board in their lab, and delivered it back same-day with zero data reset. Best mobile repair service in Pune.",
    initials: "RI",
    mediaPath: "",
    mediaType: "image",
  },
  {
    id: "nothing-phone-2-aundh",
    name: "Aditya Shinde",
    role: "Entrepreneur",
    area: "Aundh, Pune",
    deviceModel: "Nothing Phone (2)",
    serviceType: "Transparent Back Glass & Glyph Diagnostic",
    rating: 5,
    text: "Most local shops in Pune refused to touch Nothing Phone due to the Glyph LED ribbons. QuickFix safely picked it up from Aundh, carefully preserved all ribbons in their lab, and fitted the original transparent glass perfectly before same-day return.",
    initials: "AS",
    mediaPath: "",
    mediaType: "image",
  },
];
