'use client';
import { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { PROPERTIES, formatPrice } from '../../lib/data';

const STEPS = [
  { id: 1, label: 'التواريخ والضيوف' },
  { id: 2, label: 'المراجعة' },
  { id: 3, label: 'الدفع' },
];

const PAYMENT_METHODS = [
  { id: 'mada', label: 'مدى', icon: <i className="fa-regular fa-credit-card"></i> },
  { id: 'visa', label: 'Visa / Mastercard', icon: <i className="fa-brands fa-cc-visa"></i> },
  { id: 'stcpay', label: 'STC Pay', icon: <i className="fa-solid fa-mobile-screen"></i> },
  { id: 'applepay', label: 'Apple Pay', icon: <i className="fa-brands fa-apple"></i> },
];

export default function BookingPage({ params }) {
  const { id } = use(params);
  const property = PROPERTIES.find(p => p.id === parseInt(id)) || PROPERTIES[0];

  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState('2026-03-10');
  const [checkOut, setCheckOut] = useState('2026-03-13');
  const [paymentMethod, setPaymentMethod] = useState('mada');
  const [agreed, setAgreed] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [booking, setBooking] = useState(null);

  const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
  const baseAmount = property.basePrice * nights;
  const serviceFee = Math.round(baseAmount * 0.05);
  const total = baseAmount + property.cleaningFee + serviceFee;

  const handleConfirmPayment = () => {
    setBooking({
      id: `NZ-2026-${String(Math.floor(Math.random()*99999)).padStart(6,'0')}`,
      property, checkIn, checkOut, nights, total, paymentMethod
    });
    setBookingConfirmed(true);
  };

  if (bookingConfirmed && booking) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px' }}>
          <div className="booking-success" id="booking-success">
            <div className="success-icon"><i className="fa-solid fa-circle-check"></i></div>
            <h1 style={{ marginBottom: 8 }}>تم الحجز بنجاح!</h1>
            <p style={{ marginBottom: 24, color: 'var(--text-secondary)' }}>
              {property.isInstantBook ? 'حجزك مؤكد على الفور' : 'طلب حجزك قيد الانتظار — سيرد عليك المالك خلال 24 ساعة'}
            </p>
            <div className="booking-receipt">
              <div style={{ fontWeight: 700, marginBottom: 4 }}>رقم الحجز</div>
              <div className="booking-ref" id="booking-ref">{booking.id}</div>
              <div className="divider" style={{ margin: '16px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.88rem' }}>
                {[
                  { label: 'العقار', value: property.name },
                  { label: 'المدينة', value: property.city },
                  { label: 'الوصول', value: booking.checkIn },
                  { label: 'المغادرة', value: booking.checkOut },
                  { label: 'عدد الليالي', value: `${booking.nights} ليلة` },
                  { label: 'الإجمالي', value: formatPrice(booking.total) },
                  { label: 'طريقة الدفع', value: PAYMENT_METHODS.find(m => m.id === booking.paymentMethod)?.label },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>{item.label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
              <Link href="/guest" className="btn btn-primary" id="go-to-bookings-btn">عرض حجوزاتي</Link>
              <Link href="/" className="btn btn-outline">العودة للرئيسية</Link>
            </div>
          </div>
        </div>
        <style>{`
          .booking-success { background: var(--bg-card); border: 1px solid var(--border-primary); border-radius: var(--radius-xl); padding: 48px; text-align: center; max-width: 500px; width: 100%; box-shadow: var(--shadow-primary); }
          .success-icon { font-size: 3.5rem; margin-bottom: 16px; animation: float 2s ease-in-out infinite; }
          .booking-receipt { background: var(--bg-elevated); border-radius: var(--radius-md); padding: 20px; text-align: right; margin-top: 20px; }
          .booking-ref { font-size: 1.3rem; font-weight: 900; color: var(--primary-light); letter-spacing: 0.1em; font-family: monospace; }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-base)' }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
          {/* Progress Steps */}
          <div className="booking-steps" id="booking-steps">
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div className={`step-item ${step > s.id ? 'done' : step === s.id ? 'active' : ''}`} onClick={() => step > s.id && setStep(s.id)}>
                  <div className="step-num">{step > s.id ? <i className="fa-solid fa-check"></i> : s.id}</div>
                  <div className="step-label">{s.label}</div>
                </div>
                {i < STEPS.length - 1 && <div className={`step-line ${step > s.id ? 'done' : ''}`} />}
              </div>
            ))}
          </div>

          <div className="booking-layout">
            <div className="booking-main">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="card" id="step-1">
                  <div className="card-header"><h3>التواريخ وعدد الضيوف</h3></div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div className="form-group">
                        <label className="form-label">تاريخ الوصول</label>
                        <input type="date" className="form-control" value={checkIn} onChange={e => setCheckIn(e.target.value)} id="step1-checkin" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">تاريخ المغادرة</label>
                        <input type="date" className="form-control" value={checkOut} onChange={e => setCheckOut(e.target.value)} id="step1-checkout" />
                      </div>
                    </div>
                    <div className="alert alert-info">
                      <i className="fa-solid fa-circle-info" style={{ marginLeft: 8 }}></i> الحجز لمدة <strong>{nights} ليلة</strong> بتكلفة إجمالية <strong>{formatPrice(total)}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="card" id="step-2">
                  <div className="card-header"><h3>مراجعة الحجز</h3></div>
                  <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, padding: '16px 20px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                      {[
                        { l: 'العقار', v: property.name },
                        { l: 'المدينة', v: property.city },
                        { l: 'تاريخ الوصول', v: checkIn },
                        { l: 'تاريخ المغادرة', v: checkOut },
                        { l: 'عدد الليالي', v: `${nights} ليلة` },
                      ].map(item => (
                        <div key={item.l}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 2 }}>{item.l}</div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 20 }}>
                      {[
                        { label: `${formatPrice(property.basePrice)} × ${nights} ليالٍ`, value: baseAmount },
                        { label: 'رسوم النظافة', value: property.cleaningFee },
                        { label: 'رسوم الخدمة (5%)', value: serviceFee },
                      ].map(item => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                          <span>{item.label}</span><span>{formatPrice(item.value)}</span>
                        </div>
                      ))}
                      <div className="divider" style={{ margin: '10px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem' }}>
                        <span>الإجمالي</span><span style={{ color: 'var(--primary-light)' }}>{formatPrice(total)}</span>
                      </div>
                    </div>
                    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 20 }}>
                      <h5 style={{ marginBottom: 10 }}>قواعد العقار</h5>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span><i className="fa-solid fa-smoking" style={{ marginLeft: 6 }}></i> التدخين {property.rules.smoking ? 'مسموح' : 'غير مسموح'}</span>
                        <span><i className="fa-solid fa-paw" style={{ marginLeft: 6 }}></i> الحيوانات الأليفة {property.rules.pets ? 'مسموح' : 'غير مسموح'}</span>
                        <span><i className="fa-solid fa-champagne-glasses" style={{ marginLeft: 6 }}></i> الحفلات {property.rules.parties ? 'مسموح' : 'غير مسموح'}</span>
                      </div>
                    </div>
                    <label className="checkbox-item" style={{ fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} id="agree-rules" />
                      أوافق على قواعد العقار وسياسة الإلغاء
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="card" id="step-3">
                  <div className="card-header"><h3>اختر طريقة الدفع</h3></div>
                  <div className="card-body">
                    <div className="payment-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
                      {PAYMENT_METHODS.map(m => (
                        <label key={m.id} className={`payment-method${paymentMethod===m.id?' selected':''}`} id={`pay-${m.id}`}>
                          <input type="radio" name="payment" value={m.id} checked={paymentMethod===m.id} onChange={() => setPaymentMethod(m.id)} style={{ display: 'none' }} />
                          <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.label}</span>
                          {paymentMethod===m.id && <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)', marginRight: 'auto' }}><i className="fa-solid fa-check"></i></span>}
                        </label>
                      ))}
                    </div>
                    {(paymentMethod === 'visa') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div className="form-group">
                          <label className="form-label">رقم البطاقة</label>
                          <input className="form-control" placeholder="0000 0000 0000 0000" maxLength={19} id="card-number" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div className="form-group">
                            <label className="form-label">تاريخ الانتهاء</label>
                            <input className="form-control" placeholder="MM/YY" maxLength={5} id="card-expiry" />
                          </div>
                          <div className="form-group">
                            <label className="form-label">CVV</label>
                            <input className="form-control" placeholder="000" maxLength={3} type="password" id="card-cvv" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="alert alert-info" style={{ marginTop: 16 }}>
                      <i className="fa-solid fa-lock" style={{ marginLeft: 8 }}></i> معاملتك مشفرة ومؤمنة. لا نحتفظ ببيانات بطاقتك.
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                {step > 1 ? (
                  <button className="btn btn-outline" onClick={() => setStep(s => s-1)} id="prev-step-btn">
                    ← السابق
                  </button>
                ) : (
                  <Link href={`/property/${property.id}`} className="btn btn-ghost">← العودة للعقار</Link>
                )}
                {step < 3 ? (
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(s => s+1)} disabled={step===2&&!agreed} id="next-step-btn">
                    التالي →
                  </button>
                ) : (
                  <button className="btn btn-accent btn-lg" onClick={handleConfirmPayment} id="confirm-payment-btn">
                    <i className="fa-regular fa-credit-card" style={{ marginLeft: 8 }}></i> تأكيد الدفع — {formatPrice(total)}
                  </button>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="booking-summary-card">
              <img src={property.images[0]} alt={property.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 14 }} />
              <h4 style={{ marginBottom: 4 }}>{property.name}</h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14 }}><i className="fa-solid fa-location-dot" style={{ marginLeft: 6 }}></i> {property.city}</div>
              <div className="divider" style={{ marginBottom: 14 }} />
              {[
                { l: 'الوصول', v: checkIn },
                { l: 'المغادرة', v: checkOut },
                { l: 'الليالي', v: nights },
              ].map(item => (
                <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6, color: 'var(--text-secondary)' }}>
                  <span>{item.l}</span><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.v}</span>
                </div>
              ))}
              <div className="divider" style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                <span>الإجمالي</span><span style={{ color: 'var(--primary-light)', fontSize: '1.1rem' }}>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .booking-steps { display: flex; align-items: center; margin-bottom: 40px; }
        .step-item { display: flex; align-items: center; gap: 10px; cursor: default; }
        .step-num { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); flex-shrink: 0; }
        .step-item.active .step-num { border-color: var(--primary); background: var(--primary); color: #fff; }
        .step-item.done .step-num { border-color: var(--text-success); background: var(--success-bg); color: var(--text-success); }
        .step-label { font-size: 0.82rem; font-weight: 600; color: var(--text-muted); white-space: nowrap; }
        .step-item.active .step-label { color: var(--text-primary); }
        .step-item.done .step-label { color: var(--text-success); }
        .step-line { flex: 1; height: 2px; background: var(--border); margin: 0 8px; }
        .step-line.done { background: var(--text-success); }
        .booking-layout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; }
        .booking-main { min-width: 0; }
        .booking-summary-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; height: fit-content; position: sticky; top: 90px; }
        .payment-method { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--bg-elevated); border: 2px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition-base); }
        .payment-method.selected { border-color: var(--primary); background: var(--primary-glow); }
        
        @media (max-width: 900px) { 
          .booking-layout { grid-template-columns: 1fr; display: flex; flex-direction: column-reverse; } 
          .booking-summary-card { position: static; margin-bottom: 24px; }
        }
        @media (max-width: 600px) { 
          .booking-steps { display: none; } 
          .payment-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
