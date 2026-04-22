import { Order } from '../types';
import { ShieldCheck, Download, Printer, Leaf, QrCode } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const Invoice = ({ order, hideButtons = false }: { order: Order, hideButtons?: boolean }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById(`invoice-${order.id}`);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SRM-Invoice-${order.id}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-10 bg-white text-[#1a3c34] font-sans max-w-4xl mx-auto border border-[#1a3c34]/10 rounded-[40px] shadow-soft print:shadow-none print:border-none print:p-0 overflow-hidden relative" id={`invoice-${order.id}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#eef3f0] -skew-x-12 translate-x-1/2 -translate-y-1/2 rounded-full opacity-50" />
        
        <div className="flex justify-between items-start border-b border-[#1a3c34]/10 pb-10 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2 group">
               <Leaf className="w-6 h-6 text-[#4a7c59]" />
               <div className="flex flex-col">
                 <h1 className="text-2xl font-black tracking-tighter text-[#1a3c34] uppercase italic serif leading-[0.7]">SRM</h1>
                 <div className="flex items-center gap-1 mt-1">
                   <div className="h-[0.5px] w-2 bg-[#1a3c34]/20" />
                   <span className="text-[6px] font-black tracking-[0.4em] text-[#4a7c59] uppercase leading-none">FASHIONS</span>
                   <div className="h-[0.5px] w-2 bg-[#1a3c34]/20" />
                 </div>
               </div>
            </div>
            <p className="text-[10px] font-black text-[#4a7c59] uppercase tracking-[0.3em]">Official Purchase Record</p>
          </div>
          <div className="flex items-start gap-6">
            <div className="hidden md:flex flex-col items-center bg-[#eef3f0] p-2 rounded-xl border border-[#1a3c34]/5">
              <QrCode className="w-8 h-8 text-[#1a3c34] opacity-80" />
              <span className="text-[5px] font-black uppercase tracking-widest mt-1">Verify Authenticity</span>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-black tracking-widest uppercase mb-1 serif italic">Invoice</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{order.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 py-10 border-b border-[#1a3c34]/10">
          <div>
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Client Information:</h3>
            <p className="text-sm font-black text-[#1a3c34] uppercase tracking-tight italic">Registered Customer</p>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1 italic">
              {order.shippingAddress || 'Digital Delivery • Standard Shipping Pathway'}
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Transmission Logs:</h3>
            <p className="text-[11px] font-black text-[#1a3c34] uppercase tracking-widest">Date: {new Date(order.date).toLocaleDateString()}</p>
            <div className="flex justify-end items-center gap-2 mt-2">
              <span className="w-2 h-2 bg-[#4a7c59] rounded-full animate-pulse" />
              <p className="text-[10px] font-black text-[#4a7c59] uppercase tracking-widest">STATUS: {order.status.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* New Material Impact section */}
        <div className="py-6 px-10 bg-[#f8faf9] -mx-10 border-b border-[#1a3c34]/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Leaf className="w-5 h-5 text-[#4a7c59]" />
              <div>
                <span className="block text-[8px] font-black text-[#4a7c59] uppercase tracking-widest leading-none mb-1">Eco-Archive Note</span>
                <span className="text-[10px] font-bold text-[#1a3c34] uppercase tracking-widest">Calculated Material Impact: 98% Botanical</span>
              </div>
           </div>
           <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic max-w-[200px] text-right">
             Verified SRM fibers from certified organic origins.
           </div>
        </div>

        <div className="overflow-x-auto py-8">
          <table className="w-full border-collapse">
            <thead className="bg-[#eef3f0]/50 border-y border-[#1a3c34]/5 text-[9px] font-black uppercase tracking-widest text-slate-500">
              <tr>
                <th className="py-5 px-8 text-left">Description</th>
                <th className="py-5 px-8 text-center">Qty</th>
                <th className="py-5 px-8 text-right">Unit Price</th>
                <th className="py-5 px-8 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-black uppercase tracking-tight text-[#1a3c34]">
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-b border-[#1a3c34]/5 group hover:bg-[#eef3f0]/20 transition-colors">
                  <td className="py-5 px-8 italic">{item.name}</td>
                  <td className="py-5 px-8 text-center text-slate-400">{item.quantity}</td>
                  <td className="py-5 px-8 text-right">₹{item.price}</td>
                  <td className="py-5 px-8 text-right">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-[280px] space-y-4 p-8 bg-[#eef3f0]/30 rounded-[30px] border border-[#1a3c34]/5">
            <div className="flex justify-between text-[10px] font-black text-slate-400 px-2">
              <span className="uppercase tracking-widest">Subtotal</span>
              <span>₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-400 px-2">
              <span className="uppercase tracking-widest">Taxes & Fees (GST)</span>
              <span>₹{Math.round(order.totalAmount * 0.18)}</span>
            </div>
            <div className="bg-[#1a3c34] rounded-2xl p-5 flex justify-between items-center text-white mt-4 shadow-xl">
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Total Amount</span>
              <span className="text-2xl font-black italic serif">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-[#1a3c34]/10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-left space-y-4">
              <div className="flex items-center gap-4 text-[#4a7c59]">
                <ShieldCheck className="w-4 h-4" />
                <p className="text-[9px] font-black uppercase tracking-[0.3em] italic">Authentic SRM Commerce Guarantee</p>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic lowercase">This is a system generated digital invoice. No signature required.</p>
           </div>
           
           <div className="flex items-center gap-4 border-2 border-dashed border-[#1a3c34]/10 p-4 rounded-3xl opacity-40 grayscale">
              <div className="w-12 h-12 bg-[#1a3c34] rounded-full flex items-center justify-center text-white">
                 <Leaf className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[8px] font-black uppercase tracking-widest">SRM ATELIER</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Archive</span>
              </div>
           </div>
        </div>
      </div>
      
      {!hideButtons && (
        <div className="flex justify-center gap-4 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-3 px-8 py-4 border-2 border-[#1a3c34] text-[#1a3c34] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#1a3c34] hover:text-white transition-all group"
          >
            <Printer className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Print View
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-3 px-10 py-5 bg-[#1a3c34] text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#4a7c59] transition-all shadow-xl group"
          >
            <Download className="w-4 h-4 group-hover:y-[-2px] transition-transform" />
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};
