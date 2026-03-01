'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/',        label: 'الرئيسية',  icon: 'fa-house' },
  { href: '/search',  label: 'استكشف',    icon: 'fa-compass' },
  { href: '/host',    label: 'للملاك',    icon: 'fa-building' },
  { href: '/services',label: 'الخدمات',   icon: 'fa-star' },
];

const USER_MENU = [
  { href: '/guest',          label: 'حجوزاتي',       icon: 'fa-calendar-check' },
  { href: '/guest/profile',  label: 'حسابي',         icon: 'fa-user' },
  { href: '/host/dashboard', label: 'بوابة الملاك',  icon: 'fa-home' },
  { href: '/provider/dashboard', label: 'بوابة المزودين',  icon: 'fa-box-open' },
  { href: '/admin/dashboard',label: 'لوحة الإدارة',  icon: 'fa-shield-halved' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navRef  = useRef(null);
  const dropRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Hide navbar on dashboard pages
  const isDashboard = pathname?.startsWith('/host/dashboard') ||
                      pathname?.startsWith('/admin') ||
                      pathname?.startsWith('/provider') ||
                      pathname?.startsWith('/host/property');
  if (isDashboard) return null;

  return (
    <nav
      ref={navRef}
      className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}
      role="navigation"
      aria-label="القائمة الرئيسية"
    >
      <div className="nav-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo" aria-label="نزهة — الصفحة الرئيسية" id="nav-logo">
          <div className="navbar-logo-icon">
            <i className="fa-solid fa-leaf" aria-hidden="true" />
          </div>
          <span className="navbar-logo-text">نزهة</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar-links" role="menubar">
          {NAV_LINKS.map(link => (
            <li key={link.href} role="none">
              <Link
                href={link.href}
                className={`navbar-link${pathname === link.href ? ' active' : ''}`}
                role="menuitem"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Search */}
          <Link href="/search" className="btn btn-outline btn-sm nav-search-btn" id="nav-search-btn">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <span className="nav-btn-label">بحث</span>
          </Link>

          {/* User menu */}
          <div className="nav-user-wrap" ref={dropRef}>
            <button
              className="navbar-avatar"
              id="user-menu-btn"
              aria-label="قائمة المستخدم"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              onClick={() => setUserMenuOpen(v => !v)}
            >
              <i className="fa-solid fa-user" aria-hidden="true" />
            </button>

            {userMenuOpen && (
              <div className="navbar-dropdown" role="menu" aria-label="قائمة الحساب">
                <div className="navbar-dropdown-header">
                  <div className="avatar">م</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>محمد السالم</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>m.salem@email.com</div>
                  </div>
                </div>
                <div className="navbar-dropdown-divider" />
                {USER_MENU.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="navbar-dropdown-item"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                    {item.label}
                  </Link>
                ))}
                <div className="navbar-dropdown-divider" />
                <Link
                  href="/auth/login"
                  className="navbar-dropdown-item"
                  style={{ color: 'var(--text-danger)' }}
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
                  تسجيل الخروج
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="navbar-menu-btn"
            aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            id="hamburger-btn"
            onClick={() => setMenuOpen(v => !v)}
          >
            <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          className="mobile-overlay"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu"
        className={`navbar-mobile${menuOpen ? ' open' : ''}`}
        role="menu"
        aria-label="القائمة الرئيسية"
      >
        {/* Mobile nav links */}
        <nav style={{ padding: '8px 0' }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-mobile-link${pathname === link.href ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
              role="menuitem"
            >
              <i className={`fa-solid ${link.icon}`} aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-mobile-divider" />

        {/* Mobile user links */}
        <nav style={{ padding: '8px 0' }}>
          {USER_MENU.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="navbar-mobile-link"
              onClick={() => setMenuOpen(false)}
              role="menuitem"
            >
              <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-mobile-divider" />

        {/* Auth buttons */}
        <div style={{ display: 'flex', gap: 10, padding: '14px 16px 20px' }}>
          <Link
            href="/auth/login"
            className="btn btn-outline btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setMenuOpen(false)}
            id="mobile-login-btn"
          >
            <i className="fa-solid fa-right-to-bracket" aria-hidden="true" />
            دخول
          </Link>
          <Link
            href="/auth/register"
            className="btn btn-primary btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setMenuOpen(false)}
            id="mobile-register-btn"
          >
            <i className="fa-solid fa-user-plus" aria-hidden="true" />
            تسجيل
          </Link>
        </div>
      </div>

      <style>{`
        /* ===== NAVBAR BASE ===== */
        .navbar {
          position: fixed; top: 0; right: 0; left: 0;
          z-index: var(--z-navbar);
          transition: background 0.3s ease, box-shadow 0.3s ease;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .navbar-scrolled {
          box-shadow: var(--shadow-sm);
        }

        /* Inner row */
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 var(--space-lg);
          gap: 12px;
        }
        @media (max-width: 640px) {
          .nav-inner { padding: 0 var(--space-md); }
        }

        /* Logo */
        .navbar-logo {
          display: flex; align-items: center; gap: 9px;
          text-decoration: none; flex-shrink: 0;
        }
        .navbar-logo-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; color: #fff;
          box-shadow: var(--shadow-primary);
          flex-shrink: 0;
        }
        .navbar-logo-text {
          font-size: 1.3rem; font-weight: 800; color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        /* Desktop links */
        .navbar-links {
          display: flex; align-items: center; gap: 2px;
          list-style: none; margin: 0 auto;
        }
        .navbar-link {
          padding: 8px 14px; border-radius: var(--radius-md);
          font-size: 0.88rem; font-weight: 600;
          color: var(--text-secondary); transition: all 0.2s;
          text-decoration: none; white-space: nowrap;
        }
        .navbar-link:hover { color: var(--text-primary); background: var(--bg-elevated); }
        .navbar-link.active { color: var(--primary); background: var(--primary-glow); }

        /* Actions row */
        .navbar-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        /* Search btn label hidden below 860px */
        @media (max-width: 860px) {
          .nav-btn-label { display: none; }
          .nav-search-btn { padding: 8px 12px; }
        }

        /* User avatar button */
        .nav-user-wrap { position: relative; }
        .navbar-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: var(--bg-elevated);
          border: 1.5px solid var(--border-primary);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; color: var(--primary-dark);
          cursor: pointer; transition: all 0.2s;
          touch-action: manipulation;
        }
        .navbar-avatar:hover {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
          background: var(--primary-glow);
        }

        /* Dropdown */
        .navbar-dropdown {
          position: absolute; left: 0; top: calc(100% + 10px);
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 6px;
          min-width: 220px;
          box-shadow: var(--shadow-lg);
          animation: fadeInUp 0.2s ease;
          z-index: 210;
        }
        .navbar-dropdown-header {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 8px 12px;
        }
        .navbar-dropdown-divider { height: 1px; background: var(--border); margin: 4px 0; }
        .navbar-dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: var(--radius-md);
          font-size: 0.85rem; font-weight: 500;
          color: var(--text-secondary); cursor: pointer;
          transition: all 0.15s; text-decoration: none;
        }
        .navbar-dropdown-item:hover { background: var(--bg-elevated); color: var(--text-primary); }
        .navbar-dropdown-item i { width: 16px; text-align: center; color: var(--text-muted); }

        /* ===== HAMBURGER BUTTON ===== */
        .navbar-menu-btn {
          display: none;
          background: var(--bg-elevated);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          width: 42px; height: 42px;
          cursor: pointer;
          align-items: center; justify-content: center;
          font-size: 1.05rem;
          color: var(--text-primary);
          transition: all 0.2s;
          flex-shrink: 0;
          touch-action: manipulation;
        }
        .navbar-menu-btn:hover {
          background: var(--primary-glow);
          border-color: var(--primary);
          color: var(--primary);
        }

        /* ===== MOBILE OVERLAY ===== */
        .mobile-overlay {
          position: fixed; inset: 0; top: 64px;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(2px);
          z-index: calc(var(--z-navbar) - 1);
          animation: fadeIn 0.2s ease;
        }

        /* ===== MOBILE DRAWER ===== */
        .navbar-mobile {
          position: fixed;
          top: 64px; right: 0; left: 0;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          z-index: calc(var(--z-navbar) - 1);
          transform: translateY(-8px);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.25s ease, opacity 0.2s ease;
          max-height: calc(100svh - 64px);
          overflow-y: auto;
        }
        .navbar-mobile.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .navbar-mobile-link {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 20px;
          font-size: 0.95rem; font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.15s;
          border-radius: 0;
          min-height: 50px;
        }
        .navbar-mobile-link i {
          width: 20px; text-align: center; font-size: 0.9rem;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .navbar-mobile-link:hover { background: var(--bg-elevated); color: var(--text-primary); }
        .navbar-mobile-link:hover i { color: var(--primary); }
        .navbar-mobile-link.active { color: var(--primary); background: var(--primary-glow); font-weight: 700; }
        .navbar-mobile-link.active i { color: var(--primary); }
        .navbar-mobile-divider { height: 1px; background: var(--border); margin: 2px 0; }

        /* ===== RESPONSIVE BREAKPOINTS ===== */
        @media (max-width: 768px) {
          .navbar-links   { display: none; }
          .navbar-menu-btn { display: flex; }
          /* Hide desktop user-avatar on very small; keep hamburger */
          .nav-user-wrap { display: none; }
        }

        @media (max-width: 480px) {
          .navbar-logo-text { font-size: 1.15rem; }
        }
      `}</style>
    </nav>
  );
}
