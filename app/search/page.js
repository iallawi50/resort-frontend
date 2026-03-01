'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PROPERTIES, SAUDI_CITIES, AMENITIES, formatPrice } from '../lib/data';

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

export default function SearchPage() {
  const [selectedCity, setSelectedCity] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(5000);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');

  const toggleType = (type) => {
    setSelectedType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };
  const toggleAmenity = (key) => {
    setSelectedAmenities(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  let filtered = PROPERTIES.filter(p => {
    if (selectedCity && p.city !== selectedCity) return false;
    if (p.basePrice < priceMin || p.basePrice > priceMax) return false;
    if (selectedType.length && !selectedType.includes(p.type)) return false;
    if (selectedAmenities.length && !selectedAmenities.every(a => p.amenities.includes(a))) return false;
    if (minRating && p.rating < minRating) return false;
    return true;
  });

  if (sortBy === 'price_asc') filtered = [...filtered].sort((a, b) => a.basePrice - b.basePrice);
  else if (sortBy === 'price_desc') filtered = [...filtered].sort((a, b) => b.basePrice - a.basePrice);
  else if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'newest') filtered = [...filtered].sort((a, b) => b.id - a.id);
  else filtered = [...filtered].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div className="search-topbar">
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                {filtered.length} عقار متاح
                {selectedCity && <span style={{ color: 'var(--primary-light)' }}> في {selectedCity}</span>}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>نتائج مفلترة حسب معاييرك</div>
            </div>
            <select className="form-control" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)} id="sort-select">
              <option value="relevance">الأكثر صلة</option>
              <option value="price_asc">السعر: الأقل أولاً</option>
              <option value="price_desc">السعر: الأعلى أولاً</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="newest">الأحدث</option>
            </select>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className={`btn btn-icon btn-sm ${viewMode==='grid'?'btn-primary':'btn-ghost'}`} onClick={() => setViewMode('grid')} title="عرض شبكي" aria-label="عرض شبكي" id="grid-view-btn">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button className={`btn btn-icon btn-sm ${viewMode==='list'?'btn-primary':'btn-ghost'}`} onClick={() => setViewMode('list')} title="عرض قائمة" aria-label="عرض قائمة" id="list-view-btn">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
              <button className={`btn btn-icon btn-sm ${viewMode==='map'?'btn-primary':'btn-ghost'}`} onClick={() => setViewMode('map')} title="عرض الخريطة" aria-label="عرض الخريطة" id="map-view-btn">
                <i className="fa-solid fa-map-location-dot" style={{ fontSize: '0.9rem' }}></i>
              </button>
            </div>
          </div>
        </div>

        <div className="search-layout container">
          {/* SIDEBAR FILTERS */}
          <aside className="filters-sidebar" id="filters-sidebar">
            <div className="filter-section">
              <h4 className="filter-title">المدينة</h4>
              <select className="form-control" value={selectedCity} onChange={e => setSelectedCity(e.target.value)} id="filter-city">
                <option value="">جميع المدن</option>
                {SAUDI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">السعر / ليلة (ريال)</h4>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <span className="badge badge-primary">{priceMin}</span>
                <span style={{ color: 'var(--text-muted)' }}>—</span>
                <span className="badge badge-primary">{priceMax}</span>
              </div>
              <input type="range" min={0} max={5000} step={100} value={priceMax} onChange={e => setPriceMax(+e.target.value)} id="price-range" aria-label="الحد الأقصى للسعر" />
            </div>

            <div className="filter-section">
              <h4 className="filter-title">نوع العقار</h4>
              <div className="checkbox-group">
                {[{v:'resort',l:'منتجع'},{v:'chalet',l:'شاليه'},{v:'vacation_rental',l:'إيجار سياحي'}].map(t => (
                  <label key={t.v} className="checkbox-item">
                    <input type="checkbox" checked={selectedType.includes(t.v)} onChange={() => toggleType(t.v)} id={`type-${t.v}`} />
                    {t.l}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">المرافق</h4>
              <div className="checkbox-group">
                {AMENITIES.slice(0, 8).map(a => (
                  <label key={a.key} className="checkbox-item">
                    <input type="checkbox" checked={selectedAmenities.includes(a.key)} onChange={() => toggleAmenity(a.key)} id={`amenity-${a.key}`} />
                    <i className={a.icon}></i> {a.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">أدنى تقييم</h4>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0,3,4,4.5].map(r => (
                  <button key={r} className={`btn btn-sm ${minRating===r?'btn-primary':'btn-outline'}`} onClick={() => setMinRating(r)} id={`rating-filter-${r}`}>
                    {r===0?'الكل':<>{r}+<i className="fa-solid fa-star" style={{ marginRight: 2, fontSize: '0.8em' }}></i></>}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} id="clear-filters-btn"
              onClick={() => { setSelectedCity(''); setPriceMax(5000); setSelectedType([]); setSelectedAmenities([]); setMinRating(0); }}>
              مسح الفلاتر
            </button>
          </aside>

          {/* RESULTS */}
          <main className="search-results" id="search-results">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '3rem', marginBottom: 16, color: 'var(--text-muted)' }}><i className="fa-solid fa-house-circle-xmark"></i></div>
                <h3>لا توجد نتائج</h3>
                <p>جرب تعديل الفلاتر للحصول على نتائج أفضل.</p>
              </div>
            ) : (
              viewMode === 'map' ? (
                <div style={{ height: '100%', minHeight: 600, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16, color: 'var(--primary-light)' }}><i className="fa-solid fa-map-location-dot"></i></div>
                    <h3>خريطة العقارات (T-040)</h3>
                    <p>سيتم تضمين خرائط Google هنا لعرض {filtered.length} عقار</p>
                  </div>
                </div>
              ) : (
              <div className={viewMode === 'grid' ? 'results-grid' : 'results-list'}>
                {filtered.map((p, i) => (
                  viewMode === 'grid' ? (
                    <Link href={`/property/${p.id}`} className="property-card" key={p.id} id={`result-${p.id}`} style={{ animationDelay: `${i*0.06}s` }}>
                      <div style={{ position: 'relative' }}>
                        <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                        {p.isFeatured && <span className="badge badge-accent" style={{ position: 'absolute', top: 10, right: 10 }}>مميز</span>}
                        {p.isInstantBook && <span className="badge badge-primary" style={{ position: 'absolute', top: 10, left: 10 }}><i className="fa-solid fa-bolt"></i></span>}
                      </div>
                      <div className="property-card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <div>
                            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 2 }}>{p.name}</h4>
                            <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)' }}><i className="fa-solid fa-location-dot" style={{ marginLeft: 4 }}></i> {p.city} · {p.typeLabel}</div>
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <div className="property-card-price">{formatPrice(p.basePrice)}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ ليلة</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <StarRating rating={p.rating} />
                            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{p.rating} ({p.reviewCount})</span>
                          </div>
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}><i className="fa-solid fa-bed" style={{ marginLeft: 2 }}></i>{p.bedrooms}</span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link href={`/property/${p.id}`} key={p.id} className="result-list-item" id={`result-${p.id}`}>
                      <img src={p.images[0]} alt={p.name} style={{ width: 200, height: 140, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ marginBottom: 4 }}>{p.name}</h4>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}><i className="fa-solid fa-location-dot" style={{ marginLeft: 4 }}></i> {p.city} · {p.typeLabel}</div>
                            <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 10, lineClamp: 2 }}>{p.description.slice(0,100)}...</div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {p.amenities.slice(0,4).map(k => {
                                const a = AMENITIES.find(x => x.key === k);
                                return a ? <span key={k} className="amenity-chip" style={{ fontSize: '0.73rem', padding: '3px 8px' }}><i className={a.icon}></i> {a.label}</span> : null;
                              })}
                            </div>
                          </div>
                          <div style={{ textAlign: 'left', minWidth: 110 }}>
                            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary-light)' }}>{formatPrice(p.basePrice)}</div>
                            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>/ ليلة</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                              <StarRating rating={p.rating} size={12} />
                              <span style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>{p.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
              )
            )}
            
            {/* Pagination Placeholder (T-043) */}
            {filtered.length > 0 && viewMode !== 'map' && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40, gap: 8 }}>
                <button className="btn btn-outline btn-sm" disabled>السابق</button>
                <button className="btn btn-primary btn-sm">1</button>
                <button className="btn btn-ghost btn-sm">2</button>
                <button className="btn btn-ghost btn-sm">3</button>
                <button className="btn btn-outline btn-sm">التالي</button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />

      <style>{`
        .search-topbar { background: var(--bg-surface); border-bottom: 1px solid var(--border); padding: 14px 0; }
        .search-layout { display: grid; grid-template-columns: 280px 1fr; gap: 32px; padding-top: 32px; padding-bottom: 48px; flex: 1; }
        .filters-sidebar { display: flex; flex-direction: column; gap: 0; }
        .filter-section { padding: 20px 0; border-bottom: 1px solid var(--border); }
        .filter-title { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 14px; }
        .search-results { min-height: 400px; }
        .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        .results-list { display: flex; flex-direction: column; gap: 16px; }
        .result-list-item { display: flex; gap: 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; text-decoration: none; color: inherit; transition: all var(--transition-base); }
        .result-list-item:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        
        @media (max-width: 900px) { 
          .search-layout { grid-template-columns: 1fr; } 
          .filters-sidebar { display: none; } 
        }
        @media (max-width: 600px) {
          .result-list-item { flex-direction: column; gap: 12px; }
          .result-list-item img { width: 100% !important; height: 180px !important; }
        }
      `}</style>
    </>
  );
}
