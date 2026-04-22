
// src/components/OrderForm.jsx
import { useState } from "react";
import { createOrder } from "../api/api";

const INPUT =
  "w-full bg-gradient-to-br from-white to-[#FAFAFA] border border-[#CBD5E1]/50 rounded-xl px-4 sm:px-5 py-3 text-[#333333] placeholder-[#94A3B8] focus:outline-none focus:border-[#C5A059] focus:shadow-[0_0_0_3px_rgba(197,165,2,0.1)] transition-all duration-300 text-sm font-medium";
const LABEL =
  "block text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]/80 mb-2 flex items-center gap-2";
const SECTION =
  "border border-[#CBD5E1]/30 bg-gradient-to-br from-white via-[#FAFAFA] to-[#F8F9FA] rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg shadow-[#CBD5E1]/10 backdrop-blur-sm";

export default function OrderForm({ productId, onSuccess }) {
  const [quantity, setQuantity] = useState(1);

  // stitching → { type: Boolean, instructions: String }
  const [stitchingEnabled, setStitchingEnabled] = useState(false);
  const [stitchingInstructions, setStitchingInstructions] = useState("");

  // measurements → model fields exactly
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    shoulder: "",
    sleeveLength: "",
    neck: "",
    length: "",
  });

  // address → { addressLine, city, pincode }
  const [address, setAddress] = useState({
    addressLine: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const setM = (k) => (e) => setMeasurements((p) => ({ ...p, [k]: e.target.value }));
  const setA = (k) => (e) => setAddress((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!productId) {
      setError("No product selected. Please go back and select a product.");
      return;
    }
    if (!address.city || !address.pincode) {
      setError("City and pincode are required.");
      return;
    }
    if (Number(quantity) <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    // Validate measurement values
    for (let key of Object.keys(measurements)) {
      if (measurements[key] !== "" && Number(measurements[key]) <= 0) {
        setError(`${key} must be greater than 0.`);
        return;
      }
    }

    // Build payload exactly matching model schema
    const payload = {
      items: [
        {
          product:  productId,
          quantity: Number(quantity),
        },
      ],

      stitching: {
        type:         stitchingEnabled,
        instructions: stitchingEnabled ? stitchingInstructions : "",
      },

      measurements: {
        chest:       measurements.chest       ? Number(measurements.chest)       : undefined,
        waist:       measurements.waist       ? Number(measurements.waist)       : undefined,
        shoulder:    measurements.shoulder    ? Number(measurements.shoulder)    : undefined,
        sleeveLength:measurements.sleeveLength? Number(measurements.sleeveLength): undefined,
        neck:        measurements.neck        ? Number(measurements.neck)        : undefined,
        length:      measurements.length      ? Number(measurements.length)      : undefined,
      },

      address: {
        addressLine: address.addressLine,
        city:        address.city,
        pincode:     address.pincode,
      },
    };

    setLoading(true);
    try {
      await createOrder(payload);
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {error && (
        <div className="bg-gradient-to-r from-[#EF4444]/10 to-[#DC2626]/5 border border-[#EF4444]/30 text-[#EF4444] text-sm px-5 py-4 rounded-xl font-mono shadow-lg shadow-[#EF4444]/10 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.932-3L13.932 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.932 3z" />
            </svg>
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* ── Order Info ── */}
      <div className={SECTION}>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]">
          Order Info
        </p>
        <div>
          <label className={LABEL}>Quantity (meters)</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className={INPUT}
          />
        </div>
      </div>

      {/* ── Stitching ── */}
      <div className={SECTION}>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]">
          Stitching
        </p>

        {/* Toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setStitchingEnabled((p) => !p)}
            className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center px-1 ${
              stitchingEnabled ? "bg-[#C5A059]" : "bg-[#C5A059]/20"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-[#FFFFFF] shadow transition-transform duration-200 ${
                stitchingEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
          <span className="text-sm text-[#C5A059]">
            {stitchingEnabled ? "Stitching required" : "No stitching"}
          </span>
        </label>

        {/* Instructions — shown only when stitching is ON */}
        {stitchingEnabled && (
          <div>
            <label className={LABEL}>Stitching Instructions</label>
            <textarea
              value={stitchingInstructions}
              onChange={(e) => setStitchingInstructions(e.target.value)}
              rows={3}
              placeholder="Describe any special stitching requirements…"
              className={INPUT}
            />
          </div>
        )}
      </div>

      {/* ── Measurements ── */}
      {stitchingEnabled && (
        <div className={`border border-[#CBD5E1] rounded-xl p-4 sm:p-5 space-y-4 bg-gradient-to-br from-[#FAFAFA] to-[#F8F9FA] transition-all duration-300 ${SECTION}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]">
              Measurements Required
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: "chest", label: "Chest", icon: "" },
              { key: "waist", label: "Waist", icon: "" },
              { key: "shoulder", label: "Shoulder", icon: "" },
              { key: "sleeveLength", label: "Sleeve Length", icon: "" },
              { key: "neck", label: "Neck", icon: "" },
              { key: "length", label: "Length", icon: "" },
            ].map(({ key, label, icon }) => (
              <div key={key} className="group">
                <label className={`${LABEL} flex items-center gap-2`}>
                  <span className="text-lg">{icon}</span>
                  {label}
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={measurements[key]}
                  onChange={setM(key)}
                  placeholder="0.0"
                  className={`${INPUT} border-[#CBD5E1]/50 focus:border-[#C5A059] focus:shadow-[0_0_0_3px_rgba(197,165,2,0.1)] transition-all duration-200`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Delivery Address ── */}
      <div className={SECTION}>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]">
          Delivery Address
        </p>

        <div>
          <label className={LABEL}>Address Line</label>
          <input
            type="text"
            value={address.addressLine}
            onChange={setA("addressLine")}
            placeholder="House no, Street, Area…"
            className={INPUT}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>
              City <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={address.city}
              onChange={setA("city")}
              placeholder="City"
              required
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>
              Pincode <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={address.pincode}
              onChange={setA("pincode")}
              placeholder="6-digit pincode"
              required
              maxLength={6}
              className={INPUT}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C5A059] hover:bg-[#0F172A] disabled:bg-[#94A3B8] disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-sm tracking-wide shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Placing Order…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Place Order
          </>
        )}
      </button>
    </form>
  );
}