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
 * Normalizes any modern CSS color functions (lab, oklab, oklch, lch, color) to standard rgb/rgba
 * so html2canvas's color parser never encounters unsupported color functions.
 */
function createColorSanitizer(): (str: string) => string {
  const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
  const ctx = canvas ? canvas.getContext("2d") : null;
  const colorCache = new Map<string, string>();

  return function sanitizeColor(colorStr: string): string {
    if (!colorStr || typeof colorStr !== "string") return colorStr;
    if (!/(?:lab|oklab|oklch|lch|color)\(/i.test(colorStr)) {
      return colorStr;
    }

    return colorStr.replace(/(?:lab|oklab|oklch|lch|color)\([^)]+\)/gi, (match) => {
      const cached = colorCache.get(match);
      if (cached) return cached;

      if (ctx) {
        try {
          ctx.fillStyle = "#000000";
          ctx.fillStyle = match;
          const resolved = ctx.fillStyle;
          if (resolved && resolved !== "#000000") {
            colorCache.set(match, resolved);
            return resolved;
          }
        } catch {
          // fallback below
        }
      }

      const fallback = "rgba(24, 24, 27, 0.9)";
      colorCache.set(match, fallback);
      return fallback;
    });
  };
}

/**
 * Creates a Proxy around CSSStyleDeclaration to sanitize modern color values on the fly
 */
function createStyleDeclarationProxy(
  declaration: CSSStyleDeclaration,
  sanitizeColor: (str: string) => string
): CSSStyleDeclaration {
  return new Proxy(declaration, {
    get(target, prop, receiver) {
      if (prop === "getPropertyValue") {
        return (propertyName: string) => {
          const val = target.getPropertyValue(propertyName);
          return sanitizeColor(val);
        };
      }
      const val = Reflect.get(target, prop, receiver);
      if (typeof val === "string") {
        return sanitizeColor(val);
      }
      if (typeof val === "function") {
        return val.bind(target);
      }
      return val;
    },
  });
}

/**
 * Downloads an HTML element as a PDF file directly on the client using jsPDF
 */
export async function downloadJobSheetPdf(
  elementOrId: HTMLElement | string,
  jobSheetNumber: string
): Promise<void> {
  if (typeof window === "undefined") return;

  const targetElement =
    typeof elementOrId === "string"
      ? document.getElementById(elementOrId)
      : elementOrId;

  if (!targetElement) {
    throw new Error(
      `Target element for PDF generation not found (${typeof elementOrId === "string" ? elementOrId : "HTMLElement"}).`
    );
  }

  // Dynamically import jsPDF and html2canvas for client-side execution
  const { jsPDF } = await import("jspdf");
  const html2canvasModule = await import("html2canvas");
  const html2canvas = html2canvasModule.default || html2canvasModule;

  const filename = `QuickFix_JobSheet_${jobSheetNumber}.pdf`;

  const sanitizeColor = createColorSanitizer();

  // Intercept window.getComputedStyle during html2canvas traversal so any modern CSS color functions
  // (e.g. lab, oklab, oklch, color) are transparently returned as standard rgb/rgba strings
  const originalWindowGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = function (
    elt: Element,
    pseudoElt?: string | null
  ): CSSStyleDeclaration {
    const realDecl = originalWindowGetComputedStyle.call(window, elt, pseudoElt);
    return createStyleDeclarationProxy(realDecl, sanitizeColor);
  };

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: "#ffffff",
      scrollY: 0,
      scrollX: 0,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Also proxy getComputedStyle in the cloned iframe document
        if (clonedDoc.defaultView) {
          const originalClonedGetComputedStyle = clonedDoc.defaultView.getComputedStyle;
          clonedDoc.defaultView.getComputedStyle = function (
            elt: Element,
            pseudoElt?: string | null
          ): CSSStyleDeclaration {
            const realDecl = originalClonedGetComputedStyle.call(
              clonedDoc.defaultView,
              elt,
              pseudoElt
            );
            return createStyleDeclarationProxy(realDecl, sanitizeColor);
          };
        }

        // Clean out extension nodes (Grammarly, etc.) that may inject unsupported CSS
        try {
          clonedDoc
            .querySelectorAll(
              "grammarly-extension, [data-grammarly-part], #grammarly-shadow-root, [class*='grammarly'], [id*='grammarly']"
            )
            .forEach((el) => el.remove());
        } catch {
          // ignore
        }

        // Sanitize stylesheets in cloned document: replace modern color functions
        try {
          const styleTags = clonedDoc.querySelectorAll("style");
          styleTags.forEach((styleTag) => {
            if (
              styleTag.textContent &&
              /(?:lab|oklab|oklch|lch|color)\(/i.test(styleTag.textContent)
            ) {
              styleTag.textContent = styleTag.textContent.replace(
                /(?:lab|oklab|oklch|lch|color)\([^)]+\)/gi,
                (match) => sanitizeColor(match)
              );
            }
          });
        } catch (e) {
          console.warn("Error sanitizing stylesheets for PDF:", e);
        }
      },
    });
  } finally {
    // Always restore the original getComputedStyle on the host window
    window.getComputedStyle = originalWindowGetComputedStyle;
  }

  // Calculate A4 dimensions (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 6; // 6mm margin
  const printableWidth = pageWidth - margin * 2; // 198mm
  const printableHeight = pageHeight - margin * 2; // 285mm

  const imgWidth = printableWidth;
  const imgHeight = (canvas.height * printableWidth) / canvas.width;

  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  if (imgHeight <= printableHeight) {
    // Fits neatly on a single page
    pdf.addImage(
      imgData,
      "JPEG",
      margin,
      margin,
      imgWidth,
      imgHeight,
      undefined,
      "FAST"
    );
  } else {
    // Multi-page handling with page breaks
    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(
      imgData,
      "JPEG",
      margin,
      position,
      imgWidth,
      imgHeight,
      undefined,
      "FAST"
    );
    heightLeft -= printableHeight;

    while (heightLeft > 0) {
      position = position - printableHeight;
      pdf.addPage();
      pdf.addImage(
        imgData,
        "JPEG",
        margin,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      heightLeft -= printableHeight;
    }
  }

  // Generate Blob and trigger native browser file download
  const blob = pdf.output("blob");
  triggerBlobDownload(blob, filename);
}
