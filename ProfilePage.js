import React, { useState } from 'react';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    // Update profile logic would go here
  };

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>
      <div className="row">
        <div className="col-md-6">
          <h3>Profile Information</h3>
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="Enter email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        </div>
        <div className="col-md-6">
          <h3>My Orders</h3>
          <p>You have no orders yet.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
