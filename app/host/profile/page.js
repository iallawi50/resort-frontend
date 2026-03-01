'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function HostProfile() {
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast({msg}); setTimeout(() => setToast(null), 3000); };

  return (
    <div style={{ paddingTop: 0, minHeight: '100vh', background: 'var(--bg-base)' }} dir="rtl">
      {/* Quick Mock Header */}
      <div style={{ background: '#fff', padding: '16px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.2rem' }}>الملف الشخصي للمالك (T-036)</h2>
        <Link href="/host/dashboard" className="btn btn-outline btn-sm">العودة للوحة التحكم</Link>
      </div>

      <div className="container" style={{ padding: '40px 15px', maxWidth: 800 }}>
        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={e => { e.preventDefault(); showToast('تم تحديث البيانات البنكية'); }}>
            <h3 style={{ marginBottom: 20 }}>البيانات البنكية (لاستلام الدفعات)</h3>
            <div className="form-group"><label className="form-label">اسم البنك</label><input type="text" className="form-control" defaultValue="مصرف الراجحي" /></div>
            <div className="form-group"><label className="form-label">اسم المستفيد</label><input type="text" className="form-control" defaultValue="عبدالله المنيع" /></div>
            <div className="form-group"><label className="form-label">رقم الآيبان IBAN</label><input type="text" className="form-control" defaultValue="SA0000000000000000000000" style={{ direction: 'ltr', textAlign: 'right' }} /></div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>حفظ التعديلات البنكية</button>
          </form>
        </div>

        <div className="card" style={{ padding: 32, marginTop: 24 }}>
          <h3 style={{ marginBottom: 20 }}>البيانات الشخصية</h3>
          <form onSubmit={e => { e.preventDefault(); showToast('تم الحفظ'); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div className="form-group"><label className="form-label">الاسم</label><input type="text" className="form-control" defaultValue="عبدالله المنيع" /></div>
              <div className="form-group"><label className="form-label">رقم الهوية / السجل التجاري</label><input type="text" className="form-control" defaultValue="103XXXXXXX" disabled /></div>
              <div className="form-group"><label className="form-label">الجوال</label><input type="text" className="form-control" defaultValue="055XXXXXXX" /></div>
              <div className="form-group"><label className="form-label">البريد</label><input type="text" className="form-control" defaultValue="al.monei@example.com" /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" className="btn btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => confirm('سيتم أرشفة البيانات المالية ولن تتمكن من الوصول للحساب (T-186)')}>حذف الحساب</button>
              <button type="submit" className="btn btn-primary">حفظ البيانات الشخصية</button>
            </div>
          </form>
        </div>
      </div>
      {toast && <div className="toast-container"><div className="toast success">{toast.msg}</div></div>}
    </div>
  );
}
