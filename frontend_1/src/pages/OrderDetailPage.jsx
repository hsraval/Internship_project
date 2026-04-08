// // src/pages/OrderDetailPage.jsx
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getOrderById, getBillById, updateOrderStatus, cancelOrder } from "../api/api";
// import BillCard from "../components/BillCard";

// const STATUS_STYLES = {
//   pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
//   stitching: "bg-blue-500/15 text-blue-400 border-blue-500/30",
//   ready:     "bg-purple-500/15 text-purple-400 border-purple-500/30",
//   delivered: "bg-green-500/15 text-green-400 border-green-500/30",
// };

// const ORDER_STATUSES = ["pending", "stitching", "ready", "delivered"];

// // Detect admin from route: /admin/orders/:id
// function useIsAdmin() {
//   return window.location.pathname.startsWith("/admin");
// }

// export default function OrderDetailPage() {
//   const { id }    = useParams();
//   const navigate  = useNavigate();
//   const isAdmin   = useIsAdmin();

//   const [order,    setOrder]    = useState(null);
//   const [bill,     setBill]     = useState(null);
//   const [loading,  setLoading]  = useState(true);
//   const [error,    setError]    = useState("");
//   const [updating, setUpdating] = useState(false);
//   const [newStatus,setNewStatus]= useState("");

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     getOrderById(id)
//       .then(async (r) => {
//         const ord = r.data?.order || r.data;
//         setOrder(ord);
//         setNewStatus(ord?.status || "pending");
//         // Fetch bill for admin always; for user only if delivered
//         if (isAdmin || ord?.status === "delivered") {
//           try {
//             const billRes = await getBillById(id);
//             setBill(billRes.data?.bill || billRes.data);
//           } catch {
//             // Bill may not exist yet — silently ignore
//           }
//         }
//       })
//       .catch(() => setError("Failed to load order details."))
//       .finally(() => setLoading(false));
//   }, [id, isAdmin]);

//   const handleStatusUpdate = async () => {
//     if (!newStatus || newStatus === order?.status) return;
//     setUpdating(true);
//     try {
//       const r = await updateOrderStatus(id, newStatus);
//       setOrder(r.data?.order || r.data);
//       // Re-fetch bill if just delivered
//       if (newStatus === "delivered") {
//         try {
//           const billRes = await getBillById(id);
//           setBill(billRes.data?.bill || billRes.data);
//         } catch { /* ignore */ }
//       }
//     } catch {
//       alert("Failed to update status.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleCancel = async () => {
//     if (!window.confirm("Cancel this order?")) return;
//     try {
//       await cancelOrder(id);
//       navigate(isAdmin ? "/admin/orders" : "/orders");
//     } catch {
//       alert("Failed to cancel order.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//         <div className="text-zinc-500 text-sm animate-pulse">Loading order…</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//         <div className="text-red-400 text-sm">{error}</div>
//       </div>
//     );
//   }

//   const status     = order?.status || "pending";
//   const badgeClass = STATUS_STYLES[status] || STATUS_STYLES.pending;

//   return (
//     <div className="min-h-screen bg-zinc-950 px-4 py-10">
//       <div className="max-w-2xl mx-auto space-y-6">

//         {/* Back */}
//         <button
//           onClick={() => navigate(isAdmin ? "/admin/orders" : "/orders")}
//           className="text-zinc-500 hover:text-zinc-300 text-sm flex items-center gap-1.5 transition-colors"
//         >
//           ← Back to Orders
//         </button>

//         {/* Order Header */}
//         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
//           <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
//             <div>
//               <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Order Details</p>
//               <p className="font-mono text-zinc-300 text-sm">{order?._id}</p>
//             </div>
//             <span className={`text-xs font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${badgeClass}`}>
//               {status}
//             </span>
//           </div>

