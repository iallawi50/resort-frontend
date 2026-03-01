'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { window.location.href = '/'; }, 1500);
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: 'radial-gradient(ellipse at 50% 0%, rgba(26,122,94,0.12) 0%, transparent 70%)' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.3rem', color: '#fff' }}>ن</div>
              <span style={{ fontWeight: 800, fontSize: '1.4rem' }}>نزهة</span>
            </Link>
            <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: 4 }}>
              <button className={`btn btn-sm ${mode==='login'?'btn-primary':''}`} style={{ flex: 1, background: mode==='login' ? undefined : 'transparent', border: 'none' }} onClick={() => setMode('login')} id="tab-login">تسجيل الدخول</button>
              <button className={`btn btn-sm ${mode==='register'?'btn-primary':''}`} style={{ flex: 1, background: mode==='register' ? undefined : 'transparent', border: 'none' }} onClick={() => setMode('register')} id="tab-register">حساب جديد</button>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} id="auth-form">
                {mode === 'register' && (
                  <div className="form-group">
                    <label className="form-label">الاسم الكامل</label>
                    <input className="form-control" placeholder="اسمك الكامل" required id="register-name" />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">البريد الإلكتروني أو الجوال</label>
                  <input className="form-control" placeholder="example@email.com" required id="auth-email" />
                </div>
                <div className="form-group">
                  <label className="form-label">كلمة المرور</label>
                  <input type="password" className="form-control" placeholder="••••••••" required id="auth-password" />
                </div>
                {mode === 'register' && (
                  <div className="form-group">
                    <label className="form-label">تأكيد كلمة المرور</label>
                    <input type="password" className="form-control" placeholder="••••••••" required id="auth-confirm-password" />
                  </div>
                )}
                {mode === 'login' && (
                  <div style={{ textAlign: 'left' }}>
                    <Link href="#" style={{ fontSize: '0.82rem', color: 'var(--primary-light)' }}>نسيت كلمة المرور؟</Link>
                  </div>
                )}
                <button className="btn btn-accent btn-lg" type="submit" disabled={loading} id="auth-submit-btn" style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? <><i className="fa-solid fa-hourglass-half" style={{ marginLeft: 6 }}></i> جارٍ...</> : mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
                </button>
                {mode === 'register' && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    بإنشاء حسابك توافق على <Link href="/terms" style={{ color: 'var(--primary-light)' }}>الشروط والأحكام</Link> و<Link href="/privacy" style={{ color: 'var(--primary-light)' }}>سياسة الخصوصية</Link>
                  </div>
                )}
              </form>
            </div>
          </div>
          {mode === 'login' && (
            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              لا تملك حساباً؟{' '}
              <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 700 }}>سجّل الآن</button>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
