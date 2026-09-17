import React, { useState } from "react";
import Image from "next/image";
import { Search, Loader2, ArrowRight, Check, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useBookingWizard } from "./BookingWizardContext";

export default function StageDeviceSelect() {
  const t = useTranslations("RepairPage.stage1");
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
          className="font-heading text-lg sm:text-xl font-black text-tech-slate tracking-tight outline-hidden"
        >
          {t("title")}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-text-muted font-body">
          {t("description")}
        </p>
      </div>

      {/* Brand Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-tech-slate">
          {t("brandLabel")} <span className="text-flash-orange">*</span>
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
              aria-label={t("brandLabel")}
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
                    className={`relative p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden ${
                      isSelected
                        ? "border-flash-orange bg-flash-orange/10 text-flash-orange shadow-xs ring-2 ring-flash-orange/20"
                        : "border-border-default bg-clean-white text-tech-slate hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    {brand.logoUrl && (
                      <div className="relative h-4.5 w-4.5 shrink-0 flex items-center justify-center">
                        <Image
                          src={brand.logoUrl}
                          alt={brand.name}
                          width={18}
                          height={18}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
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
                  aria-label={t("otherBrandPlaceholder")}
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
                  <option value="">{t("otherBrandPlaceholder")}</option>
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
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <label
              htmlFor="modelSearchInput"
              className="block text-xs font-bold text-tech-slate"
            >
              {t("modelLabel", { brand: selectedBrand.name })} <span className="text-flash-orange">*</span>
            </label>
            {formData.model && (
              <span className="text-[11px] font-bold text-flash-orange bg-flash-orange/10 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 shrink-0 leading-tight">
                <Check className="h-3 w-3 stroke-[3]" />
                <span className="max-w-[180px] sm:max-w-[260px] truncate">{formData.model}</span>
              </span>
            )}
          </div>

          {isLoadingModels ? (
            <div className="flex items-center justify-center gap-2.5 p-6 rounded-xl bg-zinc-50 border border-border-default text-xs text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-flash-orange" />
              <span>{t("loadingModels", { brand: selectedBrand.name })}</span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Popular Model Visual Cards */}
              {popularModels.length > 0 && (
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                    {t("popularModels")}
                  </span>
                  <div
                    role="radiogroup"
                    aria-label={`Popular ${selectedBrand.name} models`}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5"
                  >
                    {popularModels.map((m) => {
                      const isSelected =
                        formData.model.toLowerCase() === m.name.toLowerCase();

                      return (
                        <button
                          type="button"
                          key={m.name}
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleSelectModel(m)}
                          className={`group relative p-2 sm:p-2.5 rounded-xl border transition-all text-left cursor-pointer flex items-center gap-2 sm:gap-2.5 focus-visible:ring-2 focus-visible:ring-flash-orange focus-visible:outline-hidden ${
                            isSelected
                              ? "border-flash-orange bg-flash-orange/10 text-tech-slate shadow-xs ring-2 ring-flash-orange/20 font-bold"
                              : "border-border-default bg-clean-white text-tech-slate hover:border-zinc-300 hover:bg-zinc-50/80 shadow-2xs"
                          }`}
                        >
                          {/* Device Image Thumbnail */}
                          <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-mist-gray/60 border border-zinc-200/60 shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                            {m.imageUrl ? (
                              <Image
                                src={m.imageUrl}
                                alt={m.name}
                                width={36}
                                height={36}
                                className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <Smartphone className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="block text-xs font-bold text-tech-slate leading-tight truncate">
                              {m.name}
                            </span>
                            {m.releaseYear && (
                              <span className="block text-[10px] text-text-muted mt-0.5 leading-none">
                                {m.releaseYear}
                              </span>
                            )}
                          </div>

                          {isSelected && (
                            <div className="h-4 w-4 rounded-full bg-flash-orange text-clean-white flex items-center justify-center shrink-0">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )}
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
                  placeholder={t("modelSearchPlaceholder", { brand: selectedBrand.name })}
                  value={modelInput}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => {
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
                    {filteredModels.slice(0, 8).map((m) => (
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
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-tech-slate hover:bg-flash-orange/10 hover:text-flash-orange flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative h-7 w-7 rounded-md bg-mist-gray border border-zinc-200/80 shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                            {m.imageUrl ? (
                              <Image
                                src={m.imageUrl}
                                alt={m.name}
                                width={28}
                                height={28}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <Smartphone className="h-3.5 w-3.5 text-zinc-400" />
                            )}
                          </div>
                          <span className="font-bold truncate">{m.name}</span>
                          {m.releaseYear && (
                            <span className="text-[10px] text-text-muted">({m.releaseYear})</span>
                          )}
                        </div>
                        <span className="text-[11px] text-text-muted shrink-0 pl-2">{t("selectOption")}</span>
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
          {!canProceed && <span>{t("selectBrandAndModelPrompt")}</span>}
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
          <span>{t("continueBtn")}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

