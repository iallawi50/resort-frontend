'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AMENITIES, SAUDI_CITIES } from '../../../lib/data';

const STEPS = [
  { id: 1, label: 'المعلومات الأساسية' },
  { id: 2, label: 'الموقع' },
  { id: 3, label: 'التفاصيل' },
  { id: 4, label: 'المرافق' },
  { id: 5, label: 'القواعد والتسعير' },
  { id: 6, label: 'الصور' },
  { id: 7, label: 'الإتاحة' },
];

const AMENITY_CATEGORIES = [
  {
    id: 'pools', label: 'مسابح مائية', icon: 'fa-person-swimming',
    fields: [
      { name: 'type', label: 'النوع', options: ['مسبح خارجي', 'مسبح داخلي', 'ألعاب مائية', 'مسبح أطفال'] },
      { name: 'dimensions', label: 'الأبعاد (م)', placeholder: 'مثال: 4x8' },
      { name: 'depth', label: 'العمق (م)', placeholder: 'مثال: 1 إلى 2' },
      { name: 'heated', label: 'بنظام تدفئة', type: 'checkbox' }
    ]
  },
  {
    id: 'seating', label: 'مجالس وجلسات', icon: 'fa-couch',
    fields: [
      { name: 'type', label: 'النوع', options: ['مجلس رئيسي', 'مجلس إضافي', 'جلسة خارجية بالحوش', 'صالة طعام', 'خيمة/بيت شعر'] },
      { name: 'capacity', label: 'السعة (أشخاص)', type: 'number', placeholder: 'مثال: 15' },
      { name: 'tv', label: 'شاشة تلفزيون', type: 'checkbox' }
    ]
  },
  {
    id: 'bedrooms', label: 'غرف النوم والأسرة', icon: 'fa-bed',
    fields: [
      { name: 'type', label: 'نوع الغرفة', options: ['غرفة نوم ماستر (بحمام)', 'غرفة نوم مفردة', 'غرفة نوم مزدوجة', 'جناح'] },
      { name: 'beds', label: 'عدد الأسرة', type: 'number', placeholder: 'مثال: 2' }
    ]
  },
  {
    id: 'bathrooms', label: 'دورات المياه', icon: 'fa-shower',
    fields: [
      { name: 'type', label: 'النوع', options: ['دورة مياه داخلية', 'دورة مياه خارجية'] },
      { name: 'shower', label: 'يوجد مروش (شاور)', type: 'checkbox' }
    ]
  },
  {
    id: 'kitchen', label: 'مرافق المطبخ', icon: 'fa-fire-burner',
    basicItems: [
      { id: 'oven', label: 'فرن' }, { id: 'microwave', label: 'مايكروويف' },
      { id: 'fridge', label: 'ثلاجة' }, { id: 'kettle', label: 'غلاية ماء' },
      { id: 'coffee', label: 'آلة قهوة' }, { id: 'utensils', label: 'أواني طبخ وتقديم' }
    ]
  },
  {
    id: 'general', label: 'مرافق عامة وتشغيلية', icon: 'fa-wifi',
    basicItems: [
      { id: 'wifi', label: 'إنترنت واي فاي (مشمول)' }, { id: 'parking_in', label: 'مواقف سيارات داخلية' },
      { id: 'parking_out', label: 'مواقف سيارات خارجية' }, { id: 'bbq', label: 'مكان مجهز للشواء' },
      { id: 'ac', label: 'تكييف (سبليت/مركزي)' }, { id: 'jacuzzi', label: 'جاكوزي' },
      { id: 'playground', label: 'ألعاب أطفال خارجية' }
    ]
  }
];

