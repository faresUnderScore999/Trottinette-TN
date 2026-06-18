import db from './db.js'
import bcrypt from 'bcryptjs'

const ddl = `
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url TEXT,
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  shipping_address TEXT,
  shipping_city VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(100),
  stripe_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`

const seedData = async () => {
  const categories = [
    { name: 'Electric Scooters', slug: 'electric-scooters' },
    { name: 'Batteries', slug: 'batteries' },
    { name: 'Spare Parts', slug: 'spare-parts' },
    { name: 'Accessories', slug: 'accessories' },
  ]

  for (const cat of categories) {
    await db.query(
      'INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING',
      [cat.name, cat.slug],
    )
  }

  // Get category IDs
  const { rows: catRows } = await db.query('SELECT id, slug FROM categories')
  const catMap = catRows.reduce((acc, row) => ({ ...acc, [row.slug]: row.id }), {})

  const products = [
    {
      category_id: catMap['electric-scooters'],
      name: 'Xiaomi Mi Pro 2',
      slug: 'xiaomi-mi-pro-2',
      description: 'The ultimate electric scooter with 45km range and 25km/h top speed.',
      price: 599.99,
      stock: 10,
      image_url:
        'https://res.cloudinary.com/dn2rjd2fq/image/upload/v1740050000/scooter_placeholder.png',
      specs: JSON.stringify({ range: '45km', speed: '25km/h', motor: '300W' }),
    },
    {
      category_id: catMap['electric-scooters'],
      name: 'Ninebot by Segway MAX',
      slug: 'ninebot-segway-max',
      description: 'High-performance scooter with 65km range and dual suspension system.',
      price: 799.99,
      stock: 8,
      image_url:
        'https://res.cloudinary.com/dn2rjd2fq/image/upload/v1740050000/scooter_ninebot.png',
      specs: JSON.stringify({ range: '65km', speed: '25km/h', motor: '800W' }),
    },
    {
      category_id: catMap['batteries'],
      name: 'Replacement Battery for Xiaomi Pro',
      slug: 'battery-xiaomi-pro',
      description: 'Genuine replacement battery for Xiaomi Mi Pro models.',
      price: 189.99,
      stock: 15,
      image_url:
        'https://res.cloudinary.com/dn2rjd2fq/image/upload/v1740050000/battery_placeholder.png',
      specs: JSON.stringify({ capacity: '12800mAh', voltage: '36V' }),
    },
    {
      category_id: catMap['batteries'],
      name: 'Extended Battery Pack',
      slug: 'extended-battery-pack',
      description: 'High capacity battery pack for extended range up to 100km.',
      price: 299.99,
      stock: 5,
      image_url:
        'https://res.cloudinary.com/dn2rjd2fq/image/upload/v1740050000/battery_extended.png',
      specs: JSON.stringify({ capacity: '20000mAh', voltage: '36V' }),
    },
    {
      category_id: catMap['spare-parts'],
      name: 'Replacement Tire',
      slug: 'replacement-tire',
      description: 'Durable replacement tire compatible with most scooter models.',
      price: 49.99,
      stock: 20,
      image_url: 'https://res.cloudinary.com/dn2rjd2fq/image/upload/v1740050000/tire.png',
      specs: JSON.stringify({ size: '8.5 inch', material: 'Solid Rubber' }),
    },
    {
      category_id: catMap['spare-parts'],
      name: 'Brake Pads Set',
      slug: 'brake-pads-set',
      description: 'High-quality brake pads for improved stopping power.',
      price: 34.99,
      stock: 30,
      image_url: 'https://res.cloudinary.com/dn2rjd2fq/image/upload/v1740050000/brake_pads.png',
      specs: JSON.stringify({ type: 'Ceramic', lifespan: '2000km' }),
    },
    {
      category_id: catMap['accessories'],
      name: 'Xiaomi Scooter Lock',
      slug: 'xiaomi-scooter-lock',
      description: 'Heavy duty lock to keep your scooter safe.',
      price: 24.99,
      stock: 40,
      image_url:
        'https://res.cloudinary.com/dn2rjd2fq/image/upload/v1740050000/lock_placeholder.png',
      specs: JSON.stringify({ material: 'Steel', weight: '800g' }),
    },
    {
      category_id: catMap['accessories'],
      name: 'LED Light Set',
      slug: 'led-light-set',
      description: 'Bright LED front and rear lights for night safety.',
      price: 39.99,
      stock: 25,
      image_url: 'https://res.cloudinary.com/dn2rjd2fq/image/upload/v1740050000/lights.png',
      specs: JSON.stringify({ brightness: '200 Lumens', battery: 'Rechargeable' }),
    },
    {
      category_id: catMap['accessories'],
      name: 'Phone Mount Holder',
      slug: 'phone-mount-holder',
      description: 'Secure phone mount for navigation and app access while riding.',
      price: 19.99,
      stock: 50,
      image_url: 'https://res.cloudinary.com/dn2rjd2fq/image/upload/v1740050000/phone_mount.png',
      specs: JSON.stringify({ compatibility: 'Universal', material: 'Aluminum' }),
    },
    {
      category_id: catMap['accessories'],
      name: 'Protective Helmet',
      slug: 'protective-helmet',
      description: 'Safety helmet with ventilation and adjustable fit.',
      price: 89.99,
      stock: 15,
      image_url: 'https://res.cloudinary.com/dn2rjd2fq/image/upload/v1740050000/helmet.png',
      specs: JSON.stringify({ size: 'One Size Fits All', material: 'EPS Foam' }),
    },
  ]

  for (const prod of products) {
    await db.query(
      'INSERT INTO products (category_id, name, slug, description, price, stock, image_url, specs) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (slug) DO NOTHING',
      [
        prod.category_id,
        prod.name,
        prod.slug,
        prod.description,
        prod.price,
        prod.stock,
        prod.image_url,
        prod.specs,
      ],
    )
  }

  // Seed sample users
  const hashedPassword = await bcrypt.hash('password123', 10)
  const users = [
    {
      email: 'customer@example.com',
      password: hashedPassword,
      first_name: 'Ahmed',
      last_name: 'Ben',
      phone: '+216 90 000 000',
      address: '123 Rue de la Paix',
      city: 'Tunis',
      postal_code: '1000',
      country: 'Tunisia',
      is_admin: false,
    },
    {
      email: 'admin@example.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      phone: '+216 90 111 111',
      address: '456 Rue du Commerce',
      city: 'Tunis',
      postal_code: '1000',
      country: 'Tunisia',
      is_admin: true,
    },
  ]

  for (const user of users) {
    await db.query(
      'INSERT INTO users (email, password, first_name, last_name, phone, address, city, postal_code, country, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (email) DO NOTHING',
      [
        user.email,
        user.password,
        user.first_name,
        user.last_name,
        user.phone,
        user.address,
        user.city,
        user.postal_code,
        user.country,
        user.is_admin,
      ],
    )
  }
}

const init = async () => {
  try {
    console.log('Initializing database tables...')

    // Split DDL by semicolon and execute each statement separately
    const statements = ddl.split(';').filter((stmt) => stmt.trim())
    for (const stmt of statements) {
      await db.query(stmt.trim())
    }

    console.log('Tables created.')

    console.log('Seeding initial data...')
    await seedData()
    console.log('Seeding complete.')

    console.log('✅ Database initialized successfully!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message)
    process.exit(1)
  }
}

init()
