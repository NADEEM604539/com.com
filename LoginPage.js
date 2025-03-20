import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, userInfo, loading, error } = useContext(AuthContext);

  const redirect = location.search ? location.search.split('=')[1] : '/';

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate(redirect);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card my-5">
          <div className="card-body p-4">
            <h1 className="text-center mb-4">Sign In to Monis,Nadeem,Bilal,Abdur-rahman E-commerce Store</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="py-3">
              <div className="text-center">
                New Customer?{' '}
                <Link
                  to={
                    redirect ? `/register?redirect=${redirect}` : '/register'
                  }
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 