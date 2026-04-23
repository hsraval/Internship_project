// src/pages/MyOrdersPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../api/api";
import OrderCard from "../components/OrderCard";
import UserSidebar from "../components/UserSidebar";
import LayoutWrapper from "../components/LayoutWrapper";

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
    <LayoutWrapper>
      <div className="px-4 py-10">
        <div className="max-w-3xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
              <button
                onClick={() => navigate("/dashboard")}
                className="group relative overflow-hidden bg-gradient-to-r from-[#C5A059] to-[#0F172A] text-white text-sm font-medium flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transform hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 ease-out"
              >
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7 7" />
                </svg>
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </button>
            </div>
            
            <div className="text-center sm:text-left">
              <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-1">My Orders</p>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Order History</h1>
            </div>
          </div>

          {loading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-36 bg-[#94A3B8] rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#64748B] text-sm">No orders yet.</p>
              <button
                onClick={() => navigate("/products")}
                className="mt-4 text-[#C5A059] hover:text-[#0F172A] text-sm underline"
              >
                Browse Products →
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
    </LayoutWrapper>
  );
}