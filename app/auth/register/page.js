'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function GuestRegister() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '' });
  const [otp, setOtp] = useState('');

  const renderStep = () => {
    if (step === 1) {
      return (
        <form onSubmit={e => { e.preventDefault(); setStep(2); }}>
          <h2 style={{ marginBottom: 24 }}>إنشاء حساب ضيف جديد</h2>
          <div className="form-group"><label className="form-label">الاسم الكامل</label><input type="text" className="form-control" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">رقم الجوال</label><input type="tel" className="form-control" required value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">البريد الإلكتروني</label><input type="email" className="form-control" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">المدينة</label>
            <select className="form-control" value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})}>
              <option value="">اختر مدينة...</option>
              <option>الرياض</option><option>جدة</option><option>الدمام</option><option>أبها</option><option>الطائف</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>التسجيل (متابعة للتحقق)</button>
        </form>
      );
    } else {
      return (
        <form onSubmit={e => { e.preventDefault(); window.location.href = '/guest'; }}>
          <h2 style={{ marginBottom: 12 }}>التحقق من رقم الجوال (T-022)</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>أدخل الرمز المكون من 4 أرقام المرسل إلى {formData.phone}</p>
          <div className="form-group"><label className="form-label">رمز التحقق OTP</label><input type="text" className="form-control" maxLength={4} style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.5rem' }} value={otp} onChange={e=>setOtp(e.target.value)} required /></div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button type="button" className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1 }}>تراجع</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>تأكيد واكتمال التسجيل</button>
          </div>
        </form>
      );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20 }} dir="rtl">
      <div className="card" style={{ width: '100%', maxWidth: 460, padding: 32 }}>
        {renderStep()}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem' }}>
          لديك حساب مسبقاً؟ <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
}
