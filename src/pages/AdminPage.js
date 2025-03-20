import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [claims, setClaims] = useState([]);
  const [newCoupon, setNewCoupon] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { username, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert('Login failed');
    }
  };

  const fetchData = async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [couponsRes, claimsRes] = await Promise.all([
      axios.get('http://localhost:5000/api/admin/coupons', config),
      axios.get('http://localhost:5000/api/admin/claims', config)
    ]);
    setCoupons(couponsRes.data);
    setClaims(claimsRes.data);
  };

  const addCoupon = async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.post('http://localhost:5000/api/admin/coupons', { code: newCoupon }, config);
    setNewCoupon('');
    fetchData();
  };

  const toggleCoupon = async (id, isActive) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.put(`http://localhost:5000/api/admin/coupons/${id}`, { isActive: !isActive }, config);
    fetchData();
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
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
              <td>{claim.couponId?.code}</td>
              <td>{new Date(claim.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;