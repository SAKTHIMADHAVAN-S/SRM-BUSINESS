import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Search, 
  Trash2, 
  CreditCard,
  Plus,
  Minus,
  User as UserIcon,
  LogOut,
  Filter,
  Check,
  Layers,
  ChevronDown,
  Shirt,
  Baby,
  Home as HomeIcon,
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  Play,
  Instagram,
  Facebook,
  Twitter,
  ShieldCheck,
  Lock,
  Globe,
  Truck,
  Sprout,
  Leaf,
  Flower2,
  Printer,
  Download,
  Heart,
  Mail,
  Clock
} from 'lucide-react';
import { api } from './services/api';
import { CartItem, Product, User, Category } from './types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

import { AuthModal } from './components/AuthModal';
import { Invoice } from './components/Invoice';

// Lazy loaded pages
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const ProductPage = lazy(() => import('./pages/ProductPage').then(m => ({ default: m.ProductPage })));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const Account = lazy(() => import('./pages/Account').then(m => ({ default: m.Account })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const WishlistPage = lazy(() => import('./pages/Wishlist').then(m => ({ default: m.Wishlist })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const AboutUs = lazy(() => import('./pages/AboutUs').then(m => ({ default: m.AboutUs })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));

const BrandLogo = ({ className = "", mono = false, size = "md" }: { className?: string, mono?: boolean, size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: { icon: "w-4 h-4", text: "text-xl", sub: "text-[6px]" },
    md: { icon: "w-7 h-7", text: "text-4xl", sub: "text-[9px]" },
    lg: { icon: "w-12 h-12", text: "text-7xl", sub: "text-[16px]" }
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-5 group cursor-pointer ${className}`}>
      <div className="relative">
        <div className={`absolute -inset-2 blur-md rounded-full transition-all duration-700 opacity-0 group-hover:opacity-100 ${mono ? 'bg-white/20' : 'bg-[#4a7c59]/20'}`} />
        <Leaf className={`${s.icon} ${mono ? 'text-white' : 'text-[#4a7c59]'} transition-all duration-1000 group-hover:rotate-[25deg] group-hover:scale-110 relative z-10`} />
      </div>
      <div className="flex flex-col relative">
        <span className={`${s.text} font-black ${mono ? 'text-white' : 'text-[#1a3c34]'} tracking-[-0.1em] uppercase italic leading-[0.7] transition-all group-hover:tracking-normal font-serif select-none`}>
          SRM
        </span>
        <div className="flex items-center gap-2 mt-2">
          <div className={`h-[1px] w-4 ${mono ? 'bg-white/40' : 'bg-[#1a3c34]/40'}`} />
          <span className={`${s.sub} font-black tracking-[0.6em] ${mono ? 'text-white/70' : 'text-[#4a7c59]'} uppercase leading-none italic`}>
            FASHIONS
          </span>
        </div>
      </div>
    </div>
  );
};

const LoadingCircle = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

// Components
const Navbar = ({ 
  cartCount, 
  onOpenCart, 
  user, 
  onOpenAuth, 
  onLogout 
}: { 
  cartCount: number;
  onOpenCart: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const navigate = useNavigate();

  const megaMenuData = {
    men: {
      title: "Men's Collection",
      items: [
        { label: "Formal Blazers", icon: Layers, count: 12 },
        { label: "Linen Shirts", icon: Shirt, count: 24 },
        { label: "Designer Footwear", icon: Zap, count: 18 }
      ],
      promo: { title: "UP TO 40% OFF", subtitle: "Summer Essentials", image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format" }
    },
    women: {
      title: "Women's Collection",
      items: [
        { label: "Silk Dresses", icon: Sparkles, count: 32 },
        { label: "Accessories", icon: Layers, count: 15 },
        { label: "Footwear", icon: Zap, count: 22 }
      ],
      promo: { title: "NEW ARRIVALS", subtitle: "Pure Mulberry Silk", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800&auto=format" }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-nav" onMouseLeave={() => setActiveMega(null)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center gap-16">
            <Link to="/">
              <BrandLogo />
            </Link>
            
            <div className="hidden lg:flex space-x-12 items-center">
              {['MEN', 'WOMEN', 'KIDS', 'HOME'].map(cat => (
                <div 
                  key={cat} 
                  className="relative h-24 flex items-center"
                  onMouseEnter={() => {
                    if (cat === 'MEN' || cat === 'WOMEN') setActiveMega(cat.toLowerCase());
                    else setActiveMega(null);
                  }}
                >
                  <Link 
                    to={`/category/${cat.toLowerCase()}`} 
                    className="flex items-center gap-2 text-[11px] font-black text-[#1a3c34] hover:text-[#4a7c59] tracking-[0.2em] transition-all uppercase"
                  >
                    {cat}
                    {(cat === 'MEN' || cat === 'WOMEN') && <ChevronDown className={`w-3 h-3 transition-transform ${activeMega === cat.toLowerCase() ? 'rotate-180' : ''}`} />}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const q = (e.target as any).search.value;
                navigate(`/search?q=${q}`);
                setIsMenuOpen(false);
              }}
              className="hidden sm:flex relative items-center border-b border-[#1a3c34]/10 py-1 focus-within:border-[#1a3c34] transition-all"
            >
              <Search className="w-4 h-4 mr-3 text-slate-400" />
              <input name="search" type="text" placeholder="EXPLORE..." className="bg-transparent border-none outline-none text-[#1a3c34] w-32 focus:w-48 font-bold text-[10px] tracking-widest transition-all" />
            </form>

            <Link to="/wishlist" className="p-2 hover:opacity-60 transition-opacity relative group" title="Wishlist">
              <Heart className="w-6 h-6 text-[#1a3c34]" />
            </Link>
            
            <button 
              onClick={onOpenCart}
              className="p-2 hover:opacity-60 transition-opacity relative group"
            >
              <ShoppingBag className="w-6 h-6 text-[#1a3c34]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4a7c59] text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full text-white ring-4 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/account" className="text-[10px] font-black tracking-[0.1em] text-[#1a3c34] hover:text-[#4a7c59] transition-colors uppercase py-1 border-b-2 border-transparent hover:border-[#4a7c59]">
                  {user.name.split(' ')[0]}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-[#4a7c59] p-1" title="Owner Management Portal">
                    <ShieldCheck className="w-5 h-5" />
                  </Link>
                )}
                <button onClick={onLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={onOpenAuth} className="hover:opacity-60 transition-opacity">
                <UserIcon className="w-6 h-6 text-[#1a1a1a]" />
              </button>
            )}

            <button 
              className="lg:hidden p-3.5 hover:bg-slate-100 rounded-full transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5 text-[#1a1a1a]" /> : <MenuIcon className="w-5 h-5 text-[#1a1a1a]" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            className="fixed inset-0 bg-[#eef3f0] z-[100] p-12 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-20">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                 <BrandLogo />
              </Link>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-4 bg-white rounded-full shadow-lg"
              >
                <X className="w-6 h-6 text-[#1a3c34]" />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {['MEN', 'WOMEN', 'KIDS', 'HOME'].map(cat => (
                <Link 
                  key={cat} 
                  to={`/category/${cat.toLowerCase()}`} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-5xl font-black text-[#1a3c34] uppercase tracking-tighter italic serif hover:text-[#4a7c59] transition-all"
                >
                  {cat}
                </Link>
              ))}
              <div className="h-px w-full bg-[#1a3c34]/5 my-4" />
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-400">The House Story</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-400">Contact Atelier</Link>
            </div>

            <div className="space-y-6 pt-12 border-t border-[#1a3c34]/5">
               {user ? (
                 <div className="flex flex-col gap-6">
                    <Link to="/account" onClick={() => setIsMenuOpen(false)} className="text-xl font-black text-[#1a3c34] uppercase tracking-tight italic">Account: {user.name}</Link>
                    <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="text-[10px] font-black text-red-500 uppercase tracking-widest text-left">LOGOUT FROM ARCHIVE</button>
                 </div>
               ) : (
                 <button onClick={() => { onOpenAuth(); setIsMenuOpen(false); }} className="w-full bg-[#1a3c34] text-white py-6 rounded-full text-[12px] font-black uppercase tracking-[0.3em] italic">SECURE LOGIN</button>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMega && (megaMenuData as any)[activeMega] && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-0 w-full bg-[#f2ede4] border-b border-black/5 z-40 overflow-hidden shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-12 py-16 grid grid-cols-4 gap-20">
              <div className="col-span-1 space-y-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{(megaMenuData as any)[activeMega].title}</h3>
                <div className="space-y-6">
                  {(megaMenuData as any)[activeMega].items.map((item: any, idx: number) => (
                    <Link 
                      key={idx} 
                      to={`/category/${activeMega}`}
                      className="flex items-center gap-6 group"
                    >
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]">{item.label}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.count} DESIGNS</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-8">
                <div className="aspect-[4/5] rounded-[60px] overflow-hidden relative group">
                  <img src={(megaMenuData as any)[activeMega].promo.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]" loading="lazy" />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
                    <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-2">{(megaMenuData as any)[activeMega].promo.subtitle}</p>
                    <h4 className="text-4xl font-black serif italic leading-tight uppercase">{(megaMenuData as any)[activeMega].promo.title}</h4>
                    <button className="mt-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:translate-x-2 transition-transform">SHOP COLLECTION <ArrowRight className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                   <div className="h-full bg-white rounded-[60px] p-10 flex flex-col justify-between group cursor-pointer hover:bg-black hover:text-white transition-all duration-700">
                      <div className="w-12 h-12 border border-black group-hover:border-white rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black serif uppercase italic tracking-tighter mb-2">SRM Privé</h4>
                        <p className="text-[10px] font-medium leading-relaxed opacity-60">Hand-curated selections based on your unique fashion silhouette.</p>
                      </div>
                   </div>
                   <div className="h-full bg-blue-600 rounded-[60px] p-10 text-white flex flex-col justify-between group overflow-hidden relative">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-[2s]" />
                      <Zap className="w-10 h-10" />
                      <div>
                        <h4 className="text-2xl font-black serif uppercase italic tracking-tighter mb-2">Flash Event</h4>
                        <p className="text-[10px] font-black tracking-widest uppercase opacity-60">EXTENDED FOR 24 HOURS</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="col-span-1 flex flex-col gap-8">
                 <div className="aspect-square bg-white rounded-[60px] p-10 flex flex-col items-center justify-center text-center gap-6 shadow-sm border border-black/5">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest mb-2">Luxury Service</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed italic lowercase">Complimentary express shipping on all orders over ₹10,000.</p>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemove,
  onCheckout
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  cartItems: CartItem[],
  onUpdateQuantity: (id: string, delta: number) => void,
  onRemove: (id: string) => void,
  onCheckout: () => void
}) => {
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-950/60 z-[60] backdrop-blur-md" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed top-0 right-0 w-full sm:w-[420px] h-full bg-white z-[70] shadow-2xl flex flex-col">
            <div className="p-8 flex justify-between items-center border-b border-slate-50">
              <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">BAG</h2>
              <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 opacity-30 italic font-black text-xs uppercase tracking-[0.3em]">Your bag is currently empty</div>
              ) : cartItems.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-[32px] group relative overflow-hidden">
                  <div className="w-20 h-28 bg-white rounded-2xl overflow-hidden shrink-0"><img src={item.image} alt="" className="w-full h-full object-cover" /></div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{item.name}</h3>
                      <p className="text-lg font-black text-blue-600 italic">₹{item.price}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-white rounded-full h-8 px-1 shadow-sm">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6 hover:bg-slate-50 rounded-full flex items-center justify-center transition-all"><Minus className="w-3 h-3" /></button>
                        <span className="px-3 text-xs font-black">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 hover:bg-slate-50 rounded-full flex items-center justify-center transition-all"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 p-2 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cartItems.length > 0 && (
              <div className="p-8 bg-[#eef3f0]/50 border-t border-[#1a3c34]/5 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#4a7c59] font-black uppercase text-[10px] tracking-widest">SUBTOTAL</span>
                  <span className="text-3xl font-black text-[#1a3c34] italic tracking-tighter">₹{total}</span>
                </div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-relaxed bg-white/80 p-4 rounded-2xl border border-[#1a3c34]/5 italic">
                  * Logistics Note: Manual shipping charges may apply for long-distance deliveries outside standard archival zones.
                </p>
                <button onClick={onCheckout} className="w-full bg-[#1a3c34] text-white py-6 rounded-full font-black tracking-[0.2em] shadow-2xl hover:bg-[#4a7c59] active:scale-95 transition-all text-[10px] flex items-center justify-center gap-3 italic uppercase">
                  <CreditCard className="w-4 h-4" /> Finalize Transmission
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ProductCard = ({ product, onAddToCart, wishlistItems = [], onToggleWishlist }: { 
  product: Product; 
  onAddToCart: (product: Product) => void; 
  wishlistItems: Product[];
  onToggleWishlist: (product: Product) => void;
  key?: React.Key 
}) => {
  const isWishlisted = wishlistItems?.some(i => i.id === product.id) || false;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
      className="group"
    >
      <div className="block relative aspect-[3/4] rounded-[60px] overflow-hidden bg-[#e8e4dc] mb-8 group-hover:shadow-2xl transition-all duration-700">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            src={product.image} 
            className="w-full h-full object-cover transition-transform duration-[2s] scale-100 group-hover:scale-110" 
            loading="lazy" 
            referrerPolicy="no-referrer" 
          />
        </Link>
        
        <div className="absolute top-8 right-8 z-10">
          <button 
            onClick={() => onToggleWishlist(product)}
            className={`p-4 rounded-full backdrop-blur-md transition-all shadow-lg active:scale-90 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-red-500 hover:bg-red-500 hover:text-white'}`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {product.isSale && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute top-8 left-8 bg-blue-600 text-white text-[9px] font-black px-5 py-2 rounded-full tracking-[0.2em] uppercase z-10"
            >
              LIMITED EDITION
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="absolute inset-x-8 bottom-8 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-700">
          <button 
            onClick={(e) => { e.preventDefault(); onAddToCart(product); }} 
            className="w-full bg-white text-black py-4 lg:py-6 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic hover:bg-black hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3"
          >
            QUICK SELECTION <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 px-2">
        <div className="flex justify-between items-start gap-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-[13px] font-black text-[#1a1a1a] tracking-tight uppercase group-hover:text-blue-600 transition-colors italic leading-relaxed">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-[#1a1a1a] tracking-tighter italic">₹{product.price}</span>
          </div>
        </div>
        <div className="flex items-baseline gap-4">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{product.category} COLLECTION</span>
          {product.stock <= 5 && <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">• only {product.stock} available</span>}
        </div>
      </div>
    </motion.div>
  );
};

// Pages
const Home = ({ onAddToCart, categories, products, wishlistItems, onToggleWishlist }: { 
  onAddToCart: (product: Product) => void, 
  categories: Category[], 
  products: Product[],
  wishlistItems: Product[],
  onToggleWishlist: (product: Product) => void
}) => {
  const featured = products.slice(0, 4);

  return (
    <div className="overflow-hidden">
      {/* Editorial Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center p-8 lg:p-20 overflow-hidden group bg-white">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.05, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
            src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2004&auto=format&fit=crop" 
            className="w-full h-full object-cover brightness-105 contrast-100" 
            loading="eager"
            alt="SRM Fashions Minimal Premium Editorial"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl w-full px-4 md:px-8 text-[#1a3c34]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center flex flex-col items-center gap-4 md:gap-6"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="h-px w-12 md:w-24 lg:w-32 bg-[#4a7c59]/40" />
              <span className="text-[8px] md:text-[12px] lg:text-[14px] font-black tracking-[0.2em] md:tracking-[0.4em] lg:tracking-[0.6em] uppercase text-[#4a7c59] whitespace-nowrap">Premium Lifestyle Collection</span>
              <div className="h-px w-12 md:w-24 lg:w-32 bg-[#4a7c59]/40" />
            </div>

            <h1 className="text-[14px] md:text-[20px] lg:text-[28px] font-black italic serif tracking-[0.1em] md:tracking-[0.15em] lg:tracking-[0.2em] uppercase max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto text-[#1a3c34]">
              Elevate Your Lifestyle <span className="text-[#4a7c59]">with SRM FASHIONS</span>
            </h1>

            <div className="flex flex-col items-center gap-3 lg:gap-5">
              <p className="text-[10px] md:text-base lg:text-lg font-black uppercase tracking-[0.1em] md:tracking-[0.15em] lg:tracking-[0.2em] text-[#4a7c59]/80 max-w-xs md:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed">
                Premium Trends for Men, Women, Kids & Home.
              </p>

              <div className="text-[8px] md:text-[11px] lg:text-[12px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] lg:tracking-[0.4em] text-white bg-[#4a7c59] px-4 md:px-8 py-2 md:py-3 rounded-full shadow-lg max-w-[90vw] md:max-w-none">
                Exclusive Collections • No Returns/Exchanges to Ensure Quality & Hygiene
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-6 lg:gap-10 text-[#1a3c34] max-w-sm md:max-w-none">
              <div className="flex items-center gap-2 text-[8px] md:text-[11px] lg:text-[12px] font-black uppercase tracking-wider md:tracking-widest whitespace-nowrap bg-[#1a3c34]/5 px-3 md:px-6 py-2 md:py-3 rounded-full border border-[#1a3c34]/10 backdrop-blur-sm">
                <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-[#4a7c59]" /> 100% Secure Payments
              </div>
              <div className="flex items-center gap-2 text-[8px] md:text-[11px] lg:text-[12px] font-black uppercase tracking-wider md:tracking-widest bg-[#1a3c34]/5 px-3 md:px-6 py-2 md:py-3 rounded-full border border-[#1a3c34]/10 backdrop-blur-sm">
                Trusted by Thousands
              </div>
              <div className="flex items-center gap-2 text-[8px] md:text-[11px] lg:text-[12px] font-black uppercase tracking-wider md:tracking-widest bg-[#1a3c34]/5 px-3 md:px-6 py-2 md:py-3 rounded-full border border-[#1a3c34]/10 backdrop-blur-sm">
                <Truck className="w-3 h-3 md:w-4 md:h-4 text-[#4a7c59]" /> Safe Delivery
              </div>
            </div>

            <button className="bg-white text-[#1a3c34] px-10 md:px-20 lg:px-24 py-4 md:py-7 rounded-full text-[9px] md:text-[12px] lg:text-[13px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] italic hover:bg-[#4a7c59] hover:text-white transition-all shadow-2xl transform hover:scale-105 active:scale-95">
              EXPLORE THE ARCHIVE
            </button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-8 lg:px-20 max-w-[1920px] mx-auto bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, idx) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Link to={`/category/${category.slug}`} className="group relative block aspect-[4/5] rounded-[60px] overflow-hidden shadow-soft">
                <img src={category.image} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                <div className="absolute inset-8 flex flex-col justify-end text-white translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h4 className="text-3xl font-black serif italic uppercase leading-tight mb-2">{category.name}</h4>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">Explore Collection →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-[#eef3f0]/50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center space-y-8 mb-24">
            <div className="flex items-center justify-center gap-6 text-[#4a7c59]">
               <ShieldCheck className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em]">Botanical Drop Spring 24</span>
               <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-7xl font-black serif italic uppercase text-[#1a3c34] tracking-tighter">Season Essentials</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {featured.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} wishlistItems={wishlistItems} onToggleWishlist={onToggleWishlist} />)}
          </div>

          <div className="mt-20 text-center">
            <Link to="/category/men" className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-[#1a3c34]/5 pb-2 hover:border-[#1a3c34] transition-all group">
              VIEW THE ENTIRE LOOKBOOK <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Scenery/Editorial Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 lg:left-1/2">
           <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover" 
            loading="lazy"
            alt="Scenic Mountain Forest Background"
          />
        </div>
        <div className="max-w-7xl mx-auto w-full px-8 relative z-10 pointer-events-none">
          <div className="lg:w-1/2 bg-white p-16 lg:p-24 rounded-[80px] shadow-soft space-y-10 pointer-events-auto border border-[#1a3c34]/5">
            <h3 className="text-6xl font-black serif italic uppercase leading-none text-[#1a3c34] tracking-tighter">Pure <br/> <span className="text-[#4a7c59]">Consciousness.</span></h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed italic lowercase">
              Our "Eco-Nature" pledge ensures that every 100 meters of fabric equals two trees planted. We believe in taking only what we give back.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#eef3f0] flex items-center justify-center text-[#4a7c59]">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xl font-black text-[#1a3c34] italic serif uppercase mb-0.5">100% Eco</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#4a7c59]">Soil Association</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1a3c34] flex items-center justify-center text-white">
                   <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xl font-black text-[#1a3c34] italic serif uppercase mb-0.5">Fair Trade</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#4a7c59]">Ethical Sourcing</span>
                </div>
              </div>
            </div>
            <button className="btn-luxury">OUR ECO-PACT</button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Removing the inline CategoryPage since it's now lazy loaded from its own file.

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [qrTimeLeft, setQrTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showPaymentQR && qrTimeLeft > 0) {
      timer = setInterval(() => {
        setQrTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showPaymentQR, qrTimeLeft]);

  const formatQrTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    // Load wishlist from localStorage
    const saved = localStorage.getItem('srm_wishlist');
    if (saved) setWishlistItems(JSON.parse(saved));
    
    api.getMe().then(setUser);
    refreshData();
  }, []);

  const toggleWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const isWishlisted = prev.some(i => i.id === product.id);
      let updated;
      if (isWishlisted) {
        updated = prev.filter(i => i.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      localStorage.setItem('srm_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const refreshData = async () => {
    const [c, p] = await Promise.all([api.getCategories(), api.getProducts()]);
    setCategories(c);
    setProducts(p);
  };

  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleCheckout = async () => {
    if (!user) return setIsAuthOpen(true);
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    if (!(window as any).Razorpay) return alert("Gateway Loading...");

    const options = {
      key: "rzp_test_pJHXzPHXzPHXz",
      amount: totalAmount * 100,
      currency: "INR",
      name: "SRM Fashions • SECURE CHECKOUT",
      description: "PCI-DSS Compliant • SSL Encrypted • Nature Crafted Commerce",
      handler: async function (response: any) {
        const orderData = { items: cartItems, totalAmount };
        const createdOrder = await api.createOrder(orderData);
        setCartItems([]);
        setIsCartOpen(false);
        setLastOrder({ ...orderData, id: response.razorpay_payment_id || createdOrder?.id || Date.now().toString(), date: new Date().toISOString(), status: 'paid' });
        setIsSuccessModalOpen(true);
      },
      prefill: { name: user.name, email: user.email },
      theme: { color: "#2563eb" }
    };
    new (window as any).Razorpay(options).open();
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} user={user} onOpenAuth={() => setIsAuthOpen(true)} onLogout={handleLogout} />
        
        <Suspense fallback={<LoadingCircle />}>
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home onAddToCart={handleAddToCart} categories={categories} products={products} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} />} />
              <Route path="/wishlist" element={<WishlistPage wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} onAddToCart={handleAddToCart} />} />
              <Route path="/track-order" element={<OrderTrackingPage />} />
              <Route path="/category/:slug" element={<CategoryPage onAddToCart={handleAddToCart} categories={categories} products={products} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} />} />
              <Route path="/product/:id" element={<ProductPage onAddToCart={handleAddToCart} products={products} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} />} />
              <Route path="/account" element={user ? <Account user={user} /> : <div className="pt-40 text-center font-black uppercase text-xl serif italic text-[#1a3c34]">Please Login to Continue</div>} />
              <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <div className="pt-40 text-center font-black uppercase text-xl text-red-500 serif italic">Access Denied • Only Management Access</div>} />
              <Route path="/search" element={<SearchPage products={products} onAddToCart={handleAddToCart} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
        </Suspense>

        <footer className="bg-[#0f241f] text-[#eef3f0] py-32 px-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1a3c34] -skew-x-12 translate-x-1/2 pointer-events-none opacity-50" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-16 lg:gap-12 mb-24">
              <div className="col-span-1 md:col-span-2">
                <Link to="/" className="inline-block mb-8">
                  <BrandLogo mono />
                </Link>
                <div className="space-y-6 max-w-sm">
                  <div className="space-y-4">
                    <p className="text-[11px] font-black text-white leading-relaxed uppercase tracking-widest">
                      SRM FASHIONS: Premium Style for Men, Women, Kids & Home.
                    </p>
                    <p className="text-[10px] font-bold text-[#4a7c59] leading-relaxed uppercase tracking-[0.2em]">
                      100% Secure Payments | Trusted Quality | Safe Delivery.
                    </p>
                    <p className="text-[9px] font-medium text-slate-400 italic lowercase leading-relaxed border-l-2 border-[#4a7c59] pl-4">
                      Note: To ensure hygiene and quality, we follow a strict No-Return Policy.
                    </p>
                  </div>
                  
                  <div className="space-y-4 pt-6">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4a7c59]">Join the SRM Archivists</h5>
                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const email = (e.target as any).email.value;
                        const res = await api.subscribeNewsletter(email);
                        alert(res.message);
                        (e.target as any).reset();
                      }}
                      className="flex bg-white/5 rounded-full border border-white/10 p-1.5 focus-within:border-[#4a7c59] transition-all"
                    >
                      <input 
                        name="email"
                        type="email" 
                        required 
                        placeholder="ENTER EMAIL FOR UNMATCHED OFFERS" 
                        className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest px-6 flex-1 text-white placeholder:text-slate-500" 
                      />
                      <button className="bg-[#4a7c59] text-white px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] italic hover:bg-white hover:text-[#1a3c34] transition-all">
                        Secure Access
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {[
                { title: 'Nature Archival', links: categories.map(c => c.name) },
                { title: 'Trust & Safety', links: ['Secure Payments', 'Encrypted Checkout', 'Privacy Shield', 'No Return Policy'] },
                { title: 'Transparency', links: ['Track Order', 'About House', 'Contact Atelier', 'Eco-Pact'] }
              ].map((col, idx) => (
                <div key={idx} className="col-span-1">
                  <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4a7c59] mb-8">{col.title}</h5>
                  <ul className="space-y-4">
                    {col.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        {link === 'Track Order' ? (
                          <Link to="/track-order" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors text-left uppercase">
                            {link}
                          </Link>
                        ) : link === 'About House' ? (
                          <Link to="/about" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors text-left uppercase">
                            {link}
                          </Link>
                        ) : link === 'Contact Atelier' ? (
                          <Link to="/contact" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors text-left uppercase">
                            {link}
                          </Link>
                        ) : (
                          <button className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors text-left uppercase">
                            {link}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="col-span-1 lg:col-span-2 flex flex-col justify-start">
                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4a7c59] mb-8">Purchase Terminal</h5>
                <div className="space-y-8">
                  <div className="relative group">
                    <Link 
                      to="/category/men" 
                      className="flex items-center justify-between bg-white text-[#1a3c34] p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-[#4a7c59] hover:text-white transition-all transform hover:-translate-y-2"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black tracking-widest uppercase opacity-60">Entry to Atelier</span>
                        <span className="text-2xl font-black italic serif uppercase">SHOP NOW</span>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-[#1a3c34] text-white flex items-center justify-center group-hover:bg-white group-hover:text-[#1a3c34] transition-colors">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </Link>
                  </div>

                  <div className="pt-6 space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4a7c59]">Customer Relations</h5>
                    <div className="flex items-center gap-6">
                      <a href="mailto:care@srmfashions.com" className="text-[11px] font-black text-white hover:text-[#4a7c59] transition-colors flex items-center gap-3">
                        <Mail className="w-4 h-4" /> care@srmfashions.com
                      </a>
                      <div className="w-1 h-1 bg-white/20 rounded-full" />
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        <Globe className="w-3 h-3" /> 24/7 ACTIVE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span>© 2026 SRM Fashions • Boutique Excellence</span>
                  <span className="w-1 h-1 bg-slate-500 rounded-full" />
                  <span>Quality Assured</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 group cursor-help" title="Your transactions are protected with industry-standard 256-bit SSL encryption">
                  <ShieldCheck className="w-4 h-4 text-[#4a7c59]" />
                  <span className="text-[8px] font-black tracking-widest uppercase">Verified Secure Payment Gateway</span>
                  <Lock className="w-3 h-3 opacity-30" />
                </div>
              </div>

              <div className="flex items-center gap-8 bg-white/5 px-8 py-4 rounded-[30px] border border-white/10">
                <div className="flex flex-col items-center gap-1 group">
                  <img src="https://razorpay.com/assets/razorpay-glyph.svg" className="h-4 brightness-0 invert group-hover:invert-0 transition-all" alt="Razorpay" />
                  <span className="text-[7px] font-black tracking-[0.3em] opacity-40">SECURED BY RAZORPAY</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                   <CreditCard className="w-5 h-5" />
                   <Globe className="w-4 h-4" />
                   <span className="text-[8px] font-black tracking-widest text-slate-300">GLOBAL PCI-DSS COMPLIANT</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <Link to="/admin" className="text-[10px] font-black text-[#4a7c59] hover:text-white uppercase tracking-widest flex items-center gap-2 group">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  OWNER MANAGEMENT PORTAL
                </Link>
                <button className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest">SYSTEM DATA INTEGRITY</button>
              </div>
            </div>
          </div>
        </footer>

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateQuantity={(id, d) => setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i))} onRemove={(id) => setCartItems(prev => prev.filter(i => i.id !== id))} onCheckout={handleCheckout} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={(u) => { setUser(u); refreshData(); }} />
        
        {/* Success Modal */}
        <AnimatePresence>
          {isSuccessModalOpen && lastOrder && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#0f241f]/90 backdrop-blur-xl overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="w-full max-w-5xl bg-[#eef3f0] rounded-[60px] p-8 md:p-16 relative"
              >
                <button 
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="absolute top-8 right-8 p-4 bg-white rounded-full hover:rotate-90 transition-transform shadow-xl"
                >
                  <X className="w-5 h-5 text-[#1a3c34]" />
                </button>

                <div className="text-center mb-16">
                  <div className="w-24 h-24 bg-[#4a7c59] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
                    <Check className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-5xl font-black serif italic uppercase text-[#1a3c34] tracking-tighter">Manifested.</h2>
                  <p className="text-[10px] font-black text-[#4a7c59] uppercase tracking-[0.4em] mt-4">Your order has been initiated in the SRM ecosystem</p>
                </div>

                <div className="bg-white rounded-[40px] p-2 overflow-hidden shadow-2xl border border-[#1a3c34]/5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <Invoice order={lastOrder} hideButtons={true} />
                </div>

                <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
                  <button 
                    onClick={() => setShowPaymentQR(!showPaymentQR)}
                    className="flex items-center gap-3 bg-[#4a7c59] text-white px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all group w-full md:w-auto justify-center"
                  >
                    <CreditCard className="w-5 h-5" />
                    {showPaymentQR ? 'Hide Secure QR' : 'Show Payment QR'}
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-3 bg-[#1a3c34] text-white px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#4a7c59] transition-all shadow-2xl group w-full md:w-auto justify-center"
                  >
                    <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Print Invoice
                  </button>
                  <button 
                    onClick={async () => {
                      const element = document.getElementById(`invoice-${lastOrder.id}`);
                      if (!element) return;
                      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
                      const imgData = canvas.toDataURL('image/png');
                      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                      const imgProps = pdf.getImageProperties(imgData);
                      const pdfWidth = pdf.internal.pageSize.getWidth();
                      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                      pdf.save(`SRM-Invoice-${lastOrder.id}.pdf`);
                    }}
                    className="flex items-center gap-3 bg-white text-[#1a3c34] border-2 border-[#1a3c34] px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#1a3c34] hover:text-white transition-all shadow-xl group w-full md:w-auto justify-center"
                  >
                    <Download className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
                    Download PDF
                  </button>
                </div>

                <AnimatePresence>
                  {showPaymentQR && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="mt-12 p-10 bg-white rounded-[50px] shadow-2xl flex flex-col items-center gap-8 relative overflow-hidden"
                    >
                      {qrTimeLeft === 0 && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center">
                          <X className="w-12 h-12 text-red-500 mb-4" />
                          <p className="text-sm font-black text-red-500 uppercase tracking-widest">TRANSMISSION EXPIRED</p>
                          <button onClick={() => setQrTimeLeft(300)} className="mt-4 text-[10px] font-black text-[#1a3c34] underline uppercase tracking-widest">Regenerate Secure Token</button>
                        </div>
                      )}
                      
                      <div className="text-center space-y-2">
                        <h4 className="text-lg font-black text-[#1a3c34] serif italic uppercase tracking-tight">Secure Payment Tunnel</h4>
                        <p className="text-[9px] font-black text-[#4a7c59] uppercase tracking-[0.4em]">UPI • PCI-DSS COMPLIANT • 256-BIT ENCRYPTION</p>
                      </div>

                      <div className="bg-[#eef3f0] p-6 rounded-[40px] shadow-inner">
                        <QRCodeSVG 
                          value={`upi://pay?pa=srmfashions@bank&pn=SRM%20Fashions&am=${lastOrder.totalAmount}&cu=INR&tn=SRM-ORDER-${lastOrder.id.slice(-6)}`}
                          size={180}
                          level="H"
                          includeMargin={true}
                        />
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3 text-red-500">
                          <Clock className="w-4 h-4" />
                          <span className="text-xl font-black italic tracking-tighter">{formatQrTime(qrTimeLeft)}</span>
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TOKEN EXPIRES FOR SECURITY</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
                  <button 
                    onClick={() => setIsSuccessModalOpen(false)}
                    className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1a3c34] border-b-2 border-[#1a3c34]/10 pb-2 hover:border-[#1a3c34] transition-all"
                  >
                    Return to Home Store
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}
