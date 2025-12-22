import React, { useEffect, useRef } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function PaymentSuccess() {
  const stripe = useStripe();
  const calledRef = useRef(false); // Prevent double calls

  useEffect(() => {
    if (!stripe || calledRef.current) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) return;

    calledRef.current = true;

    stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
      if (paymentIntent.status === "succeeded") {
        try {
          // Use the correct API_URL variable
          await axios.post(`${API_URL}/api/payment/verify-stripe`, {
            paymentIntentId: paymentIntent.id
          }, { withCredentials: true });
          
          // Small delay so user sees "Success"
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        } catch (err) {
          console.error("Verification failed", err);
        }
      }
    });
  }, [stripe]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-2xl font-bold mb-2">Confirming your transaction...</h2>
      <p className="text-slate-400">Please do not close this window.</p>
    </div>
  );
}