"use client";

import React, { useState } from "react";
import {
  X,
  Loader2,
  Plus,
  Trash2,
  IndianRupee,
  Smartphone,
  Wrench,
  Clock,
  Sparkles,
  AlertCircle,
  Check,
} from "lucide-react";
import AdminImage from "@/components/admin/AdminImage";
import { adminFetch } from "@/lib/admin/api";

export interface ServiceItem {
  _id: string;
  name: string;
  slug: string;
  startingPrice: number;
  estimatedTimeMinutes: number;
  image?: string;
  isActive?: boolean;
}

export interface ServicePricingItem {
  service: {
    _id: string;
    name: string;
    slug?: string;
    startingPrice?: number;
    image?: string;
  };
  price: number;
  estimatedTimeMinutes?: number;
}

export interface ModelWithServices {
  _id: string;
  name: string;
  slug: string;
  brand: {
    _id: string;
    name: string;
    slug: string;
  };
  imageUrl?: string;
  servicePricing?: ServicePricingItem[];
}

interface WorkingServicePricingEntry {
  serviceId: string;
  price: number | string;
  estimatedTimeMinutes: number | string;
}

interface ModelServicePricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: ModelWithServices | null;
  availableServices: ServiceItem[];
  onSaved: (updatedModel: ModelWithServices) => void;
}

