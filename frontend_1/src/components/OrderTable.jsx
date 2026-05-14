// src/components/OrderTable.jsx
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  pending:   "bg-amber-50 text-amber-700 border-amber-100",
  confirmed: "bg-blue-50 text-blue-700 border-blue-100",
  stitching: "bg-indigo-50 text-indigo-700 border-indigo-100",
  ready:     "bg-purple-50 text-purple-700 border-purple-100",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function OrderTable({ orders = [] }) {
  const navigate = useNavigate();

  if (!orders.length) {
    return (
      <div className="text-center py-16 text-[#16537e]/60 text-sm font-sans">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#b0d3e6]/50 shadow-xl bg-white">
      <table className="w-full text-sm text-left min-w-[600px] border-collapse">
        <thead className="bg-[#16537e] border-b-2 border-[#124470] shadow-lg">
          <tr>
            {["Product", "Qty", "Total", "Stitching", "Status", "Date"].map((h) => (
              <th
                key={h}
                className="px-4 sm:px-6 py-4 text-xs font-sans font-semibold text-white uppercase tracking-widest border-r border-white/10"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#b0d3e6]/30 bg-white">
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
                className={`border-b border-[#b0d3e6]/30 cursor-pointer transition-all duration-300 hover:bg-[#f4f9fb] group bg-white`}
              >
                {/* Product name from items[0].name */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="max-w-[150px] sm:max-w-none">
                    <p className="text-[#1e2a3a] font-sans font-semibold group-hover:text-[#16537e] transition-colors">
                      {firstItem?.name || "—"}
                    </p>
                    {itemCount > 1 && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-[#d7e9f2]/50 text-[#16537e] font-sans text-xs rounded-full mt-1">
                        +{itemCount - 1} more
                      </span>
                    )}
                  </div>
                </td>

                {/* Quantity from items[0].quantity */}
                <td className="px-4 sm:px-6 py-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-[#f4f9fb] text-[#1e2a3a] font-sans font-semibold rounded-lg border border-[#b0d3e6]/50">
                    {firstItem?.quantity ?? "—"}
                  </span>
                </td>

                {/* totalAmount */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-base font-bold text-[#16537e]">₹</span>
                    <span className="text-sm font-semibold text-[#1e2a3a]">
                      {Number(total).toLocaleString()}
                    </span>
                  </div>
                </td>

                {/* stitching.type Boolean */}
                <td className="px-4 sm:px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg font-sans font-semibold text-sm ${
                    stitching === "Yes" 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                      : "bg-[#f4f9fb] text-[#1e2a3a] border border-[#b0d3e6]/50"
                  }`}>
                    {stitching === "Yes" ? "✓" : "—"} {stitching}
                  </span>
                </td>

                {/* Status badge */}
                <td className="px-4 sm:px-6 py-4">
                  <span className={`text-[10px] font-sans font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border ${badge} whitespace-nowrap`}>
                    {status === "pending" ? "⏳" : status === "confirmed" ? "✅" : status === "stitching" ? "🧵" : status === "ready" ? "🎯" : status === "delivered" ? "📦" : "❌"} {status}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 sm:px-6 py-4 text-[#1e2a3a] text-sm font-sans font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-2">
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