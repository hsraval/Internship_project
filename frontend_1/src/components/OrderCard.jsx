// src/components/OrderCard.jsx
import { downloadBill } from "../api/api";

const STATUS_STYLES = {
  pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-400/15 text-blue-400 border-blue-400/30",
  stitching: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  ready:     "bg-purple-500/15 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
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
    } catch {
      alert("Could not download invoice. Try again later.");
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-4 sm:p-5 hover:border-[#C5A059] hover:shadow-[0_4px_24px_rgba(197,165,2,0.1)] transition-all duration-200">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        {/* <div className="flex-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-1">Order ID</p>
          <p className="text-[#333333] font-mono text-xs break-all">#{order._id?.slice(-8)}</p>
        </div> */}
        <span className={`text-[10px] font-mono font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${badgeClass}`}>
          {status}
        </span>
      </div>

      <hr className="border-[#CBD5E1] mb-4" />

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-sm mb-4">

        {/* Product name comes from items[0].name (saved at order creation) */}
        <div className="col-span-1 sm:col-span-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Product</p>
          <p className="text-[#333333] font-medium">
            {firstItem?.name || "—"}
            {itemCount > 1 && (
              <span className="text-[#64748B]/40 text-xs ml-1">+{itemCount - 1} more</span>
            )}
          </p>
        </div>

        {/* Quantity from items[0].quantity */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Quantity</p>
          <p className="text-[#333333] font-medium">{firstItem?.quantity ?? "—"}</p>
        </div>

        {/* totalAmount from model */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Total</p>
          <p className="text-[#C5A059] font-bold text-lg">₹{total}</p>
        </div>

        {/* stitching.type Boolean */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Stitching</p>
          <p className="text-[#333333]">{hasStitching ? "Yes" : "No"}</p>
        </div>

      </div>

      {/* Stitching instructions if present */}
      {hasStitching && order.stitching?.instructions && (
        <p className="text-[#64748B]/70 bg-[#94A3B8] rounded-lg px-3 py-2 text-sm border border-[#CBD5E1]">
          {order.stitching.instructions}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(order._id)}
            className="text-xs font-mono px-4 py-2 rounded-lg bg-[#C5A059]/10 hover:bg-[#0F172A] text-[#FFFFFF] transition-colors border border-[#C5A059]/20 w-full sm:w-auto"
          >
            View Details
          </button>
        )}
        {status === "delivered" && (
          <button
            onClick={handleDownload}
            className="text-xs font-mono px-4 py-2 rounded-lg bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            ↓ Download Invoice
          </button>
        )}
      </div>
    </div>
  );
}