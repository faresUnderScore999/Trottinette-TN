# Admin Panel - Quick Setup Guide

## ✅ What's Been Created

Your complete admin panel is now ready! Here's what you can do:

### 1. **Admin Dashboard** (`/admin`)

- View key statistics (total products, orders, users, low stock items)
- Quick access to product management
- Recent products overview
- Dashboard cards showing system status

### 2. **Product Management** (`/admin/products`)

Complete CRUD operations for products:

#### **Create Products**

- Fill form with product details
- Upload image directly from your computer
- Image automatically uploaded to Cloudinary
- Add product specifications as JSON
- Click "Create Product" to save

#### **Edit Products**

- View all products in a table
- Click "Edit" button on any product
- Modify any field
- Upload new image if needed
- Click "Update Product" to save changes

#### **Delete Products**

- Click "Delete" button on any product
- Confirm deletion
- Product immediately removed from database

#### **Image Upload**

- Supports multiple image uploads (one per product in this version)
- Automatically uploads to Cloudinary
- Images served with CDN optimization
- No storage needed on your server

## 🔐 Access Control

**Admin Panel is protected!**

- Only users with `is_admin = true` can access
- Automatically redirects non-admins to home page
- Demo admin account: `admin@example.com / password123`

## 📋 API Endpoints Added

### Image Upload

```
POST /api/upload
Headers: Authorization: Bearer <token>
Body: { image: "<base64-string>" }
Response: { url: "https://...", public_id: "..." }
```

## 🚀 How to Use

### Step 1: Login as Admin

1. Go to http://localhost:5173/login
2. Enter: `admin@example.com` / `password123`
3. Click Login

### Step 2: Access Admin Panel

1. Click your user menu (top right)
2. Click "Admin Panel"
3. You'll see the admin dashboard

### Step 3: Create a Product

1. Click "Product Management" card OR go to `/admin/products`
2. Fill in product details:
   - Category (select from dropdown)
   - Product Name
   - Price
   - Stock Quantity
   - Description (optional)
   - Specifications (JSON format, optional)
3. Click "Click to upload image" to select an image
4. Image will upload to Cloudinary automatically
5. Click "Create Product"
6. Product appears in table below

### Step 4: Edit Products

1. Find product in the table
2. Click "Edit" button
3. Modify any field
4. Click "Update Product"

### Step 5: Delete Products

1. Find product in the table
2. Click "Delete" button
3. Confirm deletion

## 📸 Image Upload Details

- **Location**: Cloudinary folder: `trottinette-tn`
- **Supported Formats**: JPEG, PNG, GIF, WebP, etc.
- **Size Limit**: Up to 100MB
- **Automatic Optimization**: Images are automatically optimized for web
- **CDN**: Fast delivery worldwide via Cloudinary CDN

## 🎨 Specifications Format

You can add specifications as JSON. Example:

```json
{
  "range": "45km",
  "speed": "25km/h",
  "motor": "300W",
  "battery": "36V",
  "weight": "12kg"
}
```

These specifications display on the product detail page.

## 📊 Admin Dashboard Cards

### Total Products

- Shows total number of products in system
- Updates when you create/delete products

### Total Orders

- Shows number of orders placed
- Will update when customers place orders

### Total Users

- Shows registered user count
- Includes admin users

### Low Stock Items

- Products with stock < 5
- Warning indicator to reorder

## 🔧 Technical Details

### Frontend Components

- `Admin.vue` - Dashboard page
- `AdminProducts.vue` - Product CRUD interface
- `api.js` - Updated with `uploadAPI.uploadImage()` function
- `router/index.js` - Added `/admin` and `/admin/products` routes

### Backend Updates

- `server/index.js` - Added `/api/upload` endpoint
- Cloudinary integration for image handling
- Admin authorization checks on all endpoints

### Database

- No schema changes needed
- Uses existing products table
- Supports JSONB specs field

## ⚠️ Important Notes

1. **Authentication Required**
   - Only admins can create/edit/delete products
   - Only admins can upload images

2. **Image Upload**
   - Images are sent as base64 to backend
   - Backend uploads to Cloudinary
   - URL is returned and saved to database

3. **Validation**
   - Name, Price, Stock, Category are required
   - Price and Stock must be numbers
   - Specifications must be valid JSON (if provided)

4. **Product Slug**
   - Automatically generated from product name
   - Includes random number to avoid duplicates
   - Used in product URLs

## 🐛 Troubleshooting

### Image Upload Fails

- Check Cloudinary credentials in `.env`
- Check image file format
- Ensure image file is not corrupted

### Can't Access Admin Panel

- Verify you're logged in as admin account
- Check if `is_admin` field is `true` in database
- Try `admin@example.com` account

### Products Not Saving

- Check browser console for errors
- Check server logs
- Verify all required fields are filled

### Images Not Showing

- Check Cloudinary URL is valid
- Verify Cloudinary is properly configured
- Try clearing browser cache

## 🎯 Next Steps

1. **Test the admin panel** with sample products
2. **Customize** product categories if needed
3. **Add more** admin features as needed
4. **Deploy** to production (remember to update Cloudinary credentials)

## 📚 For Future Enhancements

Already built for easy expansion:

- Add category management page
- Add bulk product upload
- Add order management
- Add inventory alerts
- Add analytics dashboard
- Add product reviews management

---

**Your admin panel is ready to use!** 🎉

Just login with `admin@example.com` and start managing your products!
