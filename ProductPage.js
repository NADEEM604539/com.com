import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ErrorHandler from '../components/ErrorHandler';

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  
  // For image gallery
  const [mainImage, setMainImage] = useState('');
  const [images, setImages] = useState([]);
  
  // Get image URL with fallback
  const getImageUrl = (imageUrl) => {
    // Check for product-specific images based on product name if available
    if (product) {
      if (product.name === 'Smartphone X') {
        return '/uploads/iphonex.jpg';
      } else if (product.name === 'Laptop Pro') {
        return '/uploads/laptop.jpg';
      } else if (product.name === 'Cotton T-Shirt' || product.name === "Men's Casual T-Shirt") {
        return '/uploads/tshirt.jpg';
      } else if (product.name === 'Denim Jeans') {
        return '/uploads/jeans.jpg';
      }else if (product.name === 'Programming Guide') {
        return '/uploads/program.jpg';
      }
    }
    
    // If image URL starts with /uploads, it's a local image
    if (imageUrl && imageUrl.startsWith('/uploads')) {
      return imageUrl;
    }
    
    // If image URL is provided but doesn't start with /uploads
    if (imageUrl) {
      return imageUrl;
    }
    
    // Default fallback image
    return '/uploads/WIN_20240927_10_46_01_Pro.jpg';
  };
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        
        if (data.success) {
          // Ensure price is numeric
          const formattedProduct = {
            ...data.product,
            price: typeof data.product.price === 'string' ? parseFloat(data.product.price) : data.product.price
          };
          
          setProduct(formattedProduct);
          setMainImage(getImageUrl(formattedProduct.imageUrl));
          
          // Create mock gallery images (in a real app, these would come from the API)
          const mockGallery = [
            getImageUrl(formattedProduct.imageUrl),
            '/uploads/WIN_20240927_10_46_01_Pro.jpg',
            '/uploads/WIN_20240927_10_46_01_Pro.jpg',
            '/uploads/WIN_20240927_10_46_01_Pro.jpg'
          ];
          setImages(mockGallery);
        } else {
          setError('Failed to fetch product');
        }
        
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching product');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
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
  
  // Generate star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="bi bi-star-fill text-warning"></i>);
    }
    
    // Add half star if needed
    if (halfStar) {
      stars.push(<i key="half-star" className="bi bi-star-half text-warning"></i>);
    }
    
    // Calculate remaining stars
    const remainingStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    // Add empty stars
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-star-${i}`} className="bi bi-star text-muted" style={{ opacity: 0.3 }}></i>);
    }
    
    return stars;
  };
  
  // Increase quantity
  const increaseQuantity = () => {
    if (quantity < product.countInStock) {
      setQuantity(quantity + 1);
    }
  };
  
  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Add to cart handler
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  // Handle submit review
  const submitReviewHandler = async (e) => {
    e.preventDefault();
    
    if (!userInfo) {
      setReviewError('Please login to submit a review');
      return;
    }
    
    if (rating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    
    try {
      setReviewSubmitLoading(true);
      setReviewError(null);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      
      const { data } = await axios.post(
        `/api/products/${id}/reviews`,
        { rating, comment },
        config
      );
      
      if (data.success) {
        setReviewSuccess(true);
        setRating(0);
        setComment('');
        
        // Update product with new review
        const { data: updatedProductData } = await axios.get(`/api/products/${id}`);
        if (updatedProductData.success) {
          setProduct(updatedProductData.product);
        }
      } else {
        setReviewError(data.message || 'Review submission failed');
      }
      
      setReviewSubmitLoading(false);
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Error submitting review');
      setReviewSubmitLoading(false);
    }
  };
  
  return (
    <div className="container py-4">
      <Link to="/" className="btn btn-outline-primary mb-4">
        <i className="bi bi-arrow-left me-2"></i> Back to Products
      </Link>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorHandler 
          error={error} 
          resetError={() => window.location.reload()} 
        />
      ) : product ? (
        <>
          <div className="row">
            {/* Product Image Gallery */}
            <div className="col-md-6 mb-4">
              <div className="product-gallery">
                <div className="gallery-thumbnails">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.name} - ${index}`}
                      className={`gallery-thumbnail ${mainImage === img ? 'active' : ''}`}
                      onClick={() => setMainImage(img)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/uploads/WIN_20240927_10_46_01_Pro.jpg';
                      }}
                    />
                  ))}
                </div>
                <div>
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="gallery-main-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/uploads/WIN_20240927_10_46_01_Pro.jpg';
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="col-md-6">
              <h1 className="mb-3">{product.name}</h1>
              
              <div className="mb-3">
                {renderStars(product.rating)}
                <span className="ms-2">({product.numReviews} reviews)</span>
              </div>
              
              <h2 className="mb-3 text-primary">${formatPrice(product.price)}</h2>
              
              <p className="mb-4">{product.description}</p>
              
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <span className="me-3">Status:</span>
                  <span className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                {product.countInStock > 0 && (
                  <div className="d-flex align-items-center mb-3">
                    <span className="me-3">Quantity:</span>
                    <div className="d-flex align-items-center">
                      <button 
                        className="btn btn-outline-secondary" 
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="number"
                        className="form-control mx-2 text-center"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min="1"
                        max={product.countInStock}
                        style={{ width: '60px' }}
                      />
                      <button 
                        className="btn btn-outline-secondary" 
                        onClick={increaseQuantity}
                        disabled={quantity >= product.countInStock}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                )}
                
                <button
                  className="btn btn-primary w-100"
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
              
              <div className="mt-4">
                <h4>Category</h4>
                <p>{product.Category?.name || 'Uncategorized'}</p>
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="row mt-5">
            <div className="col-md-6">
              <h2 className="mb-4">Reviews</h2>
              {product.Reviews && product.Reviews.length === 0 && (
                <Message>No reviews yet. Be the first to review this product!</Message>
              )}
              
              {product.Reviews && product.Reviews.map((review) => (
                <div key={review.id} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title">{review.User?.name || 'Anonymous'}</h5>
                      <div className="text-warning">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="card-text text-muted small">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    <p className="card-text">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="col-md-6">
              <h2 className="mb-4">Write a Review</h2>
              
              {reviewSuccess && (
                <Message variant="success">Review submitted successfully!</Message>
              )}
              
              {reviewError && (
                <Message variant="danger">{reviewError}</Message>
              )}
              
              {!userInfo ? (
                <Message>
                  Please <Link to="/login">sign in</Link> to write a review.
                </Message>
              ) : (
                <form onSubmit={submitReviewHandler}>
                  <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Rating</label>
                    <select
                      id="rating"
                      className="form-select"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="0">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Comment</label>
                    <textarea
                      id="comment"
                      className="form-control"
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={reviewSubmitLoading}
                  >
                    {reviewSubmitLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </>
      ) : (
        <Message>Product not found</Message>
      )}
    </div>
  );
};

export default ProductPage; 
