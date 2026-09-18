"use client";

import { useEffect, useState, use, Suspense } from "react";
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

function JobSheetContent({
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
      <div className="min-h-screen bg-mist-gray flex flex-col items-center justify-center text-text-muted gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-flash-orange" />
        <p className="text-xs font-semibold">Generating Repair Job Sheet...</p>
      </div>
    );
  }

  if (error || !repair) {
    return (
      <div className="min-h-screen bg-mist-gray flex flex-col items-center justify-center p-4">
        <div className="bg-clean-white rounded-xl p-6 border border-border-default shadow-xs max-w-md w-full text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-error mx-auto" />
          <h2 className="font-heading text-lg font-bold text-tech-slate">
            Job Sheet Not Available
          </h2>
          <p className="text-xs text-text-muted">{error || "The specified repair booking does not exist."}</p>
          <Link
            href="/admin/repairs"
            className="inline-flex items-center gap-1.5 rounded-lg bg-tech-slate px-4 py-2 text-xs font-bold text-clean-white hover:bg-tech-slate-hover"
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
      await downloadJobSheetPdf(sheetData);
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
    <div className="min-h-screen bg-mist-gray/80 py-3 sm:py-8 px-2 sm:px-6 flex flex-col items-center">
      {/* Floating Action Header (Hidden on Print) */}
      <div className="no-print w-full max-w-[210mm] mb-3 sm:mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 bg-clean-white p-3 sm:p-3.5 rounded-xl border border-border-default shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/admin/repairs"
            className="inline-flex items-center gap-1 text-xs font-bold text-text-secondary hover:text-tech-slate transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden xs:inline">Repairs</span>
          </Link>
          <span className="text-border-strong">|</span>
          <span className="font-mono text-xs font-bold text-tech-slate truncate">
            {repair.bookingReference}
          </span>
          <span className="text-[11px] text-text-muted truncate hidden xs:inline">
            ({repair.device.brand} {repair.device.model})
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-default bg-clean-white px-2.5 sm:px-3 py-1.5 text-xs font-bold text-text-secondary hover:bg-mist-gray cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-flash-orange px-3 sm:px-4 py-1.5 text-xs font-bold text-clean-white hover:bg-flash-orange-hover shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isDownloadingPdf ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            <span>{isDownloadingPdf ? "Generating..." : "Download PDF"}</span>
          </button>

          <button
            type="button"
            onClick={() => triggerJobSheetPrint(jobSheetNo)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-default bg-clean-white px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-hover shadow-xs transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="w-full max-w-full overflow-x-auto p-1 pb-4 flex justify-center [scrollbar-width:thin] touch-pan-x">
        <div className="w-full max-w-[210mm] min-w-[320px] sm:min-w-[650px] md:min-w-[210mm] bg-clean-white shadow-md rounded-lg overflow-hidden border border-border-default shrink-0">
          <RepairJobSheet data={sheetData} id={`jobsheet-doc-${jobSheetNo}`} />
        </div>
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

export default function StandaloneJobSheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-mist-gray">
          <Loader2 className="h-10 w-10 animate-spin text-flash-orange mb-3" />
          <p className="text-sm font-bold text-tech-slate">Loading Job Sheet...</p>
        </div>
      }
    >
      <JobSheetContent params={params} />
    </Suspense>
  );
}
