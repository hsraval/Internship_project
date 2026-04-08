// src/components/OrderTable.jsx
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  pending:   "bg-yellow-500/15 text-yellow-700",
  confirmed: "bg-blue-400/15 text-blue-600",
  stitching: "bg-blue-500/15 text-blue-700",
  ready:     "bg-purple-500/15 text-purple-700",
  delivered: "bg-green-500/15 text-green-700",
  cancelled: "bg-red-500/15 text-red-600",
};

export default function OrderTable({ orders = [] }) {
  const navigate = useNavigate();

  if (!orders.length) {
    return (
      <div className="text-center py-16 text-[#6B5F50]/40 text-sm font-mono">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#6B5F50]/20">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-[#6B5F50]/10 border-b border-[#6B5F50]/20">
            {["Order ID", "Product", "Qty", "Total", "Stitching", "Status", "Date"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-[10px] font-mono font-semibold uppercase tracking-widest text-[#6B5F50]/60"
              >
                {h}
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
                className={`border-b border-[#6B5F50]/10 cursor-pointer transition-colors hover:bg-[#6B5F50]/10 ${
                  i % 2 === 0 ? "bg-white/40" : "bg-[#6B5F50]/5"
                }`}
              >
                {/* Order ID — last 8 chars */}
                <td className="px-4 py-3 font-mono text-[#6B5F50]/50 text-xs">
                  #{order._id?.slice(-8)}
                </td>

                {/* Product name from items[0].name */}
                <td className="px-4 py-3 text-[#6B5F50] font-medium">
                  {firstItem?.name || "—"}
                  {itemCount > 1 && (
                    <span className="text-[#6B5F50]/40 text-xs ml-1">
                      +{itemCount - 1}
                    </span>
                  )}
                </td>

                {/* Quantity from items[0].quantity */}
                <td className="px-4 py-3 text-[#6B5F50]/70">
                  {firstItem?.quantity ?? "—"}
                </td>

                {/* totalAmount */}
                <td className="px-4 py-3 text-[#6B5F50] font-semibold">
                  ₹{total}
                </td>

                {/* stitching.type Boolean */}
                <td className="px-4 py-3 text-[#6B5F50]/60 text-xs font-mono">
                  {stitching}
                </td>

                {/* Status badge */}
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${badge}`}>
                    {status}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-[#6B5F50]/40 text-xs font-mono">
                  {order?.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day:   "numeric",
                        month: "short",
                        year:  "numeric",
                      })
                    : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}