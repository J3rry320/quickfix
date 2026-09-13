/**
 * Centralized SEO & Catalogue Data Catalog for QuickFix.in (Pune)
 * Provides static-generation fallback data and metadata for programmatic routes.
 */

export interface ServiceItem {
  slug: string;
  name: string;
  shortTitle: string;
  description: string;
  startingPrice: number;
  estimatedTimeMinutes: number;
  warrantyDays: number;
  isPopular: boolean;
  commonIssues: string[];
  processSteps: { title: string; desc: string }[];
}

export interface BrandItem {
  slug: string;
  name: string;
  popularModels: string[];
  repairsOffered: string[];
  warrantyDays: number;
}

export interface LocalityItem {
  slug: string;
  name: string;
  zone: string;
  dispatchTime: string;
  pincode: string;
  landmark: string;
  popularNeighborhoods: string[];
}

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    slug: "screen-replacement",
    name: "Smartphone Screen & OLED Display Replacement",
    shortTitle: "Screen Replacement",
    description:
      "Fix cracked outer glass, unresponsive touch, vertical green lines, bleeding pixels, or completely black displays. Installed in 30 minutes at your doorstep with high-refresh rate OEM grade OLED and LCD panels.",
    estimatedTimeMinutes: 30,
    startingPrice: 1499,
    warrantyDays: 90,
    isPopular: true,
    commonIssues: [
      "Cracked or shattered outer glass",
      "Touch screen unresponsive or ghost touches",
      "Green or white vertical lines on display",
      "Black spots or ink bleed on OLED screen",
      "Flickering or completely blank display",
    ],
    processSteps: [
      { title: "On-Site Diagnostic", desc: "Technician tests touch response, digitizer, and frame alignment in front of you." },
      { title: "Precision Disassembly", desc: "Old shattered display removed using thermal heating and suction tools on antistatic mat." },
      { title: "OEM Panel Fitment", desc: "Genuine OEM display installed with factory-grade water-resistant adhesive gasket." },
      { title: "Customer Verification", desc: "You personally test multi-touch, color fidelity, and camera before payment." },
    ],
  },
  {
    slug: "battery-replacement",
    name: "OEM Battery Replacement & Health Restoration",
    shortTitle: "Battery Replacement",
    description:
      "Solve rapid battery drain, sudden phone shutdowns at 20%, overheating during charging, or swollen battery back covers. High-capacity certified lithium-ion cells restored to 100% health in 20 minutes.",
    estimatedTimeMinutes: 25,
    startingPrice: 999,
    warrantyDays: 90,
    isPopular: true,
    commonIssues: [
      "Battery health degraded below 80%",
      "Phone shutting down unexpectedly under load",
      "Battery draining completely in 3 to 4 hours",
      "Back cover lifting due to swollen battery cell",
      "Phone getting unusually hot while charging",
    ],
    processSteps: [
      { title: "Cycle Count Check", desc: "Verification of current battery capacity, cycle count, and thermal readings." },
      { title: "Safe Adhesive Removal", desc: "Swollen or degraded cell safely extracted without puncturing lithium layers." },
      { title: "Fresh OEM Cell Install", desc: "New certified battery installed with genuine pull-tab adhesives." },
      { title: "Charge & Calibration", desc: "Rapid charging test verified with digital power meter at doorstep." },
    ],
  },
  {
    slug: "charging-port",
    name: "Charging Port & Flex Cable Replacement",
    shortTitle: "Charging Port Repair",
    description:
      "Fix loose charging cable connections, slow charging warnings, moisture detected errors, or complete failure to draw power. Fast port micro-cleaning and sub-board replacement in 25 minutes.",
    estimatedTimeMinutes: 25,
    startingPrice: 699,
    warrantyDays: 90,
    isPopular: true,
    commonIssues: [
      "Cable needs to be wiggled or held at an angle to charge",
      "Phone charges very slowly or disconnects constantly",
      "Lint, dirt, or burnt pins inside Type-C / Lightning port",
      "Persistent 'Moisture in charging port' alert",
      "Microphone or bottom speaker not working alongside charging",
    ],
    processSteps: [
      { title: "Port Debris Inspection", desc: "Microscope-assisted check for compacted lint or physical pin corrosion." },
      { title: "Sub-Board Replacement", desc: "Direct replacement of the charging dock flex and microphone PCB." },
      { title: "Fast-Charging Test", desc: "Fast-charge protocol (VOOC/PD/QuickCharge) confirmed before closing." },
    ],
  },
  {
    slug: "back-glass-replacement",
    name: "Rear Back Glass & Housing Restoration",
    shortTitle: "Back Glass Repair",
    description:
      "Restore shattered rear glass on iPhone, Samsung Galaxy, and OnePlus flagships with precision laser separation. Eliminates sharp glass shards and seals internal wireless charging coils.",
    estimatedTimeMinutes: 45,
    startingPrice: 1299,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "Spiderweb cracks on rear glass cover",
      "Loose glass fragments exposing battery and coils",
      "Bent aluminium chassis preventing back glass fitment",
    ],
    processSteps: [
      { title: "Laser Glass Separation", desc: "Cold laser treatment to break down rear factory adhesive cleanly." },
      { title: "Chassis Alignment", desc: "Frame edges straightened to guarantee flush fitment." },
      { title: "OEM Glass Bonding", desc: "Bonded with specialized structural epoxy under controlled clamp pressure." },
    ],
  },
  {
    slug: "front-rear-camera",
    name: "Front & Rear Camera Module Replacement",
    shortTitle: "Camera Replacement",
    description:
      "Resolve blurry photos, optical image stabilization (OIS) buzzing or vibration, black camera viewfinder, or scratched outer lens. Genuine camera sensors calibrated live at your location.",
    estimatedTimeMinutes: 30,
    startingPrice: 899,
    warrantyDays: 90,
    isPopular: true,
    commonIssues: [
      "Camera screen stays black when opening camera app",
      "Rear camera vibrates loudly and cannot focus",
      "Blotches, purple tints, or spots on captured photos",
      "Face ID or portrait depth mode failing",
    ],
    processSteps: [
      { title: "Sensor Diagnostics", desc: "Testing autofocus actuators, OIS motors, and wide/telephoto switching." },
      { title: "Modular Sensor Swap", desc: "Damaged camera unit replaced with clean OEM sensor module." },
      { title: "Focus & Clarity Verification", desc: "Focus check against calibration chart in room lighting." },
    ],
  },
  {
    slug: "camera-glass-lens",
    name: "Outer Camera Glass Lens Replacement",
    shortTitle: "Camera Lens Repair",
    description:
      "Fix cracked or scratched protective outer camera glass without replacing the expensive internal sensor. Restores crystal-clear photography in 20 minutes.",
    estimatedTimeMinutes: 20,
    startingPrice: 499,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "Scratched or shattered external circular camera ring",
      "Foggy or hazy photos due to scratched outer glass",
      "Dust specks settling on the exposed camera lens",
    ],
    processSteps: [
      { title: "External Removal", desc: "Damaged outer lens extracted without opening the entire phone." },
      { title: "Sensor Micro-Dusting", desc: "Sensor chamber vacuumed to remove dust micro-particles." },
      { title: "Sapphire/Glass Fitting", desc: "High-transparency coated glass fitted with precision adhesive." },
    ],
  },
  {
    slug: "speaker-earpiece-mic",
    name: "Earpiece Speaker, Loudspeaker & Mic Repair",
    shortTitle: "Speaker & Mic Repair",
    description:
      "Solve muffled voice during phone calls, distorted ringtones, crackling music playback, or callers being unable to hear you. Ultrasonic mesh cleaning and speaker module replacement in 25 mins.",
    estimatedTimeMinutes: 25,
    startingPrice: 599,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "Cannot hear callers unless switched to speakerphone",
      "Loudspeaker sounds buzzy or completely silent",
      "Callers complain your voice sounds muffled or distant",
    ],
    processSteps: [
      { title: "Acoustic Grill Cleaning", desc: "Ultrasonic vibration cleaning of clogged speaker mesh." },
      { title: "Driver Replacement", desc: "Replacement of blown acoustic driver or MEMS microphone." },
      { title: "Two-Way Audio Test", desc: "Live cellular call test verifying loud and clear voice transmission." },
    ],
  },
  {
    slug: "motherboard-chip-level",
    name: "Motherboard Diagnostic & Micro-Soldering Repair",
    shortTitle: "Motherboard Repair",
    description:
      "Expert board-level repair for dead smartphones, short circuits, power IC malfunctions, and no-display motherboard faults. Performed by master technicians with zero data loss wherever feasible.",
    estimatedTimeMinutes: 60,
    startingPrice: 1999,
    warrantyDays: 60,
    isPopular: false,
    commonIssues: [
      "Phone completely dead, zero response to charger or power button",
      "Overheating severely near the CPU/motherboard area",
      "Green screen issue following software update (CPU reballing)",
      "Wi-Fi or Bluetooth greyed out in phone settings",
    ],
    processSteps: [
      { title: "Thermal Multimeter Analysis", desc: "Checking power rails for shorted SMD capacitors." },
      { title: "Micro-Soldering", desc: "Replacing burned power ICs, charging controllers, or reballing chips." },
      { title: "Full Functional Audit", desc: "Stress testing CPU stability and charging efficiency." },
    ],
  },
  {
    slug: "water-damage-rescue",
    name: "Water Damage Ultrasonic Treatment & Rescue",
    shortTitle: "Water Damage Rescue",
    description:
      "Emergency rescue for smartphones dropped in water, tea, or rain. Immediate chemical ultrasonic bath to halt motherboard corrosion, followed by component drying and power circuit recovery.",
    estimatedTimeMinutes: 60,
    startingPrice: 1299,
    warrantyDays: 30,
    isPopular: false,
    commonIssues: [
      "Phone dropped in water, pool, or exposed to rain",
      "Phone powers on but screen is completely black",
      "Foggy moisture visible inside camera lenses",
      "Device gets burning hot when connected to charger",
    ],
    processSteps: [
      { title: "Immediate Battery Disconnection", desc: "Halts electrolytic corrosion on internal circuit traces." },
      { title: "Ultrasonic PCB Bath", desc: "Submersion in specialized chemical solution to neutralize mineral salts." },
      { title: "Dehydration & Testing", desc: "Micro-drying chamber treatment followed by component-by-component check." },
    ],
  },
  {
    slug: "software-issue-reflash",
    name: "OS Bootloop, Software Flash & FRP Recovery",
    shortTitle: "Software & Bootloop Fix",
    description:
      "Recover phones stuck on Apple/Android logo, failing after system update, bootlooping, or experiencing persistent system UI crashes. Clean official firmware reflash with maximum data preservation.",
    estimatedTimeMinutes: 30,
    startingPrice: 499,
    warrantyDays: 30,
    isPopular: false,
    commonIssues: [
      "Phone stuck on Apple logo or Android boot screen",
      "Restarting continuously every 60 seconds",
      "System UI has stopped error blocking navigation",
      "Corrupted firmware update over OTA Wi-Fi",
    ],
    processSteps: [
      { title: "Partition Check", desc: "Reading eMMC/UFS health and checking storage integrity." },
      { title: "Official Firmware Flash", desc: "Writing clean signed manufacturer firmware via bootloader." },
      { title: "System Boot Confirmation", desc: "Testing complete boot to home screen and user data retention." },
    ],
  },
];

