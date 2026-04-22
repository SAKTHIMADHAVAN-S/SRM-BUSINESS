import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Package, 
  Layers, 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  X, 
  Send,
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Briefcase,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Category, Order } from '../types';
import { Invoice } from '../components/Invoice';
import * as XLSX from 'xlsx';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'marketing' | 'reports'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newsletterCount, setNewsletterCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Report state
  const [reportTimeframe, setReportTimeframe] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

  // Marketing state
  const [blastData, setBlastData] = useState({ subject: '', message: '' });
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updateStatusData, setUpdateStatusData] = useState({ status: '', message: '' });
  
  const MOCK_PREVIEW_ORDER = products.length > 0 ? {
    id: 'SRM-PREVIEW-001',
    userId: 'admin',
    userName: 'Master Curator (Preview)',
    date: new Date().toISOString(),
    totalAmount: products[0].price,
    items: [{ ...products[0], quantity: 1 }],
    status: 'paid',
    tracking: [{ status: 'Preview Mode', date: new Date().toISOString(), message: 'System Template Review' }]
  } : null;

  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ 
    name: '', 
    price: 0, 
    description: '', 
    image: '', 
    category: 'men',
    sizes: ['M', 'L', 'XL'],
    demoWear: 'Model is wearing size M'
  });
  
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({ name: '', slug: '', image: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, c, o] = await Promise.all([api.getProducts(), api.getCategories(), api.getOrders()]);
      setProducts(p);
      setCategories(c);
      setOrders(o);
      // Mocked or real if exists
      setNewsletterCount(124); // Placeholder for demonstration
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendBlast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminSendMarketingBlast(blastData);
      alert('Marketing Transmission Manifested to ' + newsletterCount + ' subscribers.');
      setBlastData({ subject: '', message: '' });
    } catch (err) {
      alert('Transmission failed.');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.adminAddProduct(newProduct);
    setShowProductForm(false);
    setNewProduct({ name: '', price: 0, description: '', image: '', category: 'men' });
    loadData();
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.adminAddCategory(newCategory);
    setShowCategoryForm(false);
    setNewCategory({ name: '', slug: '', image: '', description: '' });
    loadData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Permanently remove this design from the archive?')) {
      await api.adminDeleteProduct(id);
      loadData();
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    setUpdatingOrderId(id);
    setUpdateStatusData({ status, message: '' });
  };

  const confirmStatusUpdate = async () => {
    if (!updatingOrderId) return;
    await api.adminUpdateOrderStatus(updatingOrderId, updateStatusData.status, updateStatusData.message);
    setUpdatingOrderId(null);
    loadData();
  };

  if (loading) return <div className="pt-40 text-center animate-pulse font-black uppercase tracking-tighter text-4xl italic text-[#1a3c34] serif">Re-aligning Ecosystem...</div>;

  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-16 px-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-[#4a7c59]" />
            <h1 className="text-6xl font-black text-[#1a3c34] tracking-tighter uppercase italic serif">Hub</h1>
          </div>
          <p className="text-[#4a7c59] font-black uppercase text-[10px] tracking-[0.4em] italic">Authorized Management Console • SRM E-Commerce</p>
        </div>
        <button 
          onClick={() => setShowInvoicePreview(true)}
          className="flex items-center gap-3 bg-white border-2 border-[#1a3c34] text-[#1a3c34] px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#1a3c34] hover:text-white transition-all shadow-xl"
        >
          <ShoppingBag className="w-4 h-4" /> Preview Invoice Template
        </button>
      </div>

      <div className="flex gap-4 mb-16 bg-[#eef3f0]/50 p-3 rounded-[32px] border border-[#1a3c34]/5 backdrop-blur-sm">
        {[
          { id: 'products', label: 'Designs', icon: Package },
          { id: 'categories', label: 'Archival Sections', icon: Layers },
          { id: 'orders', label: 'Transmissions', icon: ShoppingBag },
          { id: 'marketing', label: 'Automated Offers', icon: Send },
          { id: 'reports', label: 'Analytics', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#1a3c34] text-white shadow-2xl' : 'text-slate-400 hover:text-[#1a3c34] group'}`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? '' : 'group-hover:scale-110 transition-transform'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-12 min-h-[60vh]">
        {activeTab === 'products' && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-[#1a3c34]/10 shadow-soft">
              <div>
                <h2 className="text-2xl font-black uppercase italic text-[#1a3c34] serif">Design Management</h2>
                <p className="text-[9px] font-black text-[#4a7c59] uppercase tracking-[0.2em] mt-1">Status: Master Curator Access Granted</p>
              </div>
              <button onClick={() => setShowProductForm(!showProductForm)} className="flex items-center gap-3 bg-[#1a3c34] text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#4a7c59] transition-all shadow-xl">
                {showProductForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
                {showProductForm ? 'Cancel Operation' : 'Initiate New Design'}
              </button>
            </div>

            {showProductForm && (
              <motion.form initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handleAddProduct} className="bg-[#eef3f0]/30 p-10 rounded-[60px] border border-[#1a3c34]/10 shadow-2xl grid grid-cols-2 gap-8 ring-8 ring-white">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a7c59] ml-4">Identification Name</label>
                  <input placeholder="ENTER PRODUCT TITLE" className="w-full bg-white border border-[#1a3c34]/10 rounded-3xl p-5 text-[11px] font-black tracking-widest focus:ring-2 focus:ring-[#4a7c59] outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a7c59] ml-4">Price Allocation (INR)</label>
                  <input placeholder="₹ VALUE" type="number" className="w-full bg-white border border-[#1a3c34]/10 rounded-3xl p-5 text-[11px] font-black tracking-widest focus:ring-2 focus:ring-[#4a7c59] outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} required />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a7c59] ml-4">Visual Asset Source (Image URL)</label>
                  <input placeholder="PASTE CLOUD STORAGE LINK OR IMAGE ADDRESS" className="w-full bg-white border border-[#1a3c34]/10 rounded-3xl p-5 text-[11px] font-black tracking-widest focus:ring-2 focus:ring-[#4a7c59] outline-none" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a7c59] ml-4">Ecosystem Section</label>
                  <select className="w-full bg-white border border-[#1a3c34]/10 rounded-3xl p-5 text-[11px] font-black tracking-widest focus:ring-2 focus:ring-[#4a7c59] outline-none appearance-none" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.name.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a7c59] ml-4">Atelier Archetype (Sizes, comma-separated)</label>
                  <input placeholder="S, M, L, XL" className="w-full bg-white border border-[#1a3c34]/10 rounded-3xl p-5 text-[11px] font-black tracking-widest focus:ring-2 focus:ring-[#4a7c59] outline-none" value={newProduct.sizes?.join(', ')} onChange={e => setNewProduct({...newProduct, sizes: e.target.value.split(',').map(s => s.trim())})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a7c59] ml-4">Demo Wear Note</label>
                  <input placeholder="E.G., MODEL IS 6'0 WEARING L" className="w-full bg-white border border-[#1a3c34]/10 rounded-3xl p-5 text-[11px] font-black tracking-widest focus:ring-2 focus:ring-[#4a7c59] outline-none" value={newProduct.demoWear} onChange={e => setNewProduct({...newProduct, demoWear: e.target.value})} required />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a7c59] ml-4">Atelier Description</label>
                  <textarea placeholder="DESCRIBE THE MATERIALITY AND CRAFT..." className="w-full bg-white border border-[#1a3c34]/10 rounded-[40px] p-6 text-[11px] font-black tracking-widest focus:ring-2 focus:ring-[#4a7c59] outline-none min-h-[150px]" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required />
                </div>
                <button type="submit" className="col-span-2 bg-[#1a3c34] text-white py-6 rounded-[30px] font-black uppercase tracking-[0.3em] italic hover:bg-[#4a7c59] transition-all shadow-2xl hover:-translate-y-1">Commit Design to Archive</button>
              </motion.form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[50px] border border-[#1a3c34]/5 flex items-center gap-8 shadow-soft group hover:shadow-2xl transition-all duration-500">
                  <div className="relative overflow-hidden rounded-[30px] w-24 h-32 flex-shrink-0 bg-[#eef3f0]">
                    <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[11px] font-black uppercase text-[#1a3c34] tracking-tight truncate serif italic leading-tight mb-1">{p.name}</h3>
                    <p className="text-[#4a7c59] font-black text-xl italic tracking-tighter">₹{p.price}</p>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                      <button className="p-4 bg-[#eef3f0] text-[#1a3c34] rounded-2xl hover:bg-[#1a3c34] hover:text-white transition-all shadow-sm"><Edit3 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ... Categories and Orders tabs follow a similar Green aesthetic ... */}
        {activeTab === 'categories' && (
          <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-[#1a3c34]/10 shadow-soft">
              <h2 className="text-2xl font-black uppercase italic text-[#1a3c34] serif">Ecosystem Mapping</h2>
              <button onClick={() => setShowCategoryForm(!showCategoryForm)} className="flex items-center gap-3 bg-[#1a3c34] text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#4a7c59] transition-all shadow-xl">
                <Plus className="w-4 h-4" /> New Section
              </button>
            </div>

            {showCategoryForm && (
              <form onSubmit={handleAddCategory} className="bg-[#eef3f0]/30 p-10 rounded-[60px] border border-[#1a3c34]/10 shadow-2xl grid grid-cols-2 gap-8 ring-8 ring-white">
                <input placeholder="SECTION LABEL" className="bg-white border rounded-3xl p-5 text-[11px] font-black uppercase tracking-widest shadow-sm" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} required />
                <input placeholder="IDENTIFIER SLUG" className="bg-white border rounded-3xl p-5 text-[11px] font-black uppercase tracking-widest shadow-sm" value={newCategory.slug} onChange={e => setNewCategory({...newCategory, slug: e.target.value})} required />
                <input placeholder="VISUAL IDENTITY IMAGE URL" className="bg-white border rounded-3xl p-5 text-[11px] font-black col-span-2 shadow-sm" value={newCategory.image} onChange={e => setNewCategory({...newCategory, image: e.target.value})} required />
                <textarea placeholder="SECTION MISSION STATEMENT..." className="col-span-2 bg-white border rounded-[40px] p-6 text-[11px] font-black min-h-[120px] shadow-sm" value={newCategory.description} onChange={e => setNewCategory({...newCategory, description: e.target.value})} required />
                <button type="submit" className="col-span-2 bg-[#1a3c34] text-white py-6 rounded-[30px] font-black uppercase tracking-[0.2em] italic shadow-2xl">Integrate Section</button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map(c => (
                <div key={c.id} className="bg-white p-8 rounded-[50px] border border-[#1a3c34]/5 flex items-center gap-8 shadow-soft">
                  <div className="w-20 h-20 bg-[#eef3f0] rounded-[30px] flex items-center justify-center text-3xl shadow-inner">🌱</div>
                  <div className="flex-1">
                    <h3 className="text-[13px] font-black uppercase text-[#1a3c34] serif italic">{c.name}</h3>
                    <p className="text-[10px] font-black text-[#4a7c59] tracking-widest mt-1">/{c.slug}</p>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => api.adminDeleteCategory(c.id).then(loadData)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'orders' && (
          <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-[#1a3c34]/10 shadow-soft">
               <h2 className="text-2xl font-black uppercase italic text-[#1a3c34] serif">Transmission Logs</h2>
               <div className="flex items-center gap-3 text-[#4a7c59]">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Live Flow</span>
               </div>
            </div>
            
            <div className="space-y-6">
              {orders.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => (
                <div key={order.id} className="bg-white p-10 rounded-[60px] border border-[#1a3c34]/5 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:shadow-2xl transition-all duration-500 group">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-[#eef3f0] rounded-[24px] flex items-center justify-center shadow-inner group-hover:bg-[#1a3c34] transition-colors">
                       <ShoppingBag className="w-6 h-6 text-[#1a3c34] group-hover:text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-black text-[#1a3c34] italic tracking-tighter uppercase serif">{order.id.slice(-8)}</h3>
                        <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 ${order.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-[#eef3f0] text-[#1a3c34]'}`}>
                           <CheckCircle className="w-3 h-3" />
                           {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.2em]">{order.userName || 'Anonymous Client'} • <span className="text-[#1a3c34]">₹{order.totalAmount}</span></p>
                    </div>
                  </div>
                  
                    <div className="flex gap-4">
                      <select 
                        className="bg-[#eef3f0] text-[#1a3c34] text-[10px] font-black uppercase tracking-widest rounded-full px-6 py-4 outline-none border border-[#1a3c34]/5 focus:ring-2 focus:ring-[#4a7c59]"
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="paid">Paid (Initial)</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button 
                        onClick={() => handleUpdateOrderStatus(order.id, order.status)} 
                        className="px-10 py-5 bg-[#1a3c34] text-white text-[10px] font-black uppercase tracking-widest rounded-full italic shadow-xl shadow-[#1a3c34]/20 hover:bg-[#4a7c59]"
                      >
                        Add Log
                      </button>
                    </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
        {activeTab === 'marketing' && (
          <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="bg-white p-12 rounded-[60px] border border-[#1a3c34]/10 shadow-soft">
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-2">
                  <Send className="w-8 h-8 text-[#4a7c59]" />
                  <h2 className="text-3xl font-black uppercase italic text-[#1a3c34] serif leading-tight">Automated Marketing Facility</h2>
                </div>
                <p className="text-[10px] font-black text-[#4a7c59] uppercase tracking-[0.4em] ml-12 italic">Connect with {newsletterCount} archived customers</p>
              </div>

              <form onSubmit={handleSendBlast} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a7c59] ml-4 font-bold">Campaign Subject Line</label>
                  <input 
                    placeholder="E.G., NEW ATELIER SILK DROP" 
                    className="w-full bg-[#eef3f0]/30 border border-[#1a3c34]/10 rounded-3xl p-6 text-[11px] font-black tracking-widest focus:ring-2 focus:ring-[#4a7c59] outline-none placeholder:text-slate-300" 
                    value={blastData.subject} 
                    onChange={e => setBlastData({...blastData, subject: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a7c59] ml-4 font-bold">Master Bulletin Content</label>
                  <textarea 
                    placeholder="CRAFT YOUR LUXURY MESSAGE... MENTION NEW OFFERS, SALES, OR NATURE COLLECTIONS." 
                    className="w-full bg-[#eef3f0]/30 border border-[#1a3c34]/10 rounded-[40px] p-8 text-[11px] font-black tracking-widest focus:ring-2 focus:ring-[#4a7c59] outline-none min-h-[300px] placeholder:text-slate-300" 
                    value={blastData.message} 
                    onChange={e => setBlastData({...blastData, message: e.target.value})} 
                    required 
                  />
                </div>
                <button type="submit" className="w-full bg-[#1a3c34] text-white py-8 rounded-[40px] font-black uppercase tracking-[0.4em] italic hover:bg-[#4a7c59] transition-all shadow-2xl flex items-center justify-center gap-4 group">
                  <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                  Manifest Digital Campaign
                </button>
              </form>
            </div>
          </motion.section>
        )}
        {activeTab === 'reports' && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-10 rounded-[60px] border border-[#1a3c34]/10 shadow-soft">
              <div>
                <h2 className="text-3xl font-black uppercase italic text-[#1a3c34] serif">Business Intelligence</h2>
                <p className="text-[10px] font-black text-[#4a7c59] uppercase tracking-[0.2em] mt-1 italic">Real-time revenue & archival growth tracking</p>
              </div>
              <div className="flex gap-4 p-2 bg-[#eef3f0] rounded-full">
                {(['daily', 'monthly', 'yearly'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setReportTimeframe(t)}
                    className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${reportTimeframe === t ? 'bg-[#1a3c34] text-white shadow-xl' : 'text-slate-400 hover:text-[#1a3c34]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  label: 'Gross Revenue', 
                  value: `₹${orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0).toLocaleString()}`, 
                  icon: DollarSign,
                  change: '+12.5%',
                  positive: true 
                },
                { 
                  label: 'Net Profit (Est. 35%)', 
                  value: `₹${(orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0) * 0.35).toLocaleString()}`, 
                  icon: TrendingUp,
                  change: '+8.2%',
                  positive: true 
                },
                { 
                  label: 'Archival Transmissions', 
                  value: orders.filter(o => o.status !== 'Cancelled').length, 
                  icon: Briefcase,
                  change: '+4 New',
                  positive: true 
                }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-10 rounded-[50px] border border-[#1a3c34]/5 shadow-soft hover:shadow-2xl transition-all group overflow-hidden relative">
                   <stat.icon className="absolute -top-6 -right-6 w-32 h-32 text-[#1a3c34]/5 group-hover:scale-110 transition-transform" />
                   <div className="relative z-10">
                      <p className="text-[10px] font-black text-[#4a7c59] uppercase tracking-[0.3em] mb-4 italic">{stat.label}</p>
                      <h4 className="text-5xl font-black text-[#1a3c34] tracking-tighter italic serif">{stat.value}</h4>
                      <div className={`mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black ${stat.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                         {stat.change} vs PREVIOUS
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[60px] border border-[#1a3c34]/10 overflow-hidden shadow-soft">
              <div className="p-10 border-b border-[#1a3c34]/5 flex justify-between items-center bg-[#fbfdfc]">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-[#1a3c34] rounded-2xl flex items-center justify-center text-white">
                       <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-[#1a3c34] uppercase italic serif tracking-tight">Data Export Master</h3>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        const data = orders.map(o => ({
                          OrderID: o.id,
                          Client: o.userName,
                          Date: o.date,
                          Amount: o.totalAmount,
                          Status: o.status
                        }));
                        const ws = XLSX.utils.json_to_sheet(data);
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "SRM_Sales");
                        XLSX.writeFile(wb, `SRM_Sales_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
                      }}
                      className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl"
                    >
                      <Download className="w-4 h-4" /> EXPORT EXCEL (.XLSX)
                    </button>
                    <button className="flex items-center gap-3 bg-[#1a3c34] text-white px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#4a7c59] transition-all shadow-xl">
                      <Calendar className="w-4 h-4" /> REVENUE BACKUP
                    </button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-[#eef3f0]/30 border-b border-[#1a3c34]/5">
                          {['Transmission ID', 'Client Signature', 'Status', 'Revenue Contribution', 'Date'].map(h => (
                            <th key={h} className="p-8 text-[9px] font-black text-[#4a7c59] uppercase tracking-widest">{h}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a3c34]/5">
                       {orders.slice(0, 10).map(o => (
                         <tr key={o.id} className="hover:bg-[#eef3f0]/20 transition-colors group">
                            <td className="p-8"><span className="text-[11px] font-black text-[#1a3c34] italic font-serif">#{o.id.slice(-8)}</span></td>
                            <td className="p-8"><span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">{o.userName || 'Private Client'}</span></td>
                            <td className="p-8">
                               <span className={`text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${o.status === 'paid' || o.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                  {o.status}
                               </span>
                            </td>
                            <td className="p-8"><span className="text-sm font-black text-[#1a3c34] italic">₹{o.totalAmount.toLocaleString()}</span></td>
                            <td className="p-8 text-[10px] font-bold text-slate-400">{new Date(o.date).toLocaleDateString()}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="p-10 bg-slate-50 text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Archival Data Protected under SRM Integrity Protocols</p>
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {/* Invoice Template Preview Modal */}
      {showInvoicePreview && MOCK_PREVIEW_ORDER && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#0f241f]/90 backdrop-blur-xl">
           <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[60px] p-12 max-w-5xl w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar"
           >
              <button 
                onClick={() => setShowInvoicePreview(false)}
                className="absolute top-8 right-8 p-4 bg-[#eef3f0] rounded-full hover:bg-black hover:text-white transition-all z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-12 text-center">
                <h3 className="text-4xl font-black serif italic uppercase text-[#1a3c34]">Template Review</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4a7c59] mt-2">Active System Invoice Layout v2.4</p>
              </div>

              <Invoice order={MOCK_PREVIEW_ORDER as any} />
           </motion.div>
        </div>
      )}

      {/* Order Status Update Modal */}
      <AnimatePresence>
        {updatingOrderId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-[#0f241f]/95 backdrop-blur-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[60px] p-12 max-w-2xl w-full relative shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
            >
              <button 
                onClick={() => setUpdatingOrderId(null)}
                className="absolute top-8 right-8 p-4 bg-[#eef3f0] rounded-full hover:bg-[#1a3c34] hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#4a7c59] rounded-2xl flex items-center justify-center text-white">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black serif italic uppercase text-[#1a3c34]">Log Update</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4a7c59]">Order ID: {updatingOrderId.slice(-8)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a7c59] ml-4">Select Target Status</label>
                  <select 
                    className="w-full bg-[#eef3f0]/50 border border-[#1a3c34]/10 rounded-[30px] p-6 text-[11px] font-black tracking-widest outline-none focus:ring-2 focus:ring-[#4a7c59]"
                    value={updateStatusData.status}
                    onChange={(e) => setUpdateStatusData({ ...updateStatusData, status: e.target.value })}
                  >
                    <option value="paid">Paid (Initial)</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a7c59] ml-4">Archival Transmission Message</label>
                  <textarea 
                    placeholder="Enter detailed logistic logs, tracking numbers, or nature-archive notes..."
                    className="w-full bg-[#eef3f0]/50 border border-[#1a3c34]/10 rounded-[40px] p-8 text-[11px] font-black tracking-widest outline-none focus:ring-2 focus:ring-[#4a7c59] min-h-[150px]"
                    value={updateStatusData.message}
                    onChange={(e) => setUpdateStatusData({ ...updateStatusData, message: e.target.value })}
                  />
                </div>

                <button 
                  onClick={confirmStatusUpdate}
                  className="w-full bg-[#1a3c34] text-white py-8 rounded-[40px] font-black uppercase tracking-[0.4em] italic hover:bg-[#4a7c59] transition-all shadow-2xl flex items-center justify-center gap-4 group"
                >
                  <CheckCircle className="w-5 h-5 group-hover:scale-125 transition-transform" />
                  Finalize Transmission Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
