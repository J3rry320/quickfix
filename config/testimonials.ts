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
    text: "Cracked my 15 Pro display right before an important office sprint. QuickFix technician picked it up from my flat in Kothrud in a sealed pouch with an IMEI receipt, repaired it in their lab with an OEM panel, and returned it the same day without asking for my device passcode. True Tone works perfectly!",
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
    text: "Authorized center asked to keep my phone for 5 days just for a battery change. QuickFix picked up my OnePlus 11 from Hinjawadi, replaced the dual-cell battery in their Sadashiv Peth lab, and delivered it back same-day with 90 days warranty and zero data loss!",
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
    text: "Dropped my S23 Ultra on site and shattered the curved glass. QuickFix technician picked it up from Baner with an official receipt, installed a genuine frame assembly in their certified ESD lab, and returned it the same day. S-Pen pressure and 120Hz smooth scrolling verified before UPI payment.",
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
