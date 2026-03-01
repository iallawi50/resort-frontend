'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HostLandingPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        {/* Hero */}
        <section className="hero-section" id="hero" style={{ minHeight: '80vh', paddingTop: 0 }}>
          <div className="hero-bg">
            <img src="/chalet_pool.png" alt="منتجع للإيجار" className="hero-bg-img" />
            <div className="hero-overlay" />
          </div>
          <div className="container hero-content" style={{ textAlign: 'center', paddingTop: 120 }}>
            <div className="animate-fade-in-up">
              <div className="badge badge-accent" style={{ marginBottom: 16, fontSize: '0.8rem' }}>
                <i className="fa-solid fa-building" style={{ marginLeft: 6 }}></i> للملاك والمستثمرين
              </div>
              <h1 className="hero-title" style={{ justifyContent: 'center' }}>
                حوّل عقارك إلى مصدر
                <br />
                <span className="text-gradient"> دخل موثوق ومستدام </span>
              </h1>
              <p className="hero-subtitle" style={{ margin: '0 auto', maxWidth: 640 }}>
                منصة نزهة تمنحك أدوات احترافية لإدارة حجوزاتك، تتبع إيراداتك، واستقطاب ضيوف من جميع أنحاء المملكة.
              </p>
            </div>
            <div className="animate-fade-in-up delay-2" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
              <Link href="/host/property/add" className="btn btn-primary btn-lg" id="start-listing-btn">
                أدرج عقارك الآن
              </Link>
              <Link href="/host/dashboard" className="btn btn-outline btn-lg" style={{ background: 'var(--bg-surface)' }}>
                لوحة الملاك
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <div className="section">
          <div className="container">
            <h2 className="text-center" style={{ marginBottom: 48 }}>كل ما تحتاجه لإدارة عقارك</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[
                { icon:<i className="fa-regular fa-calendar-days"></i>, title:'إدارة الحجوزات', desc:'قبول أو رفض الحجوزات بسهولة. حجز فوري أو بطلب — أنت من يقرر.' },
                { icon:<i className="fa-solid fa-chart-pie"></i>, title:'تحليلات تفصيلية', desc:'تقارير الإيرادات، نسبة الإشغال، ومصادر الضيوف — كل شيء في متناول يدك.' },
                { icon:<i className="fa-regular fa-calendar-check"></i>, title:'تقويم ذكي', desc:'تحكم كامل في توفر التواريخ مع التحديث الفوري عند كل حجز.' },
                { icon:<i className="fa-solid fa-link"></i>, title:'رابط الحجز الخاص', desc:'شارك رابطاً خاصاً بعقارك عبر واتساب وانستغرام بدون عمولة.' },
                { icon:<i className="fa-solid fa-users"></i>, title:'إدارة الموظفين', desc:'أضف موظفين بصلاحيات محددة لكل عقار أو مجموعة من العقارات.' },
                { icon:<i className="fa-solid fa-money-bill-wave"></i>, title:'إيرادات متعددة', desc:'تتبع الحجوزات من المنصة والحجوزات الخارجية في تقرير واحد.' },
              ].map(f => (
                <div className="card" key={f.title} style={{ padding: 28 }}>
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>{f.icon}</div>
                  <h4 style={{ marginBottom: 8 }}>{f.title}</h4>
                  <p style={{ fontSize: '0.85rem' }}>{f.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Link href="/host/property/add" className="btn btn-primary btn-lg" id="cta-add-property">ابدأ الآن — مجاناً</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
