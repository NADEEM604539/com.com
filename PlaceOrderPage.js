import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PlaceOrderPage = () => {
  const navigate = useNavigate();

  const placeOrderHandler = () => {
    // Place order logic would go here
    navigate('/order/123');
  };

  return (
    <div className="container mt-4">
      <h1>Place Order</h1>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-body">
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong> 123 Example St, City, Country
              </p>
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong> PayPal
              </p>
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <h2>Order Items</h2>
              <p>Your cart is empty</p>
              <Link to="/" className="btn btn-light">Add Items</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2>Order Summary</h2>
              <div className="d-flex justify-content-between mb-2">
                <span>Items</span>
                <span>$0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total</span>
                <span>$0.00</span>
              </div>
              <button
                type="button"
                className="btn btn-primary w-100 mt-3"
                onClick={placeOrderHandler}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
