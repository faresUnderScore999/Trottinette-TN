# Trottinette Tunisie Ecommerce Platform

A complete, modern ecommerce website for selling electric scooters and accessories in Tunisia, built with Vue 3, Node.js/Express, and PostgreSQL.

## Features

### Customer Features

- **Product Catalog**: Browse products by category with filtering and sorting
- **Product Details**: View detailed product information, specifications, and customer reviews
- **Shopping Cart**: Add/remove items, adjust quantities
- **User Authentication**: Register and login with email/password
- **Checkout**: Complete order with shipping information and payment method selection
- **Order History**: Track your orders
- **Product Reviews**: Leave ratings and reviews for products
- **User Profile**: Manage personal information and addresses

### Admin Features

- **Product Management**: Create, update, and delete products
- **AI-Powered Descriptions**: Auto-generate product descriptions using Nvidia AI
- **Category Management**: Organize products into categories
- **Admin Dashboard**: Access to admin panel (dashboard route to be created)

### Technical Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Cart Sync**: Cart updates in real-time across the app
- **Secure Authentication**: JWT-based authentication system
- **Image Hosting**: Cloudinary integration for product images
- **Database**: PostgreSQL with Neon hosting
- **API-First Architecture**: Clean separation between frontend and backend

## Tech Stack

### Frontend

- **Vue 3** (Latest beta)
- **Vue Router** 5.1.0 - Routing
- **Pinia** 3.0.4 - State management
- **Axios** - HTTP client
- **Tailwind CSS** 3.4.1 - Styling
- **Vite** 8.0.16 - Build tool

### Backend

- **Node.js** 22.18.0+ with ES6 modules
- **Express** 4.21.2 - Web framework
- **PostgreSQL** (Neon) - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting
- **Nvidia AI API** - Product description generation

## Project Structure

```
trottinette-tn/
├── src/
│   ├── pages/
│   │   ├── Home.vue              # Homepage with featured products
│   │   ├── Products.vue          # Products listing with filters
│   │   ├── ProductDetail.vue     # Product details with reviews
│   │   ├── Auth.vue              # Login/Register page
│   │   ├── Cart.vue              # Shopping cart
│   │   └── Checkout.vue          # Checkout page
│   ├── services/
│   │   └── api.js                # API client and endpoints
│   ├── stores/
│   │   └── ecommerce.js          # Pinia stores (auth, cart, orders)
│   ├── router/
│   │   └── index.js              # Vue Router configuration
│   ├── App.vue                   # Main app component with navigation
│   ├── main.js                   # App entry point
│   └── style.css                 # Tailwind CSS imports
├── server/
│   ├── index.js                  # Express app with all API routes
│   ├── db.js                     # PostgreSQL connection
│   ├── auth.js                   # JWT and auth middleware
│   ├── ai.js                     # Nvidia AI integration
│   ├── init-db.js                # Database setup and seeding
│   └── package.json              # Server dependencies
├── public/                       # Static assets
├── tailwind.config.js            # Tailwind CSS config
├── postcss.config.js             # PostCSS config
├── vite.config.js                # Vite config
├── jsconfig.json                 # JavaScript config
├── .env                          # Environment variables (included in repo for demo)
└── README.md                     # This file
```

## Installation & Setup

### Prerequisites

- Node.js 22.18.0 or higher
- npm 10.x or higher
- PostgreSQL 14+ (we use Neon - serverless PostgreSQL)

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..
```

### 2. Database Setup

The database credentials are in `.env` file. Initialize the database:

```bash
cd server
npm run db:init
cd ..
```

This will:

- Create all necessary tables (categories, products, users, orders, reviews, etc.)
- Seed sample data (categories, products, demo users)

### 3. Run the Application

**Terminal 1 - Backend Server:**

```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend Development Server:**

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

Visit `http://localhost:5173` in your browser!

## Demo Credentials

### Customer Account

- **Email**: customer@example.com
- **Password**: password123

### Admin Account

- **Email**: admin@example.com
- **Password**: password123

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products

- `GET /api/categories` - List all categories
- `GET /api/products?category=slug` - List products (optionally filtered by category)
- `GET /api/products/:slug` - Get product details
- `POST /api/products` (Admin) - Create product
- `PUT /api/products/:id` (Admin) - Update product
- `DELETE /api/products/:id` (Admin) - Delete product

### Shopping Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders

- `POST /api/orders` - Create order from cart
- `GET /api/orders` - List user's orders
- `GET /api/orders/:orderId` - Get order details

### Reviews

- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Create review (requires auth)

### User Profile

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### AI Features

- `POST /api/ai/generate-description` - Generate product description

## Environment Variables

The `.env` file contains:

