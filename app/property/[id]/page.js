'use client';
import { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { PROPERTIES, AMENITIES, REVIEWS, SERVICE_PACKAGES, formatPrice, formatDate } from '../../lib/data';

function StarRating({ rating, interactive = false, onRate, size = 16 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 3, direction: 'ltr', cursor: interactive ? 'pointer' : 'default' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= (interactive ? (hover || rating) : Math.floor(rating)) ? '#e8a838' : 'none'}
          stroke="#e8a838" strokeWidth="1.5"
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(i)}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function PropertyDetailPage({ params }) {
  const { id } = use(params);
  const property = PROPERTIES.find(p => p.id === parseInt(id)) || PROPERTIES[0];
  const reviews = REVIEWS.filter(r => r.propertyId === property.id);
  const cityPackages = SERVICE_PACKAGES.filter(pkg => pkg.cities.some(c => c === property.city || c === 'جميع المدن السعودية'));

  const [activeImg, setActiveImg] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [points, setPoints] = useState(false);

  const nights = checkIn && checkOut ? Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 1;
  const baseAmount = property.basePrice * nights;
  const packagesTotal = selectedPackages.reduce((sum, pkgId) => {
    const pkg = SERVICE_PACKAGES.find(p => p.id === pkgId);
    if (!pkg) return sum;
    const addonsTotal = (selectedAddons[pkgId] || []).reduce((s, aId) => {
      const a = pkg.addons.find(x => x.id === aId);
      return s + (a?.priceDelta || 0);
    }, 0);
    return sum + pkg.basePrice + addonsTotal;
  }, 0);
  const serviceFee = Math.round((baseAmount + packagesTotal) * 0.05);
  const couponDiscount = couponApplied ? Math.round(baseAmount * 0.1) : 0;
  const pointsDiscount = points ? 200 : 0;
  const total = baseAmount + property.cleaningFee + packagesTotal + serviceFee - couponDiscount - pointsDiscount;

  const togglePackage = (pkgId) => {
    setSelectedPackages(prev => prev.includes(pkgId) ? prev.filter(i => i !== pkgId) : [...prev, pkgId]);
  };
  const toggleAddon = (pkgId, addonId) => {
    setSelectedAddons(prev => {
      const current = prev[pkgId] || [];
      return { ...prev, [pkgId]: current.includes(addonId) ? current.filter(i => i !== addonId) : [...current, addonId] };
    });
  };

  const handleReviewSubmit = () => {
    if (reviewRating > 0 && reviewText.length >= 20) {
      setReviewSuccess(true);
      setTimeout(() => { setShowReviewModal(false); setReviewSuccess(false); setReviewRating(0); setReviewText(''); }, 1500);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        {/* Photo Gallery */}
        <div className="gallery-container" id="gallery">
          <img src={property.images[activeImg]} alt={property.name} className="gallery-main" />
          <div className="gallery-thumbs">
            {property.images.map((img, i) => (
              <img key={i} src={img} alt="" className={`gallery-thumb${activeImg===i?' active':''}`} onClick={() => setActiveImg(i)} />
            ))}
          </div>
        </div>

        <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
          <div className="property-detail-layout">
            {/* LEFT COLUMN */}
            <div className="property-detail-main">
              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">{property.typeLabel}</span>
                  {property.isFeatured && <span className="badge badge-accent"><i className="fa-solid fa-star" style={{ marginLeft: 4 }}></i> مميز</span>}
                  {property.isInstantBook && <span className="badge badge-success"><i className="fa-solid fa-bolt" style={{ marginLeft: 4 }}></i> حجز فوري</span>}
                </div>
                <h1 style={{ marginBottom: 8 }}>{property.name}</h1>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.88rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StarRating rating={property.rating} size={14} />
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{property.rating}</span>
                    <span>({property.reviewCount} تقييم)</span>
                  </div>
                  <span><i className="fa-solid fa-location-dot" style={{ marginLeft: 4 }}></i> {property.city}</span>
                  <span><i className="fa-solid fa-bed" style={{ marginLeft: 4 }}></i> {property.bedrooms} غرف</span>
                  <span><i className="fa-solid fa-shower" style={{ marginLeft: 4 }}></i> {property.bathrooms} حمامات</span>
                </div>
              </div>

              <div className="divider" style={{ marginBottom: 24 }} />

              {/* Host */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div className="avatar avatar-lg" style={{ background: 'var(--primary-dark)', color: 'var(--primary-light)', fontWeight: 700 }}>
                  {property.host.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>يُدار من قِبل {property.host.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    نسبة الاستجابة {property.host.responseRate}% · عضو منذ {property.host.memberSince}
                  </div>
                </div>
              </div>

              <div className="divider" style={{ marginBottom: 24 }} />

              {/* Description */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ marginBottom: 12 }}>عن العقار</h3>
                <p style={{ lineHeight: 1.85, color: 'var(--text-secondary)' }}>{property.description}</p>
              </div>

              {/* Amenities */}
              <div style={{ marginBottom: 32 }} id="amenities-section">
                <h3 style={{ marginBottom: 20 }}>المرافق والخدمات</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {property.amenities.map(key => {
                    const a = AMENITIES.find(x => x.key === key);
                    return a ? (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        <span style={{ width: 28, fontSize: '1.25rem', color: 'var(--primary)', textAlign: 'center' }}><i className={a.icon}></i></span> 
                        {a.label}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Rules */}
              <div style={{ marginBottom: 32 }} id="rules-section">
                <h3 style={{ marginBottom: 16 }}>قواعد العقار</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {[
                    { icon: <i className="fa-solid fa-smoking"></i>, label: 'التدخين', allowed: property.rules.smoking },
                    { icon: <i className="fa-solid fa-paw"></i>, label: 'الحيوانات الأليفة', allowed: property.rules.pets },
                    { icon: <i className="fa-solid fa-champagne-glasses"></i>, label: 'الحفلات', allowed: property.rules.parties },
                    { icon: <i className="fa-regular fa-clock"></i>, label: `تسجيل الدخول: ${property.rules.checkIn}`, allowed: true },
                    { icon: <i className="fa-solid fa-clock"></i>, label: `تسجيل الخروج: ${property.rules.checkOut}`, allowed: true },
                  ].map((rule, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      <span>{rule.icon}</span>
                      <span>{rule.label}</span>
                      {typeof rule.allowed === 'boolean' && (
                        <span style={{ color: rule.allowed ? 'var(--text-success)' : 'var(--text-danger)', marginRight: 'auto' }}>
                          {rule.allowed ? <><i className="fa-solid fa-check" style={{ marginLeft: 4 }}></i> مسموح</> : <><i className="fa-solid fa-xmark" style={{ marginLeft: 4 }}></i> غير مسموح</>}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {property.securityDeposit > 0 && (
                  <div className="alert alert-warning" style={{ marginTop: 14 }}>
                    <i className="fa-solid fa-circle-exclamation" style={{ marginLeft: 6 }}></i> التأمين: {formatPrice(property.securityDeposit)} — يُدفع نقداً عند الوصول ويُرد عند المغادرة
                  </div>
                )}
              </div>

              {/* Map Section (T-050) */}
              <div style={{ marginBottom: 32 }} id="map-section">
                <h3 style={{ marginBottom: 16 }}>موقع العقار</h3>
                <div style={{ height: 320, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12, color: 'var(--danger)' }}><i className="fa-solid fa-location-dot"></i></div>
                    <h4 style={{ marginBottom: 4 }}>خريطة الموقع (T-050)</h4>
                    <p style={{ fontSize: '0.85rem' }}>سيتم تضمين الخريطة الجغرافية لعرض موقع العقار الدقيق في {property.city}</p>
                  </div>
                </div>
              </div>

              {/* Event Packages */}
              {cityPackages.length > 0 && (
                <div style={{ marginBottom: 32 }} id="packages-section">
                  <h3 style={{ marginBottom: 16 }}>باقات الفعاليات في {property.city}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {cityPackages.map(pkg => (
                      <div key={pkg.id} className={`package-item${selectedPackages.includes(pkg.id)?' selected':''}`} id={`package-${pkg.id}`}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                          <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>
                            {pkg.category==='photography'?<i className="fa-solid fa-camera" />:pkg.category==='decoration'?<i className="fa-solid fa-wand-magic-sparkles" />:pkg.category==='beverage'?<i className="fa-solid fa-mug-hot" />:<i className="fa-solid fa-music" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: 4 }}>{pkg.name}</h4>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>{pkg.description}</p>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 800, color: 'var(--primary-light)' }}>{formatPrice(pkg.basePrice)}+</div>
                                <button
                                  className={`btn btn-sm ${selectedPackages.includes(pkg.id)?'btn-primary':'btn-outline'}`}
                                  style={{ marginTop: 6 }}
                                  onClick={() => togglePackage(pkg.id)}
                                  id={`select-package-${pkg.id}`}
                                >
                                  {selectedPackages.includes(pkg.id) ? <><i className="fa-solid fa-check" style={{ marginLeft: 4 }}></i> مختار</> : 'اختر'}
                                </button>
                              </div>
                            </div>
                            {selectedPackages.includes(pkg.id) && (
                              <div style={{ marginTop: 8 }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>الإضافات الاختيارية:</div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                  {pkg.addons.map(addon => (
                                    <label key={addon.id} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.8rem', padding: '4px 10px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: `1px solid ${(selectedAddons[pkg.id]||[]).includes(addon.id)?'var(--primary)':'var(--border)'}` }}>
                                      <input type="checkbox" checked={(selectedAddons[pkg.id]||[]).includes(addon.id)} onChange={() => toggleAddon(pkg.id, addon.id)} style={{ accentColor: 'var(--primary)' }} />
                                      {addon.name} (+{formatPrice(addon.priceDelta)})
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div style={{ marginBottom: 32 }} id="reviews-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3>التقييمات ({property.reviewCount})</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StarRating rating={property.rating} size={18} />
                    <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>{property.rating}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {reviews.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>لا توجد تقييمات بعد. كن أول من يكتب تقييماً!</p>
                  ) : reviews.map(r => (
                    <div key={r.id} style={{ padding: '16px 20px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                        <div className="avatar" style={{ background: 'var(--primary-dark)', color: 'var(--primary-light)', fontWeight: 700 }}>{r.reviewer.initials}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{r.reviewer.name}</div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <StarRating rating={r.rating} size={12} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(r.date)}</span>
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>{r.text}</p>
                    </div>
                  ))}
                </div>
                <button className="btn btn-outline btn-sm" style={{ marginTop: 16 }} onClick={() => setShowReviewModal(true)} id="write-review-btn">
                  <i className="fa-solid fa-pen-to-square" style={{ marginLeft: 6 }}></i> اكتب تقييماً
                </button>
              </div>
            </div>

            {/* RIGHT: BOOKING PANEL */}
            <aside className="booking-panel" id="booking-panel">
              <div style={{ position: 'sticky', top: 90 }}>
                <div className="card">
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary-light)' }}>{formatPrice(property.basePrice)}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>/ ليلة</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <StarRating rating={property.rating} size={13} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{property.rating}</span>
                      </div>
                    </div>

                    {/* Date Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)', marginBottom: 10 }}>
                      <div style={{ padding: '10px 12px', borderLeft: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الوصول</div>
                        <input type="date" className="form-control" style={{ border: 'none', padding: 0, background: 'transparent', fontSize: '0.85rem' }} value={checkIn} onChange={e => setCheckIn(e.target.value)} id="checkin-date" />
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>المغادرة</div>
                        <input type="date" className="form-control" style={{ border: 'none', padding: 0, background: 'transparent', fontSize: '0.85rem' }} value={checkOut} onChange={e => setCheckOut(e.target.value)} id="checkout-date" />
                      </div>
                    </div>

                    {/* Coupon & Points */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input className="form-control" placeholder="كود الخصم" value={coupon} onChange={e => setCoupon(e.target.value)} id="coupon-input" style={{ flex: 1 }} />
                        <button className="btn btn-outline btn-sm" onClick={() => setCouponApplied(coupon.length > 0)} id="apply-coupon-btn" style={{ flexShrink: 0 }}>تطبيق</button>
                      </div>
                      {couponApplied && <div className="alert alert-success" style={{ padding: '8px 12px', fontSize: '0.8rem' }}><i className="fa-solid fa-circle-check" style={{ marginLeft: 6 }}></i> تم تطبيق الخصم 10%</div>}
                      <label className="checkbox-item" style={{ marginTop: 8 }}>
                        <input type="checkbox" checked={points} onChange={e => setPoints(e.target.checked)} id="use-points" />
                        استخدام نقاط الولاء (200 ريال متاح)
                      </label>
                    </div>

                    {/* Price Breakdown */}
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 16 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>تفاصيل السعر</div>
                      {[
                        { label: `${formatPrice(property.basePrice)} × ${nights} ليلة`, value: baseAmount },
                        { label: 'رسوم النظافة', value: property.cleaningFee },
                        ...(packagesTotal > 0 ? [{ label: 'إجمالي الباقات', value: packagesTotal }] : []),
                        { label: 'رسوم الخدمة (5%)', value: serviceFee },
                        ...(couponDiscount > 0 ? [{ label: 'خصم الكوبون', value: -couponDiscount }] : []),
                        ...(pointsDiscount > 0 ? [{ label: 'نقاط الولاء', value: -pointsDiscount }] : []),
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', marginBottom: 6, color: item.value < 0 ? 'var(--text-success)' : 'var(--text-secondary)' }}>
                          <span>{item.label}</span>
                          <span>{item.value < 0 ? '-' : ''}{formatPrice(Math.abs(item.value))}</span>
                        </div>
                      ))}
                      <div className="divider" style={{ margin: '10px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        <span>الإجمالي</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>

                    <Link href={`/booking/${property.id}`} className="btn btn-accent btn-lg" style={{ width: '100%', justifyContent: 'center' }} id="book-now-btn">
                      {property.isInstantBook ? <><i className="fa-solid fa-bolt" style={{ marginLeft: 6 }}></i> احجز الآن فوراً</> : <><i className="fa-regular fa-envelope" style={{ marginLeft: 6 }}></i> طلب حجز</>}
                    </Link>

                    {property.isInstantBook && (
                      <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 10 }}>
                        لن يتم خصم المبلغ قبل تأكيد الحجز
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="modal-backdrop" onClick={() => setShowReviewModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} id="review-modal">
            <div className="modal-header">
              <h3>اكتب تقييمك</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowReviewModal(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              {reviewSuccess ? (
                <div className="alert alert-success" style={{ justifyContent: 'center', padding: 24 }}>
                  <i className="fa-solid fa-circle-check" style={{ marginLeft: 8 }}></i> شكراً! تم نشر تقييمك بنجاح.
                </div>
              ) : (
                <>
                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label className="form-label">تقييمك العام</label>
                    <StarRating rating={reviewRating} interactive onRate={setReviewRating} size={28} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">رأيك في العقار (20-500 حرف)</label>
                    <textarea className="form-control" rows={4} value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="شاركنا تجربتك بصدق..." id="review-text" />
                    <div style={{ fontSize: '0.75rem', color: reviewText.length < 20 ? 'var(--text-danger)' : 'var(--text-muted)', textAlign: 'left' }}>{reviewText.length}/500</div>
                  </div>
                </>
              )}
            </div>
            {!reviewSuccess && (
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setShowReviewModal(false)}>إلغاء</button>
                <button className="btn btn-primary" onClick={handleReviewSubmit} disabled={reviewRating === 0 || reviewText.length < 20} id="submit-review-btn">
                  نشر التقييم
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        .gallery-container { width: 100%; max-height: 500px; overflow: hidden; background: var(--bg-surface); position: relative; }
        .gallery-main { width: 100%; height: 440px; object-fit: cover; display: block; }
        .gallery-thumbs { display: flex; gap: 8px; position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); background: rgba(10,15,13,0.7); backdrop-filter: blur(10px); padding: 8px; border-radius: var(--radius-lg); }
        .gallery-thumb { width: 60px; height: 44px; object-fit: cover; border-radius: var(--radius-sm); cursor: pointer; opacity: 0.6; transition: all 0.2s; border: 2px solid transparent; }
        .gallery-thumb.active, .gallery-thumb:hover { opacity: 1; border-color: var(--primary-light); }
        .property-detail-layout { display: grid; grid-template-columns: 1fr 380px; gap: 48px; }
        .property-detail-main { min-width: 0; }
        .booking-panel { min-width: 0; }
        .package-item { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; transition: all 0.2s; }
        .package-item.selected { border-color: var(--primary); background: var(--primary-glow); }
        @media (max-width: 1024px) { .property-detail-layout { grid-template-columns: 1fr; } .booking-panel { display: none; } }
        @media (max-width: 600px) { .gallery-main { height: 260px; } .gallery-thumbs { display: none; } }
      `}</style>
    </>
  );
}
