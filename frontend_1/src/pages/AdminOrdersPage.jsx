// src/pages/AdminOrdersPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../api/api";
import OrderTable from "../components/OrderTable";

const STATUS_STYLES = {
  pending:   "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
  confirmed: "bg-blue-400/15 text-blue-400 border-blue-400/30",
  stitching: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  ready:     "bg-purple-500/15 text-purple-400 border-purple-500/30",
  delivered: "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30",
  cancelled: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
};

// matches all enum values from order.model
const STATUSES = ["all", "pending", "confirmed", "stitching", "ready", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [filter,  setFilter]  = useState("all");

  useEffect(() => {
    getAllOrders()
      .then((r) => {
        // Backend returns: { success, page, totalPage, totalOrders, data: [...] }
        const list = r.data?.data || [];
        setOrders(list);
      })
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-10">
      <div className="max-w-6xl mx-auto w-full">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#64748B]/60 mb-1">Admin</p>
            <h1 className="font-serif text-xl sm:text-2xl font-semibold text-[#0F172A]">All Orders</h1>
            <p className="text-[#64748B]/50 text-sm mt-1">{orders.length} total orders</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[#64748B] underline text-sm flex items-center gap-1 hover:text-[#333333] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap overflow-x-auto pb-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-[10px] sm:text-[10px] font-mono px-3 sm:px-4 py-1.5 rounded-full capitalize transition-colors border whitespace-nowrap ${
                filter === s
                  ? "bg-[#0F172A] text-[#FFFFFF] border-[#0F172A] font-bold"
                  : "border-[#CBD5E1] text-[#64748B]/60 hover:border-[#C5A059] hover:text-[#333333]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-[#6B5F50]/10 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm px-4 py-3 rounded-lg font-mono">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-[#64748B]/40 text-sm font-mono">
            No orders found{filter !== "all" ? ` for status "${filter}"` : ""}.
          </div>
        )}

        {/* Mobile Card View */}
        {!loading && !error && filtered.length > 0 && (
          <div className="block sm:hidden space-y-4">
            {filtered.map((order) => {
              const status = order?.status || "pending";
              const badgeClass = STATUS_STYLES[status] || STATUS_STYLES.pending;
              const firstItem = order?.items?.[0];
              const itemCount = order?.items?.length ?? 0;
              const total = order?.totalAmount ?? "—";
              const stitching = order?.stitching?.type ? "Yes" : "No";

              return (
                <div
                  key={order._id}
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                  className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-4 hover:border-[#C5A059] hover:shadow-[0_4px_24px_rgba(197,165,2,0.1)] transition-all duration-200 cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-1">Order ID</p>
                      <p className="text-[#333333] font-mono text-xs break-all">#{order._id?.slice(-8)}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${badgeClass} whitespace-nowrap`}>
                      {status}
                    </span>
                  </div>

                  <hr className="border-[#6B5F50]/20 mb-3" />

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {/* Product */}
                    <div className="col-span-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Product</p>
                      <p className="text-[#333333] font-medium">
                        {firstItem?.name || "—"}
                        {itemCount > 1 && (
                          <span className="text-[#6B5F50]/40 text-xs ml-1">+{itemCount - 1} more</span>
                        )}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Quantity</p>
                      <p className="text-[#333333] font-medium">{firstItem?.quantity ?? "—"}</p>
                    </div>

                    {/* Total */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Total</p>
                      <p className="text-[#C5A059] font-bold">₹{total}</p>
                    </div>

                    {/* Stitching */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]/50 mb-0.5">Stitching</p>
                      <p className="text-[#333333]">{stitching}</p>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#6B5F50]/50 mb-0.5">Date</p>
                      <p className="text-[#333333]">
                        {order?.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Desktop Table View */}
        {!loading && !error && filtered.length > 0 && (
          <div className="hidden sm:block">
            <OrderTable orders={filtered} />
          </div>
        )}

      </div>
    </div>
  );
}