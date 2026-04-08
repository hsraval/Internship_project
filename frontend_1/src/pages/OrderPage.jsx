// src/pages/OrderPage.jsx
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderForm from "../components/OrderForm";

export default function OrderPage() {
  const navigate       = useNavigate();
  const [params]       = useSearchParams();
  const productId      = params.get("product"); // pass ?product=ID from product page

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-amber-500 mb-1">New Order</p>
          <h1 className="text-2xl font-bold text-zinc-100">Place Your Order</h1>
          <p className="text-zinc-500 text-sm mt-1">Fill in the details below to place a custom order.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <OrderForm
            productId={productId}
            onSuccess={() => navigate("/orders")}
          />
        </div>
      </div>
    </div>
  );
}