'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PROPERTIES, MOCK_BOOKINGS, HOST_STATS, formatPrice, getStatusLabel } from '../../lib/data';

const NAV_ITEMS = [
  { id: 'overview', label: 'نظرة عامة', icon: <i className="fa-solid fa-chart-line"></i> },
  { id: 'properties', label: 'عقاراتي', icon: <i className="fa-solid fa-house-user"></i> },
  { id: 'bookings', label: 'الحجوزات', icon: <i className="fa-regular fa-calendar-days"></i> },
  { id: 'calendar', label: 'التقويم', icon: <i className="fa-regular fa-calendar-check"></i> },
  { id: 'external', label: 'الحجوزات الخارجية', icon: <i className="fa-solid fa-link"></i> },
  { id: 'staff', label: 'الموظفون', icon: <i className="fa-solid fa-users"></i> },
  { id: 'analytics', label: 'التحليلات', icon: <i className="fa-solid fa-chart-pie"></i> },
  { id: 'subscription', label: 'الاشتراك', icon: <i className="fa-regular fa-gem"></i> },
];

function StatCard({ icon, label, value, change, color }) {
  return (
    <div className="stat-card" style={{ borderColor: color ? `${color}33` : 'var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ fontSize: '1.6rem' }}>{icon}</div>
        {change && <div className={`stat-change ${change > 0 ? 'up' : 'down'}`}>{change > 0 ? '↑' : '↓'} {Math.abs(change)}%</div>}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function MiniChart({ data, color = 'var(--primary)' }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, background: color, opacity: 0.5 + (i/(data.length-1))*0.5, borderRadius: '2px 2px 0 0', height: `${(v/max)*100}%`, minHeight: 4 }} />
      ))}
    </div>
  );
}

