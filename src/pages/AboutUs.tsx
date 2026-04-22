import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sprout, Leaf, Globe, Flower2, Zap } from 'lucide-react';

export const AboutUs = () => {
  return (
    <div className="pt-24 min-h-screen">
      {/* Hero Section */}
      <section className="h-[70vh] relative overflow-hidden flex items-center justify-center bg-[#0f241f]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 grayscale" 
            alt="The SRM Atelier"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f241f]" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-[#4a7c59] self-center" />
              <span className="text-[10px] font-black text-[#4a7c59] uppercase tracking-[0.5em] italic">The House of SRM</span>
              <div className="h-px w-12 bg-[#4a7c59] self-center" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic serif leading-none mb-8">
              Nature Led.<br />Craftsmanship Driven.
            </h1>
            <p className="text-white/60 text-sm md:text-base font-black uppercase tracking-[0.1em] leading-relaxed max-w-2xl mx-auto italic">
              From our botanical beginnings to a global flagship of excellence, 
              SRM Fashions reinvents the relationship between environment and attire.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-[#1a3c34] uppercase tracking-tighter italic serif">Our Archival<br />Philosophy</h2>
              <p className="text-slate-500 text-lg leading-relaxed uppercase tracking-tight font-black italic">
                We do not just produce garments; we curate an ecosystem of luxury. 
                Every piece in the SRM archive is a manifestation of deliberate choice—from the twist of a silk fiber to the curve of a ceramic silhouette.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-[#eef3f0] rounded-[40px] space-y-4">
                <Sprout className="w-8 h-8 text-[#4a7c59]" />
                <h3 className="text-sm font-black text-[#1a3c34] uppercase tracking-widest italic">Sustainable Roots</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  100% Organic fibers and zero-waste patterns are our baseline, not a trend.
                </p>
              </div>
              <div className="p-8 bg-[#eef3f0] rounded-[40px] space-y-4">
                <ShieldCheck className="w-8 h-8 text-[#4a7c59]" />
                <h3 className="text-sm font-black text-[#1a3c34] uppercase tracking-widest italic">Archival Quality</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  Hand-crafted to endure the passage of time and trends.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] rounded-[80px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" 
                className="w-full h-full object-cover"
                alt="Behind the scenes"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-12 rounded-[50px] shadow-2xl border border-[#1a3c34]/5 hidden md:block">
              <div className="flex items-center gap-6">
                <div className="text-left py-2">
                  <p className="text-4xl font-black text-[#1a3c34] leading-none mb-2 italic">100%</p>
                  <p className="text-[10px] font-black text-[#4a7c59] uppercase tracking-widest">Natural Integrity</p>
                </div>
                <div className="w-px h-16 bg-[#1a3c34]/10" />
                <div className="text-left py-2">
                  <p className="text-4xl font-black text-[#1a3c34] leading-none mb-2 italic">2k+</p>
                  <p className="text-[10px] font-black text-[#4a7c59] uppercase tracking-widest">Global Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-[#1a3c34] py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-white italic serif uppercase tracking-tighter mb-4">The SRM Pillars</h2>
            <p className="text-[10px] font-black text-[#4a7c59] uppercase tracking-[0.4em] italic leading-relaxed">Fundamental laws of our atelier</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: 'Botanical Ethics', desc: 'No harmful synthetics. Just nature in its purest form.' },
              { icon: Globe, title: 'Global Legacy', desc: 'Shipping archive excellence to 50+ countries.' },
              { icon: Flower2, title: 'Artisanal Soul', desc: 'Every stitch reflects the artisans unique signature.' },
              { icon: Zap, title: 'High Function', desc: 'Premium style that adapts to your dynamic lifestyle.' },
              { icon: ShieldCheck, title: 'Pure Guarantee', desc: 'A strict no-return policy for hygiene and quality control.' },
              { icon: Sprout, title: 'Future-Proof', desc: 'Carbon-negative shipping for all international orders.' }
            ].map((value, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-12 rounded-[50px] hover:bg-white/10 transition-all group">
                <value.icon className="w-10 h-10 text-[#4a7c59] mb-8 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4 italic leading-none">{value.title}</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
