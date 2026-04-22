import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "srm_fashions_secret_key_123";
const DB_PATH = path.join(__dirname, "data");

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: "Men's Collection", slug: 'men', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop', description: 'Refined elegance for the modern man.' },
  { id: 'cat-2', name: "Women's Collection", slug: 'women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop', description: 'Ethereal designs for every occasion.' },
  { id: 'cat-3', name: "Kids' Collection", slug: 'kids', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop', description: 'Style and comfort for the little ones.' },
  { id: 'cat-4', name: "Home Decor", slug: 'home', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop', description: 'Elevate your living space.' }
];

const INITIAL_PRODUCTS = [
  { 
    id: 'm1', 
    name: 'Atelier Silk-Linen Blazer', 
    price: 8999, 
    description: 'A masterpiece of tailoring. This blazer merges the structural integrity of linen with the ethereal shine of silk. Part of our High-Function collection.', 
    image: 'https://images.unsplash.com/photo-1594932224010-75f43048ec1b?q=80&w=2000&auto=format&fit=crop', 
    images: [
      'https://images.unsplash.com/photo-1594932224010-75f43048ec1b?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=2000&auto=format&fit=crop', // Model Wear 1
      'https://images.unsplash.com/photo-1519748771451-a94c59ad3a75?q=80&w=2000&auto=format&fit=crop'  // Model Wear 2
    ],
    video: 'https://cdn.pixabay.com/video/2016/09/13/5103-181554522_tiny.mp4',
    category: 'men', 
    isSale: true, 
    originalPrice: 12999,
    stock: 8,
    fabric: '60% Organic Linen, 40% Mulberry Silk',
    care: 'Professional Dry Clean only.',
    sizeGuide: 'Tailored architectural fit. Suggested to size up for layering.',
    dimensions: { h: 75, w: 52, d: 2 },
    sizes: ['38R', '40R', '42R', '44R', '46R'],
    demoWear: 'Model is 6\'1" wearing size 40R'
  },
  { 
    id: 'm2', 
    name: 'Botanical Print Oxford', 
    price: 3499, 
    description: 'Crafted from long-staple Egyptian cotton, featuring a subtle tone-on-tone botanical motif. A signature piece of SRM aesthetics.', 
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=2000&auto=format&fit=crop', 
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620012253295-c05718565a62?q=80&w=2000&auto=format&fit=crop'
    ],
    category: 'men', 
    stock: 15,
    fabric: '100% Egyptian Cotton',
    care: 'Gentle Machine Wash',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    demoWear: 'Model is 5\'11" wearing size M'
  },
  { 
    id: 'w1', 
    name: 'Silk Wrap Dress', 
    price: 3499, 
    description: 'Effortlessly feminine, this silk wrap dress features a flattering silhouette and a subtle sheen. Ideal for evening dinners and celebrations.', 
    image: 'https://images.unsplash.com/photo-1539109132382-361bd57557d8?q=80&w=1974&auto=format&fit=crop', 
    images: [
      'https://images.unsplash.com/photo-1539109132382-361bd57557d8?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1974&auto=format&fit=crop'
    ],
    video: 'https://cdn.pixabay.com/video/2016/09/13/5103-181554522_tiny.mp4',
    category: 'women',
    stock: 2,
    fabric: 'Pure Mulberry Silk',
    care: 'Hand wash cold or dry clean.',
    sizeGuide: 'Adjustable wrap fit.',
    sizes: ['XS', 'S', 'M', 'L']
  },
  { 
    id: 'k1', 
    name: 'Organic Cotton Romper', 
    price: 899, 
    description: 'Ultra-soft organic cotton romper designed for maximum comfort. Breathable and gentle on baby sensitive skin.', 
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=1974&auto=format&fit=crop', 
    category: 'kids',
    stock: 15,
    fabric: 'GOTS Certified Organic Cotton',
    care: 'Machine wash warm.',
    sizes: ['0-3M', '3-6M', '6-12M']
  },
  { 
    id: 'h1', 
    name: 'Ceramic Taper Vase', 
    price: 1299, 
    description: 'A minimalist ceramic vase with a matte finish. Its sculptural tapering design adds a modern touch to any tabletop or shelf.', 
    image: 'https://images.unsplash.com/photo-1578500494198-246f312ee3b2?q=80&w=2070&auto=format&fit=crop', 
    category: 'home',
    stock: 3,
    dimensions: { h: 30, w: 12, d: 12 },
    weight: '1.2 kg',
    assembly: 'No assembly required.'
  }
];

