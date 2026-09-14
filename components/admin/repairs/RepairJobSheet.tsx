"use client";

import React from "react";
import Image from "next/image";
import contactConfig from "@/config/contact";
import {
  JobSheetData,
  STANDARD_REPAIR_TERMS,
  isChecklistPending,
} from "@/lib/admin/jobsheet";

interface RepairJobSheetProps {
  data: JobSheetData;
  className?: string;
  isPrintOnly?: boolean;
  id?: string;
}

export default function RepairJobSheet({
  data,
  className = "",
  isPrintOnly = false,
  id,
}: RepairJobSheetProps) {
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const containerId = id || `jobsheet-doc-${data.jobSheetNumber}`;

  return (
    <div
      id={containerId}
      className={`jobsheet-container font-sans bg-white text-zinc-900 print:text-black print:p-0 print:m-0 print:shadow-none print:w-full print:max-w-none ${
        isPrintOnly ? "block" : ""
      } ${className}`}
      style={{
        width: "100%",
        maxWidth: "210mm",
        margin: "0 auto",
      }}
    >
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 8mm 8mm 8mm;
          }
          body {
            background-color: #ffffff !important;
            color: #111827 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .jobsheet-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Main A4 Document Sheet */}
      <div className="border border-zinc-300 print:border-zinc-400 p-6 sm:p-7 space-y-4 rounded-lg print:rounded-none bg-white">
        {/* =========================================================
            1. HEADER SECTION (Branding, Logo, Contact from config, Meta)
        ========================================================= */}
        <div className="flex items-start justify-between border-b-2 border-zinc-800 pb-4 gap-4">
          {/* Logo & Company Branding */}
          <div className="flex items-start gap-3.5">
            <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 p-1 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="QuickFix.in Logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-zinc-950 font-heading">
                  {contactConfig.brand}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 print:border print:border-orange-300">
                  {contactConfig.legalName}
                </span>
              </div>
              <p className="text-xs font-semibold text-orange-600">
                {contactConfig.tagline}
              </p>
              <p className="text-[11px] text-zinc-600 max-w-sm mt-0.5 leading-tight">
                {contactConfig.address.full}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-zinc-600 mt-1 font-medium">
                <span>
                  <strong>Helpline:</strong> {contactConfig.phone.display}
                </span>
                <span>•</span>
                <span>
                  <strong>Email:</strong> {contactConfig.email}
                </span>
                <span>•</span>
                <span>
                  <strong>Support:</strong> {contactConfig.supportEmail}
                </span>
                <span>•</span>
                <span>
                  <strong>Hours:</strong> {contactConfig.hours.time}
                </span>
              </div>
            </div>
          </div>

          {/* Job Sheet Meta Badge */}
          <div className="text-right shrink-0">
            <div className="inline-block bg-zinc-900 text-white px-3 py-1 text-xs font-black uppercase tracking-wider rounded print:bg-black">
              Mobile Repair Job Sheet
            </div>
            <div className="mt-2 text-right">
              <div className="text-[11px] text-zinc-500 font-medium uppercase">
                Job Sheet No.
              </div>
              <div className="font-mono text-base font-extrabold text-zinc-900">
                {data.jobSheetNumber}
              </div>
            </div>
            <div className="text-[11px] text-zinc-600 mt-0.5">
              Ref: <span className="font-mono font-bold">{data.bookingReference}</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Intake Date:{" "}
              <span className="font-semibold text-zinc-800">
                {new Date(data.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                Mode: {data.serviceMode.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            2. CUSTOMER & DEVICE INFORMATION BLOCK (2 Columns)
        ========================================================= */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Customer Details */}
          <div className="border border-zinc-200 rounded-md p-3 bg-zinc-50/60 print:bg-white space-y-1">
            <div className="font-bold text-zinc-700 uppercase tracking-wider text-[10px] border-b border-zinc-200 pb-1 flex justify-between items-center">
              <span>Customer Details</span>
              <span className="text-[10px] text-zinc-400 font-normal">Pune Region</span>
            </div>
            <div className="pt-1">
              <div className="font-bold text-sm text-zinc-950">
                {data.customer.name}
              </div>
              <div className="flex items-center gap-3 text-zinc-700 mt-0.5">
                <span className="font-mono font-semibold">
                  📞 {data.customer.phone}
                </span>
                {data.customer.alternatePhone && (
                  <span className="font-mono text-zinc-500">
                    Alt: {data.customer.alternatePhone}
                  </span>
                )}
              </div>
              {data.customer.email && (
                <div className="text-zinc-600 text-[11px] truncate">
                  ✉️ {data.customer.email}
                </div>
              )}
              <div className="text-zinc-700 mt-1 leading-snug">
                📍 {data.customer.address}, {data.customer.area},{" "}
                {data.customer.city} - {data.customer.pincode}
                {data.customer.landmark && (
                  <span className="text-zinc-500 block text-[10px]">
                    (Landmark: {data.customer.landmark})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Device Details */}
          <div className="border border-zinc-200 rounded-md p-3 bg-zinc-50/60 print:bg-white space-y-1">
            <div className="font-bold text-zinc-700 uppercase tracking-wider text-[10px] border-b border-zinc-200 pb-1 flex justify-between items-center">
              <span>Device & Intake Specs</span>
              <span className="font-mono text-[10px] font-bold text-orange-600">
                {data.device.brand}
              </span>
            </div>
            <div className="pt-1 space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-sm text-zinc-950">
                  {data.device.brand} {data.device.model}
                </span>
                {data.device.color && (
                  <span className="text-zinc-600 font-medium text-[11px]">
                    Color: {data.device.color}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-0.5">
                <div>
                  <span className="text-zinc-500">IMEI / Serial:</span>{" "}
                  <span className="font-mono font-semibold text-zinc-800">
                    {data.device.imeiOrSerial || "To be logged by technician"}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500">Screen Lock / PIN:</span>{" "}
                  <span className="font-mono font-semibold text-zinc-800">
                    {data.device.passcodePattern || "To be verified at intake"}
                  </span>
                </div>
              </div>
              <div className="border-t border-zinc-200/80 pt-1 mt-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">
                  Accessories Received (Verify on Handover):
                </span>
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-zinc-700 mt-0.5">
                  <span className={data.accessories.simTray ? "font-bold text-zinc-900" : "text-zinc-400"}>
                    [{data.accessories.simTray ? "✓" : " "}] SIM Tray
                  </span>
                  <span className={data.accessories.simCard ? "font-bold text-zinc-900" : "text-zinc-400"}>
                    [{data.accessories.simCard ? "✓" : " "}] SIM Card
                  </span>
                  <span className={data.accessories.memoryCard ? "font-bold text-zinc-900" : "text-zinc-400"}>
                    [{data.accessories.memoryCard ? "✓" : " "}] SD Card
                  </span>
                  <span className={data.accessories.protectiveCase ? "font-bold text-zinc-900" : "text-zinc-400"}>
                    [{data.accessories.protectiveCase ? "✓" : " "}] Case
                  </span>
                  <span className={data.accessories.chargerCable ? "font-bold text-zinc-900" : "text-zinc-400"}>
                    [{data.accessories.chargerCable ? "✓" : " "}] Charger
                  </span>
                  {data.accessories.other && (
                    <span className="text-zinc-600 italic">
                      ({data.accessories.other})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            3. PRE-REPAIR PHYSICAL & DIAGNOSTIC INTAKE CHECKLIST
        ========================================================= */}
        <div className="border border-zinc-200 rounded-md p-2.5 bg-zinc-50/40 print:bg-white text-xs">
          <div className="font-bold text-zinc-800 uppercase tracking-wider text-[10px] mb-1.5 flex flex-wrap items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span>Pre-Repair Physical & Diagnostic Intake Checklist</span>
              <span className="text-[9px] text-zinc-500 font-normal italic">
                (Technician physical inspection at device intake)
              </span>
            </div>
            {isChecklistPending(data.checklist) ? (
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                To Be Checked by Technician on Intake
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                Physically Verified by Technician
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px]">
            {/* 1. Power On */}
            <div className="border border-zinc-200 rounded p-1.5 bg-white flex flex-col justify-between space-y-1">
              <div className="font-bold text-[10px] text-zinc-800 border-b border-zinc-100 pb-0.5 flex items-center justify-between">
                <span>1. Power On</span>
                {data.checklist.powerOn === "yes" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-emerald-100 text-emerald-800">
                    PASS
                  </span>
                ) : data.checklist.powerOn === "no" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-red-100 text-red-800">
                    FAIL
                  </span>
                ) : (
                  <span className="text-[8px] font-medium text-zinc-400">Pending</span>
                )}
              </div>
              <div className="space-y-0.5 text-[9px] leading-tight">
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.powerOn === "yes" ? "font-bold text-emerald-700" : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.powerOn === "yes"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.powerOn === "yes" ? "✓" : ""}
                  </span>
                  <span className="truncate">Pass (Powers On)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.powerOn === "no" ? "font-bold text-red-700" : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.powerOn === "no"
                        ? "border-red-600 bg-red-50 text-red-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.powerOn === "no" ? "✓" : ""}
                  </span>
                  <span className="truncate">Fail (Dead / No Power)</span>
                </div>
              </div>
            </div>

            {/* 2. Display Screen */}
            <div className="border border-zinc-200 rounded p-1.5 bg-white flex flex-col justify-between space-y-1">
              <div className="font-bold text-[10px] text-zinc-800 border-b border-zinc-100 pb-0.5 flex items-center justify-between">
                <span>2. Display Screen</span>
                {data.checklist.screenCondition === "good" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-emerald-100 text-emerald-800">
                    PASS
                  </span>
                ) : data.checklist.screenCondition === "cracked" ||
                  data.checklist.screenCondition === "scratched" ||
                  data.checklist.screenCondition === "no_display" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-red-100 text-red-800">
                    FAULT
                  </span>
                ) : (
                  <span className="text-[8px] font-medium text-zinc-400">Pending</span>
                )}
              </div>
              <div className="space-y-0.5 text-[9px] leading-tight">
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.screenCondition === "good"
                      ? "font-bold text-emerald-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.screenCondition === "good"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.screenCondition === "good" ? "✓" : ""}
                  </span>
                  <span className="truncate">Pass (Clear / Intact)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.screenCondition === "cracked" ||
                    data.checklist.screenCondition === "scratched" ||
                    data.checklist.screenCondition === "no_display"
                      ? "font-bold text-red-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.screenCondition === "cracked" ||
                      data.checklist.screenCondition === "scratched" ||
                      data.checklist.screenCondition === "no_display"
                        ? "border-red-600 bg-red-50 text-red-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.screenCondition === "cracked" ||
                    data.checklist.screenCondition === "scratched" ||
                    data.checklist.screenCondition === "no_display"
                      ? "✓"
                      : ""}
                  </span>
                  <span className="truncate">Fault (Crack / Blank)</span>
                </div>
              </div>
            </div>

            {/* 3. Touch Function */}
            <div className="border border-zinc-200 rounded p-1.5 bg-white flex flex-col justify-between space-y-1">
              <div className="font-bold text-[10px] text-zinc-800 border-b border-zinc-100 pb-0.5 flex items-center justify-between">
                <span>3. Touch Response</span>
                {data.checklist.touchFunction === "working" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-emerald-100 text-emerald-800">
                    PASS
                  </span>
                ) : data.checklist.touchFunction === "faulty" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-red-100 text-red-800">
                    FAULT
                  </span>
                ) : (
                  <span className="text-[8px] font-medium text-zinc-400">Pending</span>
                )}
              </div>
              <div className="space-y-0.5 text-[9px] leading-tight">
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.touchFunction === "working"
                      ? "font-bold text-emerald-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.touchFunction === "working"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.touchFunction === "working" ? "✓" : ""}
                  </span>
                  <span className="truncate">Pass (Responsive)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.touchFunction === "faulty"
                      ? "font-bold text-red-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.touchFunction === "faulty"
                        ? "border-red-600 bg-red-50 text-red-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.touchFunction === "faulty" ? "✓" : ""}
                  </span>
                  <span className="truncate">Fault (Ghost / Dead)</span>
                </div>
              </div>
            </div>

            {/* 4. Body / Frame */}
            <div className="border border-zinc-200 rounded p-1.5 bg-white flex flex-col justify-between space-y-1">
              <div className="font-bold text-[10px] text-zinc-800 border-b border-zinc-100 pb-0.5 flex items-center justify-between">
                <span>4. Body / Frame</span>
                {data.checklist.backGlassBody === "good" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-emerald-100 text-emerald-800">
                    PASS
                  </span>
                ) : data.checklist.backGlassBody === "scratched" ||
                  data.checklist.backGlassBody === "dented" ||
                  data.checklist.backGlassBody === "cracked" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-red-100 text-red-800">
                    FAULT
                  </span>
                ) : (
                  <span className="text-[8px] font-medium text-zinc-400">Pending</span>
                )}
              </div>
              <div className="space-y-0.5 text-[9px] leading-tight">
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.backGlassBody === "good"
                      ? "font-bold text-emerald-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.backGlassBody === "good"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.backGlassBody === "good" ? "✓" : ""}
                  </span>
                  <span className="truncate">Pass (Intact / Good)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.backGlassBody === "scratched" ||
                    data.checklist.backGlassBody === "dented" ||
                    data.checklist.backGlassBody === "cracked"
                      ? "font-bold text-red-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.backGlassBody === "scratched" ||
                      data.checklist.backGlassBody === "dented" ||
                      data.checklist.backGlassBody === "cracked"
                        ? "border-red-600 bg-red-50 text-red-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.backGlassBody === "scratched" ||
                    data.checklist.backGlassBody === "dented" ||
                    data.checklist.backGlassBody === "cracked"
                      ? "✓"
                      : ""}
                  </span>
                  <span className="truncate">Fault (Dent / Crack)</span>
                </div>
              </div>
            </div>

            {/* 5. Cameras */}
            <div className="border border-zinc-200 rounded p-1.5 bg-white flex flex-col justify-between space-y-1">
              <div className="font-bold text-[10px] text-zinc-800 border-b border-zinc-100 pb-0.5 flex items-center justify-between">
                <span>5. Cameras (F/R)</span>
                {data.checklist.frontCamera === "working" && data.checklist.rearCamera === "working" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-emerald-100 text-emerald-800">
                    PASS
                  </span>
                ) : data.checklist.frontCamera === "faulty" || data.checklist.rearCamera === "faulty" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-red-100 text-red-800">
                    FAULT
                  </span>
                ) : (
                  <span className="text-[8px] font-medium text-zinc-400">Pending</span>
                )}
              </div>
              <div className="space-y-0.5 text-[9px] leading-tight">
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.frontCamera === "working" && data.checklist.rearCamera === "working"
                      ? "font-bold text-emerald-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.frontCamera === "working" && data.checklist.rearCamera === "working"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.frontCamera === "working" && data.checklist.rearCamera === "working"
                      ? "✓"
                      : ""}
                  </span>
                  <span className="truncate">Pass (Both Clear)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.frontCamera === "faulty" || data.checklist.rearCamera === "faulty"
                      ? "font-bold text-red-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.frontCamera === "faulty" || data.checklist.rearCamera === "faulty"
                        ? "border-red-600 bg-red-50 text-red-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.frontCamera === "faulty" || data.checklist.rearCamera === "faulty"
                      ? "✓"
                      : ""}
                  </span>
                  <span className="truncate">Fault (Blur / Dead)</span>
                </div>
              </div>
            </div>

            {/* 6. Charging Port */}
            <div className="border border-zinc-200 rounded p-1.5 bg-white flex flex-col justify-between space-y-1">
              <div className="font-bold text-[10px] text-zinc-800 border-b border-zinc-100 pb-0.5 flex items-center justify-between">
                <span>6. Charging Port</span>
                {data.checklist.chargingPort === "working" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-emerald-100 text-emerald-800">
                    PASS
                  </span>
                ) : data.checklist.chargingPort === "loose" || data.checklist.chargingPort === "faulty" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-red-100 text-red-800">
                    FAULT
                  </span>
                ) : (
                  <span className="text-[8px] font-medium text-zinc-400">Pending</span>
                )}
              </div>
              <div className="space-y-0.5 text-[9px] leading-tight">
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.chargingPort === "working"
                      ? "font-bold text-emerald-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.chargingPort === "working"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.chargingPort === "working" ? "✓" : ""}
                  </span>
                  <span className="truncate">Pass (Charges OK)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.chargingPort === "loose" || data.checklist.chargingPort === "faulty"
                      ? "font-bold text-red-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.chargingPort === "loose" || data.checklist.chargingPort === "faulty"
                        ? "border-red-600 bg-red-50 text-red-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.chargingPort === "loose" || data.checklist.chargingPort === "faulty"
                      ? "✓"
                      : ""}
                  </span>
                  <span className="truncate">Fault (Loose / Dead)</span>
                </div>
              </div>
            </div>

            {/* 7. Battery Health */}
            <div className="border border-zinc-200 rounded p-1.5 bg-white flex flex-col justify-between space-y-1">
              <div className="font-bold text-[10px] text-zinc-800 border-b border-zinc-100 pb-0.5 flex items-center justify-between">
                <span>7. Battery Health</span>
                {data.checklist.batteryCondition === "normal" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-emerald-100 text-emerald-800">
                    PASS
                  </span>
                ) : data.checklist.batteryCondition === "service_needed" ||
                  data.checklist.batteryCondition === "swollen" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-red-100 text-red-800">
                    FAULT
                  </span>
                ) : (
                  <span className="text-[8px] font-medium text-zinc-400">Pending</span>
                )}
              </div>
              <div className="space-y-0.5 text-[9px] leading-tight">
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.batteryCondition === "normal"
                      ? "font-bold text-emerald-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.batteryCondition === "normal"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.batteryCondition === "normal" ? "✓" : ""}
                  </span>
                  <span className="truncate">Pass (Normal / OK)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.batteryCondition === "service_needed" ||
                    data.checklist.batteryCondition === "swollen"
                      ? "font-bold text-red-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.batteryCondition === "service_needed" ||
                      data.checklist.batteryCondition === "swollen"
                        ? "border-red-600 bg-red-50 text-red-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.batteryCondition === "service_needed" ||
                    data.checklist.batteryCondition === "swollen"
                      ? "✓"
                      : ""}
                  </span>
                  <span className="truncate">Fault (Drain / Swollen)</span>
                </div>
              </div>
            </div>

            {/* 8. Audio (Spk/Mic) */}
            <div className="border border-zinc-200 rounded p-1.5 bg-white flex flex-col justify-between space-y-1">
              <div className="font-bold text-[10px] text-zinc-800 border-b border-zinc-100 pb-0.5 flex items-center justify-between">
                <span>8. Audio (Spk/Mic)</span>
                {data.checklist.speakerEarpiece === "working" && data.checklist.microphone === "working" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-emerald-100 text-emerald-800">
                    PASS
                  </span>
                ) : (data.checklist.speakerEarpiece &&
                    data.checklist.speakerEarpiece !== "working" &&
                    data.checklist.speakerEarpiece !== "untested") ||
                  (data.checklist.microphone &&
                    data.checklist.microphone !== "working" &&
                    data.checklist.microphone !== "untested") ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-red-100 text-red-800">
                    FAULT
                  </span>
                ) : (
                  <span className="text-[8px] font-medium text-zinc-400">Pending</span>
                )}
              </div>
              <div className="space-y-0.5 text-[9px] leading-tight">
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.speakerEarpiece === "working" && data.checklist.microphone === "working"
                      ? "font-bold text-emerald-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.speakerEarpiece === "working" && data.checklist.microphone === "working"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.speakerEarpiece === "working" && data.checklist.microphone === "working"
                      ? "✓"
                      : ""}
                  </span>
                  <span className="truncate">Pass (Loud & Clear)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    (data.checklist.speakerEarpiece &&
                      data.checklist.speakerEarpiece !== "working" &&
                      data.checklist.speakerEarpiece !== "untested") ||
                    (data.checklist.microphone &&
                      data.checklist.microphone !== "working" &&
                      data.checklist.microphone !== "untested")
                      ? "font-bold text-red-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      (data.checklist.speakerEarpiece &&
                        data.checklist.speakerEarpiece !== "working" &&
                        data.checklist.speakerEarpiece !== "untested") ||
                      (data.checklist.microphone &&
                        data.checklist.microphone !== "working" &&
                        data.checklist.microphone !== "untested")
                        ? "border-red-600 bg-red-50 text-red-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {(data.checklist.speakerEarpiece &&
                      data.checklist.speakerEarpiece !== "working" &&
                      data.checklist.speakerEarpiece !== "untested") ||
                    (data.checklist.microphone &&
                      data.checklist.microphone !== "working" &&
                      data.checklist.microphone !== "untested")
                      ? "✓"
                      : ""}
                  </span>
                  <span className="truncate">Fault (Muffled / Dead)</span>
                </div>
              </div>
            </div>

            {/* 9. WiFi / Network */}
            <div className="border border-zinc-200 rounded p-1.5 bg-white flex flex-col justify-between space-y-1">
              <div className="font-bold text-[10px] text-zinc-800 border-b border-zinc-100 pb-0.5 flex items-center justify-between">
                <span>9. WiFi / Network</span>
                {data.checklist.networkWifi === "working" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-emerald-100 text-emerald-800">
                    PASS
                  </span>
                ) : data.checklist.networkWifi === "faulty" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-red-100 text-red-800">
                    FAULT
                  </span>
                ) : (
                  <span className="text-[8px] font-medium text-zinc-400">Pending</span>
                )}
              </div>
              <div className="space-y-0.5 text-[9px] leading-tight">
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.networkWifi === "working"
                      ? "font-bold text-emerald-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.networkWifi === "working"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.networkWifi === "working" ? "✓" : ""}
                  </span>
                  <span className="truncate">Pass (Connects OK)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.networkWifi === "faulty" ? "font-bold text-red-700" : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.networkWifi === "faulty"
                        ? "border-red-600 bg-red-50 text-red-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.networkWifi === "faulty" ? "✓" : ""}
                  </span>
                  <span className="truncate">Fault (No Signal / Fail)</span>
                </div>
              </div>
            </div>

            {/* 10. Liquid Damage */}
            <div className="border border-zinc-200 rounded p-1.5 bg-white flex flex-col justify-between space-y-1">
              <div className="font-bold text-[10px] text-zinc-800 border-b border-zinc-100 pb-0.5 flex items-center justify-between">
                <span>10. Liquid Ingress</span>
                {data.checklist.liquidDamage === "none" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-emerald-100 text-emerald-800">
                    PASS
                  </span>
                ) : data.checklist.liquidDamage === "suspected" ||
                  data.checklist.liquidDamage === "detected" ? (
                  <span className="text-[8px] font-black uppercase px-1 rounded bg-red-100 text-red-800">
                    FAULT
                  </span>
                ) : (
                  <span className="text-[8px] font-medium text-zinc-400">Pending</span>
                )}
              </div>
              <div className="space-y-0.5 text-[9px] leading-tight">
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.liquidDamage === "none"
                      ? "font-bold text-emerald-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.liquidDamage === "none"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.liquidDamage === "none" ? "✓" : ""}
                  </span>
                  <span className="truncate">Pass (No Moisture)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    data.checklist.liquidDamage === "suspected" ||
                    data.checklist.liquidDamage === "detected"
                      ? "font-bold text-red-700"
                      : "text-zinc-600"
                  }`}
                >
                  <span
                    className={`w-3 h-3 shrink-0 rounded-sm border flex items-center justify-center text-[8px] ${
                      data.checklist.liquidDamage === "suspected" ||
                      data.checklist.liquidDamage === "detected"
                        ? "border-red-600 bg-red-50 text-red-700 font-black"
                        : "border-zinc-400 bg-zinc-50"
                    }`}
                  >
                    {data.checklist.liquidDamage === "suspected" ||
                    data.checklist.liquidDamage === "detected"
                      ? "✓"
                      : ""}
                  </span>
                  <span className="truncate">Detected (Moisture / LDI)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            4. REPORTED FAULT & WORKSHOP INSPECTION NOTES
        ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Customer Reported Problem */}
          <div className="border border-zinc-200 rounded-md p-2.5 bg-zinc-50/40 print:bg-white flex flex-col justify-between space-y-1.5">
            <div>
              <span className="font-bold text-zinc-700 uppercase tracking-wider text-[10px] block mb-1">
                Customer Reported Problem / Booking Fault:
              </span>
              <p className="text-zinc-900 font-medium text-xs leading-relaxed bg-white border border-zinc-200 p-2.5 rounded min-h-[50px]">
                {data.reportedFault || "Diagnostic check requested by customer"}
              </p>
            </div>
            {data.primaryServiceName && (
              <div className="pt-1.5 border-t border-zinc-200 text-[11px] flex justify-between items-center text-zinc-600">
                <span className="text-zinc-500">Service Category:</span>
                <span className="font-bold text-zinc-900">{data.primaryServiceName}</span>
              </div>
            )}
          </div>

          {/* Workshop / Inspection Notes (Blank Space for Notes) */}
          <div className="border border-zinc-200 rounded-md p-2.5 bg-zinc-50/40 print:bg-white flex flex-col space-y-1">
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-bold text-zinc-700 uppercase tracking-wider text-[10px]">
                Technician Diagnostic Findings & Workshop Notes:
              </span>
              <span className="text-[9px] text-zinc-400 font-normal italic">
                To be verified at intake
              </span>
            </div>
            <div className="flex-1 bg-white border border-zinc-200 p-2 rounded min-h-[75px] text-zinc-700 text-[11px]">
              {data.workshopNotes ? (
                <p className="whitespace-pre-wrap leading-relaxed">{data.workshopNotes}</p>
              ) : (
                <div className="h-full flex flex-col justify-around py-1 text-zinc-300">
                  <div className="border-b border-dashed border-zinc-300 h-4" />
                  <div className="border-b border-dashed border-zinc-300 h-4" />
                  <div className="border-b border-dashed border-zinc-300 h-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            5. ITEMIZED PRICING & PAYMENT BREAKDOWN
        ========================================================= */}
        <div className="border border-zinc-200 rounded-md overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-800 text-white font-bold text-[10px] uppercase tracking-wider">
                <th className="py-1.5 px-3 w-10 text-center">#</th>
                <th className="py-1.5 px-3">Service / Spare Part Description</th>
                <th className="py-1.5 px-3 w-20 text-center">Type</th>
                <th className="py-1.5 px-3 w-16 text-center">Qty</th>
                <th className="py-1.5 px-3 w-24 text-right">Price (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-[11px]">
              {data.items.length > 0 ? (
                data.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50">
                    <td className="py-1.5 px-3 text-center text-zinc-500">{idx + 1}</td>
                    <td className="py-1.5 px-3 font-medium text-zinc-900">
                      {item.description}
                    </td>
                    <td className="py-1.5 px-3 text-center capitalize text-zinc-600 text-[10px]">
                      {item.type}
                    </td>
                    <td className="py-1.5 px-3 text-center text-zinc-600">{item.quantity}</td>
                    <td className="py-1.5 px-3 text-right font-mono font-semibold text-zinc-900">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-1.5 px-3 text-center text-zinc-500">1</td>
                  <td className="py-1.5 px-3 font-medium text-zinc-900">
                    {data.primaryServiceName} ({data.device.brand} {data.device.model})
                  </td>
                  <td className="py-1.5 px-3 text-center text-zinc-600 text-[10px]">
                    Service
                  </td>
                  <td className="py-1.5 px-3 text-center text-zinc-600">1</td>
                  <td className="py-1.5 px-3 text-right font-mono font-semibold text-zinc-900">
                    {formatCurrency(data.totalAmount)}
                  </td>
                </tr>
              )}

              {/* Subtotals & Payment Calculation */}
              <tr className="bg-zinc-50/70 font-medium">
                <td colSpan={3} className="py-1.5 px-3 text-right text-zinc-600 text-[10px]">
                  Doorstep Convenience & Travel Charge:
                </td>
                <td colSpan={2} className="py-1.5 px-3 text-right font-bold text-emerald-700 text-[11px]">
                  FREE (Zero Pune Travel Fee)
                </td>
              </tr>

              {data.diagnosticFee > 0 && (
                <tr className="bg-zinc-50/70">
                  <td colSpan={3} className="py-1 px-3 text-right text-zinc-600 text-[10px]">
                    Inspection / Diagnostic Fee:
                  </td>
                  <td colSpan={2} className="py-1 px-3 text-right font-mono font-semibold text-zinc-900">
                    {formatCurrency(data.diagnosticFee)}
                  </td>
                </tr>
              )}

              {data.discount > 0 && (
                <tr className="bg-zinc-50/70 text-emerald-700">
                  <td colSpan={3} className="py-1 px-3 text-right text-[10px]">
                    Promotional Discount:
                  </td>
                  <td colSpan={2} className="py-1 px-3 text-right font-mono font-bold">
                    -{formatCurrency(data.discount)}
                  </td>
                </tr>
              )}

              {/* Net Payable & Advance Row */}
              <tr className="border-t-2 border-zinc-800 bg-zinc-100 font-bold text-xs">
                <td colSpan={3} className="py-2 px-3">
                  <div className="flex items-center gap-3">
                    <span className="uppercase text-[10px] tracking-wider text-zinc-700">
                      Payment Status:
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider ${
                        data.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {data.paymentStatus === "paid"
                        ? "PAID IN FULL"
                        : data.paymentStatus === "cod"
                        ? "CASH ON DELIVERY (COD)"
                        : "UNPAID (DUE ON DELIVERY)"}
                    </span>
                    {data.paymentMethod && (
                      <span className="text-[10px] text-zinc-500 font-normal capitalize">
                        ({data.paymentMethod})
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-3 text-right uppercase text-[10px] text-zinc-600">
                  Total Estimate:
                </td>
                <td className="py-2 px-3 text-right font-mono text-sm font-extrabold text-zinc-950">
                  {formatCurrency(data.totalAmount)}
                </td>
              </tr>

              {/* Advance Paid & Balance Due */}
              <tr className="bg-white text-[11px] font-semibold border-t border-zinc-200">
                <td colSpan={3} className="py-1 px-3 text-zinc-500 text-[10px]">
                  Warranty:{" "}
                  <strong className="text-orange-600">
                    {data.warrantyPeriod || "90-Day QuickFix Guarantee"}
                  </strong>{" "}
                  on replaced components.
                </td>
                <td className="py-1 px-3 text-right text-zinc-600 text-[10px]">
                  Advance Paid:
                </td>
                <td className="py-1 px-3 text-right font-mono text-zinc-800">
                  {formatCurrency(data.advancePaid)}
                </td>
              </tr>
              <tr className="bg-orange-50/70 text-orange-950 font-bold text-xs">
                <td colSpan={3} className="py-1.5 px-3 text-[10px] text-zinc-600">
                  *Transparent pricing policy • No hidden fees • No Fix, No Fee promise.
                </td>
                <td className="py-1.5 px-3 text-right uppercase tracking-wider text-[10px] text-orange-900 font-black">
                  Balance Due:
                </td>
                <td className="py-1.5 px-3 text-right font-mono text-sm font-black text-orange-700">
                  {formatCurrency(data.balanceDue)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* =========================================================
            6. STANDARD MOBILE REPAIR TERMS & CONDITIONS
        ========================================================= */}
        <div className="border border-zinc-200 rounded-md p-2.5 bg-zinc-50/50 print:bg-white text-[9px] text-zinc-600 space-y-1">
          <div className="font-bold text-zinc-800 uppercase tracking-wider text-[9px] border-b border-zinc-200 pb-0.5 flex justify-between">
            <span>Standard Terms & Conditions for Mobile Device Service</span>
            <span className="font-semibold text-zinc-500">QuickFix.in Policy</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 leading-tight pt-0.5">
            {STANDARD_REPAIR_TERMS.map((term, i) => (
              <div key={i} className="flex items-start gap-1">
                <span className="font-bold text-zinc-800 shrink-0">{i + 1}.</span>
                <div>
                  <strong className="text-zinc-800">{term.title}:</strong> {term.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            7. DUAL SIGNATURE & AUTHORIZATION BLOCKS
        ========================================================= */}
        <div className="border-t-2 border-zinc-800 pt-3 text-xs">
          <div className="text-[10px] text-zinc-600 mb-4 leading-tight italic text-center">
            Customer Declaration: I hereby acknowledge the physical condition checklist, verify the device intake state, and consent to the repair terms and conditions outlined above.
          </div>

          <div className="grid grid-cols-3 gap-6 pt-2">
            {/* Customer Signature */}
            <div className="space-y-4">
              <div className="h-10 border-b border-dashed border-zinc-400 flex items-end">
                {/* Space for physical/digital signature */}
              </div>
              <div className="text-center">
                <div className="font-bold text-zinc-900 text-[11px]">
                  Customer Signature
                </div>
                <div className="text-[9px] text-zinc-500">
                  Date: ____________________
                </div>
              </div>
            </div>

            {/* QuickFix Stamp / Seal */}
            <div className="flex flex-col items-center justify-center border border-dashed border-zinc-300 rounded p-1.5 text-center">
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">
                Official Hub Seal / Stamp
              </span>
              <span className="text-[9px] font-bold text-zinc-600 mt-1">
                QuickFix Sadashiv Peth Hub
              </span>
              <span className="text-[8px] text-zinc-400">Pune - 411030</span>
            </div>

            {/* QuickFix Authorized Signatory */}
            <div className="space-y-4">
              <div className="h-10 border-b border-dashed border-zinc-400 flex items-end justify-center">
                {/* Space for authorized sign */}
              </div>
              <div className="text-center">
                <div className="font-bold text-zinc-900 text-[11px]">
                  QuickFix Authorized Signatory
                </div>
                <div className="text-[9px] text-zinc-500">
                  Date: ____________________
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[9px] text-zinc-400 pt-1 border-t border-zinc-100">
          This is a computer-generated mobile repair job card issued by {contactConfig.legalName}. For support, call {contactConfig.phone.display} or email {contactConfig.email}.
        </div>
      </div>
    </div>
  );
}
