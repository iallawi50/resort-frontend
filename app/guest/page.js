'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MOCK_BOOKINGS, formatPrice, formatDate, getStatusLabel } from '../lib/data';

const TABS = [
  { id: 'upcoming', label: 'القادمة' },
  { id: 'completed', label: 'المكتملة' },
  { id: 'cancelled', label: 'الملغاة' },
];

function StarRow({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2, direction: 'ltr' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i<=Math.floor(rating)?'#e8a838':'none'} stroke="#e8a838" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function GuestDashboard() {
  const [tab, setTab] = useState('upcoming');
  const [cancelModal, setCancelModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const bookingsByTab = {
    upcoming: MOCK_BOOKINGS.filter(b => b.status === 'confirmed'),
    completed: MOCK_BOOKINGS.filter(b => b.status === 'completed'),
    cancelled: MOCK_BOOKINGS.filter(b => b.status === 'cancelled'),
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64, minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '32px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div className="avatar avatar-xl" style={{ background: 'var(--primary-dark)', color: 'var(--primary-light)', fontWeight: 700, fontSize: '1.4rem' }}>م</div>
              <div>
                <h2 style={{ marginBottom: 4 }}>مرحباً، محمد السالم <i className="fa-solid fa-hand-wave"></i></h2>
                <div style={{ display: 'flex', gap: 20, color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                  <span><i className="fa-regular fa-calendar-days" style={{ marginLeft: 6 }}></i> عضو منذ يناير 2025</span>
                  <span><i className="fa-solid fa-star" style={{ marginLeft: 6, color: '#e8a838' }}></i> 520 نقطة ولاء (يساوي 52 ريال)</span>
                  <Link href="/guest/profile" style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>تعديل الملف الشخصي</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingTop: 36, paddingBottom: 80 }}>
          <div className="guest-layout">
            {/* Stats */}
            <div className="guest-stats">
              <div className="guest-stat-card">
                <div className="stat-value">{MOCK_BOOKINGS.filter(b=>b.status==='confirmed').length}</div>
                <div className="stat-label">حجوزات قادمة</div>
              </div>
              <div className="guest-stat-card">
                <div className="stat-value">{MOCK_BOOKINGS.filter(b=>b.status==='completed').length}</div>
                <div className="stat-label">رحلات مكتملة</div>
              </div>
              <div className="guest-stat-card">
                <div className="stat-value">520</div>
                <div className="stat-label">نقاط الولاء</div>
              </div>
              <div className="guest-stat-card">
                <div className="stat-value">4.9<i className="fa-solid fa-star" style={{ marginRight: 2, fontSize: '0.8em', color: '#e8a838' }}></i></div>
                <div className="stat-label">تقييمك كضيف</div>
              </div>
            </div>

            {/* Bookings */}
            <div className="card">
              <div className="card-header">
                <h3>حجوزاتي</h3>
              </div>
              <div style={{ padding: '4px 20px 0' }}>
                <div className="tabs">
                  {TABS.map(t => (
                    <button key={t.id} className={`tab${tab===t.id?' active':''}`} onClick={() => setTab(t.id)} id={`tab-${t.id}`}>
                      {t.label} ({bookingsByTab[t.id].length})
                    </button>
                  ))}
                </div>
              </div>
              <div className="card-body">
                {bookingsByTab[tab].length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}><i className="fa-solid fa-house"></i></div>
                    <p>لا توجد حجوزات في هذه الفئة</p>
                    <Link href="/search" className="btn btn-primary" style={{ marginTop: 16 }}>ابحث عن عقار</Link>
                  </div>
                ) : bookingsByTab[tab].map(booking => {
                  const st = getStatusLabel(booking.status);
                  return (
                    <div key={booking.id} className="booking-card" id={`booking-${booking.id}`}>
                      <img src={booking.property.images[0]} alt={booking.property.name} style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <div>
                            <div style={{ fontWeight: 700, marginBottom: 2 }}>{booking.property.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}><i className="fa-solid fa-location-dot" style={{ marginLeft: 6 }}></i> {booking.property.city}</div>
                          </div>
                          <span className={`badge ${st.class}`}>{st.label}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10, flexWrap: 'wrap' }}>
                          <span><i className="fa-regular fa-calendar-days" style={{ marginLeft: 6 }}></i> {booking.checkIn} → {booking.checkOut}</span>
                          <span><i className="fa-solid fa-moon" style={{ marginLeft: 6 }}></i> {booking.nights} ليالٍ</span>
                          <span><i className="fa-solid fa-money-bill-wave" style={{ marginLeft: 6 }}></i> {formatPrice(booking.total)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link href={`/property/${booking.property.id}`} className="btn btn-outline btn-sm">عرض العقار</Link>
                          {booking.status === 'confirmed' && (
                            <button className="btn btn-danger btn-sm" onClick={() => setCancelModal(booking)} id={`cancel-${booking.id}`}>
                              إلغاء الحجز
                            </button>
                          )}
                          {booking.status === 'completed' && (
                            <Link href={`/property/${booking.property.id}#reviews-section`} className="btn btn-primary btn-sm" id={`review-${booking.id}`}>
                              <i className="fa-solid fa-pen-to-square" style={{ marginLeft: 6 }}></i> اكتب تقييماً
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Points History */}
            <div className="card">
              <div className="card-header"><h3>تاريخ نقاط الولاء</h3></div>
              <div className="card-body">
                {[
                  { date: '2026-01-15', desc: 'حجز منتجع النخيل', points: +180, type: 'earn' },
                  { date: '2026-02-22', desc: 'حجز شاليه الواحة', points: +120, type: 'earn' },
                  { date: '2025-12-10', desc: 'استخدام عند الحجز', points: -100, type: 'redeem' },
                  { date: '2025-11-05', desc: 'حجز استراحة النهر', points: +200, type: 'earn' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.desc}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.date}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: item.type==='earn' ? 'var(--text-success)' : 'var(--text-danger)' }}>
                      {item.points > 0 ? '+' : ''}{item.points} نقطة
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="modal-backdrop" onClick={() => setCancelModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} id="cancel-modal">
            <div className="modal-header">
              <h3>تأكيد إلغاء الحجز</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setCancelModal(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              <div className="alert alert-warning" style={{ marginBottom: 16 }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginLeft: 8 }}></i> قد تُطبَّق رسوم إلغاء وفقاً لسياسة العقار.
              </div>
              <p>هل أنت متأكد من إلغاء حجز <strong>{cancelModal.property.name}</strong>؟</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 8 }}>
                التواريخ: {cancelModal.checkIn} → {cancelModal.checkOut}
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setCancelModal(null)}>تراجع</button>
              <button className="btn btn-danger" id="confirm-cancel-btn" onClick={() => { setCancelModal(null); showToast('تم إلغاء الحجز بنجاح'); }}>
                تأكيد الإلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <i className={`fa-solid ${toast.type === 'success' ? 'fa-check' : 'fa-xmark'}`} style={{ marginLeft: 8 }}></i> {toast.msg}
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        .guest-layout { display: flex; flex-direction: column; gap: 28px; }
        .guest-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .guest-stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
        .booking-card { display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); }
        .booking-card:last-child { border-bottom: none; }
        @media (max-width: 768px) { .guest-stats { grid-template-columns: repeat(2, 1fr); } .booking-card img { width: 80px; height: 70px; } }
      `}</style>
    </>
  );
}
