# Coupon App Frontend

A React-based frontend for claiming coupons and managing them via an admin panel.

## Setup
1. **Navigate to Frontend**:
   ```bash
   client
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the App**:
   ```bash
   npm start
   ```
   - Runs on `http://localhost:3000`.

## How to Use

### Get a Coupon
1. Open `http://localhost:3000/` in your browser.
2. Click **"Claim Now"**.
3. See a message with your coupon code (e.g., "Coupon claimed: TESTCOUPON") or an error if unavailable.

### Login to Admin
1. Go to `http://localhost:3000/admin`.
2. Enter:
   - **Username**: `admin`
   - **Password**: `securepass123`
3. Click **"Login"**.
4. View and manage coupons in the admin panel.

## Features
- **User Page**: Claim coupons easily.
- **Admin Panel**: Add coupons, toggle availability, and see claim history.

## Notes
- Ensure the backend is running at `http://localhost:5000` (see backend setup separately).
- Admin login uses a hardcoded username/password for simplicity.
```

---

