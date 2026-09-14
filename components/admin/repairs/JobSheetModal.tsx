"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Printer,
  ExternalLink,
  Edit3,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  FileText,
  Smartphone,
  ShieldCheck,
  CreditCard,
  Download,
  Loader2,
} from "lucide-react";
import RepairJobSheet from "./RepairJobSheet";
import {
  JobSheetData,
  DEFAULT_CHECKLIST,
  DEFAULT_ACCESSORIES,
  formatJobSheetNumber,
  triggerJobSheetPrint,
  downloadJobSheetPdf,
  DeviceIntakeChecklist,
  JobSheetItem,
} from "@/lib/admin/jobsheet";
import { adminFetch } from "@/lib/admin/api";

interface RepairBookingReference {
  _id?: string;
  bookingReference?: string;
  customer?: {
    name: string;
    phone: string;
    email?: string;
  };
  device?: {
    brand: string;
    model: string;
    color?: string;
  };
  service?: {
    _id?: string;
    name?: string;
    startingPrice?: number;
  };
  issueDescription?: string;
  serviceMode?: "doorstep" | "pickup_drop" | "walk_in";
  preferredSlot?: {
    date: string;
    timeSlot: string;
  };
  address?: {
    streetAddress: string;
    area: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  pricing?: {
    estimatedPrice?: number;
    finalPrice?: number;
    paymentStatus?: "unpaid" | "paid" | "cod";
    paymentMethod?: string;
  };
  status?: string;
  createdAt?: string;
}

interface JobSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  repair?: RepairBookingReference | null;
  onUpdate?: () => void;
}

export default function JobSheetModal({
  isOpen,
  onClose,
  repair,
  onUpdate,
}: JobSheetModalProps) {
  if (!isOpen) return null;

  return (
    <JobSheetModalContent
      key={repair?._id || repair?.bookingReference || "manual-jobsheet"}
      onClose={onClose}
      repair={repair}
      onUpdate={onUpdate}
    />
  );
}

