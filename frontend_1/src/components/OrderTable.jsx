// src/components/OrderTable.jsx
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  pending:   "bg-gradient-to-r from-[#F59E0B]/15 to-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30 shadow-sm",
  confirmed: "bg-gradient-to-r from-[#0F172A]/15 to-[#0F172A]/10 text-[#0F172A] border-[#0F172A]/30 shadow-sm",
  stitching: "bg-gradient-to-r from-[#3B82F6]/15 to-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30 shadow-sm",
  ready:     "bg-gradient-to-r from-[#C5A059]/15 to-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/30 shadow-sm",
  delivered: "bg-gradient-to-r from-[#10B981]/15 to-[#10B981]/10 text-[#10B981] border-[#10B981]/30 shadow-sm",
  cancelled: "bg-gradient-to-r from-[#EF4444]/15 to-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30 shadow-sm",
};

export default function OrderTable({ orders = [] }) {
  const navigate = useNavigate();

  if (!orders.length) {
    return (
      <div className="text-center py-16 text-[#64748B]/40 text-sm font-mono">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#CBD5E1]/50 shadow-xl bg-white/80 backdrop-blur-sm">
      <table className="w-full text-sm text-left min-w-[600px]">
        <thead>
          <tr className="bg-gradient-to-r from-[#F8F9FA] to-[#F1F5F9] border-b border-[#CBD5E1]/50">
            {["Product", "Qty", "Total", "Stitching", "Status", "Date"].map((h) => (
              <th
                key={h}
                className="px-4 sm:px-6 py-4 text-[11px] font-mono font-bold uppercase tracking-widest text-[#0F172A]/80 border-b border-[#CBD5E1]/20"
              >
                <div className="flex items-center gap-2">
                  {h === "Product" && <svg className="w-4 h-4 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                  </svg>}
                  {h === "Qty" && <svg className="w-4 h-4 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"/>
                  </svg>}
                  {h === "Total" && <svg className="w-4 h-4 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                  </svg>}
                  {h === "Stitching" && <svg className="w-4 h-4 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                  </svg>}
                  {h === "Status" && <svg className="w-4 h-4 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>}
                  {h === "Date" && <svg className="w-4 h-4 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>}
                  {h}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => {
            const status    = order?.status || "pending";
            const badge     = STATUS_STYLES[status] || STATUS_STYLES.pending;

            // items is an array — read first item
            const firstItem = order?.items?.[0];
            const itemCount = order?.items?.length ?? 0;

            // totalAmount is the model field
            const total     = order?.totalAmount ?? "—";

            // stitching is { type: Boolean }
            const stitching = order?.stitching?.type ? "Yes" : "No";

            return (
              <tr
                key={order._id}
                onClick={() => navigate(`/admin/orders/${order._id}`)}
                className={`border-b border-[#CBD5E1]/30 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-[#C5A059]/5 hover:to-[#0F172A]/5 hover:shadow-sm group ${
                  i % 2 === 0 ? "bg-white/40" : "bg-white/20"
                }`}
              >
                {/* Order ID — last 8 chars */}
                {/* <td className="px-3 sm:px-4 py-3 font-mono text-[#64748B]/50 text-xs">
                  #{order._id?.slice(-8)}
                </td> */}

                {/* Product name from items[0].name */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="max-w-[150px] sm:max-w-none">
                    <p className="text-[#0F172A] font-semibold group-hover:text-[#C5A059] transition-colors">
                      {firstItem?.name || "—"}
                    </p>
                    {itemCount > 1 && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-[#C5A059]/10 text-[#C5A059] text-xs rounded-full mt-1">
                        +{itemCount - 1} more
                      </span>
                    )}
                  </div>
                </td>

                {/* Quantity from items[0].quantity */}
                <td className="px-4 sm:px-6 py-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-[#C5A059]/10 text-[#C5A059] font-bold rounded-lg">
                    {firstItem?.quantity ?? "—"}
                  </span>
                </td>

                {/* totalAmount */}
                <td className="px-4 sm:px-6 py-4">
                  <p className="text-[#C5A059] font-bold text-lg bg-gradient-to-r from-[#C5A059] to-[#0F172A] bg-clip-text text-transparent">
                    ₹{total}
                  </p>
                </td>

                {/* stitching.type Boolean */}
                <td className="px-4 sm:px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg font-semibold text-sm ${
                    stitching === "Yes" 
                      ? "bg-gradient-to-r from-[#10B981]/10 to-[#10B981]/5 text-[#10B981] border border-[#10B981]/20" 
                      : "bg-gradient-to-r from-[#64748B]/10 to-[#64748B]/5 text-[#64748B] border border-[#64748B]/20"
                  }`}>
                    {stitching === "Yes" ? "✓" : "—"} {stitching}
                  </span>
                </td>

                {/* Status badge */}
                <td className="px-4 sm:px-6 py-4">
                  <span className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border ${badge} whitespace-nowrap`}>
                    {status === "pending" ? "⏳" : status === "confirmed" ? "✅" : status === "stitching" ? "🧵" : status === "ready" ? "🎯" : status === "delivered" ? "📦" : "❌"} {status}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 sm:px-6 py-4 text-[#0F172A]/70 text-sm font-medium whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                    {order?.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day:   "numeric",
                          month: "short",
                          year:  "numeric",
                        })
                      : "—"}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}