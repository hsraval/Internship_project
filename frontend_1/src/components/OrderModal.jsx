import { useEffect } from "react";
import OrderForm from "./OrderForm";

export default function OrderModal({ product, onClose, onSuccess }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#16537e]/30 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />
      <div className="relative z-10 w-full max-w-lg bg-[#f4f9fb] border border-[#b0d3e6]/50 rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#b0d3e6]/50 flex items-center justify-between bg-white z-20 shadow-sm">
          <div>
            <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#80b3ba] mb-1">
              Place Order
            </p>
            <h2 className="font-sans text-xl font-bold text-[#1e2a3a] pr-4 truncate max-w-[300px] sm:max-w-[350px]">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#16537e]/10 text-[#16537e] hover:bg-[#16537e] hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar">
          <OrderForm productId={product._id} onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
