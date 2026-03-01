'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function HostRegister() {
  const [formData, setFormData] = useState({ name:'', cr:'', phone:'', email:'', bank:'' });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20 }} dir="rtl">
      <div className="card" style={{ width: '100%', maxWidth: 520, padding: 32 }}>
        <form onSubmit={e => { e.preventDefault(); window.location.href = '/host/dashboard'; }}>
          <div style={{ marginBottom: 24 }}>
            <div className="badge badge-primary" style={{ marginBottom: 10 }}>للملاك (T-027)</div>
            <h2>إنشاء حساب مالك جديد</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ابدأ في إدراج وتأجير عقاراتك.</p>
          </div>
          
          <div className="form-group"><label className="form-label">الاسم الكامل / اسم المنشأة</label><input type="text" className="form-control" required /></div>
          <div className="form-group"><label className="form-label">رقم الهوية الوطنية / السجل التجاري</label><input type="text" className="form-control" required /></div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group"><label className="form-label">رقم الجوال</label><input type="tel" className="form-control" required /></div>
            <div className="form-group"><label className="form-label">البريد الإلكتروني</label><input type="email" className="form-control" required /></div>
          </div>
          
          <div className="form-group"><label className="form-label">رقم الحساب البنكي (الآيبان IBAN)</label><input type="text" className="form-control" placeholder="SA..." required style={{ direction: 'ltr', textAlign: 'right' }} /></div>
          
          <div className="form-group">
            <label className="checkbox-item" style={{ fontSize: '0.8rem' }}>
              <input type="checkbox" required /> أوافق على شروط الاستخدام وسياسة الخصوصية الخاصة بالمنصة.
            </label>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>إنشاء حساب المالك والانتقال للوحة التحكم</button>
        </form>
      </div>
    </div>
  );
}
