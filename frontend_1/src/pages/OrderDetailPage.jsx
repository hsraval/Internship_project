// src/pages/OrderDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, getBillById, updateOrderStatus, cancelOrder } from "../api/api";
import BillCard from "../components/BillCard";
import LayoutWrapper from "../components/LayoutWrapper";

const STATUS_STYLES = {
  pending:   "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
  confirmed: "bg-blue-400/15 text-blue-400 border-blue-400/30",
  stitching: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  ready:     "bg-purple-500/15 text-purple-400 border-purple-500/30",
  delivered: "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30",
  cancelled: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
};

const ORDER_STATUSES = ["pending", "confirmed", "stitching", "ready", "delivered", "cancelled"];

// Detect admin from route: /admin/orders/:id
function useIsAdmin() {
  return window.location.pathname.startsWith("/admin");
}

// Helper functions
const formatAddress = (addr) => {
  if (!addr) return "";
  const parts = [addr.addressLine, addr.city, addr.pincode].filter(Boolean);
  return parts.join(", ");
};

const formatMeasurements = (m) => {
  if (!m) return null;
  const fields = [
    { key: "chest", label: "Chest" },
    { key: "waist", label: "Waist" },
    { key: "shoulder", label: "Shoulder" },
    { key: "sleeveLength", label: "Sleeve" },
    { key: "neck", label: "Neck" },
    { key: "length", label: "Length" },
  ];
  const filled = fields.filter((f) => m[f.key] != null && m[f.key] !== "");
  if (!filled.length) return null;
  return filled;
};

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
      setBill(res.data?.data || res.data);
    } catch {
      // Bill doesn't exist yet â ignore silently
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

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-[#64748B]/50 text-sm font-mono animate-pulse">Loading orderâ¦</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-4">
        <p className="text-[#EF4444] text-sm font-mono">{error}</p>
        <button
          onClick={() => navigate(isAdmin ? "/admin/orders" : "/orders")}
          className="text-[#64748B] underline text-sm"
        >
          â Back to Orders
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
    <LayoutWrapper>
      <div className="px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-5">

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="group relative overflow-hidden bg-gradient-to-r from-[#C5A059] to-[#0F172A] text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transform hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 ease-out w-full sm:w-auto justify-start sm:justify-center"
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7 7" />
            </svg>
            <span className="hidden sm:inline">Back to Dashboard</span>
            {/* <span className="sm:hidden">Dashboard</span> */}
          </button>
          
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <button
              onClick={() => navigate(isAdmin ? "/admin/orders" : "/orders")}
              className="text-[#6B5F50]/50 hover:text-[#6B5F50] font-mono flex items-center gap-1 transition-colors"
            >
              {isAdmin ? "All Orders" : "My Orders"}
            </button>
            <span className="text-[#6B5F50]/30">/</span>
            {/* <span className="text-[#6B5F50] font-mono">#{id?.slice(-8)}</span> */}
          </div>
        </div>

        {/* Order Header Card */}
        <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#CBD5E1] flex items-center justify-between">
            {/* <div>
              <p className={FIELD_LABEL}>Order ID</p>
              <p className="font-mono text-[#333333] text-sm">{order?._id}</p>
            </div> */}
            <span className={`text-[10px] font-mono font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${badgeClass}`}>
              {status}
            </span>
          </div>

          <div className="p-6 grid grid-cols-2 gap-5">

            {/* Product â from items[0].name */}
            <div>
              <p className={FIELD_LABEL}>Product</p>
              <p className={FIELD_VALUE}>{firstItem?.name || "â"}
                {itemCount > 1 && (
                  <span className="text-[#0F172A]/40 text-xs ml-1">+{itemCount - 1} more</span>
                )}
              </p>
            </div>

            {/* Quantity â from items[0].quantity */}
            <div>
              <p className={FIELD_LABEL}>Quantity</p>
              <p className={FIELD_VALUE}>{firstItem?.quantity ?? "â"}</p>
            </div>

            {/* Price per unit â from items[0].price */}
            <div>
              <p className={FIELD_LABEL}>Unit Price</p>
              <p className={FIELD_VALUE}>₹{firstItem?.price ?? "â"}</p>
            </div>

            {/* Total â from totalAmount */}
            <div>
              <p className={FIELD_LABEL}>Total Amount</p>
              <p className="text-[#C5A059] font-bold text-lg">₹{order?.totalAmount ?? "â"}</p>
            </div>

            {/* Stitching â { type: Boolean, instructions: String } */}
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
                  : "â"}
              </p>
            </div>

            {/* Stitching instructions if present */}
            {order?.stitching?.type && order?.stitching?.instructions && (
              <div className="col-span-2">
                <p className={FIELD_LABEL}>Stitching Instructions</p>
                <p className="text-[#64748B]/70 bg-[#94A3B8] rounded-lg px-3 py-2 text-sm border border-[#CBD5E1]">
                  {order.stitching.instructions}
                </p>
              </div>
            )}

            {/* Measurements */}
            {measurements && (
              <div className="col-span-2">
                <p className={FIELD_LABEL}>Measurements (inches)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-1">
                  {measurements.map(({ key, label }) => (
                    <div key={key} className="bg-[#6B5F50]/5 border border-[#6B5F50]/10 rounded-lg px-3 py-2 text-center">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-[#6B5F50]/50">{label}</p>
                      <p className="text-[#6B5F50] font-semibold text-sm">{order.measurements[key]}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address â { addressLine, city, pincode } */}
            {order?.address && (
              <div className="col-span-2">
                <p className={FIELD_LABEL}>Delivery Address</p>
                <p className="text-[#64748B]/70 bg-[#94A3B8] rounded-lg px-3 py-2 text-sm border border-[#CBD5E1]">
                  {formatAddress(order.address)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Admin: Status Update */}
        {isAdmin && (
          <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-4 sm:p-6">
            <p className={`${FIELD_LABEL} mb-3`}>Update Order Status</p>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full sm:w-auto bg-[#F8F9FA] border border-[#CBD5E1] text-[#333333] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A059] transition-colors font-mono"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || newStatus === order?.status}
                  className="flex-1 sm:w-auto bg-[#C5A059] hover:bg-[#0F172A] disabled:opacity-40 text-[#FFFFFF] text-xs font-mono font-bold px-3 sm:px-5 py-2 rounded-lg transition-colors uppercase tracking-widest"
                >
                  {updating ? "Saving" : "Update Status"}
                </button>
                {order?.status !== "cancelled" && (
                  <button
                    onClick={handleCancel}
                    className="text-xs font-mono px-3 sm:px-4 py-2 rounded-lg border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors w-full sm:w-auto"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {/* Status feedback */}
            {statusMsg && (
              <p className={`text-xs font-mono mt-3 ${statusMsg.includes("Failed") ? "text-red-500" : "text-green-600"}`}>
                {statusMsg}
              </p>
            )}
          </div>
        )}

        {/* Hint about bill */}
        {!bill && status !== "delivered" && (
          <p className="text-[#64748B]/40 text-xs font-mono mt-3">
            Bill is auto-generated when status is set to "Delivered".
          </p>
        )}

        {/* Bill / Invoice */}
        {bill && (
          <div>
            <p className={`${FIELD_LABEL} mb-3 px-1`}>Invoice / Bill</p>
            <BillCard bill={bill} />
          </div>
        )}

      </div>
    </div>
    </LayoutWrapper>
  );
}
