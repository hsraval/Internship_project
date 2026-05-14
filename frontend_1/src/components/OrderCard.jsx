// // src/components/OrderCard.jsx
// import { downloadBill } from "../api/api";

// const STATUS_STYLES = {
//   pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
//   confirmed: "bg-blue-400/15 text-blue-400 border-blue-400/30",
//   stitching: "bg-blue-500/15 text-blue-500 border-blue-500/30",
//   ready:     "bg-purple-500/15 text-purple-400 border-purple-500/30",
//   delivered: "bg-green-500/15 text-green-400 border-green-500/30",
//   cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
// };

// export default function OrderCard({ order, onViewDetail }) {
//   if (!order) return null;

//   const status     = order.status || "pending";
//   const badgeClass = STATUS_STYLES[status] || STATUS_STYLES.pending;

//   // Model stores items as array — read first item for display
//   const firstItem  = order.items?.[0];
//   const itemCount  = order.items?.length ?? 0;

//   // Model field is totalAmount, not total
//   const total      = order.totalAmount ?? "—";

//   // stitching is { type: Boolean, instructions: String }
//   const hasStitching = order.stitching?.type === true;

//   const handleDownload = async () => {
//     try {
//       const res = await downloadBill(order._id);
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const a   = document.createElement("a");
//       a.href     = url;
//       a.download = `invoice-${order._id}.pdf`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Download error:', error);
//       if (error.response?.status === 404) {
//         alert("Invoice not available for this order. Please contact support if you believe this is an error.");
//       } else if (error.response?.status === 400) {
//         alert("Invalid order ID. Please try again.");
//       } else {
//         alert("Could not download invoice. Please check your internet connection and try again.");
//       }
//     }
//   };

//   return (
//     <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-4 sm:p-5 hover:border-[#C5A059] hover:shadow-[0_4px_24px_rgba(197,165,2,0.1)] transition-all duration-200">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
//         {/* <div className="flex-1">
//           <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-1">Order ID</p>
//           <p className="text-[#333333] font-mono text-xs break-all">#{order._id?.slice(-8)}</p>
//         </div> */}
//         <span className={`text-[10px] font-mono font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${badgeClass}`}>
//           {status}
//         </span>
//       </div>

//       <hr className="border-[#CBD5E1] mb-4" />

//       {/* Details */}
//       <div className="grid grid-cols-2 gap-3 text-sm mb-4">

//         {/* Product name comes from items[0].name (saved at order creation) */}
//         <div className="col-span-1 sm:col-span-2">
//           <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Product</p>
//           <p className="text-[#333333] font-medium">
//             {firstItem?.name || "—"}
//             {itemCount > 1 && (
//               <span className="text-[#64748B]/40 text-xs ml-1">+{itemCount - 1} more</span>
//             )}
//           </p>
//         </div>

//         {/* Quantity from items[0].quantity */}
//         <div>
//           <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Quantity</p>
//           <p className="text-[#333333] font-medium">{firstItem?.quantity ?? "—"}</p>
//         </div>

//         {/* totalAmount from model */}
//         <div>
//           <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Total</p>
//           <p className="text-[#C5A059] font-bold text-lg">₹{total}</p>
//         </div>

//         {/* stitching.type Boolean */}
//         <div>
//           <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Stitching</p>
//           <p className="text-[#333333]">{hasStitching ? "Yes" : "No"}</p>
//         </div>

//       </div>

//       {/* Stitching instructions if present */}
//       {hasStitching && order.stitching?.instructions && (
//         <p className="text-[#64748B]/70 bg-[#94A3B8] rounded-lg px-3 py-2 text-sm border border-[#CBD5E1]">
//           {order.stitching.instructions}
//         </p>
//       )}

//       {/* Actions */}
//       <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
//         {onViewDetail && (
//           <button
//             onClick={() => onViewDetail(order._id)}
//             className="text-xs font-mono px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#0F172A] text-[#FFFFFF] transition-all duration-300 border border-[#C5A059] hover:border-[#0F172A] shadow-sm hover:shadow-md w-full sm:w-auto uppercase tracking-wider"
//           >
//             View Details
//           </button>
//         )}
//         {status === "delivered" && (
//           <button
//             onClick={handleDownload}
//             className="text-xs font-mono px-4 py-2 rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-[#FFFFFF] transition-all duration-300 border border-[#10B981]/20 shadow-sm hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 w-full sm:w-auto uppercase tracking-wider font-semibold"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             <span>Download Invoice</span>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// src/components/OrderCard.jsx
import { useState } from "react";                                              // [PAYMENT] added
import { downloadBill, createPaymentOrder, verifyPayment } from "../api/api"; // [PAYMENT] added createPaymentOrder, verifyPayment
import { loadRazorpay } from "../utils/loadRazorpay";                         // [PAYMENT] added
import toast from "react-hot-toast";                                           // [PAYMENT] added