```
CLOUDINARY_CLOUD_NAME=dn2rjd2fq
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
DATABASE_URL=postgresql://...
NVIDIA_API_KEY=...
RESEND_API_KEY=...
OAUTH_GOOGLE_CLIENT_ID=...
OAUTH_GOOGLE_CLIENT_SECRET=...
JWT_SECRET=your-secret-key-change-this
```

## Building for Production

### Frontend Build

```bash
npm run build
# Output in dist/ directory
```

### Backend

Ensure all dependencies are installed and environment variables are set correctly.

## Development Commands

### Frontend

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:unit` - Run unit tests
- `npm run lint` - Run linting
- `npm run format` - Format code with Prettier

### Backend

- `npm start` - Start server (from server/ directory)
- `npm run db:init` - Initialize and seed database

## File Structure Explanation

### Pages Components

Each page is a complete Vue component handling a specific route:

- **Home.vue**: Landing page with hero, categories, featured products
- **Products.vue**: Product listing with filters (category, price) and sorting
- **ProductDetail.vue**: Full product details with specs, reviews, rating
- **Auth.vue**: Dual-purpose component for login and registration
- **Cart.vue**: Shopping cart management with item quantities
- **Checkout.vue**: Order finalization with shipping and payment info

### Services & Stores

- **api.js**: Axios instance with all API endpoints organized by feature
- **ecommerce.js**: Pinia stores for:
  - `useAuthStore`: User authentication and profile
  - `useCartStore`: Shopping cart management
  - `useOrderStore`: Order management

### App Component

- **App.vue**: Main layout with:
  - Header navigation with search and categories
  - User menu (profile, orders, logout)
  - Cart icon with item count
  - Footer with links and info
  - Route view for page content

## Key Features Implementation

### Authentication Flow

1. User registers/logs in via Auth.vue
2. Credentials sent to `/api/auth/login` or `/api/auth/register`
3. Server returns JWT token and user data
4. Token stored in localStorage
5. Axios interceptor adds token to all requests
6. Protected routes redirect to login if not authenticated

### Shopping Cart Flow

1. Browse products
2. Click "Add to Cart" - adds to cart store and database
3. View cart at `/cart` - shows all items with quantities
4. Adjust quantities or remove items
5. Proceed to checkout
6. Fill shipping info and select payment method
7. Create order - cart cleared, order created, stock updated

### Product Reviews

1. View product details
2. See existing reviews from other users
3. If logged in, submit own review with rating and comment
4. Review appears immediately (with refresh)
5. Average rating calculated from all reviews

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Authorization**: Admin-only routes protected with role check
- **CORS**: Configured for development
- **SQL Injection Prevention**: Parameterized queries with pg library

## Known Limitations & Future Enhancements

### Current Limitations

- Payment processing is order creation only (no actual payment gateway)
- No email notifications
- No inventory management dashboard
- No user roles/permissions system (just admin flag)
- No search functionality
- No product recommendations

### Future Enhancements

- [ ] Stripe payment integration
- [ ] Email notifications for orders
- [ ] Wishlist functionality
- [ ] Product comparison
- [ ] Advanced search with full-text search
- [ ] Admin dashboard with analytics
- [ ] Inventory alerts
- [ ] Customer service chat
- [ ] Social login (Google OAuth setup partially ready)
- [ ] Multi-language support

## Troubleshooting

### Database Connection Issues

If getting database connection errors:

1. Check `.env` has correct DATABASE_URL
2. Verify internet connection (Neon requires it)
3. Check database is not locked/busy

### Port Already in Use

If port 5173 (frontend) or 5000 (backend) is in use:

```bash
# Change vite port in vite.config.js
# Change backend port in server/index.js
```

### Module Not Found

If getting module errors:

1. Run `npm install` in project root
2. Run `npm install` in server folder
3. Clear node_modules and reinstall if issues persist

### Authentication Not Working

1. Ensure JWT_SECRET is set in .env
2. Check token is being stored in localStorage
3. Verify Authorization header is being sent

## Performance Optimization Tips

1. **Image Optimization**: Products use Cloudinary for optimized delivery
2. **Lazy Loading**: Implement Vue Router lazy loading for routes
3. **API Caching**: Add response caching for product lists
4. **Database Indexes**: Ensure database has indexes on frequently queried columns

## Deployment

### Vercel (Frontend)

```bash
npm run build
# Connect GitHub repo to Vercel
```

### Railway/Render (Backend)

```bash
# Deploy server with DATABASE_URL and other env vars
# Set PORT environment variable
npm start
```

## License

MIT License - feel free to use and modify!

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review the code comments
3. Check browser console for errors
4. Check server logs for API errors

---

**Created**: June 2024
**Version**: 1.0.0
**Status**: Production Ready
