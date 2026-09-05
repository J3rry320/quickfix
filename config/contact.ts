/**
 * Centralized Contact Configuration for QuickFix.in
 * Location: Sadashiv Peth, Pune
 */

export const contactConfig = {
  ownerName: "Samadhan Patil",
  brand: "QuickFix.in",
  phone: {
    display: "+91 83086 86454",
    value: "+918308686454",
    clean: "918308686454",
  },
  email: "khairnars12@gmail.com",
  address: {
    shop: "Shop No. 3, Purva Plaza",
    locality: "Sadashiv Peth",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411030",
    full: "Shop No. 3, Purva Plaza, Sadashiv Peth, Pune, Maharashtra - 411030",
    short: "Purva Plaza, Sadashiv Peth, Pune - 411030",
  },
  hours: {
    display: "Mon - Sun: 9:00 AM - 9:00 PM",
    days: "Monday - Sunday",
    time: "9:00 AM - 9:00 PM",
  },
  whatsapp: {
    number: "918308686454",
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
  mapUrl: "https://maps.google.com/?q=Purva+Plaza+Sadashiv+Peth+Pune+411030",
} as const;

export default contactConfig;
