import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';

const CartPage = () => {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Calculate totals whenever cart changes
  useEffect(() => {
    setTotalItems(cartItems.reduce((acc, item) => acc + item.quantity, 0));
    setTotalPrice(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
  }, [cartItems]);
  
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
  
  // Handle quantity change
  const handleQuantityChange = (id, quantity) => {
    updateCartQuantity(id, quantity);
  };
  
  // Handle remove item
  const handleRemoveItem = (id) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeFromCart(id);
    }
  };
  
  // Handle checkout
  const handleCheckout = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=shipping');
    }
  };
  
  return (
    <div className="container py-4">
      <h1 className="mb-4">Shopping Cart</h1>
      
      <div className="row">
        <div className="col-lg-8">
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty. <Link to="/">Go back to shopping</Link>
            </Message>
          ) : (
            <>
              {cartItems.map(item => (
                <div key={item.id} className="card mb-3 cart-item-card">
                  <div className="row g-0">
                    <div className="col-md-2">
                      <Link to={`/product/${item.id}`}>
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="img-fluid rounded-start cart-item-image"
                          style={{ height: '100px', objectFit: 'cover' }}
                        />
                      </Link>
                    </div>
                    <div className="col-md-10">
                      <div className="card-body d-flex flex-column flex-md-row justify-content-between">
                        <div>
                          <Link to={`/product/${item.id}`} className="text-decoration-none">
                            <h5 className="card-title">{item.name}</h5>
                          </Link>
                          <p className="card-text text-primary">${formatPrice(item.price)}</p>
                          <p className="card-text">
                            <small className={item.countInStock > 0 ? 'text-success' : 'text-danger'}>
                              {item.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </small>
                          </p>
                        </div>
                        
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center me-3 cart-quantity">
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <input 
                              type="number" 
                              className="form-control form-control-sm mx-2 text-center"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                              min="1"
                              max={item.countInStock}
                              style={{ width: '50px' }}
                            />
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.countInStock}
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemoveItem(item.id)}
                            title="Remove Item"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="d-flex justify-content-between my-3">
                <Link to="/" className="btn btn-outline-primary">
                  <i className="bi bi-arrow-left me-2"></i>
                  Continue Shopping
                </Link>
                
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
        
        <div className="col-lg-4">
          <div className="card cart-summary">
            <div className="card-body">
              <h2 className="card-title mb-4">Order Summary</h2>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Items:</span>
                <span>{totalItems}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${formatPrice(totalPrice)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4 fw-bold">
                <span>Total:</span>
                <span>${formatPrice(totalPrice)}</span>
              </div>
              
              <button 
                className="btn btn-primary w-100 mb-3"
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
              >
                <i className="bi bi-credit-card me-2"></i>
                Proceed to Checkout
              </button>
              
              <div className="text-center mt-3">
                <div className="payment-icons d-flex justify-content-center">
                  <i className="bi bi-credit-card mx-1 fs-4"></i>
                  <i className="bi bi-credit-card-2-front mx-1 fs-4"></i>
                  <i className="bi bi-credit-card-2-back mx-1 fs-4"></i>
                  <i className="bi bi-paypal mx-1 fs-4"></i>
                </div>
                <small className="text-muted d-block mt-2">
                  Secure payment options
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