async function initDB() {
  await fs.mkdir(DB_PATH, { recursive: true });
  const files = [
    { name: "users.json", initial: [] },
    { name: "orders.json", initial: [] },
    { name: "reviews.json", initial: [] },
    { name: "newsletter.json", initial: [] },
    { name: "categories.json", initial: INITIAL_CATEGORIES },
    { name: "products.json", initial: INITIAL_PRODUCTS }
  ];
  for (const file of files) {
    const filePath = path.join(DB_PATH, file.name);
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(file.initial, null, 2));
    }
  }
}

async function readTable(table: string) {
  const data = await fs.readFile(path.join(DB_PATH, `${table}.json`), "utf-8");
  return JSON.parse(data);
}

async function writeTable(table: string, data: any) {
  await fs.writeFile(path.join(DB_PATH, `${table}.json`), JSON.stringify(data, null, 2));
}

async function startServer() {
  await initDB();
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());
  
  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Vite handles this in dev; disable for simpler CSP in this demo
    crossOriginEmbedderPolicy: false
  }));

  // Rate Limiting for Auth
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs for auth routes
    message: { error: "Too many login/signup attempts. Please try again in 15 minutes." }
  });

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: "Admin access required" });
    }
  };

  // Public Routes
  app.get("/api/categories", async (req, res) => {
    const categories = await readTable("categories");
    res.json(categories);
  });

  app.get("/api/products", async (req, res) => {
    const products = await readTable("products");
    res.json(products);
  });

  // Auth Routes
  app.post("/api/auth/signup", authLimiter, async (req, res) => {
    const { name, email, password } = req.body;
    const users = await readTable("users");
    if (users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Make first user admin OR the specific owner email
    const role = (users.length === 0 || email === 'madhavan2006sakthi@gmail.com') ? 'admin' : 'user';
    const newUser = { id: Date.now().toString(), name, email, password: hashedPassword, role };
    users.push(newUser);
    await writeTable("users", users);
    
    const token = jwt.sign({ id: newUser.id, name, email, role }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true });
    res.json({ id: newUser.id, name, email, role });
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    const { email, password } = req.body;
    const users = await readTable("users");
    const user = users.find((u: any) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    
    const role = (user.email === 'madhavan2006sakthi@gmail.com') ? 'admin' : user.role;
    
    const token = jwt.sign({ id: user.id, name: user.name, email, role }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true });
    res.json({ id: user.id, name: user.name, email, role });
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    const { email } = req.body;
    const users = await readTable("users");
    const user = users.find((u: any) => u.email === email);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    // In a real app, send actual email. Here we just reset to 'password123'
    user.password = await bcrypt.hash("password123", 10);
    await writeTable("users", users);
    res.json({ message: "Password has been reset to 'password123'. Please login and change it." });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", authenticate, (req: any, res) => {
    res.json(req.user);
  });

  // Orders
  app.get("/api/orders", authenticate, async (req: any, res) => {
    const orders = await readTable("orders");
    if (req.user.role === 'admin') {
      res.json(orders);
    } else {
      const userOrders = orders.filter((o: any) => o.userId === req.user.id);
      res.json(userOrders);
    }
  });

  app.post("/api/orders", authenticate, async (req: any, res) => {
    const orders = await readTable("orders");
    const newOrder = {
      ...req.body,
      id: "SRM-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      userId: req.user.id,
      userName: req.user.name,
      date: new Date().toISOString(),
      status: "Processing",
      tracking: [
        { status: "Order Placed", date: new Date().toISOString(), message: "We have received your order." }
      ]
    };
    orders.push(newOrder);
    await writeTable("orders", orders);
    res.json(newOrder);
  });

  app.get("/api/orders/track/:id", async (req, res) => {
    const orders = await readTable("orders");
    const order = orders.find((o: any) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    // Return only necessary tracking info for security
    const { id, status, tracking, items, totalAmount, date } = order;
    res.json({ id, status, tracking, items, totalAmount, date });
  });

  // Admin Routes: Categories
  app.post("/api/admin/categories", authenticate, isAdmin, async (req, res) => {
    const categories = await readTable("categories");
    const newCat = { ...req.body, id: Date.now().toString() };
    categories.push(newCat);
    await writeTable("categories", categories);
    res.json(newCat);
  });

  app.delete("/api/admin/categories/:id", authenticate, isAdmin, async (req, res) => {
    let categories = await readTable("categories");
    categories = categories.filter((c: any) => c.id !== req.params.id);
    await writeTable("categories", categories);
    res.json({ success: true });
  });

  // Admin Routes: Products
  app.post("/api/admin/products", authenticate, isAdmin, async (req, res) => {
    const products = await readTable("products");
    const newProd = { ...req.body, id: Date.now().toString() };
    products.push(newProd);
    await writeTable("products", products);
    res.json(newProd);
  });

  app.put("/api/admin/products/:id", authenticate, isAdmin, async (req, res) => {
    const products = await readTable("products");
    const idx = products.findIndex((p: any) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Product not found" });
    products[idx] = { ...products[idx], ...req.body };
    await writeTable("products", products);
    res.json(products[idx]);
  });

  app.delete("/api/admin/products/:id", authenticate, isAdmin, async (req, res) => {
    let products = await readTable("products");
    products = products.filter((p: any) => p.id !== req.params.id);
    await writeTable("products", products);
    res.json({ success: true });
  });

  // Admin Routes: Orders
  app.patch("/api/admin/orders/:id/status", authenticate, isAdmin, async (req, res) => {
    const { status, message } = req.body;
    const orders = await readTable("orders");
    const order = orders.find((o: any) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    order.status = status;
    order.tracking.push({
      status,
      date: new Date().toISOString(),
      message: message || `Order status updated to ${status}`
    });
    
    await writeTable("orders", orders);
    res.json(order);
  });

  app.get("/api/reviews/:productId", async (req, res) => {
    const reviews = await readTable("reviews");
    const productReviews = reviews.filter((r: any) => r.productId === req.params.productId);
    res.json(productReviews);
  });

  app.post("/api/reviews", authenticate, async (req: any, res) => {
    const { productId, rating, comment } = req.body;
    const reviews = await readTable("reviews");
    const newReview = {
      id: Date.now().toString(),
      productId,
      userId: req.user.id,
      userName: req.user.name,
      rating,
      comment,
      date: new Date().toISOString()
    };
    reviews.push(newReview);
    await writeTable("reviews", reviews);
    res.json(newReview);
  });

  // Newsletter & Marketing
  app.post("/api/newsletter/subscribe", async (req, res) => {
    const { email } = req.body;
    const subscribers = await readTable("newsletter");
    if (subscribers.find((s: any) => s.email === email)) {
      return res.status(400).json({ error: "Already subscribed to SRM Archives" });
    }
    subscribers.push({ email, date: new Date().toISOString() });
    await writeTable("newsletter", subscribers);
    res.json({ success: true, message: "Welcome to the Inner Circle. Expect nature-led excellence in your inbox." });
  });

  app.post("/api/admin/marketing/blast", authenticate, isAdmin, async (req, res) => {
    const { subject, message } = req.body;
    const subscribers = await readTable("newsletter");
    // In a real app, integrate with SendGrid/Resend here
    console.log(`[MARKETING BLAST] From: SRM FASHIONS, To: ${subscribers.length} subs, Subject: ${subject}`);
    res.json({ success: true, count: subscribers.length });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
