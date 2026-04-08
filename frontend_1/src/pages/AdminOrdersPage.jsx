// src/pages/AdminOrdersPage.jsx
import { useEffect, useState } from "react";
import { getAllOrders } from "../api/api";
import OrderTable from "../components/OrderTable";

// matches all enum values from order.model
const STATUSES = ["all", "pending", "confirmed", "stitching", "ready", "delivered", "cancelled"];

export default function AdminOrdersPage() {
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
    <div className="min-h-screen bg-[#F5F0E8] px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]/60 mb-1">Admin</p>
          <h1 className="font-serif text-2xl font-semibold text-[#6B5F50]">All Orders</h1>
          <p className="text-[#6B5F50]/50 text-sm mt-1">{orders.length} total orders</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-[10px] font-mono px-4 py-1.5 rounded-full capitalize transition-colors border ${
                filter === s
                  ? "bg-[#6B5F50] text-[#E8E0D0] border-[#6B5F50] font-bold"
                  : "border-[#6B5F50]/30 text-[#6B5F50]/60 hover:border-[#6B5F50] hover:text-[#6B5F50]"
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
          <div className="bg-red-500/10 border border-red-400/30 text-red-600 text-sm px-4 py-3 rounded-lg font-mono">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-[#6B5F50]/40 text-sm font-mono">
            No orders found{filter !== "all" ? ` for status "${filter}"` : ""}.
          </div>
        )}

        {/* Table */}
        {!loading && !error && filtered.length > 0 && (
          <OrderTable orders={filtered} />
        )}

      </div>
    </div>
  );
}