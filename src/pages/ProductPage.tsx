import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  ShieldCheck, 
  Truck, 
  Ban,
  Star,
  Heart,
  Ruler,
  Maximize
} from 'lucide-react';
import { api } from '../services/api';
import { Product, CartItem } from '../types';
import { Reviews } from '../components/Reviews';

interface ProductPageProps {
  onAddToCart: (product: Product) => void;
  products: Product[];
  wishlistItems: Product[];
  onToggleWishlist: (product: Product) => void;
}

export const ProductPage = ({ onAddToCart, products, wishlistItems, onToggleWishlist }: ProductPageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const isWishlisted = product ? (wishlistItems?.some(i => i.id === product.id) || false) : false;

  useEffect(() => {
    const found = products.find(p => p.id === id);
    if (found) {
      setProduct(found);
      if (found.sizes && found.sizes.length > 0) {
        setSelectedSize(found.sizes[0]);
      }
    }
    setLoading(false);
  }, [id, products]);

  if (loading) return <div className="pt-40 text-center animate-pulse font-black uppercase text-4xl text-[#1a3c34]">Re-loading Atelier...</div>;
  if (!product) return <div className="pt-40 text-center font-black uppercase text-4xl text-red-500">Archive Entry Not Found</div>;

  const allImages = [product.image, ...(product.images || [])];

  const handleNext = () => {
    setActiveImage((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="pt-24 pb-20 px-8 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1a3c34] transition-colors mb-12"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Ecosystem
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left: Visuals */}
        <div className="space-y-8">
          <div className="relative aspect-[3/4] rounded-[60px] overflow-hidden bg-[#eef3f0] group shadow-2xl border border-[#1a3c34]/5">
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              src={allImages[activeImage]} 
              className={`w-full h-full object-cover transition-all duration-700 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
            
            <button 
              className={`absolute top-8 left-8 p-4 backdrop-blur-md rounded-full shadow-lg transition-all z-10 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-red-500 hover:bg-red-500 hover:text-white'}`}
              onClick={() => product && onToggleWishlist(product)}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>

            {/* Navigation Controls */}
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/20 hover:bg-white/90 hover:text-[#1a3c34] text-white backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/20 hover:bg-white/90 hover:text-[#1a3c34] text-white backdrop-blur-md rounded-full transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {product.demoWear && (
               <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                 <p className="text-[9px] font-black text-white uppercase tracking-widest italic">{product.demoWear}</p>
               </div>
            )}
            
            <div className="absolute inset-x-0 bottom-8 flex justify-center gap-3">
              {allImages.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`h-1 rounded-full transition-all duration-500 ${activeImage === idx ? 'w-12 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>

            <button 
              className="absolute top-24 right-8 p-4 bg-white/80 backdrop-blur-md rounded-full text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 px-2">
            {allImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-24 h-32 rounded-2xl overflow-hidden border-2 transition-all duration-500 transform ${activeImage === idx ? 'border-[#1a3c34] shadow-xl -translate-y-2' : 'border-transparent opacity-50 hover:opacity-100 grayscale hover:grayscale-0'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {product.video && (
            <div className="pt-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 italic">Product in Motion</h3>
              <div className="aspect-video rounded-[32px] overflow-hidden bg-slate-900 relative shadow-xl">
                 <video 
                   src={product.video} 
                   autoPlay 
                   loop 
                   muted 
                   playsInline
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-slate-950/20" />
              </div>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="space-y-12 py-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4a7c59] italic">Collection: {product.category}</span>
              {product.stock <= 5 && (
                <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse border border-red-100">
                  Only {product.stock} Units Remaining
                </span>
              )}
            </div>
            
            <h1 className="text-7xl font-black text-[#1a3c34] tracking-tighter uppercase italic leading-[0.8] serif">{product.name}</h1>
            
            <div className="flex items-baseline gap-6">
              <span className="text-6xl font-black text-[#1a3c34] italic">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-3xl text-slate-300 line-through font-bold">₹{product.originalPrice}</span>
              )}
            </div>

            <p className="text-slate-500 text-sm leading-relaxed font-black uppercase tracking-tight italic">
              {product.description}
            </p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Archival Fit selection:</h4>
              <div className="flex flex-wrap gap-4">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedSize === size ? 'bg-[#1a3c34] text-white shadow-xl scale-110' : 'bg-[#eef3f0] text-slate-400 hover:text-[#1a3c34] border border-transparent hover:border-[#1a3c34]/20'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => onAddToCart(product)}
            className="w-full bg-[#1a3c34] text-white py-8 rounded-[50px] font-black text-[12px] tracking-[0.4em] uppercase italic flex items-center justify-center gap-6 hover:bg-[#4a7c59] transition-all shadow-2xl active:scale-[0.98] group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /> 
            Commit to Shopping Bag
          </button>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100">
            {[
              { icon: ShieldCheck, label: 'Secure Payment' },
              { icon: Truck, label: 'Shipping Charges Apply*' },
              { icon: Ban, label: 'No Return Policy' }
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
                  <item.icon className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Detailed Specifications Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-32 pt-20 border-t border-[#1a3c34]/5"
      >
        <div className="flex flex-col md:flex-row gap-20">
          <div className="w-full md:w-1/3">
            <h2 className="text-4xl font-black text-[#1a3c34] uppercase tracking-tighter italic serif mb-4">The Archive<br />Specifications</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Technical details & care protocols</p>
            
            <div className="mt-12 p-8 bg-white border-2 border-[#eef3f0] rounded-[40px] flex justify-between items-center group hover:border-[#1a3c34] transition-all cursor-help shadow-soft">
              <div>
                <h4 className="text-[10px] font-black text-[#1a3c34] uppercase tracking-widest serif italic">SRM Authenticity Shield</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Hand-crafted • Sustainably Sourced</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-[#4a7c59]" />
            </div>
          </div>

          <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a3c34]/5 rounded-[40px] overflow-hidden border border-[#1a3c34]/5">
            {[
              { 
                label: 'Fabric & Composition', 
                value: product.fabric || 'Premium Blended Material', 
                icon: ShieldCheck,
                detail: 'Ethically sourced and tested for longevity.'
              },
              { 
                label: 'Care Instructions', 
                value: product.care || 'Professional Clean Recommended', 
                icon: Ban,
                detail: 'Follow strict protocols to maintain silhouette.'
              },
              { 
                label: 'Artisanal Fit Guide', 
                value: product.sizeGuide || 'True to International Standards', 
                icon: Ruler,
                detail: 'Engineered for a balanced modern silhouette.'
              },
              { 
                label: 'Physical Dimensions', 
                value: product.dimensions ? `${product.dimensions.h}H × ${product.dimensions.w}W × ${product.dimensions.d}D cm` : 'Standard Architecture', 
                icon: Maximize,
                detail: 'Measured at maximum extension points.'
              }
            ].map((spec, idx) => (
              <div key={idx} className="bg-white p-10 hover:bg-[#eef3f0]/30 transition-colors group">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[9px] font-black text-[#4a7c59] uppercase tracking-[0.3em] italic">{spec.label}</span>
                  <spec.icon className="w-4 h-4 text-slate-300 group-hover:text-[#4a7c59] transition-colors" />
                </div>
                <p className="text-sm font-black text-[#1a3c34] uppercase tracking-tight mb-2">{spec.value}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{spec.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="pt-24 border-t border-[#1a3c34]/5 mt-32">
        <Reviews productId={product.id} />
      </div>
    </div>
  );
};
