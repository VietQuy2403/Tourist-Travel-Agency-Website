import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

// Khởi tạo Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentFormContent = ({ amount, bookingId, destination, email, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
        },
      });

      if (submitError) {
        setError(submitError.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement />
      {error && <div className="error-message">{error}</div>}
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="payment-button"
      >
        {processing ? "Đang xử lý..." : "Thanh toán"}
      </button>
    </form>
  );
};

const PaymentForm = ({ amount, bookingId, destination, email, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post("/api/create-payment-intent", {
          amount,
          metadata: {
            bookingId,
            destination,
            email
          }
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Lỗi tạo payment intent:", error);
      }
    };

    createPaymentIntent();
  }, [amount, bookingId, destination, email]);

  if (!clientSecret) {
    return <div>Đang tải...</div>;
  }

  return (
    <Elements 
      stripe={stripePromise} 
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#007bff",
            colorBackground: "#ffffff",
            colorText: "#30313d",
            colorDanger: "#df1b41",
            fontFamily: "system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "4px",
          },
        },
      }}
    >
      <PaymentFormContent 
        amount={amount}
        bookingId={bookingId}
        destination={destination}
        email={email}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};

export default PaymentForm; 