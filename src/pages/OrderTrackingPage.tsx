import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Package, Truck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

export const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusIcon = (status: string, isActive: boolean) => {
    const s = status.toLowerCase();
    const props = { className: "w-3 h-3" };
    
    if (s.includes('delivered')) return <CheckCircle2 {...props} />;
    if (s.includes('shipped')) return <Truck {...props} />;
    if (s.includes('processing')) return <Clock {...props} />;
    if (s.includes('cancelled')) return <AlertCircle {...props} />;
    if (s.includes('placed') || s.includes('paid')) return <Package {...props} />;
    
    return isActive ? <CheckCircle2 {...props} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />;
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const data = await api.trackOrder(orderId.trim());
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Order not found. Please verify your Tracking ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-8 bg-[#fdfdfc]">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-[10px] font-black text-[#4a7c59] uppercase tracking-[0.5em]">The SRM Archive</h2>
          <h1 className="text-5xl font-black italic serif uppercase text-[#1a3c34]">Track My Order</h1>
          <p className="max-w-md mx-auto text-xs font-medium text-slate-400 italic lowercase leading-relaxed">
            Follow your botanical artifacts as they make their way from our Chennai atelier to your home.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-[#1a3c34]/5 rounded-[40px] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.02)]"
        >
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7c59]" />
              <input 
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                placeholder="ENTER ORDER ID (E.G. SRM-XXXXXX)"
                className="w-full bg-[#f8faf9] border border-transparent focus:border-[#4a7c59] rounded-full py-5 pl-14 pr-8 text-[11px] font-black tracking-widest outline-none transition-all uppercase"
              />
            </div>
            <button 
              disabled={loading}
              className="bg-[#1a3c34] text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] italic hover:bg-[#4a7c59] transition-all disabled:opacity-50"
            >
              {loading ? 'Locating...' : 'Trace Order'}
            </button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 p-6 rounded-2xl bg-red-50 border border-red-100 text-red-600 mb-8"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                {error}
              </span>
            </motion.div>
          )}

          {order && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-100">
                <div>
                  <span className="text-[8px] font-black text-[#4a7c59] uppercase tracking-widest block mb-1">Current Artifact Status</span>
                  <div className="flex items-center gap-4">
                    <div className="px-5 py-2 bg-[#eef3f0] text-[#4a7c59] rounded-full text-[10px] font-black uppercase tracking-widest">
                      {order.status}
                    </div>
                    <span className="text-xs font-bold text-slate-300">/</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Placed {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Order Value</span>
                  <span className="text-2xl font-black text-[#1a3c34] italic serif">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-10">
                <h4 className="text-[10px] font-black text-[#1a3c34] uppercase tracking-[0.3em]">Transit History</h4>
                <div className="relative pl-10 space-y-10">
                  <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-100" />
                  
                  {order.tracking?.slice().reverse().map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center transition-all ${idx === 0 ? 'bg-[#4a7c59] text-white' : 'bg-[#eef3f0] text-slate-400'}`}>
                        {getStatusIcon(step.status, idx === 0)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-black uppercase tracking-widest ${idx === 0 ? 'text-[#1a3c34]' : 'text-slate-400'}`}>
                            {step.status}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-2">
                             <Clock className="w-3 h-3" /> {new Date(step.date).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                          {step.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#f8faf9] rounded-3xl p-8 space-y-6">
                <h4 className="text-[10px] font-black text-[#1a3c34] uppercase tracking-[0.3em]">Items in this shipment</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[#1a3c34]/5">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                      <div className="flex-1">
                        <span className="block text-[10px] font-black text-[#1a3c34] uppercase tracking-widest truncate">{item.name}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {!order && !loading && (
            <div className="text-center py-10 opacity-30">
               <Package className="w-12 h-12 mx-auto mb-4 text-[#4a7c59]" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Tracking ID Input</p>
            </div>
          )}
        </motion.div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 px-6">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-[#1a3c34] flex items-center justify-center text-white">
                <Truck className="w-5 h-5" />
             </div>
             <div>
               <span className="block text-[10px] font-black text-[#1a3c34] uppercase tracking-widest">Global Express</span>
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">Deliveries via SRM Logistics</span>
             </div>
          </div>
          <p className="text-[9px] font-medium text-slate-400 max-w-sm text-center md:text-right italic">
            Orders typically process within 24-48 business hours. For immediate archival assistance, contact concierge@srmfashions.com
          </p>
        </div>
      </div>
    </div>
  );
};
