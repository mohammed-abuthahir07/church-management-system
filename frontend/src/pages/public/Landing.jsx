import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Church,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Users,
  Menu,
  X,
  ArrowRight,
  Heart,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';
import { ChurchLogo } from '../../components/common/ChurchLogo';
import { HeavenlyParticles } from '../../components/common/HeavenlyParticles';
import { SacredArt } from '../../components/common/SacredArt';
import { useAuth } from '../../context/AuthContext';
import './Landing.css';

const inView = (reduceMotion, delay = 0) =>
  reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.22 },
        transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
      };

const VERSES = [
  { text: '“For God so loved the world that He gave His only Son.”', ref: 'John 3:16' },
  { text: '“The Lord is my shepherd; I shall not want.”', ref: 'Psalm 23:1' },
  { text: '“Be still, and know that I am God.”', ref: 'Psalm 46:10' },
  { text: '“Jesus Christ is the same yesterday and today and forever.”', ref: 'Hebrews 13:8' },
];

export const Landing = () => {
  const reduceMotion = useReducedMotion();
  const { isAuthenticated, isSubAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [verseIndex, setVerseIndex] = useState(0);

  const dashboardTo = isSubAdmin ? '/subadmin/dashboard' : '/superadmin/dashboard';

  useEffect(() => {
    const hideMenu = () => {
      if (window.innerWidth >= 900) setMenuOpen(false);
    };
    window.addEventListener('resize', hideMenu);
    return () => window.removeEventListener('resize', hideMenu);
  }, []);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = window.setInterval(() => {
      setVerseIndex((current) => (current + 1) % VERSES.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="landing">
      <header className="landing-nav">
        <ChurchLogo size="md" light={true} />
        <button
          type="button"
          className="landing-nav__toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="icon-xl" /> : <Menu className="icon-xl" />}
        </button>
        <nav className={`landing-nav__links${menuOpen ? ' is-open' : ''}`}>
          <a href="#scripture" onClick={() => setMenuOpen(false)}>Scripture</a>
          <a href="#faith" onClick={() => setMenuOpen(false)}>Our Faith</a>
          <a href="#ministry" onClick={() => setMenuOpen(false)}>Ministry</a>
          <a href="#welcome" onClick={() => setMenuOpen(false)}>Jesus</a>
          <a href="#life" onClick={() => setMenuOpen(false)}>Church Life</a>
          <a href="#portals" onClick={() => setMenuOpen(false)}>Sign In</a>
          {isAuthenticated ? (
            <Link to={dashboardTo} className="btn-gold landing-nav__cta" onClick={() => setMenuOpen(false)}>
              Open Dashboard
            </Link>
          ) : (
            <Link to="/superadmin/login" className="btn-gold landing-nav__cta" onClick={() => setMenuOpen(false)}>
              Admin Sign In
            </Link>
          )}
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero__glow-a animate-pulse-glow" />
        <div className="landing-hero__glow-b" />
        <div className="landing-hero__ray animate-light-ray" />
        <HeavenlyParticles />

        <div className="landing-hero__grid">
          <motion.div className="landing-hero__copy" {...inView(reduceMotion, 0.05)}>
            <p className="landing-kicker font-cinzel">
              <Sparkles className="icon-sm" />
              A house of prayer for all nations
            </p>
            <h1 className="landing-hero__title font-serif">
              Grace Church
              <span className="gold-gradient-text-light font-cinzel"> Management</span>
            </h1>
            <p className="landing-hero__lead">
              Shepherding branches, members, prayer, and stewardship under one faithful roof —
              built for the body of Christ.
            </p>
            <p className="landing-hero__verse font-serif">
              “I am the way, and the truth, and the life.” — John 14:6
            </p>
            <div className="landing-hero__actions">
              <Link to="/subadmin/login" className="btn-gold">
                Parish Admin Login
                <ArrowRight className="icon-md" />
              </Link>
              <Link to="/superadmin/login" className="landing-hero__ghost">
                Super Admin Login
              </Link>
            </div>
          </motion.div>

          <div className="landing-hero__art">
            <motion.div
              className="landing-hero__cross-wrap"
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: [0, -14, 0], rotate: [0, 3, 0] }
              }
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { duration: 6.5, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <span className="landing-hero__halo animate-pulse-glow" aria-hidden="true" />
              <svg className="landing-hero__cross" viewBox="0 0 120 160" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="heroCrossGold" x1="20%" y1="0%" x2="80%" y2="100%">
                    <stop offset="0%" stopColor="#FFF6C8" />
                    <stop offset="45%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#8A680C" />
                  </linearGradient>
                </defs>
                <rect x="49" y="8" width="22" height="144" rx="7" fill="url(#heroCrossGold)" />
                <rect x="10" y="46" width="100" height="22" rx="7" fill="url(#heroCrossGold)" />
              </svg>
            </motion.div>
            <motion.p
              className="landing-hero__art-quote font-cinzel"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: [0.55, 1, 0.55], y: 0 }
              }
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { duration: 4.8, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              Jesus Christ is the same yesterday and today and forever
              <span>Hebrews 13:8</span>
            </motion.p>
          </div>
        </div>
      </section>

      <section className="landing-ticker" aria-live="polite">
        <motion.div
          key={VERSES[verseIndex].ref}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="landing-ticker__inner"
        >
          <Sparkles className="icon-md icon-gold" />
          <p className="landing-ticker__text font-serif">{VERSES[verseIndex].text}</p>
          <span className="landing-ticker__ref">{VERSES[verseIndex].ref}</span>
        </motion.div>
      </section>

      <section id="scripture" className="landing-scripture">
        <motion.div className="landing-scripture__inner" {...inView(reduceMotion, 0.08)}>
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SacredArt variant="bible" />
          </motion.div>
          <div>
            <p className="landing-kicker landing-kicker--dark font-cinzel">
              <BookOpen className="icon-sm" />
              The living Word
            </p>
            <blockquote className="landing-scripture__quote font-serif">
              “Your word is a lamp to my feet and a light to my path.”
            </blockquote>
            <p className="landing-scripture__ref">Psalm 119:105</p>
            <p className="landing-scripture__note">
              Every report, prayer list, and Sunday plan in this house is meant to serve the
              Scriptures — not replace them.
            </p>
          </div>
        </motion.div>
      </section>

      <section id="faith" className="landing-faith">
        <motion.div className="landing-section-head" {...inView(reduceMotion)}>
          <p className="landing-kicker landing-kicker--dark font-cinzel">What we confess</p>
          <h2 className="landing-section-title font-serif">Christ at the center of all things</h2>
          <p className="landing-section-sub">
            We believe one God — Father, Son, and Holy Spirit — and we order church work around the Cross.
          </p>
        </motion.div>
        <div className="landing-faith__grid">
          {[
            { icon: Church, title: 'The Cross', copy: 'Jesus died for our sins. Leadership here is servant-hearted, never self-exalting.' },
            { icon: Sparkles, title: 'The Resurrection', copy: 'Christ is risen. Hope, new members, and new mornings all flow from an empty tomb.' },
            { icon: Heart, title: 'The Holy Spirit', copy: 'Prayer schedules and vigils remind us that the Church is a living temple, not a ledger.' },
            { icon: Users, title: 'The Great Commission', copy: 'Go and make disciples. Branches, pastors, and events exist to send the Gospel out.' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                className="landing-card church-card"
                {...inView(reduceMotion, 0.07 * idx)}
                whileHover={reduceMotion ? undefined : { y: -8, scale: 1.02 }}
              >
                <div className="landing-card__icon">
                  <Icon className="icon-lg" />
                </div>
                <h3 className="landing-card__title font-serif">{item.title}</h3>
                <p className="landing-card__copy">{item.copy}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="ministry" className="landing-ministry">
        <motion.div className="landing-section-head" {...inView(reduceMotion)}>
          <h2 className="landing-section-title font-serif">Called to serve together</h2>
          <p className="landing-section-sub">
            Tools for pastors and administrators who watch over the flock with care.
          </p>
        </motion.div>
        <div className="landing-ministry__grid">
          {[
            { icon: Church, title: 'The Church', copy: 'Every branch gathered under one diocese, one faith, one Lord.' },
            { icon: BookOpen, title: 'The Bible', copy: 'Schedules, prayer, and teaching ordered around the Word of God.' },
            { icon: Users, title: 'The People', copy: 'Members, pastors, and families remembered by name.' },
            { icon: HeartHandshake, title: 'Stewardship', copy: 'Tithes, offerings, and funds handled with holy integrity.' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                className="landing-card church-card"
                {...inView(reduceMotion, 0.08 * idx)}
                whileHover={reduceMotion ? undefined : { y: -6 }}
              >
                <div className="landing-card__icon">
                  <Icon className="icon-lg" />
                </div>
                <h3 className="landing-card__title font-serif">{item.title}</h3>
                <p className="landing-card__copy">{item.copy}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="landing-mosaic">
        <div className="landing-mosaic__grid">
          {[
            { text: '“Love one another as I have loved you.”', ref: 'John 13:34' },
            { text: '“Pray without ceasing.”', ref: '1 Thessalonians 5:17' },
            { text: '“Faithful is He who calls you.”', ref: '1 Thessalonians 5:24' },
          ].map((verse, idx) => (
            <motion.blockquote
              key={verse.ref}
              className="landing-mosaic__card"
              {...inView(reduceMotion, 0.1 * idx)}
              whileHover={reduceMotion ? undefined : { y: -6 }}
            >
              <p className="font-serif">{verse.text}</p>
              <cite>{verse.ref}</cite>
            </motion.blockquote>
          ))}
        </div>
      </section>

      <section id="welcome" className="landing-welcome">
        <motion.div className="landing-welcome__inner" {...inView(reduceMotion, 0.08)}>
          <div className="landing-welcome__cross animate-float">
            <SacredArt variant="cross" />
            <SacredArt variant="dove" className="landing-welcome__dove animate-dove" />
          </div>
          <div>
            <p className="landing-kicker font-cinzel">Jesus, our cornerstone</p>
            <h2 className="landing-section-title font-serif">Come to me, all who are weary</h2>
            <p className="landing-welcome__copy">
              This sanctuary system helps church leaders walk with their congregation —
              from Sunday worship and prayer vigils to donations and branch care.
              Christ remains at the center; the software simply serves the mission.
            </p>
            <ul className="landing-welcome__list">
              <li>We gather in His name, not in our own strength.</li>
              <li>We keep the poor, the widow, and the stranger before us.</li>
              <li>We count offerings as worship, not as a prize.</li>
            </ul>
            <p className="landing-hero__verse landing-welcome__verse font-serif">
              “For where two or three gather in my name, there am I with them.” — Matthew 18:20
            </p>
          </div>
        </motion.div>
      </section>

      <section id="life" className="landing-life">
        <motion.div className="landing-section-head" {...inView(reduceMotion)}>
          <p className="landing-kicker landing-kicker--dark font-cinzel">The life of the church</p>
          <h2 className="landing-section-title font-serif">Worship, prayer, fellowship, and giving</h2>
        </motion.div>
        <div className="landing-life__grid">
          {[
            { icon: Calendar, title: 'Sunday Worship', copy: 'Praise, preaching, and the breaking of bread — the heartbeat of every parish.' },
            { icon: Sparkles, title: 'Prayer & Fasting', copy: 'Morning watches and night vigils that keep the church on her knees.' },
            { icon: Heart, title: 'Fellowship', copy: 'Members, youth, and families walking together as one body in Christ.' },
            { icon: HeartHandshake, title: 'Cheerful Giving', copy: 'Tithes and alms recorded with honesty so ministry can reach the least of these.' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                className="landing-life__card church-card"
                {...inView(reduceMotion, 0.08 * idx)}
                whileHover={reduceMotion ? undefined : { y: -6 }}
              >
                <Icon className="icon-xl icon-gold" />
                <h3 className="landing-card__title font-serif">{item.title}</h3>
                <p className="landing-card__copy">{item.copy}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="portals" className="landing-portals">
        <motion.div className="landing-section-head" {...inView(reduceMotion)}>
          <h2 className="landing-section-title font-serif">Enter the vineyard</h2>
          <p className="landing-section-sub">Sign in only if you are a church administrator.</p>
        </motion.div>
        <div className="landing-portals__grid">
          <motion.div className="landing-portal church-card" {...inView(reduceMotion, 0.05)} whileHover={reduceMotion ? undefined : { y: -6 }}>
            <div className="landing-portal__icon">
              <ShieldCheck className="icon-xl" />
            </div>
            <h3 className="landing-card__title font-serif">Super Administrator</h3>
            <p className="landing-card__copy">
              Oversee every branch, fund allocation, and diocesan announcement.
            </p>
            <Link to="/superadmin/login" className="btn-navy">
              Super Admin Login
              <ArrowRight className="icon-md" />
            </Link>
          </motion.div>
          <motion.div className="landing-portal church-card" {...inView(reduceMotion, 0.15)} whileHover={reduceMotion ? undefined : { y: -6 }}>
            <div className="landing-portal__icon landing-portal__icon--gold">
              <Church className="icon-xl" />
            </div>
            <h3 className="landing-card__title font-serif">Parish Administrator</h3>
            <p className="landing-card__copy">
              Shepherd members, pastors, prayer, events, and local offerings.
            </p>
            <Link to="/subadmin/login" className="btn-gold">
              Parish Admin Login
              <ArrowRight className="icon-md" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="landing-foot">
        <div className="landing-foot__glow" />
        <SacredArt variant="cross" className="landing-foot__cross" />

        <div className="landing-foot__inner">
          <motion.div className="landing-foot__brand" {...inView(reduceMotion, 0.04)}>
            <ChurchLogo size="md" light={true} showSubtitle={false} />
            <p className="landing-foot__about">
              A house of prayer for all nations — serving branches, pastors, and families
              so the Gospel remains at the center of every parish.
            </p>
            <p className="landing-foot__motto font-serif">Soli Deo Gloria</p>
            <div className="landing-foot__social">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="landing-foot__social-link">
                <svg viewBox="0 0 24 24" className="landing-foot__svg" aria-hidden="true"><path fill="currentColor" d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v8h4v-8h3.2L17 12h-4V9c0-.6.4-1 1-1z" /></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="landing-foot__social-link">
                <svg viewBox="0 0 24 24" className="landing-foot__svg" aria-hidden="true"><path fill="currentColor" d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm-4 3.2A4.8 4.8 0 1 1 7.2 13 4.8 4.8 0 0 1 12 8.2zm0 2A2.8 2.8 0 1 0 14.8 13 2.8 2.8 0 0 0 12 10.2zM17.4 7.1a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" /></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="landing-foot__social-link">
                <svg viewBox="0 0 24 24" className="landing-foot__svg" aria-hidden="true"><path fill="currentColor" d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.6V8.8l6.2 3.4-6.2 3.4z" /></svg>
              </a>
            </div>
          </motion.div>

          <motion.div {...inView(reduceMotion, 0.1)}>
            <h3 className="landing-foot__heading font-cinzel">Explore</h3>
            <ul className="landing-foot__links">
              <li><a href="#scripture">Holy Scripture</a></li>
              <li><a href="#faith">Our Faith</a></li>
              <li><a href="#ministry">Ministry</a></li>
              <li><a href="#welcome">Jesus Christ</a></li>
              <li><a href="#life">Church Life</a></li>
              <li><a href="#portals">Admin Sign In</a></li>
            </ul>
          </motion.div>

          <motion.div {...inView(reduceMotion, 0.16)}>
            <h3 className="landing-foot__heading font-cinzel">Gathering</h3>
            <ul className="landing-foot__schedule">
              <li>
                <span className="landing-foot__event-icon"><Clock className="icon-sm" /></span>
                <span>
                  <strong>Sunday Worship</strong>
                  <em>9:00 AM & 11:00 AM</em>
                </span>
              </li>
              <li>
                <span className="landing-foot__event-icon"><Sparkles className="icon-sm" /></span>
                <span>
                  <strong>Midweek Prayer</strong>
                  <em>Wednesday · 7:00 PM</em>
                </span>
              </li>
              <li>
                <span className="landing-foot__event-icon"><Calendar className="icon-sm" /></span>
                <span>
                  <strong>Youth Fellowship</strong>
                  <em>Saturday · 5:00 PM</em>
                </span>
              </li>
              <li>
                <span className="landing-foot__event-icon"><Heart className="icon-sm" /></span>
                <span>
                  <strong>Holy Communion</strong>
                  <em>First Sunday each month</em>
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div {...inView(reduceMotion, 0.22)}>
            <h3 className="landing-foot__heading font-cinzel">Visit Us</h3>
            <ul className="landing-foot__meta">
              <li>
                <span className="landing-foot__event-icon"><MapPin className="icon-sm" /></span>
                <span>Grace Diocese Headquarters<br />1 Sanctuary Way, Chennai</span>
              </li>
              <li>
                <span className="landing-foot__event-icon"><Phone className="icon-sm" /></span>
                <a href="tel:+914412345678">+91 44 1234 5678</a>
              </li>
              <li>
                <span className="landing-foot__event-icon"><Mail className="icon-sm" /></span>
                <a href="mailto:hello@gracechurch.org">hello@gracechurch.org</a>
              </li>
            </ul>
            <div className="landing-foot__portals">
              <Link to="/superadmin/login">Super Admin</Link>
              <Link to="/subadmin/login">Parish Admin</Link>
            </div>
          </motion.div>
        </div>

        <div className="landing-foot__blessing-bar">
          <p className="landing-foot__blessing font-serif">
            “The Lord bless you and keep you; the Lord make His face shine upon you.” — Numbers 6:24–25
          </p>
        </div>

        <div className="landing-foot__legal">
          <p>© {new Date().getFullYear()} Grace Church Management System. All rights reserved.</p>
          <p>Built to serve the body of Christ.</p>
        </div>
      </footer>
    </div>
  );
};
