import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Card element styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true,
};

// Payment form component
function PaymentForm({ amount, type, onSuccess, onCancel, issueId = null }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Import the payment API
      const { paymentsAPI } = await import('../lib/api');

      // Create payment intent based on type
      let clientSecret;
      let paymentIntentId;

      if (type === 'boost') {
        if (!issueId) {
          throw new Error('Issue ID is required for boost payment');
        }
        const response = await paymentsAPI.createBoostIntent(issueId);
        clientSecret = response.data.clientSecret;
        paymentIntentId = response.data.paymentIntentId;
      } else if (type === 'subscription') {
        const response = await paymentsAPI.createSubscriptionIntent();
        clientSecret = response.data.clientSecret;
        paymentIntentId = response.data.paymentIntentId;
      } else {
        throw new Error('Invalid payment type');
      }

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        toast.error(stripeError.message);
        setLoading(false);
        return;
      }

      // Confirm payment with backend
      if (paymentIntent.status === 'succeeded') {
        if (type === 'boost') {
          await paymentsAPI.confirmBoost(paymentIntentId);
          toast.success('Issue boosted successfully! 🚀');
        } else {
          await paymentsAPI.confirmSubscription(paymentIntentId);
          toast.success('Subscription activated! You are now a premium user! 🎉');
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(paymentIntent);
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount:</span>
          <span className="text-2xl font-bold text-primary">৳{amount}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {type === 'boost'
            ? 'Boost your issue to high priority'
            : 'Get unlimited issue submissions'}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline flex-1"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="btn btn-primary flex-1"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Processing...
            </>
          ) : (
            `Pay ৳${amount}`
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
      </p>
    </form>
  );
}

// Main StripeCheckout component
export default function StripeCheckout({
  amount,
  type,
  onSuccess,
  onCancel,
  issueId = null
}) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        amount={amount}
        type={type}
        onSuccess={onSuccess}
        onCancel={onCancel}
        issueId={issueId}
      />
    </Elements>
  );
}
