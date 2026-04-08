// src/pages/MyOrdersPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../api/api";
import OrderCard from "../components/OrderCard";

export default function MyOrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders()
      .then((r) => setOrders(r.data?.data || r.data || []))
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-500 mb-1">My Orders</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-[#6B5F50]/60 hover:text-[#6B5F50] text-xs font-mono flex items-center gap-1 mb-3 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-zinc-100">Order History</h1>
          </div>
          <button
            onClick={() => navigate("/order")}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-900 text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide"
          >
            + New Order
          </button>
        </div>

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-36 bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-sm">No orders yet.</p>
            <button
              onClick={() => navigate("/order")}
              className="mt-4 text-amber-500 hover:text-amber-400 text-sm underline"
            >
              Place your first order →
            </button>
          </div>
        )}

        <div className="grid gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onViewDetail={(id) => navigate(`/orders/${id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}