'use client';
import Link from 'next/link';

const FOOTER_LINKS = {
  'للضيوف': [
    { label: 'استكشف العقارات', href: '/search' },
    { label: 'كيف يعمل؟',       href: '/how-it-works' },
    { label: 'باقات الفعاليات', href: '/services' },
    { label: 'برنامج الولاء',   href: '/loyalty' },
  ],
  'للملاك': [
    { label: 'أدرج عقارك',    href: '/host' },
    { label: 'لوحة التحكم',   href: '/host/dashboard' },
    { label: 'الاشتراكات',    href: '/host/subscription' },
    { label: 'مركز المساعدة', href: '/help' },
  ],
  'الشركة': [
    { label: 'من نحن',      href: '/about' },
    { label: 'الأخبار',     href: '/blog' },
    { label: 'وظائف',       href: '/careers' },
    { label: 'تواصل معنا',  href: '/contact' },
  ],
};

const SOCIALS = [
  { icon: 'fa-brands fa-x-twitter',  label: 'إكس',       href: '#' },
  { icon: 'fa-brands fa-instagram',  label: 'إنستغرام',  href: '#' },
  { icon: 'fa-brands fa-snapchat',   label: 'سناب شات',  href: '#' },
  { icon: 'fa-brands fa-whatsapp',   label: 'واتساب',    href: '#' },
];

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="نزهة — الصفحة الرئيسية">
              <div className="footer-logo-icon">
                <i className="fa-solid fa-leaf" aria-hidden="true" />
              </div>
              <span className="footer-logo-text">نزهة</span>
            </Link>
            <p className="footer-description">
              منصة متكاملة لحجز المنتجعات والشاليهات وإدارة الفعاليات في المملكة العربية السعودية.
            </p>
            <div className="footer-socials">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  className="footer-social"
                  aria-label={s.label}
                  rel="noopener noreferrer"
                >
                  <i className={s.icon} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="footer-section-title">{title}</h4>
              <ul className="footer-links-list">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      <i className="fa-solid fa-chevron-left footer-link-arrow" aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-text">
            <i className="fa-regular fa-copyright" aria-hidden="true" /> 2026 نزهة. جميع الحقوق محفوظة.
          </div>
          <div className="footer-bottom-links">
            <Link href="/privacy" className="footer-bottom-link">سياسة الخصوصية</Link>
            <Link href="/terms"   className="footer-bottom-link">الشروط والأحكام</Link>
          </div>
          <div className="payment-row">
            <span className="payment-label">
              <i className="fa-solid fa-shield-halved" aria-hidden="true" /> يقبل:
            </span>
            <div className="payment-badges">
              <span className="payment-badge">مدى</span>
              <span className="payment-badge">Visa</span>
              <span className="payment-badge">STC Pay</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--bg-surface);
          border-top: 1px solid var(--border);
          padding: 56px 0 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        /* Logo */
        .footer-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: inherit; margin-bottom: 14px;
        }
        .footer-logo-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem; color: #fff; flex-shrink: 0;
        }
        .footer-logo-text { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); }

        .footer-description {
          font-size: 0.84rem;
          color: var(--text-muted);
          line-height: 1.75;
          max-width: 260px;
          margin-bottom: 20px;
        }

        /* Socials */
        .footer-socials { display: flex; gap: 8px; flex-wrap: wrap; }
        .footer-social {
          width: 36px; height: 36px; border-radius: var(--radius-md);
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.95rem; color: var(--text-secondary);
          cursor: pointer; transition: all 0.2s;
          text-decoration: none;
        }
        .footer-social:hover {
          border-color: var(--primary);
          background: var(--primary-glow);
          color: var(--primary);
          transform: translateY(-2px);
        }

        /* Link columns */
        .footer-section-title {
          font-size: 0.75rem; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--text-primary); margin-bottom: 16px;
        }
        .footer-links-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-link {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.875rem; color: var(--text-secondary);
          text-decoration: none; transition: color 0.15s;
        }
        .footer-link:hover { color: var(--primary); }
        .footer-link-arrow { font-size: 0.6rem; color: var(--border-light); transition: color 0.15s; }
        .footer-link:hover .footer-link-arrow { color: var(--primary); }

        /* Bottom bar */
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding: 18px 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-bottom-text { font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }
        .footer-bottom-links { display: flex; gap: 16px; flex-wrap: wrap; }
        .footer-bottom-link {
          font-size: 0.78rem; color: var(--text-muted);
          text-decoration: none; transition: color 0.15s;
        }
        .footer-bottom-link:hover { color: var(--primary); }

        .payment-row { display: flex; align-items: center; gap: 8px; }
        .payment-label { font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }
        .payment-badges { display: flex; gap: 6px; flex-wrap: wrap; }
        .payment-badge {
          padding: 3px 9px; border-radius: 5px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          font-size: 0.68rem; font-weight: 700;
          color: var(--text-secondary); letter-spacing: 0.03em;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr 1fr; }
          .footer-brand { grid-column: 1 / -1; }
          .footer-description { max-width: 100%; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .footer-brand { grid-column: 1 / -1; }
          .footer { padding: 40px 0 0; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 14px; }
        }
        @media (max-width: 400px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
