'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PROPERTIES, MOCK_BOOKINGS, ADMIN_STATS, formatPrice, getStatusLabel } from '../../lib/data';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: <i className="fa-solid fa-chart-simple"></i> },
  { id: 'approvals', label: 'طلبات الموافقة', icon: <i className="fa-solid fa-check-to-slot"></i>, badge: 12 },
  { id: 'users', label: 'المستخدمون', icon: <i className="fa-solid fa-users"></i> },
  { id: 'bookings', label: 'الحجوزات', icon: <i className="fa-regular fa-calendar-days"></i> },
  { id: 'finance', label: 'التقارير المالية', icon: <i className="fa-solid fa-sack-dollar"></i> },
  { id: 'coupons', label: 'الكوبونات', icon: <i className="fa-solid fa-ticket"></i> },
  { id: 'featured', label: 'العقارات المميزة', icon: <i className="fa-solid fa-star"></i> },
  { id: 'disputes', label: 'النزاعات', icon: <i className="fa-solid fa-scale-balanced"></i>, badge: 5 },
  { id: 'settings', label: 'الإعدادات', icon: <i className="fa-solid fa-gear"></i> },
];

function KPICard({ icon, title, value, sub, color = 'var(--primary)' }) {
  return (
    <div className="kpi-card" style={{ borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>{title}</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: '1.6rem', opacity: 0.7 }}>{icon}</div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [commissionRate, setCommissionRate] = useState(10);
  const [serviceFee, setServiceFee] = useState(5);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="dashboard-layout" dir="rtl">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000' }}>ن</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>نزهة Admin</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>لوحة الإدارة</div>
            </div>
          </Link>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button key={item.id} className={`sidebar-item${activeNav===item.id?' active':''}`} onClick={() => setActiveNav(item.id)} id={`admin-nav-${item.id}`}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="badge badge-danger" style={{ marginRight: 'auto', fontSize: '0.65rem', padding: '2px 7px' }}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar" style={{ background: 'var(--accent-dark)', color: '#000', fontWeight: 700 }}>س</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>سلطان الإداري</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>مدير النظام</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <div style={{ borderBottom: '1px solid var(--border)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.15rem' }}>
            {NAV_ITEMS.find(n => n.id === activeNav)?.icon} {NAV_ITEMS.find(n => n.id === activeNav)?.label}
          </h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>آخر تحديث: الآن</span>
            <Link href="/" className="btn btn-ghost btn-sm">↗ الموقع</Link>
          </div>
        </div>

        <div className="page-content">
          {/* DASHBOARD */}
          {activeNav === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <KPICard icon={<i className="fa-solid fa-box-open"></i>} title="إجمالي الحجوزات اليوم" value={ADMIN_STATS.totalBookings.today} sub={`${ADMIN_STATS.totalBookings.month} هذا الشهر`} />
                <KPICard icon={<i className="fa-solid fa-money-bill-wave"></i>} title="إجمالي قيمة المعاملات (GMV)" value={formatPrice(ADMIN_STATS.gmv.month)} sub="هذا الشهر" color="var(--accent)" />
                <KPICard icon={<i className="fa-solid fa-hand-holding-dollar"></i>} title="إيرادات المنصة" value={formatPrice(ADMIN_STATS.platformRevenue.month)} sub="عمولات + رسوم" color="var(--text-success)" />
                <KPICard icon={<i className="fa-solid fa-house-chimney"></i>} title="العقارات النشطة" value={ADMIN_STATS.activeProperties} sub={`${ADMIN_STATS.pendingProperties} بانتظار الموافقة`} color="var(--text-info)" />
                <KPICard icon={<i className="fa-solid fa-user-tie"></i>} title="الملاك النشطون" value={ADMIN_STATS.activeHosts} color="var(--primary)" />
                <KPICard icon={<i className="fa-solid fa-users"></i>} title="الضيوف النشطون" value={ADMIN_STATS.activeGuests.toLocaleString('ar-SA')} color="var(--text-warning)" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                {/* Activity Feed */}
                <div className="card">
                  <div className="card-header"><h4>آخر النشاطات</h4></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[
                      { time: 'منذ 2 دقيقة', action: 'تسجيل ضيف جديد', user: 'محمد العمري', icon: <i className="fa-solid fa-user"></i>, color: 'var(--text-info)' },
                      { time: 'منذ 8 دقائق', action: 'طلب إدراج عقار جديد', user: 'فيصل الغامدي', icon: <i className="fa-solid fa-house"></i>, color: 'var(--text-warning)' },
                      { time: 'منذ 15 دقيقة', action: 'نزاع جديد على حجز', user: 'NZ-2026-000891', icon: <i className="fa-solid fa-scale-balanced"></i>, color: 'var(--text-danger)' },
                      { time: 'منذ 32 دقيقة', action: 'تأكيد حجز فوري', user: 'NZ-2026-001235', icon: <i className="fa-solid fa-check"></i>, color: 'var(--text-success)' },
                      { time: 'منذ 45 دقيقة', action: 'اشتراك مالك جديد', user: 'سلمى الدوسري', icon: <i className="fa-regular fa-gem"></i>, color: 'var(--accent)' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i<4 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 2 }}>{item.action}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{item.user} · {item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Quick Actions */}
                <div className="card">
                  <div className="card-header"><h4>إجراءات سريعة</h4></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start', gap: 10 }} onClick={() => setActiveNav('approvals')} id="quick-approvals">
                      <span><i className="fa-solid fa-check"></i></span> مراجعة طلبات ({ADMIN_STATS.pendingProperties})
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start', gap: 10 }} onClick={() => setActiveNav('disputes')} id="quick-disputes">
                      <span><i className="fa-solid fa-scale-balanced"></i></span> حل النزاعات ({ADMIN_STATS.openDisputes})
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start', gap: 10 }} onClick={() => setShowCouponModal(true)} id="quick-coupon">
                      <span><i className="fa-solid fa-ticket"></i></span> إنشاء كوبون جديد
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start', gap: 10 }} onClick={() => setActiveNav('finance')} id="quick-finance">
                      <span><i className="fa-solid fa-download"></i></span> تصدير التقارير
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* APPROVALS */}
          {activeNav === 'approvals' && (
            <div id="approvals-view">
              <div className="alert alert-warning" style={{ marginBottom: 20 }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginLeft: 8 }}></i> {ADMIN_STATS.pendingProperties} عقار ينتظر مراجعتك
              </div>
              <div className="card">
                <div className="card-header"><h4>قائمة انتظار الموافقة</h4></div>
                <div>
                  <table className="table">
                    <thead>
                      <tr><th>العقار</th><th>المالك</th><th>المدينة</th><th>النوع</th><th>تاريخ التقديم</th><th>الإجراء</th></tr>
                    </thead>
                    <tbody>
                      {PROPERTIES.slice(0,3).map(p => (
                        <tr key={p.id} id={`approval-row-${p.id}`}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <img src={p.images[0]} alt="" style={{ width: 44, height: 36, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                              <span style={{ fontWeight: 600 }}>{p.name}</span>
                            </div>
                          </td>
                          <td>{p.host.name}</td>
                          <td>{p.city}</td>
                          <td><span className="badge badge-info">{p.typeLabel}</span></td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>منذ يومين</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-sm" style={{ background:'var(--success-bg)',color:'var(--text-success)',border:'1px solid rgba(76,175,125,0.3)' }} onClick={() => showToast(`تمت الموافقة على "${p.name}"`)} id={`approve-property-${p.id}`}>موافقة</button>
                              <button className="btn btn-danger btn-sm" onClick={() => showToast('تم رفض العقار', 'error')} id={`reject-property-${p.id}`}>رفض</button>
                              <button className="btn btn-outline btn-sm" onClick={() => showToast('تم إرسال طلب معلومات إضافية')} id={`request-info-${p.id}`}>طلب معلومات</button>
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

          {/* USERS */}
          {activeNav === 'users' && (
            <div id="users-view">
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <input className="form-control" placeholder="ابحث عن مستخدم..." style={{ flex: 1 }} id="user-search" />
                <select className="form-control" style={{ width: 'auto' }} id="user-role-filter">
                  <option>جميع الأدوار</option><option>ضيوف</option><option>ملاك</option><option>مزودو خدمات</option>
                </select>
              </div>
              <div className="card">
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr><th>المستخدم</th><th>البريد</th><th>الدور</th><th>التسجيل</th><th>الحالة</th><th>الإجراءات</th></tr>
                    </thead>
                    <tbody>
                      {[
                        { name:'محمد السالم', email:'m.salem@email.com', role:'ضيف', since:'2025-01-10', status:'active' },
                        { name:'عبدالله المنيع', email:'al.monei@email.com', role:'مالك', since:'2022-06-15', status:'active' },
                        { name:'نورة العتيبي', email:'n.otaibi@email.com', role:'مالك', since:'2023-03-20', status:'active' },
                        { name:'محمد القحطاني', email:'m.qah@email.com', role:'ضيف وجميل', since:'2021-11-05', status:'suspended' },
                      ].map((u,i) => (
                        <tr key={i} id={`user-row-${i}`}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className="avatar avatar-sm" style={{ background:'var(--primary-dark)',color:'var(--primary-light)',fontWeight:700 }}>{u.name[0]}</div>
                              <span style={{ fontWeight: 600 }}>{u.name}</span>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.82rem', direction: 'ltr' }}>{u.email}</td>
                          <td><span className="badge badge-info">{u.role}</span></td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.since}</td>
                          <td><span className={`badge ${u.status==='active'?'badge-success':'badge-danger'}`}>{u.status==='active'?'نشط':'موقوف'}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              {u.status==='active'
                                ? <button className="btn btn-danger btn-sm" onClick={() => showToast(`تم تعليق حساب ${u.name}`,'error')} id={`suspend-user-${i}`}>تعليق</button>
                                : <button className="btn btn-sm" style={{background:'var(--success-bg)',color:'var(--text-success)',border:'1px solid rgba(76,175,125,0.3)'}} onClick={() => showToast(`تم إعادة تنشيط حساب ${u.name}`)} id={`unsuspend-user-${i}`}>إعادة تنشيط</button>
                              }
                              <button className="btn btn-ghost btn-sm" onClick={() => showToast('تم إضافة ملاحظة')}>ملاحظة</button>
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

          {/* FINANCE */}
          {activeNav === 'finance' && (
            <div id="finance-view" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="date" className="form-control" style={{ width: 'auto' }} id="finance-from" />
                <input type="date" className="form-control" style={{ width: 'auto' }} id="finance-to" />
                <button className="btn btn-primary btn-sm" id="finance-filter-btn">تطبيق</button>
                <button className="btn btn-outline btn-sm" onClick={() => showToast('جاري تحميل ملف CSV...')} id="export-csv-btn"><i className="fa-solid fa-download" style={{ marginLeft: 6 }}></i> CSV</button>
                <button className="btn btn-outline btn-sm" onClick={() => showToast('جاري تحميل ملف Excel...')} id="export-excel-btn"><i className="fa-solid fa-table" style={{ marginLeft: 6 }}></i> Excel</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <KPICard icon={<i className="fa-solid fa-money-bill-wave"></i>} title="عمولات المنصة" value={formatPrice(Math.round(ADMIN_STATS.gmv.month * 0.1))} />
                <KPICard icon={<i className="fa-solid fa-hand-holding-dollar"></i>} title="رسوم الخدمة" value={formatPrice(Math.round(ADMIN_STATS.gmv.month * 0.05))} color="var(--accent)" />
                <KPICard icon={<i className="fa-solid fa-star"></i>} title="رسوم التمييز" value={formatPrice(45000)} color="var(--text-warning)" />
                <KPICard icon={<i className="fa-regular fa-gem"></i>} title="اشتراكات الملاك" value={formatPrice(180000)} color="var(--text-success)" />
              </div>
              <div className="card">
                <div className="card-header"><h4>سجل الحجوزات المالي</h4></div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr><th>رقم الحجز</th><th>الإجمالي</th><th>العمولة (%)</th><th>مبلغ العمولة</th><th>رسوم الخدمة</th><th>صافي المالك</th></tr>
                    </thead>
                    <tbody>
                      {MOCK_BOOKINGS.map(b => (
                        <tr key={b.id} id={`fin-row-${b.id}`}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{b.id}</td>
                          <td style={{ fontWeight: 700 }}>{formatPrice(b.total)}</td>
                          <td>10%</td>
                          <td style={{ color: 'var(--text-success)' }}>{formatPrice(Math.round(b.total*0.1))}</td>
                          <td style={{ color: 'var(--text-success)' }}>{formatPrice(b.serviceFee)}</td>
                          <td style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{formatPrice(b.total - Math.round(b.total*0.1) - b.serviceFee)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeNav === 'settings' && (
            <div id="settings-view" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="card">
                <div className="card-header"><h4>إعدادات العمولة والرسوم</h4></div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="form-group">
                      <label className="form-label">نسبة عمولة المنصة (%)</label>
                      <input type="number" className="form-control" value={commissionRate} onChange={e => setCommissionRate(+e.target.value)} min={0} max={50} id="commission-rate-input" />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>تُطبَّق على الحجوزات الجديدة فقط</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">رسوم خدمة الضيف (%)</label>
                      <input type="number" className="form-control" value={serviceFee} onChange={e => setServiceFee(+e.target.value)} min={0} max={20} id="service-fee-input" />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>تُضاف على إجمالي الضيف</div>
                    </div>
                  </div>
                  <div className="alert alert-info">
                    <i className="fa-solid fa-circle-info" style={{ marginLeft: 8 }}></i> تغيير الأسعار لا يؤثر على الحجوزات السابقة — كل حجز يحتفظ بالنسبة المُطبَّقة عند إنشائه.
                  </div>
                  <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => showToast('تم حفظ الإعدادات بنجاح')} id="save-settings-btn">
                    حفظ الإعدادات
                  </button>
                </div>
              </div>
              <div className="card">
                <div className="card-header"><h4>إعدادات نقاط الولاء</h4></div>
                <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="form-group">
                    <label className="form-label">نقطة مقابل كل (ريال)</label>
                    <input type="number" className="form-control" defaultValue={10} id="points-accrual" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">قيمة 100 نقطة (ريال)</label>
                    <input type="number" className="form-control" defaultValue={10} id="points-redemption" />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="checkbox-item">
                      <input type="checkbox" defaultChecked id="allow-points-coupons" />
                      السماح بالجمع بين النقاط والكوبونات في نفس الحجز
                    </label>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ gridColumn: 'span 2', width: 'fit-content' }} onClick={() => showToast('تم حفظ إعدادات الولاء')} id="save-loyalty-btn">حفظ</button>
                </div>
              </div>
            </div>
          )}

          {/* COUPONS */}
          {activeNav === 'coupons' && (
            <div id="coupons-view">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>إجمالي الكوبونات النشطة: 8</div>
                <button className="btn btn-primary" onClick={() => setShowCouponModal(true)} id="create-coupon-btn">+ إنشاء كوبون جديد</button>
              </div>
              <div className="card">
                <table className="table">
                  <thead>
                    <tr><th>الكود</th><th>نوع الخصم</th><th>القيمة</th><th>الحد الأدنى</th><th>تاريخ الانتهاء</th><th>الاستخدامات</th><th>الحالة</th><th></th></tr>
                  </thead>
                  <tbody>
                    {[
                      { code:'NZHA25', type:'%', val:25, min:500, exp:'2026-03-31', used:47, max:100, active:true },
                      { code:'WELCOME150', type:'ريال', val:150, min:800, exp:'2026-04-30', used:23, max:50, active:true },
                      { code:'EID2026', type:'%', val:20, min:1000, exp:'2026-03-15', used:89, max:200, active:false },
                    ].map((c,i) => (
                      <tr key={i} id={`coupon-row-${i}`}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-light)' }}>{c.code}</td>
                        <td>{c.type === '%' ? 'نسبة مئوية' : 'مبلغ ثابت'}</td>
                        <td style={{ fontWeight: 700 }}>{c.val}{c.type}</td>
                        <td>{formatPrice(c.min)}</td>
                        <td style={{ fontSize: '0.82rem' }}>{c.exp}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>{c.used}/{c.max}</span>
                            <div className="progress" style={{ width: 60 }}>
                              <div className="progress-bar" style={{ width: `${(c.used/c.max)*100}%` }} />
                            </div>
                          </div>
                        </td>
                        <td><span className={`badge ${c.active?'badge-success':'badge-danger'}`}>{c.active?'نشط':'منتهي'}</span></td>
                        <td>
                          <button className="btn btn-ghost btn-sm" onClick={() => showToast(c.active ? 'تم إلغاء الكوبون' : 'تم تفعيل الكوبون')} id={`toggle-coupon-${i}`}>
                            {c.active ? 'إلغاء' : 'تفعيل'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DISPUTES */}
          {activeNav === 'disputes' && (
            <div id="disputes-view">
              <div className="alert alert-danger" style={{ marginBottom: 20 }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginLeft: 8 }}></i> {ADMIN_STATS.openDisputes} نزاع مفتوح يستدعي اتخاذ إجراء
              </div>
              <div className="card">
                <table className="table">
                  <thead>
                    <tr><th>رقم الحجز</th><th>الضيف</th><th>المالك</th><th>سبب النزاع</th><th>التاريخ</th><th>الإجراء</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { id:'NZ-2026-000891', guest:'محمد السالم', host:'نورة العتيبي', reason:'العقار غير مطابق للوصف', date:'2026-02-18' },
                      { id:'NZ-2026-000765', guest:'سارة القحطاني', host:'عبدالله المنيع', reason:'رفض استرداد الأمانة', date:'2026-02-20' },
                    ].map((d,i) => (
                      <tr key={i} id={`dispute-row-${i}`}>
                        <td style={{ fontFamily:'monospace', fontSize:'0.82rem' }}>{d.id}</td>
                        <td>{d.guest}</td>
                        <td>{d.host}</td>
                        <td style={{ fontSize:'0.82rem', maxWidth:200 }}>{d.reason}</td>
                        <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{d.date}</td>
                        <td>
                          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                            <button className="btn btn-sm" style={{background:'var(--success-bg)',color:'var(--text-success)',border:'1px solid rgba(76,175,125,0.3)',fontSize:'0.75rem'}} onClick={() => showToast('تم البت لصالح الضيف')} id={`favor-guest-${i}`}>للضيف</button>
                            <button className="btn btn-sm" style={{background:'var(--info-bg)',color:'var(--text-info)',border:'1px solid rgba(38,160,232,0.3)',fontSize:'0.75rem'}} onClick={() => showToast('تم البت لصالح المالك')} id={`favor-host-${i}`}>للمالك</button>
                            <button className="btn btn-outline btn-sm" style={{fontSize:'0.75rem'}} onClick={() => showToast('تم طلب مزيد من المعلومات')} id={`request-info-dispute-${i}`}>معلومات</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* OTHER TABS Placeholder */}
          {!['dashboard','approvals','users','finance','settings','coupons','disputes'].includes(activeNav) && (
            <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--text-muted)' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>{NAV_ITEMS.find(n=>n.id===activeNav)?.icon}</div>
              <h3 style={{ color:'var(--text-primary)', marginBottom:8 }}>{NAV_ITEMS.find(n=>n.id===activeNav)?.label}</h3>
              <p>هذا القسم متوفر في النسخة المتكاملة.</p>
            </div>
          )}
        </div>
      </main>

      {/* CREATE COUPON MODAL */}
      {showCouponModal && (
        <div className="modal-backdrop" onClick={() => setShowCouponModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} id="create-coupon-modal">
            <div className="modal-header">
              <h3>إنشاء كوبون جديد</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCouponModal(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body" style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">كود الكوبون</label><input className="form-control" placeholder="SUMMER26" id="coupon-code" /></div>
                <div className="form-group"><label className="form-label">نوع الخصم</label>
                  <select className="form-control" id="coupon-type"><option value="percentage">نسبة مئوية (%)</option><option value="fixed">مبلغ ثابت (ريال)</option></select>
                </div>
                <div className="form-group"><label className="form-label">قيمة الخصم</label><input type="number" className="form-control" min="1" id="coupon-value" /></div>
                <div className="form-group"><label className="form-label">الحد الأدنى للحجز (ريال)</label><input type="number" className="form-control" id="coupon-min" /></div>
                <div className="form-group"><label className="form-label">تاريخ الانتهاء</label><input type="date" className="form-control" id="coupon-expiry" /></div>
                <div className="form-group"><label className="form-label">عدد الاستخدامات الأقصى</label><input type="number" className="form-control" id="coupon-max-uses" /></div>
                <div className="form-group" style={{ gridColumn:'span 2' }}>
                  <label className="form-label">النطاق</label>
                  <select className="form-control" id="coupon-scope"><option>جميع العقارات</option><option>عقار محدد</option><option>نوع عقار محدد</option></select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowCouponModal(false)}>إلغاء</button>
              <button className="btn btn-primary" id="save-coupon-btn" onClick={() => { setShowCouponModal(false); showToast('تم إنشاء الكوبون بنجاح'); }}>إنشاء الكوبون</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type || 'success'}`}>
            <i className={`fa-solid ${toast.type === 'error' ? 'fa-xmark' : 'fa-check'}`} style={{ marginLeft: 8 }}></i> {toast.msg}
          </div>
        </div>
      )}

      <style>{`
        .kpi-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
      `}</style>
    </div>
  );
}
