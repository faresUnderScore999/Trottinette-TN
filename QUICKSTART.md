# Quick Start Guide - Trottinette Tunisie Ecommerce

Get your ecommerce website up and running in 5 minutes!

## ✅ What's Already Set Up

Your project comes with:

- ✅ Complete Vue 3 frontend with pages and components
- ✅ Full Node.js/Express backend with API endpoints
- ✅ PostgreSQL database (Neon) already configured
- ✅ Cloudinary image hosting integration
- ✅ Sample products and user data
- ✅ Authentication system (register/login)
- ✅ Shopping cart and orders
- ✅ Product reviews system
- ✅ Responsive UI with Tailwind CSS

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies (2 minutes)

**Frontend:**

```bash
npm install
```

**Backend:**

```bash
cd server
npm install
cd ..
```

### Step 2: Initialize Database (1 minute)

```bash
cd server
npm run db:init
cd ..
```

This creates all tables and seeds sample data.

### Step 3: Start the Application (2 minutes)

**Open Terminal 1 - Start Backend:**

```bash
cd server
npm start
```

Output should show: `Trottinette Tunisie Ecommerce Server running on port 5000`

**Open Terminal 2 - Start Frontend:**

```bash
npm run dev
```

Output should show: `Local: http://localhost:5173/`

### Step 4: Open Your Browser

Visit: **http://localhost:5173**

## 🛍️ Try It Out!

### Browse Products

1. Go to Home page
2. Click "Shop Now" or "Products"
3. Filter by category or price
4. Sort by name or price

### View Product Details

1. Click on any product card
2. See product specs and reviews
3. Add to cart (login if needed)

### Login & Checkout

1. Use demo credentials:
   - **Email**: customer@example.com
   - **Password**: password123
2. Add items to cart
3. Go to cart (shopping bag icon)
4. Click "Proceed to Checkout"
5. Fill shipping address
6. Select payment method
7. Place order!

### Admin Features

Login as admin to create products:

- **Email**: admin@example.com
- **Password**: password123

## 📁 Key Files to Know

### Frontend Pages

- `src/pages/Home.vue` - Landing page
- `src/pages/Products.vue` - Product listing & filtering
- `src/pages/ProductDetail.vue` - Product details & reviews
- `src/pages/Auth.vue` - Login/Register
- `src/pages/Cart.vue` - Shopping cart
- `src/pages/Checkout.vue` - Order checkout

### Backend

- `server/index.js` - All API endpoints
- `server/init-db.js` - Database setup
- `server/auth.js` - Authentication

### Configuration

- `.env` - Environment variables (already configured!)
- `tailwind.config.js` - Tailwind CSS setup
- `vite.config.js` - Frontend build config

## 🔑 Important Environment Variables

All variables are already in `.env`:

```
DATABASE_URL=postgresql://... (Neon)
CLOUDINARY_CLOUD_NAME=dn2rjd2fq
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NVIDIA_API_KEY=... (for AI descriptions)
```

## 🛠️ Common Tasks

### Add a New Product

1. Login as admin
2. Create product via API (POST /api/products)
3. Or use admin panel (not built yet - good enhancement!)

### View Database

```bash
# Connect via psql or web interface
# Database: neondb
# Check out the tables: products, users, orders, reviews, etc.
```

### Modify Styling

Edit `src/style.css` or component styles. Tailwind classes are used throughout.

### Change Database

1. Update DATABASE_URL in `.env`
2. Run `npm run db:init` again

## 🐛 Troubleshooting

### Port 5173 or 5000 already in use?

```bash
# Change in vite.config.js (port 5173)
# Or change in server/index.js (port 5000)
```

### Database connection error?

```bash
# Check .env has DATABASE_URL
# Ensure internet connection (Neon requires it)
# Verify credentials are correct
```

### npm modules not found?

```bash
# Delete node_modules
rm -rf node_modules server/node_modules
# Reinstall
npm install
cd server && npm install && cd ..
```

### Styling not showing?

```bash
# Restart dev server - Tailwind needs rebuild
npm run dev
```

## 📚 Learn More

See `ECOMMERCE_README.md` for:

- Complete feature list
- Full API documentation
- Project structure explanation
- Deployment guides
- Future enhancement ideas

## ✨ Next Steps

### To Enhance Further:

1. Add admin dashboard for managing products
2. Implement actual payment gateway (Stripe)
3. Add email notifications for orders
4. Create wishlist feature
5. Add product search
6. Implement inventory alerts
7. Add customer support chat

### To Deploy:

1. Frontend → Vercel
2. Backend → Railway or Render
3. Database → Already on Neon (no changes needed)
4. Images → Already on Cloudinary (no changes needed)

## 🎉 You're All Set!

Your complete ecommerce platform is ready to use!

**Questions?** Check:

1. Browser console for errors (F12)
2. Terminal for server errors
3. ECOMMERCE_README.md for documentation
4. Code comments in files

**Happy selling!** 🚀
