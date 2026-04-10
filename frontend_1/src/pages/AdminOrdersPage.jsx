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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = { page, limit: 10 };
    getAllOrders(params)
      .then((r) => {
        // Backend returns: { success, page, totalPage, totalOrders, data: [...] }
        const list = r.data?.data || [];
        setOrders(list);
        if (r.pagination?.totalPages) setTotalPages(r.pagination.totalPages);
        else if (r.total) setTotalPages(Math.ceil(r.total / 10));
      })
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, [page]);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-[#F1F5F9] to-[#E2E8F0] px-4 py-10">
      <div className="max-w-6xl mx-auto w-full">

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-[#C5A059] to-[#0F172A] rounded-full animate-pulse"></div>
                <p className="font-mono text-[11px] uppercase tracking-widest bg-gradient-to-r from-[#C5A059] to-[#0F172A] bg-clip-text text-transparent">Admin Dashboard</p>
              </div>
              <h1 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-[#0F172A] to-[#C5A059] bg-clip-text text-transparent">All Orders</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] rounded-full font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd"/>
                  </svg>
                  {orders.length} total orders
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7A0BC0] to-[#8B5CF6] text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
        
        {/* Filter tabs */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 mb-6">
          {/* Mobile Dropdown */}
          <div className="sm:hidden">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#0F172A] text-white font-mono text-sm font-semibold border-0 shadow-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-white text-[#0F172A]">
                  {s === "all" ? "📊 All" : s === "pending" ? "⏳ Pending" : s === "confirmed" ? "✅ Confirmed" : s === "stitching" ? "🧵 Stitching" : s === "ready" ? "🎯 Ready" : s === "delivered" ? "📦 Delivered" : "❌ Cancelled"}
                </option>
              ))}
            </select>
          </div>
          
          {/* Desktop Tabs */}
          <div className="hidden sm:flex gap-2 flex-wrap overflow-x-auto">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-[11px] font-mono px-4 py-2 rounded-xl capitalize transition-all duration-200 border whitespace-nowrap ${
                  filter === s
                    ? "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white border-transparent shadow-lg transform scale-105 font-bold"
                    : "bg-white/50 border-[#CBD5E1]/50 text-[#64748B]/70 hover:border-[#8B5CF6]/50 hover:text-[#7C3AED] hover:bg-white/80 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                {s === "all" ? "📊 All" : s === "pending" ? "⏳ Pending" : s === "confirmed" ? "✅ Confirmed" : s === "stitching" ? "🧵 Stitching" : s === "ready" ? "🎯 Ready" : s === "delivered" ? "📦 Delivered" : "❌ Cancelled"}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gradient-to-r from-[#CBD5E1]/20 to-[#E2E8F0]/20 rounded-xl animate-pulse shadow-sm" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-gradient-to-r from-[#EF4444]/10 to-[#DC2626]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm px-4 py-3 rounded-xl font-mono shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#CBD5E1]/20 to-[#E2E8F0]/20 rounded-full mb-4">
              <svg className="w-10 h-10 text-[#64748B]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-[#64748B]/40 text-sm font-mono">
              No orders found{filter !== "all" ? ` for status "${filter}"` : ""}.
            </p>
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
                  className="bg-gradient-to-br from-white to-white/80 backdrop-blur-sm border border-[#CBD5E1]/50 rounded-2xl p-5 hover:border-[#C5A059]/50 hover:shadow-[0_8px_32px_rgba(197,160,89,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#C5A059] to-[#0F172A] rounded-full"></div>
                        <p className="text-[11px] font-mono uppercase tracking-widest text-[#64748B]/60">Order ID</p>
                      </div>
                      <p className="text-[#0F172A] font-mono text-sm font-semibold break-all group-hover:text-[#C5A059] transition-colors">#{order._id?.slice(-8)}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full border uppercase tracking-wide ${badgeClass} whitespace-nowrap shadow-sm`}>
                      {status}
                    </span>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-[#CBD5E1]/30 to-transparent mb-4"></div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {/* Product */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-3 h-3 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                        </svg>
                        <p className="text-[11px] font-mono uppercase tracking-widest text-[#64748B]/60">Product</p>
                      </div>
                      <p className="text-[#0F172A] font-semibold">
                        {firstItem?.name || "—"}
                        {itemCount > 1 && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-[#C5A059]/10 text-[#C5A059] text-xs rounded-full ml-2">+{itemCount - 1} more</span>
                        )}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-3 h-3 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"/>
                        </svg>
                        <p className="text-[11px] font-mono uppercase tracking-widest text-[#64748B]/60">Quantity</p>
                      </div>
                      <p className="text-[#0F172A] font-semibold bg-[#C5A059]/10 px-2 py-1 rounded-lg inline-block">{firstItem?.quantity ?? "—"}</p>
                    </div>

                    {/* Total */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-3 h-3 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-[11px] font-mono uppercase tracking-widest text-[#64748B]/60">Total</p>
                      </div>
                      <p className="text-[#C5A059] font-bold text-lg bg-gradient-to-r from-[#C5A059] to-[#0F172A] bg-clip-text text-transparent">₹{total}</p>
                    </div>

                    {/* Stitching */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-3 h-3 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-[11px] font-mono uppercase tracking-widest text-[#64748B]/60">Stitching</p>
                      </div>
                      <p className={`font-semibold px-2 py-1 rounded-lg inline-block ${
                        stitching === "Yes" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#64748B]/10 text-[#64748B]"
                      }`}>{stitching}</p>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-3 h-3 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-[11px] font-mono uppercase tracking-widest text-[#64748B]/60">Date</p>
                      </div>
                      <p className="text-[#0F172A] font-semibold">
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

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 mb-4">
            {/* Previous Button */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`group px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                page === 1 
                  ? 'bg-gradient-to-r from-[#F8F9FA] to-[#E2E8F0] text-[#CBD5E1]/40 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                }`}
            >
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-mono text-sm transition-all duration-300 ${
                    page === i + 1
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white font-semibold shadow-lg transform scale-110'
                      : 'bg-white/60 backdrop-blur-sm text-[#64748B] hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#7C3AED] hover:text-white hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`group px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                page === totalPages 
                  ? 'bg-gradient-to-r from-[#F8F9FA] to-[#E2E8F0] text-[#CBD5E1]/40 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                }`}
            >
              Next
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}