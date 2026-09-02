import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { superAdminApi } from '../../api/superAdminApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { ChurchLogo } from '../../components/common/ChurchLogo';
import { HeavenlyParticles } from '../../components/common/HeavenlyParticles';
import './Login.css';

export const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const reduceMotion = useReducedMotion();

  const { login } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your administrator email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      const res = await superAdminApi.login({
        email: email.trim(),
        password,
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        success('Welcome back, Super Admin', "May God's grace guide your leadership today.");
        navigate('/superadmin/dashboard');
      } else {
        setErrorMsg(res.message || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to sign in. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fade = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 } };

  return (
    <div className="login-page">
      <motion.div {...fade} transition={{ duration: 0.6 }} className="login-visual login-visual-panel">
        <div className="login-visual__fade" />
        <div className="login-orb login-orb--a animate-heavenly" />
        <div className="login-orb login-orb--b animate-heavenly" style={{ animationDelay: '2s' }} />
        <div className="login-ray login-ray--left animate-light-ray" />
        <HeavenlyParticles />

        <svg className="login-art animate-float" viewBox="0 0 220 280" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="loginGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF4CC" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
          <path d="M40 260 L40 120 Q110 30 180 120 L180 260 Z" stroke="url(#loginGold)" strokeWidth="2.5" />
          <rect x="104" y="90" width="12" height="90" rx="2" fill="url(#loginGold)" />
          <rect x="78" y="118" width="64" height="12" rx="2" fill="url(#loginGold)" />
          <circle cx="110" cy="118" r="36" stroke="url(#loginGold)" strokeWidth="1" opacity="0.6" />
        </svg>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="login-visual__content"
        >
          <ChurchLogo size="lg" light={true} />
          <div className="login-visual__copy">
            <div className="login-pill">
              <ShieldCheck className="icon-sm" />
              <span>Super Admin Portal</span>
            </div>
            <h2 className="login-visual__title font-serif">
              Diocese Central <span className="gold-gradient-text-light font-cinzel">Headquarters</span>
            </h2>
            <p className="login-visual__verse font-serif">
              “Trust in the Lord with all your heart, and do not lean on your own understanding.” — Proverbs 3:5
            </p>
          </div>
        </motion.div>

        <div className="login-visual__foot">
          <div className="login-visual__icon">
            <Sparkles className="icon-md" />
          </div>
          <p>Complete church oversight, branches, pastors, and fund stewardship in one unified platform.</p>
        </div>
      </motion.div>

      <div className="login-form-side">
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="church-card login-card"
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="login-card__head"
          >
            <h3 className="login-card__title font-serif">Welcome Back</h3>
            <p className="login-card__sub">
              May God's grace and peace be with you. Please sign in to continue.
            </p>
          </motion.div>

          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="error-banner">
              {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <Mail className="icon-md input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@example.com"
                  required
                  className="church-input has-icon"
                />
              </div>
            </motion.div>

            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <Lock className="icon-md input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="church-input has-icon has-icon-right"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="icon-btn input-action"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="icon-md" /> : <Eye className="icon-md" />}
                </button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
              className="btn-gold login-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="icon-md icon-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to Super Admin</span>
              )}
            </motion.button>
          </form>

          <div className="login-switch">
            <p>
              Managing a local parish branch?{' '}
              <Link to="/subadmin/login">Parish Admin Login →</Link>
            </p>
            <p className="login-home">
              <Link to="/">← Back to Grace Church home</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
