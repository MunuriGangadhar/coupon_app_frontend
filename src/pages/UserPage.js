import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';
function UserPage() {
  const [message, setMessage] = useState('');

  const claimCoupon = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/claim-coupon`, { withCredentials: true });
      setMessage(res.data.message + (res.data.code ? `: ${res.data.code}` : ''));
    } catch (err) {
      setMessage(err.response?.data.message || 'Error claiming coupon');
    }
  };

  return (
    <div className="user-page">
      <h1>Claim Your Coupon</h1>
      <button className="claim-button" onClick={claimCoupon}>Claim Now</button>
      <p className={message.includes('Error') || message.includes('wait') ? 'error-message' : 'success-message'}>
        {message}
      </p>
    </div>
  );
}

export default UserPage;