//           <div className="p-6 grid grid-cols-2 gap-5 text-sm">
//             <div>
//               <p className="text-zinc-500 text-xs mb-1 uppercase tracking-widest">Product</p>
//               <p className="text-zinc-200 font-medium">{order?.product?.name || "—"}</p>
//             </div>
//             <div>
//               <p className="text-zinc-500 text-xs mb-1 uppercase tracking-widest">Quantity</p>
//               <p className="text-zinc-200 font-medium">{order?.quantity}</p>
//             </div>
//             <div>
//               <p className="text-zinc-500 text-xs mb-1 uppercase tracking-widest">Stitching</p>
//               <p className="text-zinc-200 capitalize">{order?.stitching || "—"}</p>
//             </div>
//             <div>
//               <p className="text-zinc-500 text-xs mb-1 uppercase tracking-widest">Total</p>
//               <p className="text-amber-400 font-bold text-lg">₹{order?.total ?? "—"}</p>
//             </div>
//             {order?.measurements && (
//               <div className="col-span-2">
//                 <p className="text-zinc-500 text-xs mb-1 uppercase tracking-widest">Measurements</p>
//                 <p className="text-zinc-300 bg-zinc-800 rounded-lg px-3 py-2">{order.measurements}</p>
//               </div>
//             )}
//             {order?.address && (
//               <div className="col-span-2">
//                 <p className="text-zinc-500 text-xs mb-1 uppercase tracking-widest">Delivery Address</p>
//                 <p className="text-zinc-300 bg-zinc-800 rounded-lg px-3 py-2">{order.address}</p>
//               </div>
//             )}
//             {isAdmin && order?.user && (
//               <div className="col-span-2">
//                 <p className="text-zinc-500 text-xs mb-1 uppercase tracking-widest">Customer</p>
//                 <p className="text-zinc-200">{order.user?.name} <span className="text-zinc-500">({order.user?.email})</span></p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Admin: Status Update */}
//         {isAdmin && (
//           <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
//             <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Update Status</p>
//             <div className="flex gap-3 items-center flex-wrap">
//               <select
//                 value={newStatus}
//                 onChange={(e) => setNewStatus(e.target.value)}
//                 className="bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
//               >
//                 {ORDER_STATUSES.map((s) => (
//                   <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
//                 ))}
//               </select>
//               <button
//                 onClick={handleStatusUpdate}
//                 disabled={updating || newStatus === order?.status}
//                 className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-900 text-xs font-bold px-5 py-2 rounded-lg transition-colors uppercase tracking-wide"
//               >
//                 {updating ? "Saving…" : "Update"}
//               </button>
//               <button
//                 onClick={handleCancel}
//                 className="text-xs px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
//               >
//                 Cancel Order
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Bill (admin always if exists; user if delivered) */}
//         {bill && (
//           <div>
//             <p className="text-xs uppercase tracking-widest text-amber-500 mb-3 px-1">Invoice / Bill</p>
//             <BillCard bill={bill} />
//           </div>
//         )}

//         {/* No bill yet */}
//         {!bill && status !== "delivered" && isAdmin && (
//           <p className="text-zinc-600 text-sm text-center py-4">
//             Bill will be generated when order is marked as delivered.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }


// ==============================

// src/pages/OrderDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, getBillById, updateOrderStatus, cancelOrder } from "../api/api";
import BillCard from "../components/BillCard";

const STATUS_STYLES = {
  pending:   "bg-yellow-500/15 text-yellow-700 border-yellow-400/30",
  confirmed: "bg-blue-400/15 text-blue-600 border-blue-400/30",
  stitching: "bg-blue-500/15 text-blue-700 border-blue-500/30",
  ready:     "bg-purple-500/15 text-purple-700 border-purple-500/30",
  delivered: "bg-green-500/15 text-green-700 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-600 border-red-400/30",
};

// All enum values from order.model
const ORDER_STATUSES = ["pending", "confirmed", "stitching", "ready", "delivered", "cancelled"];

function useIsAdmin() {
  return window.location.pathname.startsWith("/admin");
}

// Render address object { addressLine, city, pincode }
function formatAddress(address) {
  if (!address) return "—";
  if (typeof address === "string") return address;
  return [address.addressLine, address.city, address.pincode]
    .filter(Boolean)
    .join(", ");
}

