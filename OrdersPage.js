import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrdersPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format price
  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  };

  // Add mock data for testing if you get backend errors
  const useMockData = false;
  const mockOrders = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      createdAt: new Date().toISOString(),
      totalAmount: 849.99,
      paymentStatus: 'completed',
      status: 'delivered'
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: 1299.99,
      paymentStatus: 'completed',
      status: 'shipped'
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        if (useMockData) {
          // Use mock data for testing
          setOrders(mockOrders);
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        };
        
        const { data } = await axios.get('/api/orders', config);
        
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError('Failed to fetch orders');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Order fetch error:', error);
        setError(error.response?.data?.message || 'Error fetching orders');
        setLoading(false);
      }
    };
    
    if (userInfo) {
      fetchOrders();
    } else {
      setError('Please log in to view your orders');
      setLoading(false);
    }
  }, [userInfo, useMockData]);

  return (
    <div className="container py-4">
      <h1 className="mb-4">My Orders</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-bag-x display-1 text-muted"></i>
            <h2 className="mt-3">No Orders Found</h2>
            <p className="lead">You haven't placed any orders yet.</p>
          </div>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber || order.id}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>${formatPrice(order.totalAmount)}</td>
                  <td>
                    {order.paymentStatus === 'completed' ? (
                      <span className="badge bg-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Paid
                      </span>
                    ) : (
                      <span className="badge bg-danger">
                        <i className="bi bi-x-circle me-1"></i>
                        Not Paid
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${order.status === 'delivered' 
                      ? 'bg-success' 
                      : order.status === 'processing' 
                      ? 'bg-info' 
                      : 'bg-warning text-dark'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/order/${order.id}`} className="btn btn-primary btn-sm">
                      <i className="bi bi-eye me-1"></i>
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 