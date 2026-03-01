'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20 }} dir="rtl">
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 32 }}>
        {step === 1 ? (
          <form onSubmit={e => { e.preventDefault(); setStep(2); }}>
            <h2 style={{ marginBottom: 16 }}>نسيت كلمة المرور؟</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>أدخل عنوان بريدك الإلكتروني ليتم إرسال رابط إعادة تعيين كلمة المرور.</p>
            <div className="form-group"><label className="form-label">البريد الإلكتروني</label><input type="email" className="form-control" required /></div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>إرسال رابط التحقق</button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', color: 'var(--text-success)', marginBottom: 16 }}><i className="fa-solid fa-envelope-circle-check"></i></div>
            <h3 style={{ marginBottom: 12 }}>تم إرسال الرابط!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>يرجى التحقق من صندوق الوارد الخاص بك لتعيين كلمة مرور جديدة.</p>
            <Link href="/auth/login" className="btn btn-primary" style={{ width: '100%' }}>العودة لتسجيل الدخول</Link>
          </div>
        )}
      </div>
    </div>
  );
}
