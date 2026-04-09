// src/components/OrderTable.jsx
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  pending:   "bg-[#F59E0B]/15 text-[#F59E0B]",
  confirmed: "bg-[#0F172A]/15 text-[#0F172A]",
  stitching: "bg-[#0F172A]/15 text-[#0F172A]",
  ready:     "bg-[#C5A059]/15 text-[#C5A059]",
  delivered: "bg-[#10B981]/15 text-[#10B981]",
  cancelled: "bg-[#EF4444]/15 text-[#EF4444]",
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
    <div className="overflow-x-auto rounded-xl border border-[#CBD5E1]">
      <table className="w-full text-sm text-left min-w-[600px]">
        <thead>
          <tr className="bg-[#F8F9FA] border-b border-[#CBD5E1]">
            {["Product", "Qty", "Total", "Stitching", "Status", "Date"].map((h) => (
              <th
                key={h}
                className="px-3 sm:px-4 py-3 text-[10px] font-mono font-semibold uppercase tracking-widest text-[#64748B]/60"
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
                className={`border-b border-[#CBD5E1] cursor-pointer transition-colors hover:bg-[#F8F9FA]/50 ${
                  i % 2 === 0 ? "bg-[#F8F9FA]/40" : "bg-[#F8F9FA]/5"
                }`}
              >
                {/* Order ID — last 8 chars */}
                {/* <td className="px-3 sm:px-4 py-3 font-mono text-[#64748B]/50 text-xs">
                  #{order._id?.slice(-8)}
                </td> */}

                {/* Product name from items[0].name */}
                <td className="px-3 sm:px-4 py-3 text-[#333333] font-medium">
                  <div className="max-w-[150px] sm:max-w-none">
                    {firstItem?.name || "—"}
                    {itemCount > 1 && (
                      <span className="text-[#64748B]/40 text-xs ml-1">
                        +{itemCount - 1}
                      </span>
                    )}
                  </div>
                </td>

                {/* Quantity from items[0].quantity */}
                <td className="px-3 sm:px-4 py-3 text-[#64748B]/70">
                  {firstItem?.quantity ?? "—"}
                </td>

                {/* totalAmount */}
                <td className="px-3 sm:px-4 py-3 text-[#C5A059] font-semibold">
                  ₹{total}
                </td>

                {/* stitching.type Boolean */}
                <td className="px-3 sm:px-4 py-3 text-[#64748B]/60 text-xs font-mono">
                  {stitching}
                </td>

                {/* Status badge */}
                <td className="px-3 sm:px-4 py-3">
                  <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${badge} whitespace-nowrap`}>
                    {status}
                  </span>
                </td>

                {/* Date */}
                <td className="px-3 sm:px-4 py-3 text-[#64748B]/40 text-xs font-mono whitespace-nowrap">
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