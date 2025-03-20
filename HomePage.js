import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keywordParam = queryParams.get('keyword');
  const categoryParam = queryParams.get('category');
  
  // Get category icon based on name
  const getCategoryIcon = (name) => {
    const icons = {
      'Electronics': 'bi-phone',
      'Clothing': 'bi-tags',
      'Books': 'bi-book',
      'Home & Kitchen': 'bi-house'
    };
    
    return icons[name] || 'bi-box';
  };
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let url = '/api/products';
        if (keywordParam) {
          url += `?keyword=${keywordParam}`;
        }
        if (categoryParam) {
          url += keywordParam ? `&category=${categoryParam}` : `?category=${categoryParam}`;
          setActiveCategory(parseInt(categoryParam));
        }
        
        const { data } = await axios.get(url);
        
        if (data.success) {
          // Ensure product prices are numeric
          const formattedProducts = data.products.map(product => ({
            ...product,
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
          }));
          
          setProducts(formattedProducts);
          setFilteredProducts(formattedProducts);
        } else {
          setError('Failed to fetch products');
        }
        
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching products');
        setLoading(false);
      }
    };
    
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        
        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    
    fetchProducts();
    fetchCategories();
  }, [keywordParam, categoryParam]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    
    if (e.target.value.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(e.target.value.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Add search to URL parameter for SEO
    window.history.pushState(
      {}, 
      '', 
      searchTerm ? `?keyword=${encodeURIComponent(searchTerm)}` : '/'
    );
  };
  
  // Handle category filter
  const handleCategoryFilter = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
    
    if (activeCategory === categoryId) {
      // Clear filter
      setFilteredProducts(products);
      // Update URL
      window.history.pushState({}, '', '/');
    } else {
      // Filter products
      const filtered = products.filter(product => product.categoryId === categoryId);
      setFilteredProducts(filtered);
      // Update URL
      window.history.pushState({}, '', `?category=${categoryId}`);
    }
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Shop the Latest Products From Monis</h1>
          <p>Find amazing deals on collections by Monis</p>
          <form onSubmit={handleSearchSubmit} className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="submit" className="search-button">
              <i className="bi bi-search"></i> Search
            </button>
          </form>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="category-grid">
            {categories.map(category => (
              <div 
                key={category.id} 
                className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(category.id)}
                style={activeCategory === category.id ? { borderColor: 'var(--primary-color)', backgroundColor: 'rgba(63, 81, 181, 0.1)' } : {}}
              >
                <div className="category-icon">
                  <i className={`bi ${getCategoryIcon(category.name)}`}></i>
                </div>
                <h3>{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="latest-products">
        <div className="container">
          <h2 className="mb-4">
            {searchTerm ? `Search Results for "${searchTerm}"` : 
             activeCategory ? `${categories.find(c => c.id === activeCategory)?.name || 'Category'} Products` : 
             'Latest Products'}
          </h2>
          
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : filteredProducts.length === 0 ? (
            <Message>No products found</Message>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <Product key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage; 