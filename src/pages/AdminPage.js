import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

function AdminPage() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [claims, setClaims] = useState([]);
  const [newCoupon, setNewCoupon] = useState('');

  const login = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/login`, { username, password });
      const newToken = res.data.token;
      console.log("Login successful, token:", newToken);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      await fetchData(); // Fetch data immediately after login
    } catch (err) {
      console.error("Login error:", err.response?.data);
      alert('Login failed: ' + (err.response?.data.message || 'Unknown error'));
    }
  };

  const fetchData = async () => {
    console.log("Fetching data with BASE_URL:", BASE_URL);
    console.log("Token:", token);
    if (!token) {
      console.log("No token available, skipping fetch");
      return;
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [couponsRes, claimsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/coupons`, config),
        axios.get(`${BASE_URL}/api/admin/claims`, config)
      ]);
      setCoupons(couponsRes.data);
      setClaims(claimsRes.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.status, err.response?.data);
    }
  };

  const addCoupon = async () => {
    if (!token) {
      alert("Please log in first");
      return;
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post(`${BASE_URL}/api/admin/coupons`, { code: newCoupon }, config);
      setNewCoupon('');
      await fetchData();
    } catch (err) {
      console.error("Add coupon error:", err.response?.data);
      alert('Failed to add coupon: ' + (err.response?.data.message || 'Unknown error'));
    }
  };

  const toggleCoupon = async (id, isActive) => {
    if (!token) {
      alert("Please log in first");
      return;
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`${BASE_URL}/api/admin/coupons/${id}`, { isActive: !isActive }, config);
      await fetchData();
    } catch (err) {
      console.error("Toggle coupon error:", err.response?.data);
      alert('Failed to toggle coupon: ' + (err.response?.data.message || 'Unknown error'));
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log("Stored token from localStorage:", storedToken);
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  if (!token) {
    return (
      <div className="login-container">
        <h1>Admin Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button className="login-button" onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>
      <div className="add-coupon">
        <h2>Add Coupon</h2>
        <input
          type="text"
          value={newCoupon}
          onChange={(e) => setNewCoupon(e.target.value)}
          className="coupon-input"
          placeholder="Enter coupon code"
        />
        <button className="add-button" onClick={addCoupon}>Add</button>
      </div>
      <h2>Coupons</h2>
      <table className="coupon-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Claimed</th>
            <th>Active</th>
            <th>Toggle</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(coupon => (
            <tr key={coupon._id}>
              <td>{coupon.code}</td>
              <td>{coupon.isClaimed ? 'Yes' : 'No'}</td>
              <td>{coupon.isActive ? 'Yes' : 'No'}</td>
              <td>
                <button
                  className={coupon.isActive ? 'disable-button' : 'enable-button'}
                  onClick={() => toggleCoupon(coupon._id, coupon.isActive)}
                >
                  {coupon.isActive ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Claim History</h2>
      <table className="claim-table">
        <thead>
          <tr>
            <th>IP</th>
            <th>Coupon</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {claims.map(claim => (
            <tr key={claim._id}>
              <td>{claim.ip}</td>
              <td>{claim.couponId?.code || 'Unknown'}</td>
              <td>{new Date(claim.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;