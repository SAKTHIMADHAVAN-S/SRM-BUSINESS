import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface WishlistProps {
  wishlistItems: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const Wishlist = ({ wishlistItems, onToggleWishlist, onAddToCart }: WishlistProps) => {
  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto min-h-[70vh]">
      <div className="flex justify-between items-end mb-16 px-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-6 h-6 text-[#4a7c59] fill-[#4a7c59]" />
            <h1 className="text-6xl font-black serif italic uppercase text-[#1a3c34] tracking-tighter">Your Archive</h1>
          </div>
          <p className="text-[#4a7c59] font-black uppercase text-[10px] tracking-[0.4em] italic ml-10">Curated Selection • SRM Fashions</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-40 space-y-8"
        >
          <div className="bg-[#eef3f0] w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-12 h-12 text-[#1a3c34]/20" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black serif italic uppercase text-[#1a3c34]">Archive is empty</h3>
            <p className="text-sm font-medium text-slate-400 italic">No pieces have been curated yet.</p>
          </div>
          <Link to="/" className="inline-flex items-center gap-4 bg-[#1a3c34] text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] italic hover:bg-[#4a7c59] transition-all shadow-2xl">
            Return to Ecosystem <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {wishlistItems.map(product => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-[60px] overflow-hidden bg-[#e8e4dc] mb-8 shadow-soft group-hover:shadow-2xl transition-all duration-700">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    alt={product.name}
                  />
                </Link>
                <div className="absolute top-8 right-8">
                  <button 
                    onClick={() => onToggleWishlist(product)}
                    className="p-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute inset-x-8 bottom-8">
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-[#1a3c34] text-white py-6 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic hover:bg-[#4a7c59] transition-all shadow-2xl flex items-center justify-center gap-3"
                  >
                    Move to Bag <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3 px-2">
                <h3 className="text-[13px] font-black text-[#1a1a1a] tracking-tight uppercase italic">{product.name}</h3>
                <p className="text-lg font-black text-[#1a1a1a] tracking-tighter italic">₹{product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
