import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Church, Loader2, Heart } from 'lucide-react';
import { subAdminApi } from '../../api/subAdminApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { ChurchLogo } from '../../components/common/ChurchLogo';
import { HeavenlyParticles } from '../../components/common/HeavenlyParticles';
import './Login.css';

export const SubAdminLogin = () => {
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
      setErrorMsg('Please enter your branch admin email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      const res = await subAdminApi.login({
        email: email.trim(),
        password,
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        success('Welcome to your Church Branch', 'May the Lord bless your ministry and leadership.');
        navigate('/subadmin/dashboard');
      } else {
        setErrorMsg(res.message || 'Login failed. Please verify your credentials.');
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
        <div className="login-orb login-orb--c animate-heavenly" />
        <div className="login-orb login-orb--d animate-heavenly" style={{ animationDelay: '2s' }} />
        <div className="login-ray login-ray--right animate-light-ray" />
        <HeavenlyParticles />

        <svg className="login-dove animate-dove" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
          <path d="M50 30 C45 25 35 25 25 35 C20 40 18 50 20 60 C25 55 35 52 45 54 C55 56 60 62 70 65 C75 58 78 48 72 40 C65 32 55 32 50 30 Z" />
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
              <Church className="icon-sm" />
              <span>Branch Portal</span>
            </div>
            <h2 className="login-visual__title font-serif">
              Local Church <span className="gold-gradient-text-light font-cinzel">Administration</span>
            </h2>
            <p className="login-visual__verse font-serif">
              “For where two or three gather in my name, there am I with them.” — Matthew 18:20
            </p>
          </div>
        </motion.div>

        <div className="login-visual__foot">
          <div className="login-visual__icon">
            <Heart className="icon-md" />
          </div>
          <p>Caring for congregation members, pastors, prayer schedules, tithes, and local church events.</p>
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
            <h3 className="login-card__title font-serif">Parish Admin Sign In</h3>
            <p className="login-card__sub">Serving the church. Connecting the community.</p>
          </motion.div>

          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="error-banner">
              {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
              <label className="form-label">Branch Admin Email</label>
              <div className="input-wrap">
                <Mail className="icon-md input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="branchadmin@church.com"
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
                <span>Sign In to Branch Dashboard</span>
              )}
            </motion.button>
          </form>

          <div className="login-switch">
            <p>
              Are you a Central Diocese Super Admin?{' '}
              <Link to="/superadmin/login">Main Church Login →</Link>
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
