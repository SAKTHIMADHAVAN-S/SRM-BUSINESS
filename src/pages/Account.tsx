import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, ChevronRight, Printer, Clock } from 'lucide-react';
import { api } from '../services/api';
import { Order, User } from '../types';
import { Invoice } from '../components/Invoice';

export const Account = ({ user }: { user: User }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  const handlePrint = (order: Order) => {
    const printContent = document.getElementById(`invoice-${order.id}`);
    if (printContent) {
      const originalBody = document.body.innerHTML;
      document.body.innerHTML = printContent.outerHTML;
      window.print();
      document.body.innerHTML = originalBody;
      window.location.reload();
    }
  };

  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
      <aside className="w-full md:w-80 space-y-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl mb-4 flex items-center justify-center text-white text-2xl font-black italic">{user.name[0]}</div>
          <h2 className="text-xl font-black uppercase text-slate-900">{user.name}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
        </div>
      </aside>

      <main className="flex-1">
        <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-8">Order History</h2>
        {loading ? <div className="animate-pulse h-40 bg-slate-100 rounded-3xl" /> : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-slate-50">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-xl">🛍️</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-slate-900 tracking-tighter uppercase italic">{order.id}</h3>
                            <span className="text-[9px] font-black px-3 py-1 bg-blue-100 text-blue-600 rounded-full uppercase tracking-widest">{order.status}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                            {new Date(order.date).toLocaleDateString()} • {order.items.length} Items • ₹{order.totalAmount}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handlePrint(order)}
                          className="p-4 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all"
                        >
                          <Printer className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-8">
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 italic">Tracking Status</h4>
                      <div className="relative pl-10 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        {order.tracking?.map((step, idx) => (
                          <div key={idx} className="relative">
                            <div className={`absolute -left-[30px] w-[21px] h-[21px] rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${idx === 0 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                            <div>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${idx === 0 ? 'text-blue-600' : 'text-slate-900'}`}>{step.status}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(step.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                              <p className="text-[10px] font-medium text-slate-500 mt-2 lowercase italic leading-relaxed">{step.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Hidden Invoice for Printing */}
                    <div className="hidden">
                      <Invoice order={order} />
                    </div>
                  </motion.div>
                ))}
              </div>
        )}
      </main>
    </div>
  );
};
