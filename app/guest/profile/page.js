'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function GuestProfile() {
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast({msg}); setTimeout(() => setToast(null), 3000); };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-base)' }} dir="rtl">
        <div className="container" style={{ padding: '40px 15px' }}>
          <h2 style={{ marginBottom: 24 }}>تعديل الملف الشخصي (T-035)</h2>
          <div className="profile-layout" style={{ display: 'grid', gap: 24, alignItems: 'start' }}>
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <div className="avatar avatar-xl" style={{ width: 120, height: 120, fontSize: '3rem', background: 'var(--primary-dark)', color: 'var(--primary-light)', margin: '0 auto 16px' }}>م</div>
              <h4 style={{ marginBottom: 4 }}>محمد السالم</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>عضو منذ 2025</p>
              <button className="btn btn-outline btn-sm" style={{ width: '100%' }}>تغيير الصورة</button>
            </div>
            <div className="card" style={{ padding: 32 }}>
              <form onSubmit={e => { e.preventDefault(); showToast('تم الحفظ بنجاح'); }}>
                <div className="profile-form-grid" style={{ display: 'grid', gap: 20, marginBottom: 20 }}>
                  <div className="form-group"><label className="form-label">الاسم الكامل</label><input type="text" className="form-control" defaultValue="محمد السالم" /></div>
                  <div className="form-group"><label className="form-label">المدينة</label><input type="text" className="form-control" defaultValue="الرياض" /></div>
                  <div className="form-group"><label className="form-label">رقم الجوال</label><input type="tel" className="form-control" defaultValue="0501234567" disabled /></div>
                  <div className="form-group"><label className="form-label">البريد الإلكتروني</label><input type="email" className="form-control" defaultValue="m.salem@example.com" disabled /></div>
                </div>
                <div style={{ padding: 16, border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', marginBottom: 24, background: 'var(--bg-elevated)' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: 12 }}>تغيير كلمة المرور</h4>
                  <div className="profile-pw-grid" style={{ display: 'grid', gap: 12 }}>
                    <input type="password" placeholder="كلمة المرور الجديدة" className="form-control" />
                    <input type="password" placeholder="تأكيد كلمة المرور" className="form-control" />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => confirm('هل أنت متأكد من حذف الحساب نهائياً؟ (T-186 GDPR)')}><i className="fa-solid fa-trash" style={{ marginLeft: 6 }}></i> حذف الحساب</button>
                  <button type="submit" className="btn btn-primary">حفظ التعديلات</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="toast-container"><div className="toast success">{toast.msg}</div></div>}
      <Footer />
      <style>{`
        .profile-layout { grid-template-columns: 300px 1fr; }
        .profile-form-grid { grid-template-columns: 1fr 1fr; }
        .profile-pw-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) {
          .profile-layout { grid-template-columns: 1fr; }
          .profile-form-grid { grid-template-columns: 1fr; }
          .profile-pw-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
