import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Phone,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SHIV_DHARA_LOGO } from '../../lib/assets';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, registerAccount, loginAccount, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isAuthModalOpen) return;

    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const pointer = { x: -1000, y: -1000 };
    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 1 + Math.random() * 2,
      speed: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    let animationFrame = 0;

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.phase += 0.01;
        const distanceX = particle.x - pointer.x;
        const distanceY = particle.y - pointer.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        if (distance < 130 && distance > 0) {
          particle.x += (distanceX / distance) * 0.55;
          particle.y += (distanceY / distance) * 0.55;
        }
        particle.y -= particle.speed;
        if (particle.y < -10) particle.y = canvas.height + 10;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(230,181,90,${0.2 + Math.sin(particle.phase) * 0.1})`;
        context.fill();
      });
      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMessage('Please provide your full name to create an account.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const result = await loginAccount({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (!result.success) {
          if (result.reason === 'WRONG_PASSWORD') {
            setErrorMessage('The password you entered is incorrect. Please check and try again.');
          } else {
            setErrorMessage('No account found with this email. Please click "Setup New Account" to register.');
          }
        }
      } else {
        const success = await registerAccount({
          name: name.trim(),
          email: cleanEmail,
          phone: phone.trim(),
          password: cleanPassword,
        });

        if (!success) {
          setErrorMessage('Could not register account. If you already have an account, please switch to Sign In.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="customer-auth-backdrop"
        data-lenis-prevent
        className="auth-page-scroll fixed inset-0 z-50 flex h-screen min-h-screen items-start justify-center overflow-y-scroll overscroll-contain bg-[#0E2623] bg-[radial-gradient(circle_at_top_left,_rgba(49,92,82,0.8),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(197,106,69,0.22),_transparent_40%)] p-4 sm:p-8"
      >
        <canvas ref={particleCanvasRef} className="pointer-events-none fixed inset-0 h-full w-full opacity-90" aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative z-10 my-4 grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-[2rem] border border-[#E6D5B8] bg-[#FAF6EE] text-[#163A36] shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:my-8"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute right-5 top-5 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-black border border-[#E6D5B8] transition-all cursor-pointer shadow-md hover:scale-105"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Banner */}
          <div className="relative flex items-center justify-center border-b border-[#315C52] bg-gradient-to-b from-[#0E2623] to-[#163A36] p-8 text-center text-[#F7F1E6] sm:p-10">
            
            <div className="relative z-10 max-w-md space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-white p-3 mx-auto border-2 border-[#C56A45]/50 shadow-lg flex items-center justify-center">
                <img src={SHIV_DHARA_LOGO} alt="SHIV DHARA" className="h-full w-full object-contain" />
              </div>

              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E6B55A] font-bold block">
                Sacred Sanctuary Portal
              </span>

              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#F7F1E6] tracking-tight">
                {mode === 'signin' ? 'Welcome Back' : 'Create Sanctuary Account'}
              </h3>
              <p className="text-sm text-[#E6D5B8]/85 max-w-sm mx-auto leading-relaxed font-sans">
                {mode === 'signin'
                  ? 'Sign in to access your consultations, orders, and personalized insights.'
                  : 'Register once to unlock direct booking access, order tracking, and sacred guidance.'}
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div
            data-lenis-prevent
            className="auth-form-scroll max-h-[calc(100vh-13rem)] overflow-y-scroll overscroll-contain p-7 sm:p-10 editor-panel-scroll"
          >
            <div className="mx-auto w-full max-w-lg space-y-5">
            {/* Google 1-Click Button */}
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-4 px-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 text-sm font-bold border border-[#E6D5B8] shadow-sm flex items-center justify-center gap-3 transition-all hover:shadow-md hover:scale-[1.01] cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E6D5B8]" />
              <span className="text-xs uppercase font-mono font-bold text-gray-400">or with email password</span>
              <div className="flex-1 h-px bg-[#E6D5B8]" />
            </div>

            {/* Luxury Mode Switcher */}
            <div className="flex rounded-2xl bg-white p-1.5 border border-[#E6D5B8] shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-[#163A36] text-[#F7F1E6] shadow-md ring-1 ring-[#E6B55A]/50'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#163A36] text-[#F7F1E6] shadow-md ring-1 ring-[#E6B55A]/50'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Setup New Account
              </button>
            </div>

            {/* Error Notification Box */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 shadow-sm"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="leading-snug block">{errorMessage}</span>
                  {mode === 'signin' && errorMessage.includes('No account found') && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMessage(null);
                      }}
                      className="inline-block text-xs font-bold text-[#C56A45] hover:underline cursor-pointer pt-0.5"
                    >
                      Click here to Create Account →
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono font-bold text-[#163A36] uppercase tracking-wider">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jayshil Thakkar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#E6D5B8] text-xs text-[#163A36] focus:outline-none focus:border-[#C56A45] focus:ring-2 focus:ring-[#C56A45]/20 shadow-sm transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-[#163A36] uppercase tracking-wider">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#E6D5B8] text-xs text-[#163A36] focus:outline-none focus:border-[#C56A45] focus:ring-2 focus:ring-[#C56A45]/20 shadow-sm transition-all"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono font-bold text-[#163A36] uppercase tracking-wider">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#E6D5B8] text-xs text-[#163A36] focus:outline-none focus:border-[#C56A45] focus:ring-2 focus:ring-[#C56A45]/20 shadow-sm transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-[#163A36] uppercase tracking-wider">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-white border border-[#E6D5B8] text-xs text-[#163A36] focus:outline-none focus:border-[#C56A45] focus:ring-2 focus:ring-[#C56A45]/20 shadow-sm transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C56A45] via-[#D47E5B] to-[#E6B55A] text-[#0E2623] text-xs font-bold uppercase tracking-[0.15em] hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md mt-3 disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In & Access' : 'Create Sanctuary Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center flex items-center justify-center gap-2 text-[11px] text-gray-500 border-t border-[#E6D5B8]/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Confidential & Secure Seeker Authentication</span>
            </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
