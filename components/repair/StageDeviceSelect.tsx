"use client";

import React, { useState } from "react";
import { Search, Loader2, ArrowRight, Check } from "lucide-react";
import { useBookingWizard } from "./BookingWizardContext";

export default function StageDeviceSelect() {
  const {
    brands,
    popularBrands,
    otherBrands,
    models,
    popularModels,
    filteredModels,
    isLoadingCatalog,
    isLoadingModels,
    selectedBrand,
    modelInput,
    formData,
    handleSelectBrand,
    handleSelectModel,
    setModelInput,
    goToNextStage,
  } = useBookingWizard();

  const [isInputFocused, setIsInputFocused] = useState(false);

  const canProceed = Boolean(formData.brand.trim() && formData.model.trim());

  // Show suggestions when input is focused, user has typed, and no exact match is active
  const hasExactMatch = models.some(
    (m) => m.name.toLowerCase() === modelInput.trim().toLowerCase()
  );
  const showSuggestions =
    isInputFocused &&
    modelInput.trim().length > 0 &&
    filteredModels.length > 0 &&
    !hasExactMatch;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setModelInput(val);

    // If cleared, clear the selected model
    if (!val.trim()) {
      handleSelectModel("");
      return;
    }

    // If user typed the exact name of a model from catalog, select it automatically
    const exact = models.find(
      (m) => m.name.toLowerCase() === val.trim().toLowerCase()
    );
    if (exact) {
      handleSelectModel(exact);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredModels.length > 0) {
        handleSelectModel(filteredModels[0]);
      } else if (modelInput.trim()) {
        handleSelectModel(modelInput.trim());
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div>
        <h2
          id="stage-heading"
          tabIndex={-1}
          className="font-heading text-xl sm:text-2xl font-black text-tech-slate tracking-tight outline-hidden"
        >
          1. Which phone needs repair?
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-text-muted font-body">
          Select your brand and device model. Certified technician arrives with genuine parts.
        </p>
      </div>

      {/* Brand Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-tech-slate">
          Select Phone Brand <span className="text-flash-orange">*</span>
        </label>

        {isLoadingCatalog ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-11 rounded-xl bg-zinc-100 animate-pulse border border-zinc-200"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Popular Brand Grid */}
            <div
              role="radiogroup"
              aria-label="Select Phone Brand"
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5"
            >
              {popularBrands.map((brand) => {
                const isSelected =
                  formData.brand.toLowerCase() === brand.name.toLowerCase();

                return (
                  <button
                    type="button"
                    key={brand.slug}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectBrand(brand)}
                    className={`relative p-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden ${
                      isSelected
                        ? "border-flash-orange bg-flash-orange/10 text-flash-orange shadow-xs ring-2 ring-flash-orange/20"
                        : "border-border-default bg-clean-white text-tech-slate hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <span>{brand.name}</span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-flash-orange shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Other Brands Dropdown */}
            {otherBrands.length > 0 && (
              <div className="pt-1">
                <select
                  aria-label="Or choose from other smartphone brands"
                  value={
                    otherBrands.some(
                      (ob) => ob.name.toLowerCase() === formData.brand.toLowerCase()
                    )
                      ? formData.brand
                      : ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    const matched = brands.find((x) => x.name === val);
                    if (matched) {
                      handleSelectBrand(matched);
                    }
                  }}
                  className="w-full h-11 rounded-xl border border-border-default bg-zinc-50/70 px-3.5 text-xs font-medium text-tech-slate cursor-pointer focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden transition-colors"
                >
                  <option value="">Or select other smartphone brand…</option>
                  {otherBrands.map((b) => (
                    <option key={b.slug} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}
      </div>

      {/* Model Selection (Progressive Disclosure once brand is picked) */}
      {selectedBrand && (
        <div className="pt-5 border-t border-border-default/70 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <label
              htmlFor="modelSearchInput"
              className="block text-xs font-bold text-tech-slate"
            >
              Device Model for {selectedBrand.name} <span className="text-flash-orange">*</span>
            </label>
            {formData.model && (
              <span className="text-2xs font-bold text-flash-orange bg-flash-orange/10 px-2 py-0.5 rounded-full">
                Selected: {formData.model}
              </span>
            )}
          </div>

          {isLoadingModels ? (
            <div className="flex items-center justify-center gap-2.5 p-6 rounded-xl bg-zinc-50 border border-border-default text-xs text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-flash-orange" />
              <span>Loading {selectedBrand.name} models…</span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Popular Model Quick Chips */}
              {popularModels.length > 0 && (
                <div>
                  <span className="block text-2xs font-semibold text-text-muted mb-1.5">
                    Popular Models:
                  </span>
                  <div
                    role="radiogroup"
                    aria-label={`Popular ${selectedBrand.name} models`}
                    className="flex flex-wrap gap-1.5"
                  >
                    {popularModels.map((m) => {
                      const isSelected = formData.model === m.name;
                      return (
                        <button
                          type="button"
                          key={m.name}
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleSelectModel(m)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden ${
                            isSelected
                              ? "border-flash-orange bg-flash-orange text-clean-white font-bold shadow-2xs"
                              : "border-border-default bg-clean-white text-tech-slate hover:border-zinc-300 hover:bg-zinc-50"
                          }`}
                        >
                          {m.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Instant Search or Manual Type Input with Combobox ARIA */}
              <div className="relative">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="modelSearchInput"
                  type="text"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={showSuggestions}
                  aria-controls="model-suggestions-listbox"
                  spellCheck={false}
                  autoComplete="off"
                  placeholder={`Search or type your ${selectedBrand.name} model (e.g. 15 Pro, S24 Ultra)...`}
                  value={modelInput}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => {
                    // Small timeout to allow click on suggestion item before closing
                    setTimeout(() => {
                      setIsInputFocused(false);
                      if (modelInput.trim() && !formData.model) {
                        handleSelectModel(modelInput.trim());
                      }
                    }, 200);
                  }}
                  className="w-full h-11 rounded-xl border border-border-default bg-zinc-50/70 pl-10 pr-3.5 text-xs sm:text-sm font-medium text-tech-slate focus:bg-clean-white focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden transition-colors"
                />

                {/* Autocomplete suggestions dropdown when typing */}
                {showSuggestions && (
                  <div
                    id="model-suggestions-listbox"
                    role="listbox"
                    aria-label={`${selectedBrand.name} model suggestions`}
                    className="absolute left-0 right-0 top-full mt-1.5 z-20 rounded-xl border border-border-default bg-clean-white p-1.5 shadow-md max-h-48 overflow-y-auto space-y-0.5"
                  >
                    {filteredModels.slice(0, 6).map((m) => (
                      <button
                        type="button"
                        key={m.name}
                        role="option"
                        aria-selected={formData.model === m.name}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectModel(m);
                          setIsInputFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-tech-slate hover:bg-flash-orange/10 hover:text-flash-orange flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="font-bold">{m.name}</span>
                        <span className="text-2xs text-text-muted">Select</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      <div className="pt-6 border-t border-border-default/70 flex items-center justify-between">
        <div className="text-xs text-text-muted">
          {!canProceed && <span>Select brand and model to continue</span>}
        </div>

        <button
          type="button"
          onClick={goToNextStage}
          disabled={!canProceed}
          className={`h-11 inline-flex items-center justify-center gap-2 rounded-xl px-6 sm:px-8 text-xs sm:text-sm font-bold transition-all ${
            canProceed
              ? "bg-flash-orange text-clean-white hover:bg-flash-orange-hover shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
              : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
          }`}
        >
          <span>Continue to Service</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

