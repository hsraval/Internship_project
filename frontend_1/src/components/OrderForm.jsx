// src/components/OrderForm.jsx
import { useState } from "react";
import { createOrder } from "../api/api";

const INPUT =
  "w-full bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg px-3 sm:px-4 py-2.5 text-[#333333] placeholder-[#94A3B8] focus:outline-none focus:border-[#C5A059] transition-colors text-sm";
const LABEL =
  "block text-[10px] font-mono font-semibold uppercase tracking-widest text-[#64748B]/70 mb-1.5";
const SECTION =
  "border border-[#CBD5E1] rounded-xl p-4 sm:p-5 space-y-4";

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
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm px-4 py-3 rounded-lg font-mono">
          {error}
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
      <div className={SECTION}>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]">
          Measurements{" "}
          <span className="text-[#6B5F50]/40 normal-case font-sans">(in inches, optional)</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: "chest",        label: "Chest" },
            { key: "waist",        label: "Waist" },
            { key: "shoulder",     label: "Shoulder" },
            { key: "sleeveLength", label: "Sleeve Length" },
            { key: "neck",         label: "Neck" },
            { key: "length",       label: "Length" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={LABEL}>{label}</label>
              <input
                type="number"
                min={0}
                step="0.1"
                value={measurements[key]}
                onChange={setM(key)}
                placeholder="0.0"
                className={INPUT}
              />
            </div>
          ))}
        </div>
      </div>

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
        className="w-full bg-[#C5A059] hover:bg-[#0F172A] disabled:opacity-50 text-[#FFFFFF] font-mono font-bold py-3 rounded-lg transition-colors text-xs tracking-widest uppercase"
      >
        {loading ? "Placing Order…" : "Place Order"}
      </button>
    </form>
  );
}