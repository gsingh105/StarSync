import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { X, ShieldCheck } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null); // Clear previous errors

    try {
        // 1. Confirm Payment with Stripe
        const result = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (result.error) {
            // Stripe Error
            throw new Error(result.error.message);
        } 
        
        if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
            // 2. Verify with Backend
            const response = await axios.post(`${API_URL}/api/payment/verify-stripe`, {
                paymentIntentId: result.paymentIntent.id
            }, { withCredentials: true });
            
            if (response.data.success) {
                // 3. SUCCESS! 
                // We purposefully do NOT put onSuccess() inside this try block.
                // We return the balance to be handled outside.
                const newBalance = response.data.balance;
                
                // Stop loading BEFORE calling onSuccess (which might close the modal)
                setLoading(false); 
                
                // Call parent
                onSuccess(newBalance);
                return; 
            }
        }
    } catch (err) {
        console.error("Payment Error:", err);
        setErrorMessage(err.message || "Payment verification failed.");
    } finally {
        // Only stop loading if we didn't succeed (success case handles it above)
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      {errorMessage && <div className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded border border-red-200">{errorMessage}</div>}
      
      <button
        disabled={!stripe || loading}
        className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>
    </form>
  );
};

const WalletModal = ({ isOpen, onClose, user, onRechargeSuccess }) => {
  const [amount, setAmount] = useState(100);
  const [clientSecret, setClientSecret] = useState(null);

  const initiatePayment = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/api/payment/create-payment-intent`, { amount }, { withCredentials: true });
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Failed to init stripe", error);
    }
  };

  const handleSuccess = (newBalance) => {
      // 1. Alert User
      alert("Recharge Successful!");
      
      // 2. Pass data to Dashboard
      onRechargeSuccess(newBalance);
      
      // 3. Close Modal (This unmounts everything)
      onClose();
      
      // 4. Reset internal state (in case it re-opens)
      setClientSecret(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden relative p-6">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recharge Wallet</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20}/></button>
        </div>

        {!clientSecret ? (
          <>
            <div className="text-center mb-6">
               <h2 className="text-4xl font-bold text-slate-900 dark:text-white">₹{amount}</h2>
               <p className="text-sm text-slate-500">Selected Amount</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
               {[100, 200, 500, 1000].map((amt) => (
                 <button
                   key={amt}
                   onClick={() => setAmount(amt)}
                   className={`py-2 rounded-lg border font-medium ${amount === amt ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200'}`}
                 >
                   ₹{amt}
                 </button>
               ))}
            </div>

            <button onClick={initiatePayment} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">
              Proceed to Pay
            </button>
          </>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
             <CheckoutForm 
                amount={amount} 
                onSuccess={handleSuccess} 
             />
          </Elements>
        )}
        
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
           <ShieldCheck size={14} className="text-green-500" />
           <span>Secured by Stripe</span>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;