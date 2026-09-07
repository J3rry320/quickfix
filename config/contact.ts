/**
 * Centralized Contact, Business, Social, and Service Area Configuration for QuickFix.in
 * Hub Location: Sadashiv Peth, Pune
 */

export const contactConfig = {
  ownerName: "Samadhan Patil",
  brand: "QuickFix.in",
  legalName: "QuickFix Mobile Solutions",
  tagline: "Pune's #1 Doorstep Mobile Repair Specialists",

  phone: {
    display: "+91 83086 86454",
    value: "+918308686454",
    clean: "918308686454",
    tenDigit: "8308686454",
    emergency: "+91 83086 86454",
  },

  email: "khairnars12@gmail.com",
  supportEmail: "support@quickfix.in",

  address: {
    shop: "Shop No. 3, Purva Plaza",
    locality: "Sadashiv Peth",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411030",
    country: "India",
    countryCode: "IN",
    full: "Shop No. 3, Purva Plaza, Sadashiv Peth, Pune, Maharashtra - 411030",
    short: "Purva Plaza, Sadashiv Peth, Pune - 411030",
    landmark: "Near SP College",
  },

  hours: {
    display: "Mon - Sun: 9:00 AM - 9:00 PM",
    days: "Monday - Sunday",
    time: "9:00 AM - 9:00 PM",
    openingTime: "09:00 AM",
    closingTime: "09:00 PM",
    emergencySupport: "24/7 WhatsApp Booking Assistance",
  },

  whatsapp: {
    number: "918308686454",
    display: "+91 83086 86454",
    getDefaultUrl: (customMessage?: string) => {
      const text =
        customMessage ||
        "Hello QuickFix, I need mobile repair service in Pune.";
      return `https://wa.me/918308686454?text=${encodeURIComponent(text)}`;
    },
    getBookingUrl: (bookingRef: string) => {
      const text = `Hello QuickFix, my booking reference is ${bookingRef}. Please confirm technician arrival.`;
      return `https://wa.me/918308686454?text=${encodeURIComponent(text)}`;
    },
  },

  social: {
    whatsapp: {
      name: "WhatsApp",
      handle: "+91 83086 86454",
      url: "https://wa.me/918308686454",
    },
    instagram: {
      name: "Instagram",
      handle: "@quickfix.pune",
      url: "https://instagram.com/quickfix.pune",
    },
    facebook: {
      name: "Facebook",
      handle: "QuickFix Pune",
      url: "https://facebook.com/quickfixpune",
    },
    twitter: {
      name: "X (Twitter)",
      handle: "@quickfix_pune",
      url: "https://x.com/quickfix_pune",
    },
    youtube: {
      name: "YouTube",
      handle: "@quickfixpune",
      url: "https://youtube.com/@quickfixpune",
    },
    linkedin: {
      name: "LinkedIn",
      handle: "QuickFix Pune",
      url: "https://linkedin.com/company/quickfix-pune",
    },
    google: {
      name: "Google Business",
      handle: "QuickFix Sadashiv Peth",
      url: "https://maps.google.com/?q=Purva+Plaza+Sadashiv+Peth+Pune+411030",
    },
  },

  serviceAreas: {
    city: "Pune",
    state: "Maharashtra",
    hub: "Sadashiv Peth (Central Pune)",
    doorstepSla: "30-45 Minutes Doorstep Dispatch",
    coverageRadiusKm: 25,

    // Popular top 8 Pune areas for quick pill displays
    popular: [
      "Kothrud",
      "Baner",
      "Wakad",
      "Hinjawadi",
      "Viman Nagar",
      "Aundh",
      "Hadapsar",
      "Magarpatta",
    ],

    // Complete list of Pune localities for booking wizards and address selectors
    all: [
      "Kothrud",
      "Baner",
      "Balewadi",
      "Aundh",
      "Wakad",
      "Hinjawadi Phase 1",
      "Hinjawadi Phase 2",
      "Hinjawadi Phase 3",
      "Viman Nagar",
      "Kalyani Nagar",
      "Kharadi",
      "Magarpatta City",
      "Hadapsar",
      "Shivajinagar",
      "FC Road / Deccan",
      "Camp / MG Road",
      "Bavdhan",
      "Pimple Saudagar",
      "Pimple Nilakh",
      "Pashan",
      "Bibwewadi",
      "Katraj",
      "Kondhwa",
      "Swargate",
      "Karve Nagar",
      "Senapati Bapat Road",
      "Dhanori",
      "Vishrantwadi",
      "Wagholi",
      "Pimpri",
      "Chinchwad",
      "Ravet",
      "Nigdi",
      "Bhosari",
      "Other Pune Locality",
    ],

    // Categorized by zones for regional coverage displays and directory cards
    zones: [
      {
        id: "west-pune",
        name: "West Pune",
        dispatchTime: "30 Mins",
        areas: [
          "Baner",
          "Balewadi",
          "Aundh",
          "Wakad",
          "Hinjawadi Phase 1-3",
          "Pimple Saudagar",
          "Bavdhan",
          "Pashan",
          "Kothrud",
          "Karve Nagar",
        ],
      },
      {
        id: "east-pune",
        name: "East Pune",
        dispatchTime: "35 Mins",
        areas: [
          "Viman Nagar",
          "Kalyani Nagar",
          "Kharadi",
          "Magarpatta City",
          "Hadapsar",
          "Dhanori",
          "Vishrantwadi",
          "Wagholi",
        ],
      },
      {
        id: "central-pune",
        name: "Central Pune",
        dispatchTime: "25 Mins",
        areas: [
          "Shivajinagar",
          "FC Road",
          "Deccan Gymkhana",
          "Sadashiv Peth",
          "Camp / MG Road",
          "Swargate",
          "Senapati Bapat Road",
        ],
      },
      {
        id: "south-pune",
        name: "South Pune",
        dispatchTime: "35 Mins",
        areas: [
          "Bibwewadi",
          "Katraj",
          "Kondhwa",
          "Market Yard",
          "Dhankawadi",
          "Undri",
        ],
      },
      {
        id: "pcmc-north",
        name: "PCMC / North",
        dispatchTime: "40 Mins",
        areas: [
          "Pimpri",
          "Chinchwad",
          "Ravet",
          "Nigdi",
          "Akurdi",
          "Bhosari",
        ],
      },
    ],
  },

  guarantees: {
    turnaround: "30-Minute Express On-Site Repair",
    warranty: "90-Day Warranty on Replacement Parts",
    parts: "100% Genuine OEM Quality Parts",
    pricing: "Transparent Pricing • No Fix, No Fee",
    doorstepTravel: "Zero Doorstep Travel Fee Across Pune",
  },

  mapUrl: "https://maps.google.com/?q=Purva+Plaza+Sadashiv+Peth+Pune+411030",
} as const;

export default contactConfig;
