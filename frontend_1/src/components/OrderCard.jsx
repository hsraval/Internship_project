// src/components/OrderCard.jsx
import { downloadBill } from "../api/api";

const STATUS_STYLES = {
  pending:   "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  confirmed: "bg-[#16537e]/10 text-[#16537e] border-[#16537e]/30",
  stitching: "bg-[#80b3ba]/15 text-[#3a7a8e] border-[#80b3ba]/30",
  ready:     "bg-purple-500/15 text-purple-600 border-purple-500/30",
  delivered: "bg-green-500/15 text-green-600 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-600 border-red-500/30",
};

export default function OrderCard({ order, onViewDetail }) {
  if (!order) return null;

  const status     = order.status || "pending";
  const badgeClass = STATUS_STYLES[status] || STATUS_STYLES.pending;

  // Model stores items as array — read first item for display
  const firstItem  = order.items?.[0];
  const itemCount  = order.items?.length ?? 0;

  // Model field is totalAmount, not total
  const total      = order.totalAmount ?? "—";

  // stitching is { type: Boolean, instructions: String }
  const hasStitching = order.stitching?.type === true;

  const handleDownload = async () => {
    try {
      const res = await downloadBill(order._id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement("a");
      a.href     = url;
      a.download = `invoice-${order._id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      if (error.response?.status === 404) {
        alert("Invoice not available for this order. Please contact support if you believe this is an error.");
      } else if (error.response?.status === 400) {
        alert("Invalid order ID. Please try again.");
      } else {
        alert("Could not download invoice. Please check your internet connection and try again.");
      }
    }
  };

  return (
    <div className="group bg-white border border-[#b0d3e6]/50 rounded-2xl p-5 sm:p-6 hover:border-[#80b3ba] hover:shadow-xl hover:shadow-[#16537e]/10 transition-all duration-300 relative overflow-hidden flex flex-col">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#16537e] via-[#80b3ba] to-[#d7e9f2] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex flex-col">
          <span className="text-[10px] font-sans uppercase tracking-widest text-[#80b3ba] font-bold mb-1">
            Order #{order._id.slice(-6).toUpperCase()}
          </span>
          <span className={`w-fit text-[10px] font-sans font-bold px-3 py-1.5 rounded-full border uppercase tracking-widest shadow-sm ${badgeClass}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-[#b0d3e6]/50 to-transparent mb-5" />

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-5">

        {/* Product name comes from items[0].name */}
        <div className="col-span-1 sm:col-span-2 bg-[#f4f9fb] rounded-xl p-3 border border-[#b0d3e6]/30">
          <p className="text-[10px] font-sans uppercase tracking-widest text-[#16537e]/60 font-bold mb-1">Product</p>
          <p className="text-[#1e2a3a] font-bold text-base">
            {firstItem?.name || "—"}
            {itemCount > 1 && (
              <span className="text-[#16537e] text-xs ml-2 bg-[#d7e9f2] px-2 py-0.5 rounded-full">+{itemCount - 1} more</span>
            )}
          </p>
        </div>

        {/* Quantity */}
        <div className="bg-[#f4f9fb] rounded-xl p-3 border border-[#b0d3e6]/30">
          <p className="text-[10px] font-sans uppercase tracking-widest text-[#16537e]/60 font-bold mb-1">Quantity</p>
          <p className="text-[#1e2a3a] font-bold">{firstItem?.quantity ?? "—"} <span className="text-xs text-[#80b3ba] font-normal">meters</span></p>
        </div>

        {/* Total */}
        <div className="bg-[#f4f9fb] rounded-xl p-3 border border-[#b0d3e6]/30">
          <p className="text-[10px] font-sans uppercase tracking-widest text-[#16537e]/60 font-bold mb-1">Total</p>
          <p className="text-[#16537e] font-bold text-lg leading-none">₹{Number(total).toLocaleString()}</p>
        </div>

        {/* Stitching */}
        <div className="col-span-2 flex items-center justify-between bg-[#f4f9fb] rounded-xl p-3 border border-[#b0d3e6]/30">
          <p className="text-[10px] font-sans uppercase tracking-widest text-[#16537e]/60 font-bold">Stitching Required</p>
          <p className={`text-xs font-bold px-2 py-1 rounded-md ${hasStitching ? "bg-[#16537e]/10 text-[#16537e]" : "bg-gray-100 text-gray-500"}`}>
            {hasStitching ? "Yes" : "No"}
          </p>
        </div>

      </div>

      {/* Stitching instructions if present */}
      {hasStitching && order.stitching?.instructions && (
        <div className="mb-5 bg-white border border-[#b0d3e6] rounded-xl p-3 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#80b3ba]" />
          <p className="text-[10px] font-sans uppercase tracking-widest text-[#16537e]/60 font-bold mb-1 pl-2">Instructions</p>
          <p className="text-[#1e2a3a]/80 text-sm font-sans pl-2 italic">
            "{order.stitching.instructions}"
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap mt-auto pt-2">
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(order._id)}
            className="text-xs font-sans font-bold px-5 py-2.5 rounded-xl bg-white text-[#16537e] hover:bg-[#f4f9fb] hover:border-[#16537e] transition-all duration-300 border border-[#b0d3e6] shadow-sm hover:shadow-md w-full sm:w-auto uppercase tracking-wider flex-1 text-center"
          >
            View Details
          </button>
        )}
        {status === "delivered" && (
          <button
            onClick={handleDownload}
            className="text-xs font-sans font-bold px-5 py-2.5 rounded-xl bg-[#16537e] hover:bg-[#124470] text-white transition-all duration-300 border border-[#16537e] shadow-sm hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full sm:w-auto uppercase tracking-wider flex-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Invoice</span>
          </button>
        )}
      </div>
    </div>
  );
}