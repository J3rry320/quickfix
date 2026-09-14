import React from "react";

export interface JobSheetItem {
  description: string;
  type: "service" | "part" | "inspection" | "other";
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DeviceIntakeChecklist {
  powerOn: "yes" | "no" | "untested";
  screenCondition: "good" | "scratched" | "cracked" | "no_display" | "untested";
  touchFunction: "working" | "faulty" | "untested";
  backGlassBody: "good" | "scratched" | "dented" | "cracked" | "untested";
  frontCamera: "working" | "faulty" | "untested";
  rearCamera: "working" | "faulty" | "untested";
  chargingPort: "working" | "loose" | "faulty" | "untested";
  batteryCondition: "normal" | "service_needed" | "swollen" | "untested";
  speakerEarpiece: "working" | "muffled" | "faulty" | "untested";
  microphone: "working" | "faulty" | "untested";
  liquidDamage: "none" | "suspected" | "detected" | "untested";
  networkWifi: "working" | "faulty" | "untested";
}

export interface JobSheetData {
  jobSheetNumber: string;
  bookingReference: string;
  date: string;
  serviceMode: "doorstep" | "pickup_drop" | "walk_in";
  status: string;

  // Customer
  customer: {
    name: string;
    phone: string;
    alternatePhone?: string;
    email?: string;
    address: string;
    area: string;
    pincode: string;
    city: string;
    landmark?: string;
  };

  // Device
  device: {
    brand: string;
    model: string;
    color?: string;
    imeiOrSerial?: string;
    passcodePattern?: string;
  };

  // Accessories Received
  accessories: {
    simTray: boolean;
    simCard: boolean;
    memoryCard: boolean;
    protectiveCase: boolean;
    chargerCable: boolean;
    other?: string;
  };

  // Intake Diagnostics
  checklist: DeviceIntakeChecklist;
  reportedFault: string;
  workshopNotes?: string;

  // Service & Pricing
  primaryServiceName: string;
  items: JobSheetItem[];
  subtotal: number;
  diagnosticFee: number;
  discount: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: "unpaid" | "paid" | "cod";
  paymentMethod?: string;

  warrantyPeriod: string;
}

export const DEFAULT_CHECKLIST: DeviceIntakeChecklist = {
  powerOn: "untested",
  screenCondition: "untested",
  touchFunction: "untested",
  backGlassBody: "untested",
  frontCamera: "untested",
  rearCamera: "untested",
  chargingPort: "untested",
  batteryCondition: "untested",
  speakerEarpiece: "untested",
  microphone: "untested",
  liquidDamage: "untested",
  networkWifi: "untested",
};

export const DEFAULT_ACCESSORIES = {
  simTray: false,
  simCard: false,
  memoryCard: false,
  protectiveCase: false,
  chargerCable: false,
  other: "",
};

export function isChecklistPending(checklist?: DeviceIntakeChecklist): boolean {
  if (!checklist) return true;
  return Object.values(checklist).every((val) => val === "untested");
}

export const STANDARD_REPAIR_TERMS = [
  {
    title: "Data Backup & Privacy",
    text: "The customer is solely responsible for creating a complete data backup prior to handing over the device. QuickFix Mobile Solutions shall not be held liable for any loss, corruption, or recovery of data, applications, or settings during disassembly, repair, or testing.",
  },
  {
    title: "Latent / Pre-existing Defects",
    text: "Devices exposed to liquid contact, physical drops, bent frames, or previous third-party repairs may carry hidden PCB or IC micro-fractures that can manifest during disassembly. QuickFix is only liable for the specific hardware module contracted for repair.",
  },
  {
    title: "Parts Warranty (90 Days)",
    text: "QuickFix provides a 90-day replacement warranty on genuine replacement components. Warranty strictly excludes subsequent physical drops, display cracks, lines/ink bleeds, water ingress, self-tampering, or alteration of the warranty void tamper sticker.",
  },
  {
    title: "Testing & Screen Lock Consent",
    text: "The customer authorizes QuickFix technicians to conduct comprehensive hardware QA testing before and after service. Passcode/pattern provided will be used strictly for functional diagnostic verification (cameras, touch, mic, speakers, sensors).",
  },
  {
    title: "Estimate Revisions",
    text: "Initial service estimates are contingent on physical inspection. If secondary board-level faults or motherboard complications are discovered, an updated quote will be communicated to the customer for prior approval before proceeding.",
  },
  {
    title: "Delivery & Unclaimed Devices",
    text: "Repaired devices must be collected or accepted upon delivery within 30 days of completion notification. A demurrage charge of ₹20/day applies after 30 days. Devices unclaimed beyond 60 days may be liquidated or recycled to defray accrued costs.",
  },
];

/**
 * Generates standard Job Sheet Number from booking reference or timestamp
 */
export function formatJobSheetNumber(bookingReference?: string): string {
  if (bookingReference && bookingReference.trim()) {
    const cleanRef = bookingReference.replace(/^QF-?/i, "");
    return `JS-QF-${cleanRef}`;
  }
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `JS-${dateStr}-${rand}`;
}

/**
 * Triggers standard browser print dialog for a printable element or page
 */
export function triggerJobSheetPrint(jobSheetNumber: string): void {
  const originalTitle = document.title;
  document.title = `QuickFix_JobSheet_${jobSheetNumber}`;
  window.print();
  // Restore document title after print dialog closes
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}

/**
 * Triggers direct browser download for a Blob file using an attached <a> tag
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.style.position = "fixed";
  anchor.style.left = "-9999px";
  anchor.style.top = "-9999px";
  anchor.style.opacity = "0";
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();

  // Clean up DOM and revoke Blob URL
  setTimeout(() => {
    if (document.body.contains(anchor)) {
      document.body.removeChild(anchor);
    }
    window.URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Downloads a Job Sheet as a crisp vector PDF directly on the client using @react-pdf/renderer
 */
export async function downloadJobSheetPdf(
  dataOrElement: JobSheetData | HTMLElement | string,
  jobSheetNumber?: string,
  fallbackData?: JobSheetData
): Promise<void> {
  if (typeof window === "undefined") return;

  // Resolve JobSheetData
  let jobData: JobSheetData | undefined;
  if (
    typeof dataOrElement === "object" &&
    dataOrElement !== null &&
    "jobSheetNumber" in dataOrElement
  ) {
    jobData = dataOrElement as JobSheetData;
  } else if (fallbackData) {
    jobData = fallbackData;
  }

  if (!jobData) {
    throw new Error(
      "JobSheetData is required to generate the PDF."
    );
  }

  const jsNumber = jobSheetNumber || jobData.jobSheetNumber;
  const filename = `QuickFix_JobSheet_${jsNumber}.pdf`;

  // Dynamically import @react-pdf/renderer and JobSheetPdfDocument for client-side execution
  const { pdf } = await import("@react-pdf/renderer");
  const { JobSheetPdfDocument } = await import(
    "@/components/admin/repairs/JobSheetPdfDocument"
  );

  const logoUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/logo.png`
      : undefined;

  // Generate vector PDF Blob
  const docElement = React.createElement(JobSheetPdfDocument, {
    data: jobData,
    logoSrc: logoUrl,
  }) as unknown as Parameters<typeof pdf>[0];

  const instance = pdf(docElement);
  const blob = await instance.toBlob();

  // Trigger browser download
  triggerBlobDownload(blob, filename);
}

