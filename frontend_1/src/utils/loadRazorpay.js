// src/utils/loadRazorpay.js

/**
 * Dynamically loads the Razorpay Checkout script.
 * Returns a Promise that resolves to true if loaded successfully, false otherwise.
 */
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    // If already loaded, resolve immediately
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};