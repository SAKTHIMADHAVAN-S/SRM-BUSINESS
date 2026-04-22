import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      if (mode === 'forgot') {
        const res = await api.forgotPassword(formData.email);
        setMessage(res.message);
      } else {
        const user = mode === 'login'
          ? await api.login({ email: formData.email, password: formData.password })
          : await api.signup(formData);
        onSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 pb-0 flex justify-between items-center">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join the Club' : 'Reset Password'}
              </h2>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-100">
                  {error}
                </div>
              )}
              {message && (
                <div className="p-4 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-blue-100">
                  {message}
                </div>
              )}

              <div className="space-y-4">
                {mode === 'signup' && (
                  <div className="relative">
                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="FULL NAME"
                      className="w-full bg-slate-50 border-none rounded-3xl py-4 pl-14 pr-6 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="EMAIL ADDRESS"
                    className="w-full bg-slate-50 border-none rounded-3xl py-4 pl-14 pr-6 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                {mode !== 'forgot' && (
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="PASSWORD"
                      className="w-full bg-slate-50 border-none rounded-3xl py-4 pl-14 pr-6 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-sm tracking-[0.2em] uppercase shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'login' ? 'LOGIN NOW' : mode === 'signup' ? 'CREATE ACCOUNT' : 'SEND RESET LINK')}
              </button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
                >
                  {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
