'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SERVICE_PACKAGES, SAUDI_CITIES, formatPrice } from '../lib/data';

function StarRating({ rating, size = 13 }) {
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

export default function ServicesPage() {
  const [selectedCity, setSelectedCity] = useState('');
  const [priceMax, setPriceMax] = useState(3000);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast({msg}); setTimeout(() => setToast(null), 3000); };

  const toggleCategory = (cat) => {
    setSelectedCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  let filtered = SERVICE_PACKAGES.filter(p => {
    if (selectedCity && !p.cities.includes(selectedCity) && !p.cities.includes('جميع المدن السعودية')) return false;
    if (p.basePrice > priceMax) return false;
    if (selectedCategory.length && !selectedCategory.includes(p.category)) return false;
    if (minRating && p.rating < minRating) return false;
    return true;
  });

  if (sortBy === 'price_asc') filtered = [...filtered].sort((a, b) => a.basePrice - b.basePrice);
  else if (sortBy === 'price_desc') filtered = [...filtered].sort((a, b) => b.basePrice - a.basePrice);
  else if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="search-topbar">
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                {filtered.length} خدمة متوفرة
                {selectedCity && <span style={{ color: 'var(--primary-light)' }}> في {selectedCity}</span>}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>لإضافة لمسة خاصة على مناسبتك</div>
            </div>
            <select className="form-control" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="rating">الأعلى تقييماً</option>
              <option value="price_asc">السعر: الأقل أولاً</option>
              <option value="price_desc">السعر: الأعلى أولاً</option>
            </select>
          </div>
        </div>

        <div className="search-layout container" dir="rtl">
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h4 className="filter-title">المدينة</h4>
              <select className="form-control" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                <option value="">جميع المدن</option>
                {SAUDI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-section">
              <h4 className="filter-title">السعر الأقصى (ريال)</h4>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <span className="badge badge-primary">{priceMax}</span>
              </div>
              <input type="range" min={0} max={3000} step={100} value={priceMax} onChange={e => setPriceMax(+e.target.value)} />
            </div>
            <div className="filter-section">
              <h4 className="filter-title">الفئة</h4>
              <div className="checkbox-group">
                {[{v:'photography',l:'تصوير'},{v:'decoration',l:'ديكور وزينة'},{v:'beverage',l:'ضيافة'},{v:'sound',l:'صوتيات وإضاءة'}].map(t => (
                  <label key={t.v} className="checkbox-item">
                    <input type="checkbox" checked={selectedCategory.includes(t.v)} onChange={() => toggleCategory(t.v)} />
                    {t.l}
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-section">
              <h4 className="filter-title">أدنى تقييم</h4>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0,4,4.5,4.8].map(r => (
                  <button key={r} className={`btn btn-sm ${minRating===r?'btn-primary':'btn-outline'}`} onClick={() => setMinRating(r)}>
                    {r===0?'الكل':<>{r}+<i className="fa-solid fa-star" style={{ marginRight: 2, fontSize: '0.8em' }}></i></>}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={() => { setSelectedCity(''); setPriceMax(3000); setSelectedCategory([]); setMinRating(0); }}> مسح الفلاتر </button>
          </aside>

          <main className="search-results">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '3rem', marginBottom: 16, color: 'var(--text-muted)' }}><i className="fa-solid fa-box-open"></i></div>
                <h3>لا توجد خدمات تناسب الفلتر</h3>
                <p>جرب تعديل بعض معايير البحث.</p>
              </div>
            ) : (
              <div className="results-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {filtered.map((s, i) => {
                   let icon = 'fa-camera';
                   if (s.category === 'decoration') icon = 'fa-wand-magic-sparkles';
                   if (s.category === 'beverage') icon = 'fa-mug-hot';
                   if (s.category === 'sound') icon = 'fa-music';

                   return (
                  <div key={s.id} className="card property-card" style={{ padding: 20, animationDelay: `${i*0.06}s`, cursor: 'default' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div className="avatar" style={{ background: 'var(--primary-glow)', color: 'var(--primary-dark)', fontSize: '1.2rem', width: 44, height: 44 }}><i className={`fa-solid ${icon}`}></i></div>
                      <span className="badge badge-info">{s.categoryLabel}</span>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>{s.name}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}><i className="fa-solid fa-store" style={{ marginLeft: 6 }}></i> {s.providerName}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <StarRating rating={s.rating} />
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{s.rating}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {s.description}
                      </p>
                    </div>
                    {s.addons && s.addons.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                        يتوفر {s.addons.length} إضافات اختيارية
                      </div>
                    )}
                    <div className="divider" style={{ margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>السعر الأساسي</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-light)' }}>{formatPrice(s.basePrice)}</div>
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => showToast('هذه الخدمة جاهزة للطلب ضمن الحجوزات')}>طلب الخدمة</button>
                    </div>
                  </div>
                )})}
              </div>
            )}
          </main>
        </div>
      </div>
      
      {toast && (
        <div className="toast-container">
          <div className="toast success"><i className="fa-solid fa-check" style={{ marginLeft: 8 }}></i> {toast.msg}</div>
        </div>
      )}
      
      <Footer />
      <style>{`
        .search-topbar { background: var(--bg-surface); border-bottom: 1px solid var(--border); padding: 14px 0; }
        .search-layout { display: grid; grid-template-columns: 280px 1fr; gap: 32px; padding-top: 32px; padding-bottom: 48px; flex: 1; }
        .filters-sidebar { display: flex; flex-direction: column; gap: 0; }
        .filter-section { padding: 20px 0; border-bottom: 1px solid var(--border); }
        .filter-title { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 14px; }
        .search-results { min-height: 400px; }
        .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        @media (max-width: 900px) { .search-layout { grid-template-columns: 1fr; } .filters-sidebar { display: none; } }
      `}</style>
    </>
  );
}