export const BRANDS_CATALOG: BrandItem[] = [
  {
    slug: "apple",
    name: "Apple iPhone",
    popularModels: ["iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "iPhone 14", "iPhone 13", "iPhone 12", "iPhone 11", "iPhone XR"],
    repairsOffered: ["OLED Screen Replacement", "Battery Health Restore", "Back Glass Laser Fix", "Charging Port Repair", "Camera Lens"],
    warrantyDays: 90,
  },
  {
    slug: "samsung",
    name: "Samsung Galaxy",
    popularModels: ["Galaxy S24 Ultra", "Galaxy S23", "Galaxy S22", "Galaxy A54", "Galaxy A34", "Galaxy M34", "Galaxy Z Flip 5", "Galaxy S21 FE"],
    repairsOffered: ["Dynamic AMOLED Display", "Original Battery Swap", "Charging Sub-Board", "Rear Camera Replacement"],
    warrantyDays: 90,
  },
  {
    slug: "oneplus",
    name: "OnePlus",
    popularModels: ["OnePlus 12", "OnePlus 11", "OnePlus 11R", "OnePlus 10 Pro", "OnePlus 9 Pro", "OnePlus Nord CE 3", "OnePlus Nord 3"],
    repairsOffered: ["Fluid AMOLED Screen", "Green Line CPU Fix", "Warp Charge Port", "High-Capacity Battery"],
    warrantyDays: 90,
  },
  {
    slug: "xiaomi",
    name: "Xiaomi & Redmi",
    popularModels: ["Redmi Note 13 Pro", "Redmi Note 12", "Xiaomi 13 Pro", "Redmi 12 5G", "Xiaomi 12 Pro", "Redmi Note 11"],
    repairsOffered: ["Display & Digitizer", "Battery Swap", "Charging Flex Cable", "Camera Module"],
    warrantyDays: 90,
  },
  {
    slug: "google-pixel",
    name: "Google Pixel",
    popularModels: ["Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro", "Pixel 7", "Pixel 7a", "Pixel 6a", "Pixel 6 Pro"],
    repairsOffered: ["OLED Screen Swap", "OEM Battery Replacement", "Camera Glass Repair", "Charging Port"],
    warrantyDays: 90,
  },
  {
    slug: "vivo",
    name: "Vivo",
    popularModels: ["Vivo V30 Pro", "Vivo V29", "Vivo X100 Pro", "Vivo T2 Pro", "Vivo Y200", "Vivo V27"],
    repairsOffered: ["Curved AMOLED Screen", "Battery Replacement", "Selfie Camera Module", "Charging Port"],
    warrantyDays: 90,
  },
  {
    slug: "oppo",
    name: "Oppo",
    popularModels: ["Oppo Reno 11 Pro", "Oppo Reno 10", "Oppo Find N3", "Oppo F25 Pro", "Oppo A78"],
    repairsOffered: ["AMOLED Display", "SuperVOOC Charging Port", "Battery Swap", "Rear Glass"],
    warrantyDays: 90,
  },
  {
    slug: "realme",
    name: "Realme",
    popularModels: ["Realme 12 Pro+", "Realme 11 Pro", "Realme GT 2 Pro", "Realme Narzo 60", "Realme 10 Pro"],
    repairsOffered: ["Curved Screen Fix", "High-Drain Battery Swap", "Dart Charging Flex", "Speaker Module"],
    warrantyDays: 90,
  },
  {
    slug: "motorola",
    name: "Motorola",
    popularModels: ["Moto Edge 50 Pro", "Moto Edge 40", "Moto G84", "Moto G54", "Razr 40 Ultra"],
    repairsOffered: ["pOLED Display Repair", "TurboPower Port", "Battery Replacement", "Earpiece Speaker"],
    warrantyDays: 90,
  },
  {
    slug: "nothing",
    name: "Nothing Phone",
    popularModels: ["Nothing Phone (2)", "Nothing Phone (1)", "Nothing Phone (2a)"],
    repairsOffered: ["OLED Screen Replacement", "Transparent Back Glass", "Battery Swap", "Glyph LED Diagnostic"],
    warrantyDays: 90,
  },
  {
    slug: "iqoo",
    name: "iQOO",
    popularModels: ["iQOO 12", "iQOO Neo 9 Pro", "iQOO 11", "iQOO Neo 7", "iQOO Z7 Pro"],
    repairsOffered: ["144Hz AMOLED Screen", "Dual-Cell Battery", "FlashCharge Port", "Motherboard Repair"],
    warrantyDays: 90,
  },
  {
    slug: "poco",
    name: "Poco",
    popularModels: ["Poco X6 Pro", "Poco F5", "Poco X5 Pro", "Poco M6 Pro", "Poco F4"],
    repairsOffered: ["Display & Touch", "Fast Battery Replacement", "Sub-Board Charging Flex", "Motherboard Reboot"],
    warrantyDays: 90,
  },
];

import localitiesData from "./localities.json";

export const LOCALITIES_CATALOG: LocalityItem[] = localitiesData as LocalityItem[];
