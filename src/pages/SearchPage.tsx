import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search as SearchIcon, ArrowRight, Heart } from 'lucide-react';
import { Product } from '../types';

interface SearchPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  wishlistItems: Product[];
  onToggleWishlist: (product: Product) => void;
}

export const SearchPage = ({ products, onAddToCart, wishlistItems, onToggleWishlist }: SearchPageProps) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!query) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  return (
    <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-20 text-center space-y-4">
        <h1 className="text-6xl font-black text-[#1a3c34] uppercase tracking-tighter italic serif">
          {query ? `Results for "${query}"` : 'Global Archive Search'}
        </h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-relaxed">
          Traversing the SRM ecosystem for your specific selection
        </p>
      </div>

      {!query ? (
        <div className="max-w-2xl mx-auto text-center py-20">
          <SearchIcon className="w-20 h-20 text-slate-100 mx-auto mb-8" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Please enter a term in the search bar above to begin archival retrieval.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-40 bg-[#eef3f0]/30 rounded-[80px] border border-[#1a3c34]/5">
          <h3 className="text-3xl font-black text-[#1a3c34] uppercase tracking-tighter mb-4 italic serif">No Signature Found</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-12">The term "{query}" does not correspond with any current SRM pieces.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-[#1a3c34] text-white px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#4a7c59] transition-all shadow-xl"
          >
            Explore the Full Archive <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-16">
          <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-soft border border-[#1a3c34]/5">
            <span className="text-[10px] font-black text-[#1a3c34] uppercase tracking-widest italic">ARCHIVAL RETRIEVAL: {results.length} PIECES IDENTIFIED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {results.map((product) => {
              const isWishlisted = wishlistItems?.some(i => i.id === product.id) || false;
              return (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <div className="block relative aspect-[3/4] rounded-[60px] overflow-hidden bg-[#eef3f0] mb-8 group-hover:shadow-2xl transition-all duration-700 border border-[#1a3c34]/5">
                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                    </Link>
                    <div className="absolute top-8 right-8 z-10">
                      <button 
                        onClick={() => onToggleWishlist(product)}
                        className={`p-4 rounded-full backdrop-blur-md transition-all shadow-lg active:scale-90 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-red-500 hover:bg-red-500'}`}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 px-2">
                    <h3 className="text-[12px] font-black text-[#1a3c34] tracking-tight uppercase italic ">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-[#1a3c34] italic">₹{product.price}</span>
                      <button 
                        onClick={() => onAddToCart(product)}
                        className="text-[9px] font-black text-[#4a7c59] uppercase tracking-widest hover:text-[#1a3c34] transition-colors"
                      >
                        ADD TO BAG
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
