import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    // Payment method submission logic would go here
    navigate('/placeorder');
  };

  return (
    <div className="container mt-4">
      <h1>Payment Method</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <h5>Select Method</h5>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="form-check-label" htmlFor="PayPal">
              PayPal or Credit Card
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="CashOnDelivery"
              name="paymentMethod"
              value="CashOnDelivery"
              checked={paymentMethod === 'CashOnDelivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label className="form-check-label" htmlFor="CashOnDelivery">
              Cash on Delivery
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Continue</button>
      </form>
    </div>
  );
};

export default PaymentPage;
