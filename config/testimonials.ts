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
    id: "iphone-15-pro-kothrud",
    name: "Aniket Kulkarni",
    role: "Software Engineer",
    area: "Kothrud, Pune",
    deviceModel: "Apple iPhone 15 Pro",
    serviceType: "OLED Screen Replacement",
    rating: 5,
    text: "Cracked my 15 Pro display right before an important office sprint. QuickFix technician arrived at my flat in Kothrud in 25 minutes, tested the display in front of me, and swapped it with an OEM panel without asking for my device passcode. Tested True Tone on the spot!",
    initials: "AK",
    mediaPath: "",
    mediaType: "image",
  },
  {
    id: "oneplus-11-hinjawadi",
    name: "Pooja Deshmukh",
    role: "QA Lead",
    area: "Hinjawadi Phase 1",
    deviceModel: "OnePlus 11 5G",
    serviceType: "Dual-Cell Battery Swap",
    rating: 5,
    text: "Authorized center asked to keep my phone for 5 days just for a battery change. Booked QuickFix at my Hinjawadi office cafeteria; technician showed up with certified battery, performed the swap right at the table in 35 mins, and warp charging works flawlessly.",
    initials: "PD",
    mediaPath: "",
    mediaType: "image",
  },
  {
    id: "samsung-s23-ultra-baner",
    name: "Vikram Malhotra",
    role: "Architect",
    area: "Baner, Pune",
    deviceModel: "Samsung Galaxy S23 Ultra",
    serviceType: "Curved AMOLED & Frame Repair",
    rating: 5,
    text: "Dropped my S23 Ultra on the site and shattered the curved glass. QuickFix Pune dispatched a senior technician to Baner with the genuine frame assembly. Took about 45 minutes on the spot. S-Pen pressure and 120Hz smooth scrolling verified before UPI payment.",
    initials: "VM",
    mediaPath: "",
    mediaType: "image",
  },
  {
    id: "xiaomi-13-pro-viman-nagar",
    name: "Sneha Joshi",
    role: "Content Creator",
    area: "Viman Nagar, Pune",
    deviceModel: "Xiaomi 13 Pro",
    serviceType: "Leica Camera Glass & Back Panel",
    rating: 5,
    text: "Shattered the massive Leica camera bump glass. QuickFix replaced the optical glass module and ceramic back panel right in front of me. No dust under the 1-inch sensor, autofocus checked, and 90-day warranty card issued on spot.",
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
    text: "Pixel stopped fast charging and the lower mic wasn't picking up calls. Technician carried the sub-board replacement to my society in Wakad. Repaired in 30 mins with zero data reset. Best mobile service experience in Pune.",
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
    text: "Most local shops in Pune refused to touch Nothing Phone due to the Glyph LED ribbons. QuickFix technician knew the disassembly inside out, preserved all ribbon connectors, and fitted the original transparent glass perfectly.",
    initials: "AS",
    mediaPath: "",
    mediaType: "image",
  },
];
