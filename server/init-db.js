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
    { name: 'Pièces Electroniques', slug: 'pieces-electroniques' },
    { name: 'Accessoires de Roues', slug: 'accessoires-de-roues' },
    { name: 'Accessoires de Freinage', slug: 'accessoires-de-freinage' },
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
      category_id: catMap['pieces-electroniques'],
      name: 'Carte Mère Contrôleur renforcé V3 Xiaomi M365',
      slug: 'carte-mere-controleur-renforce-v3-xiaomi-m365',
      description:
        'Contrôleur renforcé V3 compatible Xiaomi M365, M365 Pro, Pro 2, Pro 3, 1S, Essential.',
      price: 200.0,
      stock: 0,
      image_url:
        'https://souilah-electronique.tn/3272-home_default/carte-mere-controleur-renforce-v3-xiaomi-m365-m365-pro-pro-2-pro-3-1s-essential.jpg',
      specs: JSON.stringify({
        compatibility: 'Xiaomi M365 / Pro / Pro 2 / Pro 3 / 1S / Essential',
        version: 'V3 renforcé',
      }),
    },
    {
      category_id: catMap['pieces-electroniques'],
      name: 'Régulateur de vitesse pour moteur sans balais 24-60V 1-20A',
      slug: 'regulation-vitesse-moteur-sans-balais-24-60v',
      description: 'Contrôleur de vitesse pour moteur sans balais 24 / 36 / 48 / 52 / 60V 1-20A.',
      price: 99.0,
      stock: 3,
      image_url:
        'https://souilah-electronique.tn/3268-home_default/contoleur-de-vitesse-pour-moteur-sans-balais-24-a-60v-1-20a.jpg',
      specs: JSON.stringify({ voltage: '24-60V', current: '1-20A', type: 'Moteur sans balais' }),
    },
    {
      category_id: catMap['pieces-electroniques'],
      name: 'Kit Contrôleur de Vitesse 60V 500W 25A avec Afficheur',
      slug: 'kit-controleur-vitesse-60v-500w-25a-afficheur',
      description:
        'Kit contrôleur de vitesse pour moteur sans balais 60V 500W 25A avec afficheur pour trottinette électrique.',
      price: 230.0,
      stock: 0,
      image_url:
        'https://souilah-electronique.tn/3269-home_default/controleur-de-vitesse-pour-moteur-sans-balais-60v-500w-25a-avec-afficheur.jpg',
      specs: JSON.stringify({ voltage: '60V', power: '500W', current: '25A', display: 'Oui' }),
    },
    {
      category_id: catMap['pieces-electroniques'],
      name: 'Kit Contrôleur de Vitesse 52V 500W 25A avec Afficheur',
      slug: 'kit-controleur-vitesse-52v-500w-25a-afficheur',
      description:
        'Kit contrôleur de vitesse pour moteur sans balais 52V 500W 25A avec afficheur pour trottinette électrique.',
      price: 230.0,
      stock: 1,
      image_url:
        'https://souilah-electronique.tn/3270-home_default/controleur-de-vitesse-pour-moteur-sans-balais-52v-500w-25a-avec-afficheur-pour-trottinette-electrique.jpg',
      specs: JSON.stringify({ voltage: '52V', power: '500W', current: '25A', display: 'Oui' }),
    },
    {
      category_id: catMap['pieces-electroniques'],
      name: "Kit Contrôleur d'accélérateur 6 Pines 48V 25A TF-100",
      slug: 'kit-controleur-accelerateur-6pines-48v-25a-tf100',
      description:
        "Kit contrôleur d'accélérateur 6 pines 48V 25A TF-100 pour trottinette électrique.",
      price: 230.0,
      stock: 1,
      image_url:
        'https://souilah-electronique.tn/3273-home_default/kit-controleur-d-accelerateur-6-pines-48v-25a-tf-100-pour-trottinette-electrique.jpg',
      specs: JSON.stringify({ pins: '6', voltage: '48V', current: '25A', model: 'TF-100' }),
    },
    {
      category_id: catMap['pieces-electroniques'],
      name: 'Carte BMS Contrôleur Batterie pour Xiaomi M365',
      slug: 'carte-bms-controleur-batterie-xiaomi-m365',
      description: 'Carte BMS contrôleur batterie pour trottinette électrique Xiaomi M365.',
      price: 155.0,
      stock: 2,
      image_url:
        'https://souilah-electronique.tn/3271-home_default/carte-bms-controleur-batterie-pour-trottinette-electrique-xiaomi-m365.jpg',
      specs: JSON.stringify({
        compatibility: 'Xiaomi M365',
        type: 'BMS',
        function: 'Contrôle batterie',
      }),
    },
    {
      category_id: catMap['pieces-electroniques'],
      name: 'Kit de remplacement pour trottinette électrique Xiaomi M365 350W',
      slug: 'kit-remplacement-xiaomi-m365-350w',
      description: 'Kit de remplacement pour trottinette électrique Xiaomi M365 350W.',
      price: 240.0,
      stock: 2,
      image_url:
        'https://souilah-electronique.tn/3359-home_default/kit-de-remplacement-pour-trottinette-electrique-xiaomi-m365-350w.jpg',
      specs: JSON.stringify({
        compatibility: 'Xiaomi M365',
        power: '350W',
        type: 'Kit de remplacement',
      }),
    },
    {
      category_id: catMap['pieces-electroniques'],
      name: "Kit Contrôleur d'accélérateur 5PIN 36V 16A TF-100",
      slug: 'kit-controleur-accelerateur-5pin-36v-16a-tf100',
      description: "Kit TF100 36V contrôleur d'accélérateur 5PIN 16A pour trottinette électrique.",
      price: 190.0,
      stock: 9,
      image_url:
        'https://souilah-electronique.tn/3751-home_default/kit-controleur-d-accelerateur-5pin-36v-16a-tf-100-pour-trottinette-electrique.jpg',
      specs: JSON.stringify({ pins: '5', voltage: '36V', current: '16A', model: 'TF-100' }),
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