function JobSheetModalContent({
  onClose,
  repair,
  onUpdate,
}: {
  onClose: () => void;
  repair?: RepairBookingReference | null;
  onUpdate?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"preview" | "customize">("preview");

  const sName = repair?.service?.name || "Smartphone Diagnostic & Repair";
  const initialPrice =
    repair?.pricing?.finalPrice ??
    repair?.pricing?.estimatedPrice ??
    (repair ? 1499 : 1999);

  // Editable states for Job Sheet
  const [jobSheetNo, setJobSheetNo] = useState(() =>
    repair ? formatJobSheetNumber(repair.bookingReference) : formatJobSheetNumber()
  );
  const [bookingRef, setBookingRef] = useState(
    () => repair?.bookingReference || `QF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [date, setDate] = useState(() => repair?.createdAt || new Date().toISOString());
  const [serviceMode, setServiceMode] = useState<"doorstep" | "pickup_drop" | "walk_in">(
    () => repair?.serviceMode || "doorstep"
  );
  const [status, setStatus] = useState(() => repair?.status || "confirmed");

  // Customer
  const [custName, setCustName] = useState(() => repair?.customer?.name || "");
  const [custPhone, setCustPhone] = useState(() => repair?.customer?.phone || "");
  const [custAltPhone, setCustAltPhone] = useState("");
  const [custEmail, setCustEmail] = useState(() => repair?.customer?.email || "");
  const [custAddress, setCustAddress] = useState(() => repair?.address?.streetAddress || "");
  const [custArea, setCustArea] = useState(() => repair?.address?.area || "Sadashiv Peth");
  const [custCity, setCustCity] = useState(() => repair?.address?.city || "Pune");
  const [custPincode, setCustPincode] = useState(() => repair?.address?.pincode || "411030");
  const [custLandmark, setCustLandmark] = useState(() => repair?.address?.landmark || "");

  // Device
  const [brand, setBrand] = useState(() => repair?.device?.brand || "Apple");
  const [model, setModel] = useState(() => repair?.device?.model || "iPhone");
  const [color, setColor] = useState(() => repair?.device?.color || "");
  const [imei, setImei] = useState("");
  const [passcode, setPasscode] = useState("");

  // Accessories
  const [accessories, setAccessories] = useState(DEFAULT_ACCESSORIES);

  // Checklist
  const [checklist, setChecklist] = useState<DeviceIntakeChecklist>(DEFAULT_CHECKLIST);

  // Issues & Work
  const [reportedFault, setReportedFault] = useState(
    () =>
      repair?.issueDescription ||
      (repair ? "Device service requested" : "")
  );
  const [serviceName, setServiceName] = useState(
    () => (repair ? sName : "")
  );
  const [workshopNotes, setWorkshopNotes] = useState("");

  // Pricing & Items
  const [items, setItems] = useState<JobSheetItem[]>(() => [
    {
      description: repair
        ? `${sName} (${repair.device?.brand || ""} ${repair.device?.model || ""})`
        : "Mobile Diagnostic & Repair",
      type: "service",
      quantity: 1,
      unitPrice: initialPrice,
      totalPrice: initialPrice,
    },
  ]);
  const [totalPrice, setTotalPrice] = useState<number>(initialPrice);
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [diagnosticFee, setDiagnosticFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<"unpaid" | "paid" | "cod">(
    () => repair?.pricing?.paymentStatus || "unpaid"
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(
    () => repair?.pricing?.paymentMethod || "UPI"
  );

  // Catalogue Options
  const [brandsList, setBrandsList] = useState<Array<{ _id: string; name: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load brands for quick selection dropdowns
  useEffect(() => {
    adminFetch<{ brands: Array<{ _id: string; name: string }> }>("/api/admin/brands")
      .then((res) => {
        if (res?.brands) setBrandsList(res.brands);
      })
      .catch(() => {});
  }, []);

  // Calculate Balance Due
  const balanceDue = useMemo(() => {
    if (paymentStatus === "paid") return 0;
    const computedTotal = Math.max(0, totalPrice + diagnosticFee - discount);
    return Math.max(0, computedTotal - advancePaid);
  }, [totalPrice, diagnosticFee, discount, advancePaid, paymentStatus]);

  // Compile full JobSheetData for the preview
  const jobSheetData: JobSheetData = useMemo(() => {
    return {
      jobSheetNumber: jobSheetNo,
      bookingReference: bookingRef,
      date,
      serviceMode,
      status,
      customer: {
        name: custName || "Valued Customer",
        phone: custPhone || "+91 98000 00000",
        alternatePhone: custAltPhone,
        email: custEmail,
        address: custAddress || "Pune Doorstep Address",
        area: custArea || "Pune",
        city: custCity || "Pune",
        pincode: custPincode || "411030",
        landmark: custLandmark,
      },
      device: {
        brand,
        model,
        color,
        imeiOrSerial: imei,
        passcodePattern: passcode,
      },
      accessories,
      checklist,
      reportedFault,
      workshopNotes,
      primaryServiceName: serviceName,
      items,
      subtotal: totalPrice,
      diagnosticFee,
      discount,
      totalAmount: Math.max(0, totalPrice + diagnosticFee - discount),
      advancePaid,
      balanceDue,
      paymentStatus,
      paymentMethod,
      warrantyPeriod: "90-Day Parts Replacement Guarantee",
    };
  }, [
    jobSheetNo,
    bookingRef,
    date,
    serviceMode,
    status,
    custName,
    custPhone,
    custAltPhone,
    custEmail,
    custAddress,
    custArea,
    custCity,
    custPincode,
    custLandmark,
    brand,
    model,
    color,
    imei,
    passcode,
    accessories,
    checklist,
    reportedFault,
    workshopNotes,
    serviceName,
    items,
    totalPrice,
    diagnosticFee,
    discount,
    advancePaid,
    balanceDue,
    paymentStatus,
    paymentMethod,
  ]);

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handlePrint = () => {
    triggerJobSheetPrint(jobSheetNo);
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const elementId = `jobsheet-preview-${jobSheetData.jobSheetNumber}`;
      await downloadJobSheetPdf(elementId, jobSheetData.jobSheetNumber);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert(
        "Direct PDF download encountered an issue. Opening browser print view where you can save as PDF."
      );
      triggerJobSheetPrint(jobSheetData.jobSheetNumber);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        description: "New Spare Part / Repair Labor",
        type: "part",
        quantity: 1,
        unitPrice: 500,
        totalPrice: 500,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const handleItemChange = (index: number, field: keyof JobSheetItem, value: unknown) => {
    setItems((prev) => {
      const next = [...prev];
      const target = { ...next[index], [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        target.totalPrice = Number(target.quantity || 1) * Number(target.unitPrice || 0);
      }
      next[index] = target;

      // Recalculate total price sum
      const sum = next.reduce((acc, curr) => acc + curr.totalPrice, 0);
      setTotalPrice(sum);

      return next;
    });
  };

  // Sync updates back to database if attached to a repair booking
  const handleSaveToDatabase = async () => {
    if (!repair?._id) return;
    setIsSaving(true);
    try {
      await adminFetch(`/api/admin/repair-requests/${repair._id}`, {
        method: "PATCH",
        body: {
          pricing: {
            estimatedPrice: totalPrice,
            finalPrice: totalPrice,
            paymentStatus,
            paymentMethod,
          },
        },
      });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Failed to sync repair record", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 bg-zinc-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-sm sm:text-base text-zinc-900 leading-tight">
                Mobile Repair Job Sheet • {jobSheetNo}
              </h2>
              <p className="text-[11px] text-zinc-500">
                Standard Pune Service Card for {brand} {model}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "preview"
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>A4 Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("customize")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "customize"
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Customize & Edit</span>
              </button>
            </div>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-orange-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>{isDownloadingPdf ? "Downloading..." : "Download PDF"}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>

            {/* Standalone link if booking exists */}
            {repair?._id && (
              <a
                href={`/admin/repairs/${repair._id}/jobsheet`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                title="Open in new window"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 grow bg-zinc-100/60">
          {/* Live A4 Preview Container - Always mounted in DOM for reliable PDF generation */}
          <div
            aria-hidden={activeTab !== "preview"}
            className={
              activeTab === "preview"
                ? "flex flex-col items-center"
                : "fixed -left-[99999px] top-0 pointer-events-none opacity-0"
            }
          >
            <div className="w-[210mm] max-w-[210mm] bg-white shadow-lg rounded-md overflow-hidden">
              <RepairJobSheet
                data={jobSheetData}
                id={`jobsheet-preview-${jobSheetData.jobSheetNumber}`}
              />
            </div>
          </div>

          {/* Customize & Edit Tab */}
          {activeTab === "customize" && (
            <div className="max-w-4xl mx-auto space-y-6 bg-white p-5 rounded-xl border border-zinc-200 shadow-xs text-xs">
              {/* Section 1: Device & Brand Selection */}
              <div>
                <h3 className="font-heading text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2 mb-3 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-orange-600" />
                  <span>Device & Brand Selection</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Brand</label>
                    <div className="flex gap-1.5">
                      <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900 focus:border-orange-500 focus:outline-hidden"
                      >
                        {brandsList.length > 0 ? (
                          brandsList.map((b) => (
                            <option key={b._id} value={b.name}>
                              {b.name}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Apple">Apple</option>
                            <option value="Samsung">Samsung</option>
                            <option value="Xiaomi">Xiaomi</option>
                            <option value="OnePlus">OnePlus</option>
                            <option value="Vivo">Vivo</option>
                            <option value="Oppo">Oppo</option>
                            <option value="Realme">Realme</option>
                            <option value="Google">Google</option>
                          </>
                        )}
                      </select>
                      <input
                        type="text"
                        placeholder="Custom Brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-32 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Model Name</label>
                    <input
                      type="text"
                      placeholder="e.g. iPhone 14 Pro / Galaxy S23"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900 focus:border-orange-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Color / Finish</label>
                    <input
                      type="text"
                      placeholder="e.g. Space Gray, Silver"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">IMEI / Serial Number</label>
                    <input
                      type="text"
                      placeholder="15-digit IMEI or Serial"
                      value={imei}
                      onChange={(e) => setImei(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Screen Lock PIN / Passcode</label>
                    <input
                      type="text"
                      placeholder="For QA testing (e.g. 1234 or Pattern)"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Service Mode</label>
                    <select
                      value={serviceMode}
                      onChange={(e) =>
                        setServiceMode(e.target.value as "doorstep" | "pickup_drop" | "walk_in")
                      }
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold capitalize"
                    >
                      <option value="doorstep">Doorstep Pune (On-Site)</option>
                      <option value="walk_in">Hub Walk-in (Sadashiv Peth)</option>
                      <option value="pickup_drop">Pickup & Drop Dispatch</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Customer Details */}
              <div>
                <h3 className="font-heading text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2 mb-3">
                  Customer & Service Location
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Customer Name</label>
                    <input
                      type="text"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Phone Number</label>
                    <input
                      type="text"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Alt Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={custAltPhone}
                      onChange={(e) => setCustAltPhone(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-zinc-600">Street Address</label>
                    <input
                      type="text"
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Pune Area / Pincode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Area"
                        value={custArea}
                        onChange={(e) => setCustArea(e.target.value)}
                        className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={custPincode}
                        onChange={(e) => setCustPincode(e.target.value)}
                        className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Diagnostic Checklist & Accessories */}
              <div>
                <h3 className="font-heading text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2 mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-orange-600" />
                  <span>Physical Intake Inspection & Accessories</span>
                </h3>

                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] text-zinc-500">
                    Online bookings default to &quot;Untested&quot; so the technician can physically verify faults upon intake.
                  </p>
                  <button
                    type="button"
                    onClick={() => setChecklist(DEFAULT_CHECKLIST)}
                    className="text-[10px] font-bold text-orange-600 hover:text-orange-700 underline"
                  >
                    Reset All to Untested
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-zinc-50 p-3 rounded-lg border border-zinc-200 mb-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 text-[10px]">1. Power On</label>
                    <select
                      value={checklist.powerOn}
                      onChange={(e) =>
                        setChecklist({ ...checklist, powerOn: e.target.value as "yes" | "no" | "untested" })
                      }
                      className="w-full rounded border border-zinc-200 bg-white p-1 text-xs"
                    >
                      <option value="untested">Untested (Check at Intake)</option>
                      <option value="yes">Yes (Powers On)</option>
                      <option value="no">No (Dead / No Power)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 text-[10px]">2. Display Screen</label>
                    <select
                      value={checklist.screenCondition}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          screenCondition: e.target.value as "good" | "scratched" | "cracked" | "no_display" | "untested",
                        })
                      }
                      className="w-full rounded border border-zinc-200 bg-white p-1 text-xs"
                    >
                      <option value="untested">Untested (Check at Intake)</option>
                      <option value="good">Good / Intact</option>
                      <option value="cracked">Cracked / Shattered</option>
                      <option value="scratched">Scratched Only</option>
                      <option value="no_display">Blank / No Display</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 text-[10px]">3. Touch Function</label>
                    <select
                      value={checklist.touchFunction}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          touchFunction: e.target.value as "working" | "faulty" | "untested",
                        })
                      }
                      className="w-full rounded border border-zinc-200 bg-white p-1 text-xs"
                    >
                      <option value="untested">Untested (Check at Intake)</option>
                      <option value="working">Working</option>
                      <option value="faulty">Faulty / Ghost Touch</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 text-[10px]">4. Body / Frame</label>
                    <select
                      value={checklist.backGlassBody}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          backGlassBody: e.target.value as "good" | "scratched" | "dented" | "cracked" | "untested",
                        })
                      }
                      className="w-full rounded border border-zinc-200 bg-white p-1 text-xs"
                    >
                      <option value="untested">Untested (Check at Intake)</option>
                      <option value="good">Good / Intact</option>
                      <option value="dented">Dented / Bent</option>
                      <option value="scratched">Scratched</option>
                      <option value="cracked">Back Glass Cracked</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 text-[10px]">5. Cameras</label>
                    <select
                      value={checklist.frontCamera === "working" && checklist.rearCamera === "working" ? "working" : checklist.frontCamera === "faulty" || checklist.rearCamera === "faulty" ? "faulty" : "untested"}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          frontCamera: e.target.value as "working" | "faulty" | "untested",
                          rearCamera: e.target.value as "working" | "faulty" | "untested",
                        })
                      }
                      className="w-full rounded border border-zinc-200 bg-white p-1 text-xs"
                    >
                      <option value="untested">Untested (Check at Intake)</option>
                      <option value="working">Both Working / Clear</option>
                      <option value="faulty">Faulty / Blurry</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 text-[10px]">6. Charging Port</label>
                    <select
                      value={checklist.chargingPort}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          chargingPort: e.target.value as "working" | "loose" | "faulty" | "untested",
                        })
                      }
                      className="w-full rounded border border-zinc-200 bg-white p-1 text-xs"
                    >
                      <option value="untested">Untested (Check at Intake)</option>
                      <option value="working">Normal Fast Charging</option>
                      <option value="loose">Loose / Intermittent</option>
                      <option value="faulty">No Charge / Dead</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 text-[10px]">7. Battery Health</label>
                    <select
                      value={checklist.batteryCondition}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          batteryCondition: e.target.value as "normal" | "service_needed" | "swollen" | "untested",
                        })
                      }
                      className="w-full rounded border border-zinc-200 bg-white p-1 text-xs"
                    >
                      <option value="untested">Untested (Check at Intake)</option>
                      <option value="normal">Normal / Good</option>
                      <option value="service_needed">Fast Draining</option>
                      <option value="swollen">Swollen / Danger</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 text-[10px]">8. Audio (Spk/Mic)</label>
                    <select
                      value={checklist.speakerEarpiece === "working" && checklist.microphone === "working" ? "working" : checklist.speakerEarpiece === "faulty" || checklist.microphone === "faulty" ? "faulty" : "untested"}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          speakerEarpiece: e.target.value as "working" | "muffled" | "faulty" | "untested",
                          microphone: e.target.value as "working" | "faulty" | "untested",
                        })
                      }
                      className="w-full rounded border border-zinc-200 bg-white p-1 text-xs"
                    >
                      <option value="untested">Untested (Check at Intake)</option>
                      <option value="working">Loud & Clear</option>
                      <option value="faulty">Muffled / Faulty</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 text-[10px]">9. WiFi / Network</label>
                    <select
                      value={checklist.networkWifi}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          networkWifi: e.target.value as "working" | "faulty" | "untested",
                        })
                      }
                      className="w-full rounded border border-zinc-200 bg-white p-1 text-xs"
                    >
                      <option value="untested">Untested (Check at Intake)</option>
                      <option value="working">Normal Connection</option>
                      <option value="faulty">No Signal / Drop</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 text-[10px]">10. Liquid Ingress</label>
                    <select
                      value={checklist.liquidDamage}
                      onChange={(e) =>
                        setChecklist({
                          ...checklist,
                          liquidDamage: e.target.value as "none" | "suspected" | "detected" | "untested",
                        })
                      }
                      className="w-full rounded border border-zinc-200 bg-white p-1 text-xs"
                    >
                      <option value="untested">Untested (Check at Intake)</option>
                      <option value="none">None (Clean)</option>
                      <option value="suspected">Suspected Exposure</option>
                      <option value="detected">Detected / Corrosion</option>
                    </select>
                  </div>
                </div>

                {/* Accessories Checkboxes */}
                <div className="space-y-1">
                  <label className="font-bold text-zinc-600">Accessories Received with Handset</label>
                  <div className="flex flex-wrap gap-4 pt-1">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessories.simTray}
                        onChange={(e) => setAccessories({ ...accessories, simTray: e.target.checked })}
                        className="rounded border-zinc-300 text-orange-600"
                      />
                      <span>SIM Tray</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessories.simCard}
                        onChange={(e) => setAccessories({ ...accessories, simCard: e.target.checked })}
                        className="rounded border-zinc-300 text-orange-600"
                      />
                      <span>SIM Card</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessories.memoryCard}
                        onChange={(e) => setAccessories({ ...accessories, memoryCard: e.target.checked })}
                        className="rounded border-zinc-300 text-orange-600"
                      />
                      <span>MicroSD Card</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessories.protectiveCase}
                        onChange={(e) => setAccessories({ ...accessories, protectiveCase: e.target.checked })}
                        className="rounded border-zinc-300 text-orange-600"
                      />
                      <span>Case / Back Cover</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessories.chargerCable}
                        onChange={(e) => setAccessories({ ...accessories, chargerCable: e.target.checked })}
                        className="rounded border-zinc-300 text-orange-600"
                      />
                      <span>Charger / Cable</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 4: Services, Spare Parts & Pricing */}
              <div>
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-3">
                  <h3 className="font-heading text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-orange-600" />
                    <span>Repair Services, Spare Parts & Pricing</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Line Item</span>
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-zinc-50 p-2 rounded-lg border border-zinc-200"
                    >
                      <div className="col-span-6 space-y-0.5">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          placeholder="Service or part description"
                          className="w-full rounded border border-zinc-200 bg-white px-2 py-1 text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={item.type}
                          onChange={(e) => handleItemChange(idx, "type", e.target.value)}
                          className="w-full rounded border border-zinc-200 bg-white p-1 text-xs capitalize"
                        >
                          <option value="service">Service</option>
                          <option value="part">Part</option>
                          <option value="inspection">Inspection</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                          className="w-full rounded border border-zinc-200 bg-white p-1 text-xs text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, "unitPrice", Number(e.target.value))}
                          placeholder="Price (₹)"
                          className="w-full rounded border border-zinc-200 bg-white p-1 text-xs font-mono text-right"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-zinc-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Totals */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Total Estimate (₹)</label>
                    <input
                      type="number"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(Number(e.target.value))}
                      className="w-full rounded border border-zinc-200 bg-white p-1.5 text-xs font-bold text-zinc-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Advance Paid (₹)</label>
                    <input
                      type="number"
                      value={advancePaid}
                      onChange={(e) => setAdvancePaid(Number(e.target.value))}
                      className="w-full rounded border border-zinc-200 bg-white p-1.5 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as "unpaid" | "paid" | "cod")}
                      className="w-full rounded border border-zinc-200 bg-white p-1.5 text-xs font-semibold capitalize"
                    >
                      <option value="unpaid">Unpaid (Post-Repair)</option>
                      <option value="paid">Paid (Online / Cash)</option>
                      <option value="cod">Cash on Delivery (COD)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-600">Balance Due (₹)</label>
                    <div className="font-mono text-sm font-extrabold text-orange-600 py-1.5">
                      ₹{balanceDue.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Workshop Inspection Notes */}
              <div>
                <h3 className="font-heading text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-2 mb-3">
                  Workshop Inspection Notes (Optional)
                </h3>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-600">Inspection & Lab Observations</label>
                  <textarea
                    rows={3}
                    placeholder="Leave blank to print ruled lines for handwritten notes..."
                    value={workshopNotes}
                    onChange={(e) => setWorkshopNotes(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400"
                  />
                  <p className="text-[10px] text-zinc-500">
                    If left empty, the printed job card will display ruled lines for writing observations by hand.
                  </p>
                </div>
              </div>

              {/* Sync Button if attached to database entry */}
              {repair?._id && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveToDatabase}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isSaving ? "Saving..." : "Update Repair Booking Record"}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-200 bg-zinc-50 shrink-0">
          <div className="text-[11px] text-zinc-500 font-medium">
            Standard Mobile Repair Sheet • Hub: Sadashiv Peth, Pune
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "preview" ? "customize" : "preview")}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
            >
              {activeTab === "preview" ? "Edit Data" : "View A4 Preview"}
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-orange-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>{isDownloadingPdf ? "Downloading..." : "Download PDF"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
