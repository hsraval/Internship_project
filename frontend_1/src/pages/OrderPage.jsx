// src/pages/OrderPage.jsx
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderForm from "../components/OrderForm";
import LayoutWrapper from "../components/LayoutWrapper";

export default function OrderPage() {
  const navigate       = useNavigate();
  const [params]       = useSearchParams();
  const productId      = params.get("product"); // pass ?product=ID from product page

  return (
    <LayoutWrapper>
      <div className="px-4 py-10">
        <div className="max-w-lg mx-auto w-full">
          {/* Header with back button */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-[#64748B] hover:text-[#333333] text-sm flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7 7" />
                </svg>
                Back to Dashboard
              </button>
            </div>
            
            <div className="text-center sm:text-left">
              <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-1">New Order</p>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Place Your Order</h1>
              <p className="text-[#64748B] text-sm mt-1">Fill in the details below to place a custom order.</p>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-4 sm:p-6">
            <OrderForm
              productId={productId}
              onSuccess={() => navigate("/orders")}
            />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}