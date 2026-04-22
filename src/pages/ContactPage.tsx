import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Globe, MessageSquare } from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Left: Contact Info */}
        <div className="space-y-16">
          <div className="space-y-6">
            <h1 className="text-7xl font-black text-[#1a3c34] uppercase tracking-tighter italic serif leading-[0.8] mb-4">Direct<br />Communication.</h1>
            <p className="text-[10px] font-black text-[#4a7c59] uppercase tracking-[0.4em] italic mb-12">Assistance from the SRM Atelier</p>
          </div>

          <div className="space-y-12">
            {[
              { icon: Mail, label: 'Email Correspondence', value: 'atelier@srmfashions.com', desc: 'Secure response within 24 archival hours.' },
              { icon: Phone, label: 'Voice Transmission', value: '+91 98765 43210', desc: 'Mon - Fri | 10:00 - 18:00 IST' },
              { icon: MapPin, label: 'Global Headquarters', value: 'Atelier Floor 4, SRM Tower, Mumbai, India', desc: 'Viewing by strictly vetted appointment only.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-8 group">
                <div className="w-16 h-16 bg-[#eef3f0] rounded-[24px] flex items-center justify-center group-hover:bg-[#1a3c34] group-hover:text-white transition-all shadow-sm">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2 py-1">
                  <span className="block text-[9px] font-black text-[#4a7c59] uppercase tracking-widest leading-none">{item.label}</span>
                  <p className="text-xl font-black text-[#1a3c34] uppercase tracking-tighter leading-none italic">{item.value}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-10 bg-[#1a3c34] rounded-[50px] shadow-2xl relative overflow-hidden">
            <Globe className="absolute -top-10 -right-10 w-40 h-40 text-white/5" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-[#4a7c59]" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white italic uppercase tracking-widest leading-none mb-2">Live Support Hub</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">System active for real-time tracking assistance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-[#eef3f0] rounded-[60px] p-12 lg:p-20 relative shadow-soft border border-[#1a3c34]/5">
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="h-full flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="w-20 h-20 bg-[#4a7c59] rounded-full flex items-center justify-center shadow-2xl">
                <Send className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-[#1a3c34] uppercase tracking-tighter italic serif leading-tight">Transmission<br />Successful.</h2>
                <p className="text-[10px] font-black text-[#4a7c59] uppercase tracking-widest mt-4">The Atelier will analyze your query shortly.</p>
              </div>
              <button onClick={() => setSubmitted(false)} className="text-[11px] font-black uppercase tracking-widest text-[#1a3c34] border-b-2 border-[#1a3c34]/10 pb-2 hover:border-[#1a3c34] transition-all">NEW CORRESPONDENCE</button>
            </motion.div>
          ) : (
            <div className="space-y-12">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-[#1a3c34] uppercase tracking-tighter italic serif leading-none">Initiate Inquiry</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Full data protection guaranteed</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-8">
                  {[
                    { label: 'ARCHIVAL NAME', type: 'text', placeholder: 'IDENTIFY YOURSELF' },
                    { label: 'CONTACT ADDRESS', type: 'email', placeholder: 'YOUR EMAIL SIGNATURE' }
                  ].map((field, idx) => (
                    <div key={idx} className="space-y-4">
                      <label className="text-[10px] font-black text-[#1a3c34] uppercase tracking-[0.3em] ml-4">{field.label}</label>
                      <input 
                        required 
                        type={field.type} 
                        placeholder={field.placeholder} 
                        className="w-full bg-white border-2 border-transparent p-6 rounded-[30px] outline-none text-sm font-black uppercase tracking-widest focus:border-[#4a7c59] transition-all placeholder:text-slate-200"
                      />
                    </div>
                  ))}
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#1a3c34] uppercase tracking-[0.3em] ml-4">YOUR QUERY</label>
                    <textarea 
                      required 
                      rows={4} 
                      placeholder="DETAILED SPECIFICATIONS OF YOUR REQUEST..."
                      className="w-full bg-white border-2 border-transparent p-8 rounded-[40px] outline-none text-sm font-black uppercase tracking-widest focus:border-[#4a7c59] transition-all placeholder:text-slate-200 resize-none"
                    />
                  </div>
                </div>

                <button className="w-full bg-[#1a3c34] text-white py-8 rounded-[40px] font-black text-[12px] tracking-[0.4em] uppercase italic flex items-center justify-center gap-6 hover:bg-[#4a7c59] transition-all shadow-2xl active:scale-[0.98] group">
                  Finalize Transmission <Send className="w-5 h-5 group-hover:-rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
