import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Heart } from 'lucide-react';
import { Product, Category } from '../types';
import { Reviews } from '../components/Reviews';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  wishlistItems: Product[];
  onToggleWishlist: (product: Product) => void;
  key?: React.Key;
}

const ProductCard = ({ product, onAddToCart, wishlistItems = [], onToggleWishlist }: ProductCardProps) => {
  const isWishlisted = wishlistItems?.some(i => i.id === product.id) || false;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
      className="group"
    >
      <div className="block relative aspect-[3/4] rounded-[60px] overflow-hidden bg-[#eef3f0] mb-8 group-hover:shadow-2xl transition-all duration-700 border border-[#1a3c34]/5">
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
        <div className="absolute inset-0 bg-[#0f241f]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-x-8 bottom-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
          <button 
            onClick={(e) => { e.preventDefault(); onAddToCart(product); }} 
            className="w-full bg-white text-[#1a3c34] py-6 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic hover:bg-[#1a3c34] hover:text-white transition-all shadow-2xl"
          >
            QUICK SELECTION
          </button>
        </div>
      </div>
      <div className="space-y-3 px-2 text-center">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[13px] font-black text-[#1a3c34] tracking-tight uppercase italic hover:text-[#4a7c59] transition-colors">{product.name}</h3>
        </Link>
        <span className="text-lg font-black text-[#1a3c34] tracking-tighter italic block">₹{product.price}</span>
      </div>
    </motion.div>
  );
};

export const CategoryPage = ({ onAddToCart, categories, products, wishlistItems, onToggleWishlist }: { 
  onAddToCart: (product: Product) => void, 
  categories: Category[], 
  products: Product[],
  wishlistItems: Product[],
  onToggleWishlist: (product: Product) => void
}) => {
  const { slug } = useParams();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');
  const category = categories.find(c => c.slug === slug);
  
  const filteredProducts = products
    .filter(p => p.category === slug)
    .filter(p => activeFilter === 'ALL' || (activeFilter === 'SALE' && p.isSale))
    .sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.price - b.price;
      if (sortBy === 'PRICE_DESC') return b.price - a.price;
      return 0; // Default: Newest/Unsorted
    });

  if (!category) return <div className="pt-40 text-center font-black uppercase text-4xl italic tracking-tighter">Not Found</div>;

  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="h-[50vh] relative overflow-hidden flex items-center justify-center">
        <img src={category.image} className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale transition-transform duration-[20s] hover:scale-110" />
        <div className="absolute inset-0 bg-[#1a3c34]/30" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center space-y-4">
          <h1 className="text-8xl md:text-[10rem] text-white font-black uppercase tracking-tighter italic serif leading-none">{category.slug}</h1>
          <p className="text-white/80 font-black tracking-[0.5em] uppercase text-[10px] italic">Nature Crafted • SRM Selection</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-24 space-y-20">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[60px] shadow-soft border border-[#1a3c34]/5 gap-6">
           <div className="flex gap-10 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto scrollbar-none">
              {['ALL', 'SALE', 'NEW'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setActiveFilter(f)} 
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 py-2 whitespace-nowrap ${activeFilter === f ? 'border-[#4a7c59] text-[#4a7c59]' : 'border-transparent text-slate-400 hover:text-[#1a3c34]'}`}
                >
                  {f}
                </button>
              ))}
           </div>

           <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-4">
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">SORT:</span>
                 <select 
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value)}
                   className="bg-transparent border-none outline-none text-[10px] font-black text-[#1a3c34] uppercase tracking-widest cursor-pointer"
                 >
                   <option value="NEWEST">THE ARCHIVE (NEWEST)</option>
                   <option value="PRICE_ASC">PRICE: LOWEST FIRST</option>
                   <option value="PRICE_DESC">PRICE: ELITE FIRST</option>
                 </select>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-100 pl-8">{filteredProducts.length} DESIGNS FOUND</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
              wishlistItems={wishlistItems}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        <div className="pt-32 border-t border-[#1a3c34]/5">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-black serif italic uppercase tracking-tighter text-[#1a3c34]">Client Satisfaction</h2>
              <div className="flex justify-center items-center gap-3 mt-4 text-[#4a7c59]">
                 <ShieldCheck className="w-4 h-4" />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em]">Verified Reviews • Secure Experience</p>
              </div>
           </div>
           <Reviews productId={slug || 'general'} />
        </div>
      </div>
    </div>
  );
};
