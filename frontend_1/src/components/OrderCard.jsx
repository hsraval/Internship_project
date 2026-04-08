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
    <div className="bg-[#E8E0D0] border border-[#6B5F50]/30 rounded-xl p-5 hover:border-[#6B5F50]/60 hover:shadow-[0_4px_24px_rgba(107,95,80,0.1)] transition-all duration-200">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#6B5F50]/50 mb-1">Order ID</p>
          <p className="text-[#6B5F50] font-mono text-xs">{order._id}</p>
        </div>
        <span className={`text-[10px] font-mono font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${badgeClass}`}>
          {status}
        </span>
      </div>

      <hr className="border-[#6B5F50]/20 mb-4" />

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-sm mb-4">

        {/* Product name comes from items[0].name (saved at order creation) */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#6B5F50]/50 mb-0.5">Product</p>
          <p className="text-[#6B5F50] font-medium">
            {firstItem?.name || "—"}
            {itemCount > 1 && (
              <span className="text-[#6B5F50]/50 text-xs ml-1">+{itemCount - 1} more</span>
            )}
          </p>
        </div>

        {/* Quantity from items[0].quantity */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#6B5F50]/50 mb-0.5">Quantity</p>
          <p className="text-[#6B5F50] font-medium">{firstItem?.quantity ?? "—"}</p>
        </div>

        {/* totalAmount from model */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#6B5F50]/50 mb-0.5">Total</p>
          <p className="text-[#6B5F50] font-bold">₹{total}</p>
        </div>

        {/* stitching.type Boolean */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#6B5F50]/50 mb-0.5">Stitching</p>
          <p className="text-[#6B5F50]">{hasStitching ? "Yes" : "No"}</p>
        </div>

      </div>

      {/* Stitching instructions if present */}
      {hasStitching && order.stitching?.instructions && (
        <p className="text-xs text-[#6B5F50]/60 bg-[#6B5F50]/5 rounded-lg px-3 py-2 mb-4 border border-[#6B5F50]/10">
          {order.stitching.instructions}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(order._id)}
            className="text-xs font-mono px-4 py-2 rounded-lg bg-[#6B5F50]/10 hover:bg-[#6B5F50]/20 text-[#6B5F50] transition-colors border border-[#6B5F50]/20"
          >
            View Details
          </button>
        )}
        {status === "delivered" && (
          <button
            onClick={handleDownload}
            className="text-xs font-mono px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-700 transition-colors flex items-center gap-1.5"
          >
            ↓ Download Invoice
          </button>
        )}
      </div>
    </div>
  );
}