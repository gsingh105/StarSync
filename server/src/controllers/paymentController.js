import Stripe from "stripe"
import User from '../models/auth.model.js'; // Ensure path is correct
import Transaction from '../models/transaction.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body; 
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, 
      currency: "inr",
      description: "Wallet Recharge",
      metadata: {
        userId: req.user.id
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    await Transaction.create({
      userId: req.user.id,
      amount: amount,
      type: 'CREDIT',
      status: 'PENDING',
      paymentId: paymentIntent.id,
      description: 'Wallet Recharge - Stripe'
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            const transaction = await Transaction.findOne({ paymentId: paymentIntentId });
            
            if (transaction && transaction.status === 'PENDING') {
                transaction.status = 'SUCCESS';
                await transaction.save();

                const updatedUser = await User.findByIdAndUpdate(
                    req.user.id, 
                    { $inc: { walletBalance: transaction.amount } },
                    { new: true } 
                );

                return res.json({ 
                    success: true, 
                    balance: updatedUser.walletBalance 
                });
            }
            return res.json({ success: true, message: "Already processed" });
        } else {
            return res.status(400).json({ success: false, message: "Payment not succeeded" });
        }
    } catch (error) {
        console.error("Verify Error:", error);
        res.status(500).json({ error: error.message });
    }
};