import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?keyword=${searchQuery}`);
    }
  };

  return (
    <div className="text-center py-5 my-5">
      <div className="mb-4">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-4">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>
      
      <div className="card mb-4 mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h3 className="card-title h5 mb-3">Looking for something specific?</h3>
          <form onSubmit={handleSearch} className="d-flex">
            <input 
              type="text" 
              className="form-control me-2" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      </div>
      
      <div className="d-flex flex-column align-items-center">
        <p className="mb-3">Here are some helpful links:</p>
        <div className="d-flex gap-3 flex-wrap justify-content-center">
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-house-door me-2"></i>
            Back to Home
          </Link>
          <Link to="/" className="btn btn-outline-primary">
            <i className="bi bi-bag me-2"></i>
            Browse Products
          </Link>
          <Link to="/cart" className="btn btn-outline-primary">
            <i className="bi bi-cart me-2"></i>
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 