// Render measurements object
function formatMeasurements(m) {
  if (!m) return null;
  const fields = [
    { key: "chest",        label: "Chest" },
    { key: "waist",        label: "Waist" },
    { key: "shoulder",     label: "Shoulder" },
    { key: "sleeveLength", label: "Sleeve" },
    { key: "neck",         label: "Neck" },
    { key: "length",       label: "Length" },
  ];
  const filled = fields.filter((f) => m[f.key] != null && m[f.key] !== "");
  if (!filled.length) return null;
  return filled;
}

const FIELD_LABEL = "text-[10px] font-mono uppercase tracking-widest text-[#6B5F50]/50 mb-1";
const FIELD_VALUE = "text-[#6B5F50] font-medium text-sm";

export default function OrderDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isAdmin  = useIsAdmin();

  const [order,     setOrder]     = useState(null);
  const [bill,      setBill]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [updating,  setUpdating]  = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const fetchBill = async (orderId) => {
    try {
      const res = await getBillById(orderId);
      setBill(res.data?.bill || res.data);
    } catch {
      // Bill doesn't exist yet — ignore silently
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrderById(id)
      .then(async (r) => {
        // Backend returns { success, data: order }
        const ord = r.data?.data || r.data;
        setOrder(ord);
        setNewStatus(ord?.status || "pending");
        if (isAdmin || ord?.status === "delivered") {
          await fetchBill(id);
        }
      })
      .catch(() => setError("Failed to load order details."))
      .finally(() => setLoading(false));
  }, [id, isAdmin]);

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order?.status) return;
    setUpdating(true);
    setStatusMsg("");
    try {
      const r = await updateOrderStatus(id, newStatus);
      // Backend returns { success, message, data: updatedOrder }
      const updated = r.data?.data || r.data;
      setOrder(updated);
      setStatusMsg("Status updated successfully.");
      if (newStatus === "delivered") {
        await fetchBill(id);
      }
    } catch {
      setStatusMsg("Failed to update status. Try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await cancelOrder(id);
      navigate(isAdmin ? "/admin/orders" : "/orders");
    } catch {
      alert("Failed to cancel order.");
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <p className="text-[#6B5F50]/50 text-sm font-mono animate-pulse">Loading order…</p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-sm font-mono">{error}</p>
        <button
          onClick={() => navigate(isAdmin ? "/admin/orders" : "/orders")}
          className="text-[#6B5F50] underline text-sm"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  const status     = order?.status || "pending";
  const badgeClass = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const firstItem  = order?.items?.[0];
  const itemCount  = order?.items?.length ?? 0;
  const measurements = formatMeasurements(order?.measurements);

  return (
    <div className="min-h-screen bg-[#F5F0E8] px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Navigation ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[#6B5F50]/50 hover:text-[#6B5F50] text-xs font-mono flex items-center gap-1 transition-colors"
          >
            ← Dashboard
          </button>
          <span className="text-[#6B5F50]/30 text-xs">/</span>
          <button
            onClick={() => navigate(isAdmin ? "/admin/orders" : "/orders")}
            className="text-[#6B5F50]/50 hover:text-[#6B5F50] text-xs font-mono flex items-center gap-1 transition-colors"
          >
            {isAdmin ? "All Orders" : "My Orders"}
          </button>
          <span className="text-[#6B5F50]/30 text-xs">/</span>
          <span className="text-[#6B5F50] text-xs font-mono">#{id?.slice(-8)}</span>
        </div>

        {/* ── Order Header Card ── */}
        <div className="bg-[#E8E0D0] border border-[#6B5F50]/30 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#6B5F50]/20 flex items-center justify-between">
            <div>
              <p className={FIELD_LABEL}>Order ID</p>
              <p className="font-mono text-[#6B5F50] text-sm">{order?._id}</p>
            </div>
            <span className={`text-[10px] font-mono font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${badgeClass}`}>
              {status}
            </span>
          </div>

          <div className="p-6 grid grid-cols-2 gap-5">

            {/* Product — from items[0].name */}
            <div>
              <p className={FIELD_LABEL}>Product</p>
              <p className={FIELD_VALUE}>
                {firstItem?.name || "—"}
                {itemCount > 1 && (
                  <span className="text-[#6B5F50]/40 text-xs ml-1">+{itemCount - 1} more</span>
                )}
              </p>
            </div>

            {/* Quantity — from items[0].quantity */}
            <div>
              <p className={FIELD_LABEL}>Quantity</p>
              <p className={FIELD_VALUE}>{firstItem?.quantity ?? "—"}</p>
            </div>

            {/* Price per unit — from items[0].price */}
            <div>
              <p className={FIELD_LABEL}>Unit Price</p>
              <p className={FIELD_VALUE}>₹{firstItem?.price ?? "—"} / meter</p>
            </div>

            {/* Total — from totalAmount */}
            <div>
              <p className={FIELD_LABEL}>Total Amount</p>
              <p className="text-[#6B5F50] font-bold text-lg">₹{order?.totalAmount ?? "—"}</p>
            </div>

            {/* Stitching — { type: Boolean, instructions: String } */}
            <div>
              <p className={FIELD_LABEL}>Stitching</p>
              <p className={FIELD_VALUE}>{order?.stitching?.type ? "Yes" : "No"}</p>
            </div>

            {/* Date */}
            <div>
              <p className={FIELD_LABEL}>Ordered On</p>
              <p className={FIELD_VALUE}>
                {order?.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })
                  : "—"}
              </p>
            </div>

            {/* Stitching instructions if present */}
            {order?.stitching?.type && order?.stitching?.instructions && (
              <div className="col-span-2">
                <p className={FIELD_LABEL}>Stitching Instructions</p>
                <p className="text-[#6B5F50]/70 bg-[#6B5F50]/5 rounded-lg px-3 py-2 text-sm border border-[#6B5F50]/10">
                  {order.stitching.instructions}
                </p>
              </div>
            )}

            {/* Measurements */}
            {measurements && (
              <div className="col-span-2">
                <p className={FIELD_LABEL}>Measurements (inches)</p>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {measurements.map(({ key, label }) => (
                    <div key={key} className="bg-[#6B5F50]/5 border border-[#6B5F50]/10 rounded-lg px-3 py-2 text-center">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-[#6B5F50]/50">{label}</p>
                      <p className="text-[#6B5F50] font-semibold text-sm">{order.measurements[key]}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address — { addressLine, city, pincode } */}
            {order?.address && (
              <div className="col-span-2">
                <p className={FIELD_LABEL}>Delivery Address</p>
                <p className="text-[#6B5F50]/70 bg-[#6B5F50]/5 rounded-lg px-3 py-2 text-sm border border-[#6B5F50]/10">
                  {formatAddress(order.address)}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* ── Admin: Status Update ── */}
        {isAdmin && (
          <div className="bg-[#E8E0D0] border border-[#6B5F50]/30 rounded-2xl p-6">
            <p className={`${FIELD_LABEL} mb-3`}>Update Order Status</p>
            <div className="flex gap-3 items-center flex-wrap">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="bg-[#F5F0E8] border border-[#6B5F50]/30 text-[#6B5F50] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B5F50] transition-colors font-mono"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>

              <button
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === order?.status}
                className="bg-[#6B5F50] hover:bg-[#45362C] disabled:opacity-40 text-[#E8E0D0] text-xs font-mono font-bold px-5 py-2 rounded-lg transition-colors uppercase tracking-widest"
              >
                {updating ? "Saving…" : "Update Status"}
              </button>

              {order?.status !== "cancelled" && (
                <button
                  onClick={handleCancel}
                  className="text-xs font-mono px-4 py-2 rounded-lg border border-red-400/30 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Status feedback */}
            {statusMsg && (
              <p className={`text-xs font-mono mt-3 ${statusMsg.includes("Failed") ? "text-red-500" : "text-green-600"}`}>
                {statusMsg}
              </p>
            )}

            {/* Hint about bill */}
            {!bill && status !== "delivered" && (
              <p className="text-[#6B5F50]/40 text-xs font-mono mt-3">
                Bill is auto-generated when status is set to "Delivered".
              </p>
            )}
          </div>
        )}

        {/* ── Bill / Invoice ── */}
        {bill && (
          <div>
            <p className={`${FIELD_LABEL} mb-3 px-1`}>Invoice / Bill</p>
            <BillCard bill={bill} />
          </div>
        )}

      </div>
    </div>
  );
}