export default function HostDashboard() {
  const [activeNav, setActiveNav] = useState('overview');
  const [showAddExternal, setShowAddExternal] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="dashboard-layout" dir="rtl">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} style={{ display: 'block' }}></div>}

      {/* SIDEBAR */}
      <aside className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>ن</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>نزهة</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>بوابة الملاك</div>
            </div>
          </Link>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button key={item.id} className={`sidebar-item${activeNav===item.id?' active':''}`} onClick={() => { setActiveNav(item.id); setIsSidebarOpen(false); }} id={`nav-${item.id}`}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'bookings' && <span className="badge badge-danger" style={{ marginRight: 'auto', fontSize: '0.65rem', padding: '2px 6px' }}>3</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar" style={{ background: 'var(--primary-dark)', color: 'var(--primary-light)', fontWeight: 700 }}>ع</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>عبدالله المنيع</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>الاشتراك السنوي <i className="fa-solid fa-check" style={{ marginLeft: 4 }}></i></div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div style={{ borderBottom: '1px solid var(--border)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.15rem' }}>
            {NAV_ITEMS.find(n => n.id === activeNav)?.icon} {NAV_ITEMS.find(n => n.id === activeNav)?.label}
          </h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/host/property/add" className="btn btn-primary btn-sm hide-mobile" id="add-property-btn">
              + إضافة عقار
            </Link>
            <Link href="/" className="btn btn-ghost btn-sm">
              ↗ الموقع الرئيسي
            </Link>
          </div>
        </div>

        <button className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle Sidebar">
          <i className="fa-solid fa-bars"></i>
        </button>

        <div className="page-content">
          {/* OVERVIEW */}
          {activeNav === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Welcome */}
              <div className="alert alert-info">
                <i className="fa-solid fa-hand-wave" style={{ marginLeft: 8 }}></i> مرحباً بك في لوحة تحكم الملاك! لديك <strong>3 طلبات حجز</strong> تنتظر الموافقة.
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <StatCard icon={<i className="fa-regular fa-calendar-days"></i>} label="حجوزات هذا الشهر" value={HOST_STATS.confirmedBookings.month} change={12} />
                <StatCard icon={<i className="fa-solid fa-money-bill-wave"></i>} label="إيرادات الشهر" value={formatPrice(HOST_STATS.revenue.total)} change={8} />
                <StatCard icon={<i className="fa-solid fa-percent"></i>} label="نسبة الإشغال" value={`${HOST_STATS.occupancyRate}%`} change={5} />
                <StatCard icon={<i className="fa-solid fa-star" style={{ color: '#e8a838' }}></i>} label="متوسط التقييم" value={HOST_STATS.averageRating} />
              </div>

              {/* Revenue Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                <div className="card">
                  <div className="card-header"><h4>اتجاه الإيرادات (آخر 6 أشهر)</h4></div>
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {['سبت', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذوالقعدة'].map(m => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                    <MiniChart data={[32000, 45000, 38000, 72000, 55000, HOST_STATS.revenue.total]} />
                    <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--primary)', opacity: 0.8 }} />
                        منصة نزهة: {formatPrice(HOST_STATS.revenue.platform)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)', opacity: 0.8 }} />
                        خارجية: {formatPrice(HOST_STATS.revenue.external)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header"><h4>الإجراءات المطلوبة</h4></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { label: 'طلبات انتظار الموافقة', count: 3, color: 'var(--text-warning)' },
                      { label: 'رسائل غير مقروءة', count: HOST_STATS.unreadMessages, color: 'var(--text-info)' },
                      { label: 'تقييمات جديدة', count: 2, color: 'var(--text-success)' },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                        <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
                        <span style={{ fontWeight: 800, color: item.color }}>{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="card">
                <div className="card-header">
                  <h4>أحدث الحجوزات</h4>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveNav('bookings')}>عرض الكل</button>
                </div>
                <div>
                  <table className="table">
                    <thead>
                      <tr><th>رقم الحجز</th><th>العقار</th><th>الضيف</th><th>التواريخ</th><th>الإجمالي</th><th>الحالة</th><th></th></tr>
                    </thead>
                    <tbody>
                      {MOCK_BOOKINGS.map(b => {
                        const st = getStatusLabel(b.status);
                        return (
                          <tr key={b.id}>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{b.id}</td>
                            <td style={{ fontWeight: 600 }}>{b.property.name}</td>
                            <td>محمد السالم</td>
                            <td style={{ fontSize: '0.82rem' }}>{b.checkIn} → {b.checkOut}</td>
                            <td style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{formatPrice(b.total)}</td>
                            <td><span className={`badge ${st.class}`}>{st.label}</span></td>
                            <td>
                              {b.status === 'confirmed' && (
                                <div style={{ display: 'flex', gap: 4 }}>
                                  <button className="btn btn-success btn-sm" style={{ background: 'var(--success-bg)', color: 'var(--text-success)', border: '1px solid rgba(76,175,125,0.3)' }} onClick={() => showToast('تم قبول الحجز')} id={`approve-${b.id}`}>قبول</button>
                                  <button className="btn btn-danger btn-sm" onClick={() => showToast('تم رفض الحجز', 'error')} id={`reject-${b.id}`}>رفض</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PROPERTIES */}
          {activeNav === 'properties' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} id="properties-list">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{PROPERTIES.length} عقارات نشطة</div>
                <Link href="/host/property/add" className="btn btn-primary btn-sm">+ إضافة عقار جديد</Link>
              </div>
              {PROPERTIES.slice(0, 3).map(p => {
                const st = getStatusLabel(p.status);
                return (
                  <div key={p.id} className="card" id={`host-property-${p.id}`}>
                    <div className="card-body">
                      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <img src={p.images[0]} alt={p.name} style={{ width: 120, height: 85, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div>
                              <h4 style={{ marginBottom: 4 }}>{p.name}</h4>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}><i className="fa-solid fa-location-dot" style={{ marginLeft: 4 }}></i> {p.city} · {p.typeLabel} · {p.bedrooms} غرف</div>
                            </div>
                            <span className={`badge ${st.class}`}>{st.label}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 12, fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                            <span><i className="fa-solid fa-money-bill-wave" style={{ marginLeft: 4 }}></i> {formatPrice(p.basePrice)}/ليلة</span>
                            <span><i className="fa-solid fa-star" style={{ color: '#e8a838', marginLeft: 4 }}></i> {p.rating} ({p.reviewCount})</span>
                            <span>{p.isInstantBook ? <><i className="fa-solid fa-bolt" style={{ marginLeft: 4 }}></i> حجز فوري</> : <><i className="fa-regular fa-envelope" style={{ marginLeft: 4 }}></i> بطلب</>}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Link href={`/property/${p.id}`} className="btn btn-outline btn-sm">عرض</Link>
                            <button className="btn btn-ghost btn-sm" onClick={() => showToast('جاري تطوير صفحة التعديل')} id={`edit-property-${p.id}`}>تعديل</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => { setActiveNav('calendar'); }} id={`calendar-${p.id}`}>التقويم</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CALENDAR */}
          {activeNav === 'calendar' && (
            <div id="calendar-view">
              <div style={{ marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[{c:'var(--text-success)',l:'متاح'},{c:'var(--text-danger)',l:'محجوز'},{c:'#e87038',l:'موقوف'},{c:'var(--text-warning)',l:'انتظار'}].map(item => (
                  <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: item.c }} />
                    {item.l}
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-header">
                  <h4>تقويم العقار — مارس 2026</h4>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm">← السابق</button>
                    <button className="btn btn-outline btn-sm">التالي →</button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="calendar-grid">
                    {['أحد','اثن','ثلا','أرب','خمي','جمع','سبت'].map(d => (
                      <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', padding: '8px 0' }}>{d}</div>
                    ))}
                    {Array.from({length: 7}, (_, i) => null).map((_, i) => (
                      <div key={`e${i}`} />
                    ))}
                    {Array.from({length: 31}, (_, i) => {
                      const day = i + 1;
                      const isBooked = [10,11,12,13,20,21,22].includes(day);
                      const isBlocked = [5,6,7].includes(day);
                      const isPending = [15,16].includes(day);
                      return (
                        <div key={day} className="cal-day" style={{ 
                          background: isBooked ? 'rgba(232,96,56,0.15)' : isBlocked ? 'rgba(232,112,56,0.15)' : isPending ? 'rgba(232,192,56,0.15)' : 'var(--bg-elevated)',
                          borderColor: isBooked ? 'rgba(232,96,56,0.3)' : isBlocked ? 'rgba(232,112,56,0.3)' : isPending ? 'rgba(232,192,56,0.3)' : 'var(--border)',
                          cursor: 'pointer',
                        }} id={`cal-day-${day}`}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isBooked ? 'var(--text-danger)' : isBlocked ? '#e87038' : isPending ? 'var(--text-warning)' : 'var(--text-primary)' }}>{day}</div>
                          {isBooked && <div style={{ fontSize: '0.6rem', color: 'var(--text-danger)', marginTop: 2 }}>محجوز</div>}
                          {isBlocked && <div style={{ fontSize: '0.6rem', color: '#e87038', marginTop: 2 }}>موقوف</div>}
                          {isPending && <div style={{ fontSize: '0.6rem', color: 'var(--text-warning)', marginTop: 2 }}>انتظار</div>}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                    <button className="btn btn-outline btn-sm" id="block-dates-btn"><i className="fa-solid fa-lock" style={{ marginLeft: 4 }}></i> إيقاف تاريخ</button>
                    <button className="btn btn-outline btn-sm" id="unblock-dates-btn"><i className="fa-solid fa-lock-open" style={{ marginLeft: 4 }}></i> تفعيل تاريخ</button>
                    <button className="btn btn-outline btn-sm" id="seasonal-price-btn"><i className="fa-solid fa-money-bill-wave" style={{ marginLeft: 4 }}></i> تسعير موسمي</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXTERNAL BOOKINGS */}
          {activeNav === 'external' && (
            <div id="external-bookings">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>يتوفر هذا الخيار على الاشتراك السنوي فقط <span className="badge badge-accent" style={{ marginRight: 6 }}><i className="fa-regular fa-gem" style={{ marginLeft: 4 }}></i> بريميوم</span></div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddExternal(true)} id="add-external-btn">+ إضافة حجز خارجي</button>
              </div>
              <div className="card">
                <div className="card-header"><h4>الحجوزات الخارجية</h4></div>
                <div>
                  <table className="table">
                    <thead>
                      <tr><th>اسم الضيف</th><th>الجوال</th><th>تاريخ الوصول</th><th>تاريخ المغادرة</th><th>الحالة المالية</th><th>العقار</th></tr>
                    </thead>
                    <tbody>
                      {[
                        { name:'فيصل الشهري',phone:'0501234567',from:'2026-03-05',to:'2026-03-07',pay:'مدفوع',prop:'منتجع النخيل' },
                        { name:'أم سلمى',phone:'0557654321',from:'2026-03-12',to:'2026-03-14',pay:'جزئي',prop:'شاليه الواحة' },
                      ].map((b,i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{b.name} <span className="badge badge-info" style={{ fontSize: '0.65rem', marginRight: 6 }}>خارجي</span></td>
                          <td style={{ direction: 'ltr' }}>{b.phone}</td>
                          <td>{b.from}</td>
                          <td>{b.to}</td>
                          <td><span className={`badge ${b.pay==='مدفوع'?'badge-success':'badge-warning'}`}>{b.pay}</span></td>
                          <td>{b.prop}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUBSCRIPTION */}
          {activeNav === 'subscription' && (
            <div id="subscription-view" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="alert alert-success"><i className="fa-solid fa-circle-check" style={{ marginLeft: 8 }}></i> أنت مشترك في الخطة السنوية حتى يناير 2027</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  { name: 'الخطة المجانية', price: '0', period: '', features: ['إدراج العقارات','إدارة الحجوزات','التقويم الأساسي','تحليلات أساسية','إضافة حجوزات خارجية يدوياً'], current: false },
                  { name: 'الاشتراك السنوي', price: '2,999', period: '/ سنة', features: ['كل مميزات المجاني','رابط الحجز المشترك','إدارة الموظفين','التسعير الموسمي','تحليلات متقدمة لكل عقار','دعم أولوية'], current: true },
                ].map(plan => (
                  <div key={plan.name} className="card" style={{ border: plan.current ? '2px solid var(--primary)' : undefined }}>
                    {plan.current && <div style={{ textAlign: 'center', padding: '8px', background: 'var(--primary-glow)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-light)', borderBottom: '1px solid var(--border-primary)' }}><i className="fa-solid fa-check" style={{ marginLeft: 4 }}></i> خطتك الحالية</div>}
                    <div className="card-body">
                      <h3 style={{ marginBottom: 8 }}>{plan.name}</h3>
                      <div style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--primary-light)', marginBottom: 16 }}>
                        {plan.price} ريال <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>{plan.period}</span>
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {plan.features.map(f => (
                          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--text-success)' }}><i className="fa-solid fa-check"></i></span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {activeNav === 'bookings' && (
            <div id="bookings-view" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>إدارة الحجوزات (T-101)</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select className="form-control" style={{ width: 140 }}>
                    <option>كل العقارات</option>
                    <option>منتجع النخيل</option>
                  </select>
                  <select className="form-control" style={{ width: 140 }}>
                    <option>كل الحالات</option>
                    <option>مؤكد</option>
                    <option>بانتظار الموافقة</option>
                  </select>
                </div>
              </div>
              <div className="card">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>رقم الحجز</th>
                        <th>العقار</th>
                        <th>الضيف</th>
                        <th>التواريخ</th>
                        <th>الباقات المضافة</th>
                        <th>الإجمالي</th>
                        <th>حصة المالك</th>
                        <th>الحالة</th>
                        <th>الإجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_BOOKINGS.map(b => {
                        const st = getStatusLabel(b.status);
                        const hostPayout = b.total * 0.9; // example 10% fee
                        const packages = b.id === 'NZ-2026-00341' ? 'تصوير (500ر.س)' : 'لا يوجد';
                        return (
                          <tr key={b.id}>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{b.id}</td>
                            <td style={{ fontWeight: 600 }}>{b.property.name}</td>
                            <td>محمد السالم</td>
                            <td style={{ fontSize: '0.82rem' }}>{b.checkIn} → {b.checkOut}</td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{packages}</td>
                            <td style={{ fontWeight: 700 }}>{formatPrice(b.total)}</td>
                            <td style={{ fontWeight: 700, color: 'var(--text-success)' }}>{formatPrice(hostPayout)}</td>
                            <td><span className={`badge ${st.class}`}>{st.label}</span></td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                {b.status === 'confirmed' ? (
                                  <button className="btn btn-outline btn-sm" onClick={() => showToast('إلغاء الحجز سيخضع لسياسة الإلغاء', 'error')}>إلغاء</button>
                                ) : b.status === 'pending' ? (
                                  <>
                                    <button className="btn btn-success btn-sm" style={{ background: 'var(--success-bg)', color: 'var(--success)' }} onClick={() => showToast('تم القبول')}>قبول</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => showToast('تم الرفض', 'error')}>رفض</button>
                                  </>
                                ) : (
                                  <button className="btn btn-ghost btn-sm" disabled>التفاصيل</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STAFF */}
          {activeNav === 'staff' && (
            <div id="staff-view" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ marginBottom: 4 }}>إدارة الموظفين والصلاحيات (T-118/T-119)</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ميزة متوفرة في الاشتراك السنوي فقط</div>
                </div>
                <button className="btn btn-primary" onClick={() => showToast('نموذج إضافة الموظف سيظهر هنا')}>+ إضافة موظف</button>
              </div>
              <div className="card">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>نطاق الصلاحية</th>
                        <th>الدور (T-119)</th>
                        <th>العقارات المسندة (T-120)</th>
                        <th>الحالة</th>
                        <th>إجراءات (T-121)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'أحمد صالح', email: 'ahmad@example.com', role: 'Full Access', properties: 'جميع العقارات', status: 'نشط' },
                        { name: 'سارة خالد', email: 'sara@example.com', role: 'View Only', properties: 'منتجع النخيل', status: 'نشط' },
                        { name: 'ياسر محمد', email: 'yasser@example.com', role: 'Booking Manager', properties: 'شاليه الواحة', status: 'موقوف' }
                      ].map((staff, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{staff.name}</td>
                          <td style={{ direction: 'ltr' }}>{staff.email}</td>
                          <td><span className="badge badge-primary" style={{ background: 'var(--primary-glow)' }}>{staff.role}</span></td>
                          <td>
                            {staff.role === 'Full Access' && 'تحكم كامل ما عدا الدفع'}
                            {staff.role === 'View Only' && 'استعراض فقط'}
                            {staff.role === 'Booking Manager' && 'إدارة حجوزات'}
                          </td>
                          <td style={{ fontSize: '0.85rem' }}>{staff.properties}</td>
                          <td>
                            <span className={`badge ${staff.status === 'نشط' ? 'badge-success' : 'badge-danger'}`}>{staff.status}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-ghost btn-sm" onClick={() => showToast('تعديل الصلاحيات')}>تعديل</button>
                              <button className="btn btn-outline btn-sm" style={{ color: 'var(--danger)', borderColor: 'rgba(192,40,32,0.3)' }} onClick={() => showToast('تم إيقاف الحساب', 'error')}>إيقاف</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeNav === 'analytics' && (
            <div id="analytics-view" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>إحصائيات تفصيلية (T-117)</h3>
                <select className="form-control" style={{ width: 220 }}>
                  <option>كل العقارات (نظرة شاملة)</option>
                  {PROPERTIES.map(p => <option key={p.id}>{p.name}</option>)}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <StatCard icon={<i className="fa-solid fa-bed"></i>} label="متوسط ليالي الحجز" value="2.4" change={10} />
                <StatCard icon={<i className="fa-solid fa-moon"></i>} label="إجمالي الليالي (الشهر)" value="45" change={5} />
                <StatCard icon={<i className="fa-solid fa-eye"></i>} label="مشاهدات العقارات" value="1,240" change={15} />
                <StatCard icon={<i className="fa-solid fa-mouse-pointer"></i>} label="نسبة التحويل (Bookings/Views)" value="4.2%" change={-2} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Analytics Trends */}
                <div className="card">
                  <div className="card-header"><h4>توجه الحجوزات (شهرياً)</h4></div>
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {['سبت', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذوالقعدة'].map(m => <span key={m}>{m}</span>)}
                    </div>
                    {/* Simulated multi-line for platform vs external bookings */}
                    <div style={{ height: 120, position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                       {[8, 12, 10, 18, 14, 20].map((v, i) => (
                         <div key={i} style={{ flex: 1, display: 'flex', gap: 2, alignItems: 'flex-end', height: '100%' }}>
                           <div style={{ background: 'var(--primary)', height: `${(v/20)*100}%`, flex: 1, borderRadius: '2px 2px 0 0' }} />
                           <div style={{ background: 'var(--accent)', height: `${(v/30)*100}%`, flex: 1, borderRadius: '2px 2px 0 0' }} />
                         </div>
                       ))}
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
                        <div style={{ width: 10, height: 10, background: 'var(--primary)' }} /> منصة نزهة
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
                        <div style={{ width: 10, height: 10, background: 'var(--accent)' }} /> خارجية
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><h4>تفصيل التقييمات و المدن (T-117)</h4></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <h5 style={{ marginBottom: 12 }}>أبرز مدن الضيوف</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                          { city: 'الرياض', per: 65 },
                          { city: 'الدمام', per: 20 },
                          { city: 'جدة', per: 15 }
                        ].map(c => (
                          <div key={c.city}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.85rem' }}>
                              <span>{c.city}</span><span style={{ fontWeight: 700 }}>{c.per}%</span>
                            </div>
                            <div className="progress"><div className="progress-bar" style={{ width: `${c.per}%` }}></div></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                      <h5 style={{ marginBottom: 12 }}>محصلة التقييمات</h5>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#e8a838', lineHeight: 1 }}>{HOST_STATS.averageRating}</div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ fontSize: '0.75rem', display: 'flex', gap: 4, alignItems: 'center' }}>
                            <span style={{ width: 40 }}>5 نجوم</span><div className="progress" style={{ flex: 1 }}><div className="progress-bar" style={{ width: '85%', background: '#e8a838' }} /></div>
                          </div>
                          <div style={{ fontSize: '0.75rem', display: 'flex', gap: 4, alignItems: 'center' }}>
                            <span style={{ width: 40 }}>4 نجوم</span><div className="progress" style={{ flex: 1 }}><div className="progress-bar" style={{ width: '10%', background: '#e8a838' }} /></div>
                          </div>
                          <div style={{ fontSize: '0.75rem', display: 'flex', gap: 4, alignItems: 'center' }}>
                            <span style={{ width: 40 }}>+3 أدنى</span><div className="progress" style={{ flex: 1 }}><div className="progress-bar" style={{ width: '5%', background: '#e8a838' }} /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS Placeholder */}
          {!['overview','properties','calendar','external','subscription','staff','analytics','bookings'].includes(activeNav) && (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>{NAV_ITEMS.find(n=>n.id===activeNav)?.icon}</div>
              <h3 style={{ marginBottom: 8, color: 'var(--text-primary)' }}>{NAV_ITEMS.find(n=>n.id===activeNav)?.label}</h3>
              <p>هذا القسم متوفر قريباً في النسخة الكاملة.</p>
            </div>
          )}
        </div>
      </main>

      {/* ADD EXTERNAL BOOKING MODAL */}
      {showAddExternal && (
        <div className="modal-backdrop" onClick={() => setShowAddExternal(false)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()} id="add-external-modal">
            <div className="modal-header">
              <h3>إضافة حجز خارجي</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddExternal(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">اسم الضيف</label><input className="form-control" placeholder="الاسم الكامل" id="ext-guest-name" /></div>
                <div className="form-group"><label className="form-label">رقم الجوال</label><input className="form-control" placeholder="05xxxxxxxx" id="ext-guest-phone" /></div>
                <div className="form-group"><label className="form-label">تاريخ الوصول</label><input type="date" className="form-control" id="ext-checkin" /></div>
                <div className="form-group"><label className="form-label">تاريخ المغادرة</label><input type="date" className="form-control" id="ext-checkout" /></div>
                <div className="form-group"><label className="form-label">الحالة المالية</label>
                  <select className="form-control" id="ext-pay-status">
                    <option>مدفوع</option><option>غير مدفوع</option><option>جزئي</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">ملاحظات</label><textarea className="form-control" rows={3} id="ext-notes" /></div>
              <div className="alert alert-info" style={{ padding: '10px 14px', fontSize: '0.82rem' }}>
                <i className="fa-solid fa-circle-info" style={{ marginLeft: 8 }}></i> هذا الحجز لا تُطبَّق عليه عمولة المنصة ويُحجّب التواريخ تلقائياً في التقويم.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAddExternal(false)}>إلغاء</button>
              <button className="btn btn-primary" id="save-external-btn" onClick={() => { setShowAddExternal(false); showToast('تم إضافة الحجز الخارجي بنجاح'); }}>حفظ الحجز</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <i className={`fa-solid ${toast.type === 'success' ? 'fa-check' : 'fa-xmark'}`} style={{ marginLeft: 8 }}></i> {toast.msg}
          </div>
        </div>
      )}

      <style>{`
        .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
        .cal-day { padding: 8px 4px; border-radius: var(--radius-sm); border: 1px solid var(--border); text-align: center; min-height: 50px; transition: all 0.15s; }
        .cal-day:hover { border-color: var(--primary); background: var(--primary-glow) !important; }
      `}</style>
    </div>
  );
}