const STATUS_STYLES = {
  pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-400/15 text-blue-400 border-blue-400/30",
  stitching: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  ready:     "bg-purple-500/15 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function OrderCard({ order, onViewDetail, onStatusUpdate }) {
  if (!order) return null;

  const status       = order.status || "pending";
  const badgeClass   = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const firstItem    = order.items?.[0];
  const itemCount    = order.items?.length ?? 0;
  const total        = order.totalAmount ?? "—";
  const hasStitching = order.stitching?.type === true;

  // ── [PAYMENT] state ──────────────────────────────────────────
  const [paymentStatus, setPaymentStatus] = useState(
    order?.bill?.paymentStatus || "pending"
  );
  const [payLoading, setPayLoading] = useState(false);

  const isPaid     = paymentStatus === "paid";
  const showPayNow = !isPaid && status !== "cancelled";
  // ─────────────────────────────────────────────────────────────

  // ── Existing download handler — untouched ─────────────────────
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
      console.error("Download error:", error);
      if (error.response?.status === 404) {
        alert("Invoice not available for this order. Please contact support if you believe this is an error.");
      } else if (error.response?.status === 400) {
        alert("Invalid order ID. Please try again.");
      } else {
        alert("Could not download invoice. Please check your internet connection and try again.");
      }
    }
  };

  // ── [PAYMENT] handlePayment ───────────────────────────────────
  const handlePayment = async () => {
    if (!order?.bill?._id) {
      toast.error("Bill not found for this order.");
      return;
    }

    setPayLoading(true);

    try {
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        toast.error("Payment gateway failed to load. Please try again.");
        setPayLoading(false);
        return;
      }

      const { data: response } = await createPaymentOrder(order.bill._id);
      if (!response?.success) {
        toast.error("Could not initiate payment. Please try again.");
        setPayLoading(false);
        return;
      }

      const { id: razorpayOrderId, amount, currency } = response.data;

      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name:        "Tailor Shop",
        description: `Payment for Order #${order._id?.slice(-6).toUpperCase()}`,
        order_id:    razorpayOrderId,

        handler: async (paymentResponse) => {
          try {
            await verifyPayment({
              razorpay_order_id:   paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature:  paymentResponse.razorpay_signature,
              billId:              order.bill._id,
            });
            setPaymentStatus("paid");
            toast.success("Payment successful!");
            if (typeof onStatusUpdate === "function") onStatusUpdate(order._id);
          } catch (err) {
            console.error("Verification failed:", err);
            toast.error("Payment verification failed. Contact support.");
          }
        },

        theme: { color: "#C5A059" },

        modal: {
          ondismiss: () => {
            setPayLoading(false);
            toast.error("Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (res) => {
        toast.error(`Payment failed: ${res.error.description}`);
        setPayLoading(false);
      });
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong. Please try again.");
      setPayLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-4 sm:p-5 hover:border-[#C5A059] hover:shadow-[0_4px_24px_rgba(197,165,2,0.1)] transition-all duration-200">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        {/* Existing order status badge — untouched */}
        <span className={`text-[10px] font-mono font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${badgeClass}`}>
          {status}
        </span>

        {/* [PAYMENT] Payment status badge */}
        <span
          className={`self-start inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-3 py-1 rounded-full border uppercase tracking-wide
            ${isPaid
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : "bg-red-500/15 text-red-400 border-red-500/30"
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-400" : "bg-red-400"}`} />
          {isPaid ? "Paid" : "Unpaid"}
        </span>
      </div>

      <hr className="border-[#CBD5E1] mb-4" />

      {/* Details — unchanged */}
      <div className="grid grid-cols-2 gap-3 text-sm mb-4">

        <div className="col-span-1 sm:col-span-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Product</p>
          <p className="text-[#333333] font-medium">
            {firstItem?.name || "—"}
            {itemCount > 1 && (
              <span className="text-[#64748B]/40 text-xs ml-1">+{itemCount - 1} more</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Quantity</p>
          <p className="text-[#333333] font-medium">{firstItem?.quantity ?? "—"}</p>
        </div>

        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Total</p>
          <p className="text-[#C5A059] font-bold text-lg">₹{total}</p>
        </div>

        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Stitching</p>
          <p className="text-[#333333]">{hasStitching ? "Yes" : "No"}</p>
        </div>

      </div>

      {/* Stitching instructions — unchanged */}
      {hasStitching && order.stitching?.instructions && (
        <p className="text-[#64748B]/70 bg-[#94A3B8] rounded-lg px-3 py-2 text-sm border border-[#CBD5E1] mb-4">
          {order.stitching.instructions}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 flex-wrap">

        {/* View Details — unchanged */}
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(order._id)}
            className="text-xs font-mono px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#0F172A] text-[#FFFFFF] transition-all duration-300 border border-[#C5A059] hover:border-[#0F172A] shadow-sm hover:shadow-md w-full sm:w-auto uppercase tracking-wider"
          >
            View Details
          </button>
        )}

        {/* Download Invoice — unchanged */}
        {status === "delivered" && (
          <button
            onClick={handleDownload}
            className="text-xs font-mono px-4 py-2 rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-[#FFFFFF] transition-all duration-300 border border-[#10B981]/20 shadow-sm hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 w-full sm:w-auto uppercase tracking-wider font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Invoice</span>
          </button>
        )}

        {/* [PAYMENT] Pay Now button — shown only when unpaid & not cancelled */}
        {showPayNow && (
          <button
            onClick={handlePayment}
            disabled={payLoading}
            className="text-xs font-mono px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-[#C5A059] text-[#C5A059] hover:text-[#FFFFFF] transition-all duration-300 border border-[#C5A059]/40 hover:border-[#C5A059] shadow-sm hover:shadow-md flex items-center justify-center gap-2 w-full sm:w-auto uppercase tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {payLoading ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" />
                  <path strokeLinecap="round" d="M2 10h20" />
                </svg>
                <span>Pay Now</span>
              </>
            )}
          </button>
        )}

      </div>
    </div>
  );
}