export default function ModelServicePricingModal({
  isOpen,
  onClose,
  model,
  availableServices,
  onSaved,
}: ModelServicePricingModalProps) {
  const [modelServiceList, setModelServiceList] = useState<
    WorkingServicePricingEntry[]
  >(() => {
    if (model && Array.isArray(model.servicePricing) && model.servicePricing.length > 0) {
      return model.servicePricing.map((item) => ({
        serviceId: item.service?._id || (item.service as unknown as string),
        price: item.price,
        estimatedTimeMinutes: item.estimatedTimeMinutes || 30,
      }));
    }
    return [];
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Add individual service form fields
  const [addServiceId, setAddServiceId] = useState("");
  const [addServicePrice, setAddServicePrice] = useState<number | string>("");
  const [addServiceTime, setAddServiceTime] = useState<number | string>(30);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [isOpen]);

  if (!isOpen || !model) return null;

  const handleSelectServiceToAdd = (serviceId: string) => {
    setAddServiceId(serviceId);
    if (!serviceId) {
      setAddServicePrice("");
      setAddServiceTime(30);
      return;
    }

    const svc = availableServices.find((s) => s._id === serviceId);
    if (svc) {
      setAddServicePrice(svc.startingPrice);
      setAddServiceTime(svc.estimatedTimeMinutes || 30);
    }
  };

  const handleAddServiceToList = () => {
    if (!addServiceId) {
      setError("Please select a repair service to add.");
      return;
    }

    const priceNum = Number(addServicePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Please specify a valid non-negative repair price.");
      return;
    }

    const timeNum = Number(addServiceTime) || 30;

    // Check if already in list
    if (modelServiceList.some((item) => item.serviceId === addServiceId)) {
      setModelServiceList((prev) =>
        prev.map((item) =>
          item.serviceId === addServiceId
            ? { ...item, price: priceNum, estimatedTimeMinutes: timeNum }
            : item
        )
      );
    } else {
      setModelServiceList((prev) => [
        ...prev,
        {
          serviceId: addServiceId,
          price: priceNum,
          estimatedTimeMinutes: timeNum,
        },
      ]);
    }

    setAddServiceId("");
    setAddServicePrice("");
    setAddServiceTime(30);
    setError("");
  };

  const handleQuickAddAllServices = () => {
    const combined: WorkingServicePricingEntry[] = availableServices.map(
      (svc) => {
        const existing = modelServiceList.find(
          (item) => item.serviceId === svc._id
        );
        return {
          serviceId: svc._id,
          price: existing ? existing.price : svc.startingPrice,
          estimatedTimeMinutes: existing
            ? existing.estimatedTimeMinutes
            : svc.estimatedTimeMinutes || 30,
        };
      }
    );
    setModelServiceList(combined);
    setError("");
  };

  const handleRemoveServiceFromList = (serviceId: string) => {
    setModelServiceList((prev) =>
      prev.filter((item) => item.serviceId !== serviceId)
    );
  };

  const handleUpdateEntryPrice = (
    serviceId: string,
    val: number | string
  ) => {
    setModelServiceList((prev) =>
      prev.map((item) =>
        item.serviceId === serviceId ? { ...item, price: val } : item
      )
    );
  };

  const handleUpdateEntryTime = (serviceId: string, val: number | string) => {
    setModelServiceList((prev) =>
      prev.map((item) =>
        item.serviceId === serviceId
          ? { ...item, estimatedTimeMinutes: val }
          : item
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        servicePricing: modelServiceList.map((item) => ({
          service: item.serviceId,
          price: Number(item.price) || 0,
          estimatedTimeMinutes: Number(item.estimatedTimeMinutes) || 30,
        })),
      };

      const res = await adminFetch<{ model: ModelWithServices }>(
        `/api/admin/models/${model._id}`,
        {
          method: "PATCH",
          body: payload,
        }
      );

      setSuccess("Model repair services and pricing updated successfully!");
      if (res.model) {
        onSaved(res.model);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error saving repair services"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-clean-white p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 max-h-[94vh] my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 pb-3 sm:pb-4 shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <AdminImage
              src={model.imageUrl}
              alt={model.name}
              fallbackIcon={Smartphone}
              containerClassName="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading text-base sm:text-lg font-bold text-tech-slate truncate">
                  {model.name}
                </h3>
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-2xs font-bold text-tech-slate shrink-0">
                  {model.brand?.name}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5 truncate sm:whitespace-normal">
                Configure custom repair prices and turnaround times for this
                phone model.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium flex items-center gap-2 shrink-0">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs border border-emerald-200 font-medium flex items-center gap-2 shrink-0">
            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs shrink-0">
          <span className="font-bold text-tech-slate">
            {modelServiceList.length} Repair Services Configured
          </span>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleQuickAddAllServices}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-tech-slate px-3 py-2 sm:py-1.5 text-xs font-bold text-clean-white hover:bg-black transition-all cursor-pointer"
              title="Populate all active catalogue services with default starting rates"
            >
              <Sparkles className="h-3.5 w-3.5 text-electric-amber" />
              <span>Quick Add All Active Services</span>
            </button>

            {modelServiceList.length > 0 && (
              <button
                type="button"
                onClick={() => setModelServiceList([])}
                className="rounded-lg border border-zinc-200 bg-clean-white px-2.5 py-2 sm:py-1.5 text-xs font-semibold text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Add New Service Form Row */}
        <div className="p-4 rounded-xl border border-flash-orange/30 bg-flash-orange/5 space-y-3 shrink-0">
          <p className="text-xs font-extrabold uppercase tracking-wider text-flash-orange">
            + Add / Associate Repair Service
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5 space-y-1">
              <label className="text-2xs font-bold text-zinc-600">
                Select Service
              </label>
              <select
                value={addServiceId}
                onChange={(e) => handleSelectServiceToAdd(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-clean-white px-3 py-2 text-xs font-medium text-tech-slate focus:border-flash-orange focus:outline-hidden"
              >
                <option value="">Choose service...</option>
                {availableServices.map((svc) => {
                  const isAlreadyAdded = modelServiceList.some(
                    (item) => item.serviceId === svc._id
                  );
                  return (
                    <option key={svc._id} value={svc._id}>
                      {svc.name} {isAlreadyAdded ? "(Already added)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-2xs font-bold text-zinc-600">
                Model Price (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="number"
                  min={0}
                  placeholder="2499"
                  value={addServicePrice}
                  onChange={(e) => setAddServicePrice(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-clean-white pl-8 pr-2 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-2xs font-bold text-zinc-600">
                Est. Time (Mins)
              </label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="number"
                  min={5}
                  placeholder="30"
                  value={addServiceTime}
                  onChange={(e) => setAddServiceTime(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-clean-white pl-8 pr-2 py-2 text-xs font-medium text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddServiceToList}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-flash-orange px-3 py-2 text-xs font-bold text-clean-white hover:bg-orange-600 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Configured Services Table (Scrollable) */}
        <div className="flex-1 overflow-y-auto min-h-[160px] rounded-xl border border-zinc-200 bg-clean-white">
          {modelServiceList.length === 0 ? (
            <div className="text-center py-10 px-4 text-zinc-400 space-y-2">
              <Wrench className="h-8 w-8 mx-auto text-zinc-300" />
              <p className="text-xs font-medium">
                No repair services associated with this model yet.
              </p>
              <p className="text-2xs text-zinc-400">
                Use the &quot;Quick Add All Active Services&quot; button above or
                add individual services manually.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-zinc-50 border-b border-zinc-200 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-2.5">Service</th>
                  <th className="px-4 py-2.5">Price (₹)</th>
                  <th className="px-4 py-2.5">Est. Time</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {modelServiceList.map((entry) => {
                  const svc = availableServices.find(
                    (s) => s._id === entry.serviceId
                  );
                  return (
                    <tr
                      key={entry.serviceId}
                      className="hover:bg-zinc-50/80 transition-colors"
                    >
                      {/* Service Details */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <AdminImage
                            src={svc?.image}
                            alt={svc?.name || "Service"}
                            fallbackIcon={Wrench}
                            containerClassName="h-7 w-7 rounded-md bg-flash-orange/10 text-flash-orange border border-flash-orange/20 p-0.5 flex items-center justify-center shrink-0"
                          />
                          <div>
                            <span className="font-bold text-tech-slate block">
                              {svc?.name || "Unknown Service"}
                            </span>
                            {svc?.startingPrice !== undefined && (
                              <span className="text-2xs text-zinc-400">
                                Catalogue Default: ₹{svc.startingPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Editable Price */}
                      <td className="px-4 py-3 w-36">
                        <div className="relative">
                          <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
                          <input
                            type="number"
                            min={0}
                            value={entry.price}
                            onChange={(e) =>
                              handleUpdateEntryPrice(
                                entry.serviceId,
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-zinc-200 bg-clean-white pl-7 pr-2 py-1.5 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                          />
                        </div>
                      </td>

                      {/* Editable Time */}
                      <td className="px-4 py-3 w-32">
                        <div className="relative">
                          <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
                          <input
                            type="number"
                            min={5}
                            value={entry.estimatedTimeMinutes}
                            onChange={(e) =>
                              handleUpdateEntryTime(
                                entry.serviceId,
                                e.target.value
                              )
                            }
                            className="w-full rounded-lg border border-zinc-200 bg-clean-white pl-7 pr-2 py-1.5 text-xs font-medium text-tech-slate focus:border-flash-orange focus:outline-hidden"
                          />
                        </div>
                      </td>

                      {/* Delete Action */}
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveServiceFromList(entry.serviceId)
                          }
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove service association"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200 shrink-0">
          <span className="text-2xs text-zinc-500 font-medium">
            Changes must be saved to update pricing for this device model.
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 cursor-pointer disabled:opacity-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-flash-orange px-5 py-2.5 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              <span>
                {isSaving ? "Saving Pricing..." : "Save Pricing Rules"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
