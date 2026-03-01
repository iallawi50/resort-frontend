'use client';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PROPERTIES, SERVICE_PACKAGES, AMENITIES, SAUDI_CITIES, formatPrice } from './lib/data';

function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2, direction: 'ltr' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.floor(rating) ? '#e8a838' : 'none'} stroke="#e8a838" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

function PropertyCard({ property }) {
  return (
    <Link href={`/property/${property.id}`} className="property-card animate-fade-in-up" id={`property-card-${property.id}`}>
      <div style={{ position: 'relative' }}>
        <img
          src={property.images[0]}
          alt={property.name}
          className="property-card-img"
          style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', background: 'var(--bg-elevated)' }}
        />
        {property.isFeatured && (
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <span className="badge badge-accent"><i className="fa-solid fa-star" style={{ marginLeft: 4 }}></i> مميز</span>
          </div>
        )}
        {property.isInstantBook && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span className="badge badge-primary"><i className="fa-solid fa-bolt" style={{ marginLeft: 4 }}></i> حجز فوري</span>
          </div>
        )}
      </div>
      <div className="property-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 2 }}>{property.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {property.city}
              <span>·</span>
              <span>{property.typeLabel}</span>
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div className="property-card-price">{formatPrice(property.basePrice)}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/ ليلة</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <StarRating rating={property.rating} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {property.rating} ({property.reviewCount})
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span><i className="fa-solid fa-bed" style={{ marginLeft: 4 }}></i> {property.bedrooms}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function HeroSearchBar() {
  return (
    <div className="hero-searchbar">
      <div className="hero-search-field">
        <label className="hero-search-label">
          <svg width="14" height="14" fill="none" stroke="var(--primary-light)" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          الوجهة
        </label>
        <select className="hero-search-input" id="hero-city-select">
          <option value="">جميع المدن</option>
          {SAUDI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="hero-search-divider" />
      <div className="hero-search-field">
        <label className="hero-search-label">
          <svg width="14" height="14" fill="none" stroke="var(--primary-light)" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          تسجيل الدخول
        </label>
        <input type="date" className="hero-search-input" id="hero-checkin" />
      </div>
      <div className="hero-search-divider" />
      <div className="hero-search-field">
        <label className="hero-search-label">
          <svg width="14" height="14" fill="none" stroke="var(--primary-light)" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          تسجيل الخروج
        </label>
        <input type="date" className="hero-search-input" id="hero-checkout" />
      </div>
      <div className="hero-search-divider" />

      <Link href="/search" className="btn btn-accent btn-lg hero-search-btn" id="hero-search-submit">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        ابحث الآن
      </Link>
    </div>
  );
}

export default function HomePage() {
  const featured = PROPERTIES.filter(p => p.isFeatured);
  const allProps = PROPERTIES;

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="hero-section" id="hero">
        <div className="hero-bg">
          <img src="/resort_hero.png" alt="منتجع فاخر" className="hero-bg-img" />
          <div className="hero-overlay" />
        </div>
        <div className="container hero-content">
          <div className="animate-fade-in-up">
            <div className="badge badge-accent" style={{ marginBottom: 16, fontSize: '0.8rem' }}>
              <i className="fa-solid fa-flag" style={{ marginLeft: 6 }}></i> المنصة الأولى للسياحة الداخلية في السعودية
            </div>
            <h1 className="hero-title">
              ابحث عن
              <span className="text-gradient"> إقامتك المثالية </span>
              في المملكة
            </h1>
            <p className="hero-subtitle">
              أكثر من 300 منتجع وشاليه في كل أنحاء المملكة العربية السعودية.<br />
              احجز في دقيقة واستمتع بتجربة لا تُنسى.
            </p>
          </div>
          <div className="animate-fade-in-up delay-2">
            <HeroSearchBar />
          </div>
          <div className="hero-stats animate-fade-in-up delay-3">
            {[
              { value: '+300', label: 'عقار مميز' },
              { value: '+18K', label: 'حجز ناجح' },
              { value: <>4.8<i className="fa-solid fa-star" style={{ marginRight: 2, fontSize: '0.8em' }}></i></>, label: 'متوسط التقييم' },
              { value: '20+', label: 'مدينة سعودية' },
            ].map(stat => (
              <div className="hero-stat" key={stat.label}>
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      <section className="section" id="featured-properties">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">العقارات المميزة</div>
              <h2>اكتشف أفضل الوجهات</h2>
            </div>
            <Link href="/search" className="btn btn-outline">
              عرض الكل
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {featured.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CITY FILTER ===== */}
      <section style={{ padding: '40px 0', background: 'var(--bg-surface)' }} id="cities-section">
        <div className="container">
          <div className="section-eyebrow text-center" style={{ marginBottom: 8 }}>استكشف بالمدينة</div>
          <h2 className="text-center" style={{ marginBottom: 32 }}>وجهاتنا في المملكة</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['الرياض', 'جدة', 'أبها', 'الدمام', 'الطائف', 'الأحساء', 'تبوك'].map(city => (
              <Link
                key={city}
                href={`/search?city=${city}`}
                className="city-pill"
                id={`city-${city}`}
              >
                <span style={{ fontSize: '1.1rem' }}><i className="fa-solid fa-location-dot"></i></span>
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ALL PROPERTIES ===== */}
      <section className="section" id="all-properties">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">جميع العقارات</div>
              <h2>تصفح مجموعتنا الكاملة</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {allProps.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 0.08}s` }}>
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EVENT SERVICES ===== */}
      <section style={{ padding: '60px 0', background: 'var(--bg-surface)' }} id="event-services">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 40 }}>
            <div className="section-eyebrow">باقات الفعاليات</div>
            <h2>اجعل مناسبتك أكثر تميزاً</h2>
            <p style={{ marginTop: 12, fontSize: '0.9rem' }}>أضف خدمات متخصصة مباشرة لحجزك — تصوير، ديكور، ضيافة، وأكثر.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {SERVICE_PACKAGES.map(pkg => (
              <div className="service-card" key={pkg.id} id={`service-${pkg.id}`}>
                <div className="service-icon">{pkg.category === 'photography' ? <i className="fa-solid fa-camera"></i> : pkg.category === 'decoration' ? <i className="fa-solid fa-wand-magic-sparkles"></i> : pkg.category === 'beverage' ? <i className="fa-solid fa-mug-hot"></i> : <i className="fa-solid fa-music"></i>}</div>
                <h4 style={{ marginBottom: 6, fontSize: '0.95rem' }}>{pkg.name}</h4>
                <p style={{ fontSize: '0.8rem', marginBottom: 12, color: 'var(--text-muted)' }}>{pkg.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-light)' }}>
                    {formatPrice(pkg.basePrice)}+
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <i className="fa-solid fa-star" style={{ color: '#e8a838' }}></i> {pkg.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <div className="section-eyebrow">كيف يعمل نزهة؟</div>
            <h2>ثلاث خطوات وأنت في وجهتك</h2>
          </div>
          <div className="how-steps-grid" style={{ display: 'grid', gap: 32 }}>
            {[
              { step:'01', icon:<i className="fa-solid fa-magnifying-glass"></i>, title:'ابحث واستكشف', desc:'استخدم مرشحاتنا الذكية للعثور على العقار المثالي حسب المدينة والميزانية والمرافق.' },
              { step:'02', icon:<i className="fa-regular fa-calendar-check"></i>, title:'احجز بأمان', desc:'ادفع بسهولة عبر مدى أو فيزا أو STC Pay. حجزك مؤمّن وتأكيدك فوري.' },
              { step:'03', icon:<i className="fa-solid fa-house-user"></i>, title:'استمتع بإقامتك', desc:'تحقق من وصولك واستمتع بتجربة استثنائية مع كل الخدمات جاهزة لك.' },
            ].map(item => (
              <div className="how-step" key={item.step}>
                <div className="how-step-number">{item.step}</div>
                <div className="how-step-icon">{item.icon}</div>
                <h3 style={{ marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA HOST ===== */}
      <section className="host-cta" id="host-cta">
        <div className="container">
          <div className="host-cta-content">
            <div>
              <div className="section-eyebrow">للملاك والمستثمرين</div>
              <h2>أدرج عقارك وابدأ تحقيق الدخل</h2>
              <p style={{ marginTop: 12, marginBottom: 28, maxWidth: 520 }}>
                انضم لأكثر من 210 مالك عقار يديرون حجوزاتهم بكفاءة عالية عبر منصة نزهة.
                أدوات احترافية، تقارير مفصلة، ودعم مستمر.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/host" className="btn btn-primary btn-lg" id="list-property-btn">
                  أدرج عقارك الآن
                </Link>
                <Link href="/host/dashboard" className="btn btn-outline btn-lg">
                  لوحة الملاك
                </Link>
              </div>
            </div>
            <div className="host-cta-img">
              <img src="/resort_interior.png" alt="لوحة تحكم الملاك" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-xl)' }} />
              <div className="host-cta-overlay">
                <div className="host-cta-stat">
                  <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#fff' }}>74%</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>متوسط الإشغال</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        /* SEARCH BAR */
        .hero-searchbar {
          display: flex; align-items: stretch; gap: 0;
          background: var(--bg-card); border: 1px solid var(--border-light);
          border-radius: var(--radius-xl); padding: 6px; box-shadow: var(--shadow-lg);
          flex-wrap: wrap;
        }
        .hero-search-field { flex: 1; min-width: 150px; padding: 10px 16px; display: flex; flex-direction: column; gap: 4px; }
        .hero-search-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--primary-light); display: flex; align-items: center; gap: 4px; }
        .hero-search-input { background: none; border: none; outline: none; color: var(--text-primary); font-size: 0.9rem; font-family: var(--font-body); font-weight: 500; }
        .hero-search-input::placeholder { color: var(--text-muted); }
        .hero-search-input option { background: var(--bg-card); }
        .hero-search-divider { width: 1px; background: var(--border); margin: 8px 0; }
        .hero-search-btn { border-radius: var(--radius-lg); margin: 4px; flex-shrink: 0; }
        
        /* HERO STATS */
        .hero-stats { display: flex; gap: 32px; margin-top: 48px; flex-wrap: wrap; }
        .hero-stat { display: flex; flex-direction: column; gap: 4px; }
        .hero-stat-value { font-size: 1.6rem; font-weight: 800; color: #fff; }
        .hero-stat-label { font-size: 0.75rem; color: rgba(240,245,242,0.6); letter-spacing: 0.04em; }

        /* CITY PILLS */
        .city-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: var(--radius-full);
          background: var(--bg-card); border: 1px solid var(--border);
          font-size: 0.88rem; font-weight: 600; color: var(--text-secondary);
          cursor: pointer; transition: all 0.2s; text-decoration: none;
        }
        .city-pill:hover { border-color: var(--primary); color: var(--primary-light); background: var(--primary-glow); transform: translateY(-2px); }

        /* SERVICE CARDS */
        .service-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 24px;
          transition: all 0.25s; cursor: pointer;
        }
        .service-card:hover { border-color: var(--border-primary); transform: translateY(-3px); box-shadow: var(--shadow-primary); }
        .service-icon { font-size: 2rem; margin-bottom: 12px; }

        /* HOW IT WORKS */
        .how-steps-grid { grid-template-columns: repeat(3, 1fr); }
        .how-step {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius-xl); padding: 32px; position: relative;
          transition: all 0.25s;
        }
        .how-step:hover { border-color: var(--border-primary); transform: translateY(-4px); }
        .how-step-number {
          position: absolute; top: -18px; right: 24px;
          font-size: 2.5rem; font-weight: 900; color: var(--border);
          line-height: 1;
        }
        .how-step-icon { font-size: 2rem; margin-bottom: 16px; margin-top: 8px; }

        /* HOST CTA */
        .host-cta {
          padding: 80px 0;
          background: linear-gradient(135deg, var(--primary-dark) 0%, var(--bg-surface) 100%);
        }
        .host-cta-content { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .host-cta-img { position: relative; height: 380px; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--border-primary); }
        .host-cta-overlay { position: absolute; bottom: 20px; right: 20px; background: rgba(10,15,13,0.8); backdrop-filter: blur(10px); padding: 16px 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-primary); }

        @media (max-width: 900px) {
          .host-cta-content { grid-template-columns: 1fr; }
          .host-cta-img { height: 240px; }
          .hero-searchbar { flex-direction: column; }
          .hero-search-divider { width: 100%; height: 1px; margin: 0; }
          .how-steps-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .how-steps-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
