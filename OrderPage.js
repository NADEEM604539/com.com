import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderPage = () => {
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);
  
  useEffect(() => {
    if (!userInfo) {
      setError('Please log in to view this order');
      setLoading(false);
      return;
    }
    
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        const { data } = await axios.get(`/api/orders/${id}`, config);
        
        if (data.success) {
          setOrder(data.order);
        } else {
          setError('Failed to fetch order details');
        }
        
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching order');
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, userInfo]);
  
  // Format price to show 2 decimal places
  const formatPrice = (price) => {
    // Check if price exists and is a number
    if (price !== undefined && price !== null) {
      // Convert to number first if it's a string
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      // Check if it's a valid number after conversion
      if (!isNaN(numPrice)) {
        return numPrice.toFixed(2);
      }
    }
    return '0.00';
  };
  
  // Pay order handler
  const payOrderHandler = async () => {
    try {
      setLoadingPay(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.put(
        `/api/orders/${id}/pay`,
        {
          paymentResultId: 'mock_payment_id',
          paymentResultStatus: 'COMPLETED',
          paymentResultUpdateTime: new Date().toISOString(),
        },
        config
      );
      
      if (data.success) {
        setOrder({ ...order, isPaid: true, paidAt: new Date().toISOString() });
      } else {
        setError('Payment failed');
      }
      
      setLoadingPay(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Payment failed');
      setLoadingPay(false);
    }
  };
  
  // Deliver order handler (admin only)
  const deliverOrderHandler = async () => {
    try {
      setLoadingDeliver(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.put(
        `/api/orders/${id}/deliver`,
        {},
        config
      );
      
      if (data.success) {
        setOrder({ ...order, isDelivered: true, deliveredAt: new Date().toISOString() });
      } else {
        setError('Failed to mark as delivered');
      }
      
      setLoadingDeliver(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to mark as delivered');
      setLoadingDeliver(false);
    }
  };
  
  // Get order status step
  const getOrderStatus = () => {
    const steps = [
      { id: 'processing', label: 'Processing', icon: 'bi-gear-fill', completed: true },
      { id: 'paid', label: 'Paid', icon: 'bi-credit-card-fill', completed: order?.isPaid },
      { id: 'shipped', label: 'Shipped', icon: 'bi-truck', completed: order?.isDelivered },
      { id: 'delivered', label: 'Delivered', icon: 'bi-check-circle-fill', completed: order?.isDelivered }
    ];
    
    // Find the active step
    let activeStepIndex = 0;
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].completed) {
        activeStepIndex = i;
        break;
      }
    }
    
    return { steps, activeStepIndex };
  };
  
  return (
    <div className="container py-4">
      <Link to="/profile" className="btn btn-outline-primary mb-4">
        <i className="bi bi-arrow-left me-2"></i> Back to Profile
      </Link>
      
      <h1 className="mb-4">Order Details</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : order ? (
        <>
          <div className="alert alert-info">
            <strong>Order ID:</strong> {order.id}
          </div>
          
          {/* Order Tracking */}
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Order Status</h4>
              
              <div className="order-status">
                {getOrderStatus().steps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`status-step ${
                      index <= getOrderStatus().activeStepIndex ? 'completed' : ''
                    } ${index === getOrderStatus().activeStepIndex ? 'active' : ''}`}
                  >
                    <div className="status-dot">
                      <i className={step.icon}></i>
                    </div>
                    <div className="status-label">{step.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3">
                <p className="mb-1">
                  <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="mb-1">
                  <strong>Payment Status:</strong>{' '}
                  {order.isPaid ? (
                    <span className="text-success">
                      Paid on {new Date(order.paidAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-danger">Not Paid</span>
                  )}
                </p>
                <p className="mb-0">
                  <strong>Delivery Status:</strong>{' '}
                  {order.isDelivered ? (
                    <span className="text-success">
                      Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-warning">Not Delivered</span>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-8">
              {/* Shipping Information */}
              <div className="card mb-4">
                <div className="card-body">
                  <h4 className="card-title">Shipping</h4>
                  <p>
                    <strong>Name:</strong> {order.User?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.User?.email}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.shippingAddress}
                  </p>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="card mb-4">
                <div className="card-body">
                  <h4 className="card-title">Payment Method</h4>
                  <p>
                    <strong>Method:</strong> {order.paymentMethod}
                  </p>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="card mb-4">
                <div className="card-body">
                  <h4 className="card-title">Order Items</h4>
                  
                  {order.OrderItems?.length === 0 ? (
                    <Message>Your order is empty</Message>
                  ) : (
                    <div className="list-group">
                      {order.OrderItems?.map(item => (
                        <div key={item.id} className="list-group-item">
                          <div className="row align-items-center">
                            <div className="col-md-2">
                              <img
                                src={item.image || 'https://via.placeholder.com/100'}
                                alt={item.name}
                                className="img-fluid rounded"
                              />
                            </div>
                            <div className="col-md-6">
                              <Link to={`/product/${item.productId}`}>
                                {item.name}
                              </Link>
                            </div>
                            <div className="col-md-4">
                              {item.quantity} x ${formatPrice(item.price)} = $
                              {formatPrice(item.quantity * item.price)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              {/* Order Summary */}
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Order Summary</h4>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Items:</span>
                    <span>${formatPrice(order.totalPrice - order.taxPrice - order.shippingPrice)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>${formatPrice(order.shippingPrice)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <span>${formatPrice(order.taxPrice)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-4 fw-bold">
                    <span>Total:</span>
                    <span>${formatPrice(order.totalPrice)}</span>
                  </div>
                  
                  {/* Pay Button (if not paid) */}
                  {!order.isPaid && (
                    <button
                      className="btn btn-primary w-100 mb-3"
                      onClick={payOrderHandler}
                      disabled={loadingPay}
                    >
                      {loadingPay ? (
                        <>
                          <i className="bi bi-arrow-repeat spin me-2"></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-credit-card me-2"></i>
                          Pay Now
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* Deliver Button (admin only) */}
                  {userInfo && userInfo.role === 'admin' && order.isPaid && !order.isDelivered && (
                    <button
                      className="btn btn-success w-100 mb-3"
                      onClick={deliverOrderHandler}
                      disabled={loadingDeliver}
                    >
                      {loadingDeliver ? (
                        <>
                          <i className="bi bi-arrow-repeat spin me-2"></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-truck me-2"></i>
                          Mark as Delivered
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* Print Invoice Button */}
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => window.print()}
                  >
                    <i className="bi bi-printer me-2"></i>
                    Print Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Message>Order not found</Message>
      )}
    </div>
  );
};

export default OrderPage;
