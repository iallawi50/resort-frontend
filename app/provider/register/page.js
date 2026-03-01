'use client';
import { useState } from 'react';

export default function ProviderRegister() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ business: '', category: '', phone: '', email: '', ibaan: '' });
  const [otp, setOtp] = useState('');

  const renderStep = () => {
    if (step === 1) {
      return (
        <form onSubmit={e => { e.preventDefault(); setStep(2); }}>
          <div className="badge badge-accent" style={{ marginBottom: 10 }}>لمزودي الخدمات (T-030)</div>
          <h2 style={{ marginBottom: 24 }}>انضم كمزود خدمة</h2>
          <div className="form-group"><label className="form-label">الاسم التجاري</label><input type="text" className="form-control" required value={formData.business} onChange={e=>setFormData({...formData, business: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">فئة الخدمة</label>
            <select className="form-control" required value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}>
              <option value="">اختر...</option><option>تصوير</option><option>ديكور وضيافة</option><option>موسيقى وصوتيات</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">البريد الإلكتروني</label><input type="email" className="form-control" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">رقم الجوال</label><input type="tel" className="form-control" required value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">رقم الحساب البنكي (الآيبان IBAN)</label><input type="text" className="form-control" placeholder="SA..." required value={formData.ibaan} onChange={e=>setFormData({...formData, ibaan: e.target.value})} style={{ direction: 'ltr', textAlign: 'right' }} /></div>
          <div className="form-group">
            <label className="checkbox-item" style={{ fontSize: '0.8rem' }}>
              <input type="checkbox" required /> أوافق على شروط مزودي الخدمة وتقتطع المنصة نسبة 5٪ من كل طلب.
            </label>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>إرسال وتلقي رمز التحقق</button>
        </form>
      );
    } else if (step === 2) {
      return (
        <form onSubmit={e => { e.preventDefault(); setStep(3); }}>
          <h2 style={{ marginBottom: 12 }}>التحقق من الهاتف</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>أدخل رمز OTP المرسل لجوالك.</p>
          <div className="form-group"><input type="text" className="form-control" maxLength={4} style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.5rem' }} value={otp} onChange={e=>setOtp(e.target.value)} required /></div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 20 }}>تأكيد</button>
        </form>
      );
    } else {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', color: 'var(--text-warning)', marginBottom: 16 }}><i className="fa-solid fa-clock"></i></div>
          <h3 style={{ marginBottom: 12 }}>طلبك قيد المراجعة (T-031)</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>سيقوم فريق الدعم بمراجعة طلبك والرد خلال 24 ساعة.</p>
          <button onClick={() => window.location.href = '/provider/dashboard'} className="btn btn-outline" style={{ width: '100%' }}>الانتقال للوحة التحكم (مؤقتاً)</button>
        </div>
      );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20 }} dir="rtl">
      <div className="card" style={{ width: '100%', maxWidth: 460, padding: 32 }}>{renderStep()}</div>
    </div>
  );
}
