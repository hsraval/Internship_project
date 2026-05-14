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
    <div className="bg-white border border-[#b0d3e6] rounded-xl p-4 sm:p-5 hover:border-[#80b3ba] hover:shadow-[0_4px_24px_rgba(22,83,126,0.10)] transition-all duration-200">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <span className={`text-[10px] font-mono font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${badgeClass}`}>
          {status}
        </span>
      </div>

      <hr className="border-[#b0d3e6] mb-4" />

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-sm mb-4">

        {/* Product name comes from items[0].name (saved at order creation) */}
        <div className="col-span-1 sm:col-span-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#16537e]/50 mb-0.5">Product</p>
          <p className="text-[#1e2a3a] font-medium">
            {firstItem?.name || "—"}
            {itemCount > 1 && (
              <span className="text-[#80b3ba] text-xs ml-1">+{itemCount - 1} more</span>
            )}
          </p>
        </div>

        {/* Quantity from items[0].quantity */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#16537e]/50 mb-0.5">Quantity</p>
          <p className="text-[#1e2a3a] font-medium">{firstItem?.quantity ?? "—"}</p>
        </div>

        {/* totalAmount from model */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#16537e]/50 mb-0.5">Total</p>
          <p className="text-[#16537e] font-bold text-lg">₹{total}</p>
        </div>

        {/* stitching.type Boolean */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#16537e]/50 mb-0.5">Stitching</p>
          <p className="text-[#1e2a3a]">{hasStitching ? "Yes" : "No"}</p>
        </div>

      </div>

      {/* Stitching instructions if present */}
      {hasStitching && order.stitching?.instructions && (
        <p className="text-[#1e2a3a]/70 bg-[#d7e9f2] rounded-lg px-3 py-2 text-sm border border-[#b0d3e6]">
          {order.stitching.instructions}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 flex-wrap mt-4">
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(order._id)}
            className="text-xs font-mono px-4 py-2 rounded-lg bg-[#16537e] hover:bg-[#124470] text-white transition-all duration-300 border border-[#16537e] shadow-sm hover:shadow-md w-full sm:w-auto uppercase tracking-wider"
          >
            View Details
          </button>
        )}
        {status === "delivered" && (
          <button
            onClick={handleDownload}
            className="text-xs font-mono px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-300 border border-green-600/20 shadow-sm hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 w-full sm:w-auto uppercase tracking-wider font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Invoice</span>
          </button>
        )}
      </div>
    </div>
  );
}