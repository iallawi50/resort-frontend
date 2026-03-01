'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SERVICE_PACKAGES, formatPrice } from '../../lib/data';

const NAV = [
  { id: 'overview', label: 'نظرة عامة', icon: <i className="fa-solid fa-chart-pie"></i> },
  { id: 'services', label: 'خدماتي', icon: <i className="fa-solid fa-gift"></i> },
  { id: 'orders', label: 'الطلبات', icon: <i className="fa-solid fa-box-open"></i> },
  { id: 'messages', label: 'الرسائل', icon: <i className="fa-regular fa-comment-dots"></i> },
  { id: 'analytics', label: 'التحليلات', icon: <i className="fa-solid fa-chart-line"></i> },
];

export default function ProviderDashboard() {
  const [activeNav, setActiveNav] = useState('overview');
  const [toast, setToast] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="dashboard-layout" dir="rtl">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} style={{ display: 'block' }}></div>}

      <aside className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--accent),var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000' }}>ن</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>نزهة</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>بوابة مزودي الخدمات</div>
            </div>
          </Link>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(item => (
            <button key={item.id} className={`sidebar-item${activeNav===item.id?' active':''}`} onClick={() => { setActiveNav(item.id); setIsSidebarOpen(false); }} id={`provider-nav-${item.id}`}>
              <span>{item.icon}</span><span>{item.label}</span>
              {item.id === 'orders' && <span className="badge badge-danger" style={{ marginRight:'auto', fontSize:'0.65rem', padding:'2px 7px' }}>3</span>}
              {item.id === 'messages' && <span className="badge badge-info" style={{ marginRight:'auto', fontSize:'0.65rem', padding:'2px 7px' }}>5</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding:'16px 12px', borderTop:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div className="avatar" style={{ background:'var(--accent-dark)', color:'#000', fontWeight:700 }}>ل</div>
            <div>
              <div style={{ fontWeight:600, fontSize:'0.82rem' }}>لمسة فرح</div>
              <div className="badge badge-success" style={{ fontSize:'0.62rem', padding:'2px 6px', marginTop:3 }}>نشط <i className="fa-solid fa-check" style={{ marginLeft: 4 }}></i></div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div style={{ borderBottom:'1px solid var(--border)', padding:'16px 32px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontSize:'1.15rem' }}>{NAV.find(n=>n.id===activeNav)?.icon} {NAV.find(n=>n.id===activeNav)?.label}</h2>
        </div>

        <button className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle Sidebar">
          <i className="fa-solid fa-bars"></i>
        </button>

        <div className="page-content">
          {activeNav === 'overview' && (
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
                {[
                  { icon:<i className="fa-solid fa-box-open"></i>, label:'طلبات هذا الشهر', value:'28' },
                  { icon:<i className="fa-solid fa-money-bill-wave"></i>, label:'الإيرادات', value:formatPrice(42000) },
                  { icon:<i className="fa-solid fa-star" style={{ color: '#e8a838' }}></i>, label:'متوسط التقييم', value:'4.8' },
                  { icon:<i className="fa-solid fa-bell"></i>, label:'طلبات جديدة', value:'3' },
                ].map(s => (
                  <div key={s.label} className="card" style={{ padding:20 }}>
                    <div style={{ fontSize:'1.6rem', marginBottom:8 }}>{s.icon}</div>
                    <div style={{ fontWeight:800, fontSize:'1.5rem', color:'var(--text-primary)' }}>{s.value}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-header"><h4>أحدث الطلبات</h4></div>
                <table className="table">
                  <thead><tr><th>الضيف</th><th>العقار</th><th>الخدمة</th><th>التاريخ</th><th>الإجمالي</th><th>الإجراء</th></tr></thead>
                  <tbody>
                    {[
                      { guest:'خالد المطيري', prop:'منتجع النخيل', svc:'تصوير', date:'2026-03-10', total:1800 },
                      { guest:'أم سلمى', prop:'شاليه الواحة', svc:'ديكور + حنة', date:'2026-03-12', total:1550 },
                      { guest:'فيصل الغامدي', prop:'فيلا الجبل', svc:'صوتيات', date:'2026-03-20', total:2800 },
                    ].map((o,i) => (
                      <tr key={i} id={`order-row-${i}`}>
                        <td style={{ fontWeight:600 }}>{o.guest}</td>
                        <td>{o.prop}</td>
                        <td><span className="badge badge-primary">{o.svc}</span></td>
                        <td style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>{o.date}</td>
                        <td style={{ fontWeight:700, color:'var(--primary-light)' }}>{formatPrice(o.total)}</td>
                        <td>
                          <div style={{ display:'flex', gap:4 }}>
                            <button className="btn btn-sm" style={{ background:'var(--success-bg)',color:'var(--text-success)',border:'1px solid rgba(76,175,125,0.3)' }} onClick={() => showToast('تم قبول الطلب')} id={`accept-order-${i}`}>قبول</button>
                            <button className="btn btn-danger btn-sm" onClick={() => showToast('تم رفض الطلب','error')} id={`reject-order-${i}`}>رفض</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeNav === 'services' && (
            <div id="provider-services" style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>إجمالي خدماتك: {SERVICE_PACKAGES.length}</div>
                <button className="btn btn-primary btn-sm" onClick={() => { setEditingService(null); setShowServiceModal(true); }}>+ إضافة خدمة</button>
              </div>
              {SERVICE_PACKAGES.map(pkg => (
                <div className="card" key={pkg.id} id={`provider-service-${pkg.id}`}>
                  <div className="card-body">
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <div>
                        <h4 style={{ marginBottom:4 }}>{pkg.name}</h4>
                        <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:8 }}>
                          <span className="badge badge-info" style={{ marginLeft:6 }}>{pkg.categoryLabel}</span>
                          المدن: {pkg.cities.join('، ')}
                        </div>
                        <div style={{ fontSize:'0.83rem', color:'var(--text-secondary)' }}>{pkg.description}</div>
                      </div>
                      <div style={{ textAlign:'left' }}>
                        <div style={{ fontWeight:800, fontSize:'1.15rem', color:'var(--primary-light)' }}>{formatPrice(pkg.basePrice)}+</div>
                        <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>السعر الأساسي</div>
                      </div>
                    </div>
                    <div style={{ marginBottom:10 }}>
                      <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:6, fontWeight:700 }}>الإضافات ({pkg.addons.length}):</div>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {pkg.addons.map(a => (
                          <span key={a.id} className="amenity-chip" style={{ fontSize:'0.75rem' }}>
                            {a.name} (+{formatPrice(a.priceDelta)})
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => { setEditingService(pkg); setShowServiceModal(true); }} id={`edit-service-${pkg.id}`}>تعديل</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => showToast('تم إيقاف الخدمة مؤقتاً')} id={`deactivate-service-${pkg.id}`}>إيقاف مؤقت</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeNav === 'messages' && (
            <div className="card" id="messages-view">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', height:500 }}>
                <div style={{ borderLeft:'1px solid var(--border)', overflowY:'auto' }}>
                  {[
                    { name:'خالد المطيري', last:'متى يمكنكم البدء؟', unread:2, time:'منذ 5 د' },
                    { name:'أم سلمى', last:'شكراً جزيلاً!', unread:0, time:'أمس' },
                    { name:'فيصل الغامدي', last:'هل تتوفرون في يوم...', unread:3, time:'منذ يومين' },
                  ].map((conv,i) => (
                    <div key={i} className={`msg-conv-item${i===0?' active':''}`} id={`conversation-${i}`}>
                      <div className="avatar avatar-sm" style={{ background:'var(--primary-dark)',color:'var(--primary-light)',fontWeight:700,flexShrink:0 }}>{conv.name[0]}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                          <span style={{ fontWeight:600, fontSize:'0.85rem' }}>{conv.name}</span>
                          <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{conv.time}</span>
                        </div>
                        <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{conv.last}</div>
                      </div>
                      {conv.unread > 0 && <span className="badge badge-primary" style={{ fontSize:'0.65rem',flexShrink:0 }}>{conv.unread}</span>}
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', flexDirection:'column' }}>
                  <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)', fontWeight:700 }}>خالد المطيري</div>
                  <div style={{ flex:1, padding:16, overflowY:'auto', display:'flex', flexDirection:'column', gap:10 }}>
                    {[
                      { me:false, text:'مرحبا، لدي حجز في 10 مارس. متى يمكنكم البدء بالتجهيز؟', time:'10:30' },
                      { me:true, text:'أهلاً خالد! يمكننا البدء من الساعة 2 عصراً. هل هذا مناسب؟', time:'10:35' },
                      { me:false, text:'ممتاز! سنكون جاهزين.', time:'10:40' },
                    ].map((m,i) => (
                      <div key={i} style={{ display:'flex', justifyContent:m.me?'flex-start':'flex-end' }}>
                        <div style={{ maxWidth:'75%', padding:'10px 14px', borderRadius:m.me?'0 14px 14px 14px':'14px 0 14px 14px', background:m.me?'var(--bg-elevated)':'var(--primary)', color:m.me?'var(--text-secondary)':'#fff', fontSize:'0.87rem', lineHeight:1.6 }}>
                          <div>{m.text}</div>
                          <div style={{ fontSize:'0.7rem', opacity:0.6, marginTop:4, textAlign:m.me?'right':'left' }}>{m.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding:12, borderTop:'1px solid var(--border)', display:'flex', gap:8 }}>
                    <input className="form-control" placeholder="اكتب رسالتك..." id="message-input" />
                    <button className="btn btn-primary btn-sm" id="send-message-btn" onClick={() => showToast('تم إرسال الرسالة')}>إرسال</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeNav === 'orders' && (
            <div id="orders-view">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3>إدارة الطلبات والحجوزات</h3>
              </div>
              <div className="card">
                <div>
                  <table className="table">
                    <thead>
                      <tr><th>رقم الطلب</th><th>الضيف</th><th>الخدمة</th><th>الإضافات</th><th>التواريخ</th><th>المبلغ الإجمالي</th><th>الحالة</th><th></th></tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'ORD-101', guest: 'خالد المطيري', service: 'باقة التصوير الاحترافي', scope: 'لا يوجد', date: '2026-03-10', total: 1800, status: 'pending' },
                        { id: 'ORD-102', guest: 'أم سلمى', service: 'ديكور احتفالي', scope: 'حنة + بالونات', date: '2026-03-12', total: 1550, status: 'confirmed' },
                        { id: 'ORD-103', guest: 'فيصل الغامدي', service: 'نظام صوتي DJ', scope: 'إضاءة', date: '2026-03-20', total: 2800, status: 'completed' }
                      ].map((o, i) => (
                        <tr key={i} id={`provider-order-${i}`}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{o.id}</td>
                          <td style={{ fontWeight: 600 }}>{o.guest}</td>
                          <td><span className="badge badge-info">{o.service}</span></td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{o.scope}</td>
                          <td style={{ fontSize: '0.82rem' }}>{o.date}</td>
                          <td style={{ fontWeight: 700 }}>{formatPrice(o.total)}</td>
                          <td>
                            <span className={`badge ${o.status === 'confirmed' ? 'badge-success' : o.status === 'completed' ? 'badge-primary' : 'badge-warning'}`}>
                              {o.status === 'pending' ? 'جديد' : o.status === 'confirmed' ? 'مؤكد' : 'مكتمل'}
                            </span>
                          </td>
                          <td>
                            {o.status === 'pending' ? (
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button className="btn btn-sm btn-outline" style={{ background: 'var(--success-bg)', color: 'var(--text-success)' }} onClick={() => showToast('تم القبول')}>قبول</button>
                                <button className="btn btn-danger btn-sm" onClick={() => showToast('تم الرفض')}>رفض</button>
                              </div>
                            ) : (
                              <button className="btn btn-ghost btn-sm">التفاصيل</button>
                            )}
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
              <h3>تحليلات مزود الخدمة (T-140/T-141/T-142)</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: 8 }}><i className="fa-solid fa-money-bill-wave"></i></div>
                  <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)' }}>{formatPrice(42000)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>الإيرادات الشهرية</div>
                </div>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: 8 }}><i className="fa-solid fa-box-open"></i></div>
                  <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)' }}>124</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>إجمالي الطلبات المنجزة</div>
                </div>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: 8 }}><i className="fa-solid fa-star" style={{ color: '#e8a838' }}></i></div>
                  <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)' }}>4.8</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>متوسط التقييم العام</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card">
                  <div className="card-header"><h4>الخدمات الأكثر طلباً (T-141)</h4></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem' }}>
                        <span>باقة التصوير الاحترافي</span><span>65%</span>
                      </div>
                      <div className="progress"><div className="progress-bar" style={{ width: '65%' }}></div></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem' }}>
                        <span>ديكور احتفالي</span><span>35%</span>
                      </div>
                      <div className="progress"><div className="progress-bar" style={{ width: '35%', background: 'var(--accent)' }}></div></div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><h4>سجل الدفعات (T-142)</h4></div>
                  <div className="card-body">
                    {[
                      { date: '2026-02-28 14:30', amount: 8400, status: 'تم التحويل' },
                      { date: '2026-01-31 09:15', amount: 12500, status: 'تم التحويل' },
                      { date: '2026-03-01 11:00', amount: 3200, status: 'بانتظار التسوية' },
                    ].map((p, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatPrice(p.amount)}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.date}</div>
                        </div>
                        <span className={`badge ${p.status === 'تم التحويل' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!['overview','services','messages','orders','analytics'].includes(activeNav) && (
            <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--text-muted)' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>{NAV.find(n=>n.id===activeNav)?.icon}</div>
              <p>هذا القسم متوفر قريباً.</p>
            </div>
          )}
        </div>
      </main>

      {showServiceModal && (
        <div className="modal-backdrop" onClick={() => setShowServiceModal(false)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowServiceModal(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="form-group">
                <label className="form-label">اسم الخدمة</label>
                <input className="form-control" defaultValue={editingService?.name || ''} placeholder="مثال: باقة التصوير الاحترافي" />
              </div>
              <div className="form-group">
                <label className="form-label">الفئة</label>
                <select className="form-control" defaultValue={editingService?.categoryLabel || ''}>
                  <option>تصوير</option>
                  <option>ديكور وزينة</option>
                  <option>ضيافة</option>
                  <option>صوتيات</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">وصف تفصيلي</label>
                <textarea className="form-control" rows={3} defaultValue={editingService?.description || ''} placeholder="صف تفاصيل الخدمة بدقة..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">السعر الأساسي (ريال)</label>
                  <input type="number" className="form-control" defaultValue={editingService?.basePrice || ''} />
                </div>
                <div className="form-group">
                  <label className="form-label">النطاق الجغرافي</label>
                  <select className="form-control" defaultValue={editingService?.cities ? editingService.cities[0] : ''}>
                    <option>جميع المدن السعودية</option>
                    <option>الرياض</option>
                    <option>جدة</option>
                    <option>الشرقية</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">إضافات اختيارية (Add-ons)</label>
                <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  {editingService?.addons?.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input className="form-control form-control-sm" defaultValue={a.name} style={{ flex: 1 }} />
                      <input type="number" className="form-control form-control-sm" defaultValue={a.priceDelta} style={{ width: 100 }} placeholder="السعر" />
                      <button className="btn btn-icon btn-sm" style={{ color: 'var(--text-danger)' }} title="حذف"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  ))}
                  <button className="btn btn-outline btn-sm" style={{ marginTop: editingService?.addons?.length ? 8 : 0 }}>+ إضافة خيار جديد</button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowServiceModal(false)}>إلغاء</button>
              <button className="btn btn-primary" onClick={() => { setShowServiceModal(false); showToast('تم حفظ تفاصيل الخدمة بنجاح'); }}>حفظ الخدمة</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}><i className={`fa-solid ${toast.type === 'error' ? 'fa-xmark' : 'fa-check'}`} style={{ marginLeft: 8 }}></i> {toast.msg}</div>
        </div>
      )}

      <style>{`
        .msg-conv-item { display:flex; align-items:center; gap:10; padding:12px 14px; cursor:pointer; border-bottom:1px solid var(--border); transition:background 0.15s; }
        .msg-conv-item:hover { background:var(--bg-elevated); }
        .msg-conv-item.active { background:var(--primary-glow); }
      `}</style>
    </div>
  );
}
