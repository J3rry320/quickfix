"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Edit3, Loader2, AlertCircle, Download } from "lucide-react";
import RepairJobSheet from "@/components/admin/repairs/RepairJobSheet";
import JobSheetModal from "@/components/admin/repairs/JobSheetModal";
import { adminFetch } from "@/lib/admin/api";
import {
  JobSheetData,
  DEFAULT_CHECKLIST,
  DEFAULT_ACCESSORIES,
  formatJobSheetNumber,
  triggerJobSheetPrint,
  downloadJobSheetPdf,
} from "@/lib/admin/jobsheet";

interface RepairRequestDoc {
  _id: string;
  bookingReference: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  device: {
    brand: string;
    model: string;
    color?: string;
  };
  service?: {
    _id?: string;
    name?: string;
    startingPrice?: number;
  };
  issueDescription: string;
  serviceMode: "doorstep" | "pickup_drop" | "walk_in";
  preferredSlot: {
    date: string;
    timeSlot: string;
  };
  address: {
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
  status: string;
  createdAt: string;
}

export default function StandaloneJobSheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [repair, setRepair] = useState<RepairRequestDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isSubscribed = true;

    async function fetchRecord() {
      setLoading(true);
      setError("");
      try {
        const data = await adminFetch<{ request: RepairRequestDoc }>(
          `/api/admin/repair-requests/${id}`
        );
        if (isSubscribed && data?.request) {
          setRepair(data.request);
        } else if (isSubscribed) {
          setError("Repair request not found");
        }
      } catch (err) {
        if (isSubscribed) {
          setError(err instanceof Error ? err.message : "Failed to load repair record");
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    fetchRecord();

    return () => {
      isSubscribed = false;
    };
  }, [id, refreshKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center text-zinc-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <p className="text-xs font-semibold">Generating Repair Job Sheet...</p>
      </div>
    );
  }

  if (error || !repair) {
    return (
      <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm max-w-md w-full text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <h2 className="font-heading text-lg font-bold text-zinc-900">
            Job Sheet Not Available
          </h2>
          <p className="text-xs text-zinc-500">{error || "The specified repair booking does not exist."}</p>
          <Link
            href="/admin/repairs"
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Repairs</span>
          </Link>
        </div>
      </div>
    );
  }

  const jobSheetNo = formatJobSheetNumber(repair.bookingReference);
  const finalPrice = repair.pricing?.finalPrice ?? repair.pricing?.estimatedPrice ?? 1499;

  const sheetData: JobSheetData = {
    jobSheetNumber: jobSheetNo,
    bookingReference: repair.bookingReference,
    date: repair.createdAt,
    serviceMode: repair.serviceMode || "doorstep",
    status: repair.status,
    customer: {
      name: repair.customer.name,
      phone: repair.customer.phone,
      email: repair.customer.email,
      address: repair.address.streetAddress,
      area: repair.address.area,
      city: repair.address.city,
      pincode: repair.address.pincode,
      landmark: repair.address.landmark,
    },
    device: {
      brand: repair.device.brand,
      model: repair.device.model,
      color: repair.device.color,
    },
    accessories: DEFAULT_ACCESSORIES,
    checklist: DEFAULT_CHECKLIST,
    reportedFault: repair.issueDescription,
    workshopNotes: "",
    primaryServiceName: repair.service?.name || "Mobile Repair Service",
    items: [
      {
        description: `${repair.service?.name || "Mobile Repair"} (${repair.device.brand} ${repair.device.model})`,
        type: "service",
        quantity: 1,
        unitPrice: finalPrice,
        totalPrice: finalPrice,
      },
    ],
    subtotal: finalPrice,
    diagnosticFee: 0,
    discount: 0,
    totalAmount: finalPrice,
    advancePaid: 0,
    balanceDue: repair.pricing?.paymentStatus === "paid" ? 0 : finalPrice,
    paymentStatus: repair.pricing?.paymentStatus || "unpaid",
    paymentMethod: repair.pricing?.paymentMethod || "UPI",
    warrantyPeriod: "90-Day Parts Replacement Guarantee",
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await downloadJobSheetPdf(`jobsheet-doc-${jobSheetNo}`, jobSheetNo);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert(
        "Direct PDF download encountered an issue. Opening browser print view where you can save as PDF."
      );
      triggerJobSheetPrint(jobSheetNo);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100/80 py-6 sm:py-8 px-3 sm:px-6 flex flex-col items-center">
      {/* Floating Action Header (Hidden on Print) */}
      <div className="no-print w-full max-w-[210mm] mb-4 flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/repairs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Repairs</span>
          </Link>
          <span className="text-zinc-300">|</span>
          <span className="font-mono text-xs font-bold text-zinc-800">
            {repair.bookingReference}
          </span>
          <span className="text-[11px] text-zinc-500">
            ({repair.device.brand} {repair.device.model})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit / Customize</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-orange-700 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isDownloadingPdf ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            <span>{isDownloadingPdf ? "Generating PDF..." : "Download PDF"}</span>
          </button>

          <button
            type="button"
            onClick={() => triggerJobSheetPrint(jobSheetNo)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="w-full max-w-[210mm] bg-white shadow-md rounded-lg overflow-hidden">
        <RepairJobSheet data={sheetData} id={`jobsheet-doc-${jobSheetNo}`} />
      </div>

      {/* Editor Modal */}
      {isEditModalOpen && (
        <JobSheetModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          repair={repair}
          onUpdate={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