export default function AddPropertyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', type: '', descAr: '', city: '', address: '',
    bedrooms: 1, bathrooms: 1, checkin: '14:00', checkout: '12:00',
    structuredAmenities: {}, smoking: false, pets: false, parties: false, rules: '',
    basePrice: '', cleaningFee: '', weekendPrice: '', minStay: 1,
    deposit: '', instantBook: true, availability: 'always',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  
  const updateStructured = (catId, type, val) => {
    setForm(f => ({
      ...f, 
      structuredAmenities: {
        ...f.structuredAmenities,
        [catId]: { ...(f.structuredAmenities[catId] || {}), [type]: val }
      }
    }));
  };

  const addStructuredItem = (catId) => {
    const list = form.structuredAmenities[catId]?.items || [];
    updateStructured(catId, 'items', [...list, {}]);
  };

  const updateStructuredItem = (catId, idx, key, val) => {
    const list = [...(form.structuredAmenities[catId]?.items || [])];
    list[idx] = { ...list[idx], [key]: val };
    updateStructured(catId, 'items', list);
  };

  const removeStructuredItem = (catId, idx) => {
    const list = [...(form.structuredAmenities[catId]?.items || [])];
    list.splice(idx, 1);
    updateStructured(catId, 'items', list);
  };

  const handleSubmit = () => { setSubmitted(true); };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: '3rem', color: 'var(--text-success)' }}><i className="fa-solid fa-circle-check"></i></div>
        <h2>تم إرسال طلب إدراج العقار!</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 420 }}>عقارك قيد المراجعة من قِبل فريق نزهة. سيتم الرد خلال 24-48 ساعة عمل.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/host/dashboard" className="btn btn-primary" id="back-to-dashboard">العودة للوحة التحكم</Link>
          <Link href="/" className="btn btn-outline">الصفحة الرئيسية</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/host/dashboard" className="btn btn-ghost btn-sm">← لوحة التحكم</Link>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>إضافة عقار جديد</h3>
          <div style={{ marginRight: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>الخطوة {step} من {STEPS.length}</div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 740 }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 36, overflow: 'auto', paddingBottom: 4 }}>
          {STEPS.map(s => (
            <div key={s.id} style={{ flex: 1, minWidth: 80 }}>
              <div style={{ height: 4, background: step >= s.id ? 'var(--primary)' : 'var(--bg-elevated)', borderRadius: 2, marginBottom: 6, transition: 'background 0.3s' }} />
              <div style={{ fontSize: '0.7rem', color: step === s.id ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: step === s.id ? 700 : 400, whiteSpace: 'nowrap' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1.05rem' }}>{STEPS[step-1].label}</h3>
            <span className="badge badge-primary">{step}/{STEPS.length}</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {step === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">اسم العقار *</label>
                  <input className="form-control" placeholder="مثال: شاليه النخيل الفاخر" value={form.name} onChange={e => update('name',e.target.value)} id="prop-name" />
                </div>
                <div className="form-group">
                  <label className="form-label">نوع العقار *</label>
                  <select className="form-control" value={form.type} onChange={e => update('type',e.target.value)} id="prop-type">
                    <option value="">اختر النوع</option>
                    <option value="resort">منتجع</option>
                    <option value="chalet">شاليه</option>
                    <option value="vacation_rental">إيجار سياحي / فيلا</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">الوصف بالعربية *</label>
                  <textarea className="form-control" rows={5} placeholder="اكتب وصفاً تفصيلياً لعقارك..." value={form.descAr} onChange={e => update('descAr',e.target.value)} id="prop-desc" />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'left' }}>{form.descAr.length} حرف</div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-group">
                  <label className="form-label">المدينة *</label>
                  <select className="form-control" value={form.city} onChange={e => update('city',e.target.value)} id="prop-city">
                    <option value="">اختر المدينة</option>
                    {SAUDI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">العنوان التفصيلي</label>
                  <input className="form-control" placeholder="الحي، الشارع، ورقم المبنى" value={form.address} onChange={e => update('address',e.target.value)} id="prop-address" />
                </div>
                <div style={{ background: 'var(--bg-elevated)', height: 220, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', cursor: 'pointer' }} id="map-placeholder">
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}><i className="fa-regular fa-map"></i></div>
                    <div style={{ fontSize: '0.9rem' }}>انقر لتحديد موقع العقار على الخريطة</div>
                    <div style={{ fontSize: '0.77rem', marginTop: 4 }}>Google Maps — يُحدَّد الموقع تلقائياً عند كتابة العنوان</div>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { label: 'عدد غرف النوم', key: 'bedrooms', min: 1 },
                    { label: 'عدد الحمامات', key: 'bathrooms', min: 1 },
                  ].map(f => (
                    <div className="form-group" key={f.key}>
                      <label className="form-label">{f.label}</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button className="btn btn-outline btn-sm btn-icon" onClick={() => update(f.key, Math.max(f.min, form[f.key]-1))} id={`${f.key}-minus`}>-</button>
                        <span style={{ fontWeight: 700, minWidth: 30, textAlign: 'center' }}>{form[f.key]}</span>
                        <button className="btn btn-outline btn-sm btn-icon" onClick={() => update(f.key, form[f.key]+1)} id={`${f.key}-plus`}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">وقت تسجيل الدخول</label>
                    <input type="time" className="form-control" value={form.checkin} onChange={e => update('checkin',e.target.value)} id="prop-checkin-time" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">وقت تسجيل الخروج</label>
                    <input type="time" className="form-control" value={form.checkout} onChange={e => update('checkout',e.target.value)} id="prop-checkout-time" />
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>قسّم مرافق عقارك بوضوح (مثل الغرف، المسابح، المطابخ) لتسهيل تجربة العميل.</p>
                {AMENITY_CATEGORIES.map(cat => (
                  <div key={cat.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: 20, borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.2rem', color: 'var(--primary)', background: 'var(--bg-surface)', width: 34, height: 34, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}><i className={`fa-solid ${cat.icon}`}></i></span>
                      {cat.label}
                    </h4>
                    
                    {/* Basic Checkbox Items */}
                    {cat.basicItems && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                        {cat.basicItems.map(item => {
                          const isChecked = form.structuredAmenities[cat.id]?.basic?.includes(item.id);
                          return (
                            <label key={item.id} className="checkbox-item" style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border)'}`, transition: 'all 0.2s', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <input 
                                type="checkbox" 
                                style={{ accentColor: 'var(--primary)' }}
                                checked={isChecked || false} 
                                onChange={(e) => {
                                  const current = form.structuredAmenities[cat.id]?.basic || [];
                                  const newBasics = e.target.checked ? [...current, item.id] : current.filter(id => id !== item.id);
                                  updateStructured(cat.id, 'basic', newBasics);
                                }}
                              />
                              <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Array/Nested Items (Pools, Seating, Bedrooms) */}
                    {cat.fields && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {(form.structuredAmenities[cat.id]?.items || []).map((entry, idx) => (
                          <div key={idx} style={{ background: 'var(--bg-surface)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', position: 'relative' }}>
                            <button className="btn btn-ghost btn-icon btn-sm" style={{ position: 'absolute', top: 10, left: 10, color: 'var(--text-danger)' }} onClick={() => removeStructuredItem(cat.id, idx)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 14, color: 'var(--primary-dark)', borderBottom: '1px dashed var(--border)', paddingBottom: 8 }}>
                              {cat.label} (مرفق {idx + 1})
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                              {cat.fields.map(field => (
                                <div key={field.name} style={{ display: 'flex', flexDirection: field.type === 'checkbox' ? 'row' : 'column', gap: 6, alignItems: field.type === 'checkbox' ? 'center' : 'stretch', gridColumn: field.type === 'checkbox' ? '1 / -1' : 'auto', marginTop: field.type === 'checkbox' ? 10 : 0 }}>
                                  
                                  {field.type !== 'checkbox' && <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{field.label}</label>}
                                  
                                  {field.options ? (
                                    <select className="form-control" style={{ padding: '6px 10px', fontSize: '0.82rem' }} value={entry[field.name] || ''} onChange={e => updateStructuredItem(cat.id, idx, field.name, e.target.value)}>
                                      <option value="">اختر {field.label}</option>
                                      {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                  ) : field.type === 'checkbox' ? (
                                    <label className="checkbox-item" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                      <input type="checkbox" style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} checked={!!entry[field.name]} onChange={e => updateStructuredItem(cat.id, idx, field.name, e.target.checked)} />
                                      {field.label}
                                    </label>
                                  ) : (
                                    <input type={field.type || 'text'} className="form-control" style={{ padding: '6px 10px', fontSize: '0.82rem' }} placeholder={field.placeholder} value={entry[field.name] || ''} onChange={e => updateStructuredItem(cat.id, idx, field.name, e.target.value)} />
                                  )}

                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', background: 'var(--bg-surface)' }} onClick={() => addStructuredItem(cat.id)}>
                          <i className="fa-solid fa-plus"></i> إضافة {cat.label}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {step === 5 && (
              <>
                <div className="form-group"><label className="form-label">سياسة التدخين</label>
                  <div style={{ display:'flex', gap:10 }}>
                    <label className="checkbox-item"><input type="radio" name="smoking" checked={!form.smoking} onChange={() => update('smoking',false)} id="no-smoking" /> غير مسموح</label>
                    <label className="checkbox-item"><input type="radio" name="smoking" checked={form.smoking} onChange={() => update('smoking',true)} id="smoking-ok" /> مسموح</label>
                  </div>
                </div>
                <div className="form-group"><label className="form-label">الحيوانات الأليفة</label>
                  <div style={{ display:'flex', gap:10 }}>
                    <label className="checkbox-item"><input type="radio" name="pets" checked={!form.pets} onChange={() => update('pets',false)} id="no-pets" /> غير مسموح</label>
                    <label className="checkbox-item"><input type="radio" name="pets" checked={form.pets} onChange={() => update('pets',true)} id="pets-ok" /> مسموح</label>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div className="form-group"><label className="form-label">السعر الأساسي / ليلة (ريال) *</label>
                    <input type="number" className="form-control" min="1" placeholder="مثال: 1500" value={form.basePrice} onChange={e => update('basePrice',e.target.value)} id="prop-base-price" />
                  </div>
                  <div className="form-group"><label className="form-label">رسوم النظافة (ريال)</label>
                    <input type="number" className="form-control" min="0" value={form.cleaningFee} onChange={e => update('cleaningFee',e.target.value)} id="prop-cleaning-fee" />
                  </div>
                  <div className="form-group"><label className="form-label">سعر نهاية الأسبوع (ريال)</label>
                    <input type="number" className="form-control" min="0" placeholder="اختياري" value={form.weekendPrice} onChange={e => update('weekendPrice',e.target.value)} id="prop-weekend-price" />
                  </div>
                  <div className="form-group"><label className="form-label">الحد الأدنى للإقامة (ليالٍ)</label>
                    <input type="number" className="form-control" min="1" value={form.minStay} onChange={e => update('minStay',+e.target.value)} id="prop-min-stay" />
                  </div>
                  <div className="form-group"><label className="form-label">مبلغ التأمين / الأمانة (ريال)</label>
                    <input type="number" className="form-control" min="0" placeholder="اختياري — يُدفع نقداً عند الوصول" value={form.deposit} onChange={e => update('deposit',e.target.value)} id="prop-deposit" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">نوع الحجز</label>
                  <div style={{ display:'flex', gap:10 }}>
                    <label className="checkbox-item"><input type="radio" name="book" checked={form.instantBook} onChange={() => update('instantBook',true)} id="instant-book" /> <i className="fa-solid fa-bolt" style={{ marginLeft: 6 }}></i> حجز فوري</label>
                    <label className="checkbox-item"><input type="radio" name="book" checked={!form.instantBook} onChange={() => update('instantBook',false)} id="request-book" /> <i className="fa-regular fa-envelope" style={{ marginLeft: 6 }}></i> بطلب مسبق</label>
                  </div>
                </div>
              </>
            )}

            {step === 6 && (
              <div>
                <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} id="photo-upload-area">
                  <div style={{ fontSize: '2.5rem', marginBottom: 12, color: 'var(--text-muted)' }}><i className="fa-solid fa-cloud-arrow-up"></i></div>
                  <h4 style={{ marginBottom: 8 }}>اسحب الصور هنا أو انقر للتحميل</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>من 5 إلى 30 صورة · JPG/PNG · حجم أقصى 10 ميغابايت لكل صورة</p>
                  <input type="file" accept="image/*" multiple style={{ display: 'none' }} id="photo-input" />
                  <button className="btn btn-outline btn-sm" style={{ marginTop: 16 }} onClick={() => document.getElementById('photo-input').click()} id="upload-photos-btn">
                    اختر الصور
                  </button>
                </div>
                <div className="alert alert-info" style={{ marginTop: 16, fontSize: '0.82rem' }}>
                  <i className="fa-solid fa-lightbulb" style={{ marginLeft: 8 }}></i> الصورة الأولى ستكون الصورة الرئيسية. يمكنك إعادة الترتيب بالسحب والإفلات.
                </div>
              </div>
            )}

            {step === 7 && (
              <div>
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label">الإتاحة الافتراضية</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <label className="checkbox-item"><input type="radio" name="avail" checked={form.availability==='always'} onChange={() => update('availability','always')} id="always-available" /> <i className="fa-solid fa-check" style={{ marginLeft: 6 }}></i> متاح دائماً</label>
                    <label className="checkbox-item"><input type="radio" name="avail" checked={form.availability==='blocked'} onChange={() => update('availability','blocked')} id="blocked-default" /> <i className="fa-solid fa-lock" style={{ marginLeft: 6 }}></i> محجوب افتراضياً</label>
                  </div>
                </div>
                <div className="alert alert-success" style={{ marginBottom: 16 }}>
                  <i className="fa-solid fa-circle-check" style={{ marginLeft: 8 }}></i> يمكنك ضبط الإتاحة يداً بيد عبر تقويم العقار في لوحة التحكم
                </div>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--border)' }}>
                  <h5 style={{ marginBottom: 12 }}>ملخص العقار</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {(() => {
                      let tA = 0;
                      Object.values(form.structuredAmenities || {}).forEach(c => {
                        if (c.basic) tA += c.basic.length;
                        if (c.items) tA += c.items.length;
                      });
                      return [
                        { l: 'الاسم', v: form.name || '—' },
                        { l: 'النوع', v: form.type || '—' },
                        { l: 'المدينة', v: form.city || '—' },
                        { l: 'الغرف / الحمامات', v: `${form.bedrooms} / ${form.bathrooms}` },
                        { l: 'السعر / ليلة', v: form.basePrice ? `${form.basePrice} ريال` : '—' },
                        { l: 'المرافق المفصلة', v: `${tA} عناصر مسجلة` },
                        { l: 'نوع الحجز', v: form.instantBook ? 'فوري' : 'بطلب' },
                      ].map(item => (
                        <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{item.l}</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.v}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="card-footer" style={{ justifyContent: 'space-between' }}>
            {step > 1 ? (
              <button className="btn btn-outline" onClick={() => setStep(s => s-1)} id="prev-step-btn">← السابق</button>
            ) : (
              <Link href="/host/dashboard" className="btn btn-ghost">إلغاء</Link>
            )}
            {step < STEPS.length ? (
              <button className="btn btn-primary btn-lg" onClick={() => setStep(s => s+1)} id="next-step-btn">التالي →</button>
            ) : (
              <button className="btn btn-accent btn-lg" onClick={handleSubmit} id="submit-property-btn">إرسال للمراجعة <i className="fa-solid fa-rocket" style={{ marginRight: 6 }}></i></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
