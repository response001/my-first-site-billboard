import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../services/LanguageContext';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1920&q=70',
    icon: '🖥️',
    titleKey: 'hero.slide1Title',
    textKey: 'hero.slide1Text',
  },
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=70',
    icon: '🎓',
    titleKey: 'hero.slide2Title',
    textKey: 'hero.slide2Text',
  },
  {
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=70',
    icon: '💼',
    titleKey: 'hero.slide3Title',
    textKey: 'hero.slide3Text',
  },
];

export default function Hero() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const go = (i) => setActive((i + slides.length) % slides.length);

  return (
    <section className="relative h-[560px] overflow-hidden text-white">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === active ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={s.image}
            alt={t(s.titleKey)}
            className={`absolute inset-0 w-full h-full object-cover ${i === active ? 'animate-hero-zoom' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
            <div key={`${i}-${active}`} className={`max-w-xl ${active === i ? 'animate-fade-slide' : ''}`}>
              <p className="text-sun-400 font-semibold uppercase tracking-widest text-sm mb-3">
                {t('hero.tagline')}
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-3">{t(s.titleKey)}</h1>
              <p className="text-xl text-gray-100 mb-8">{t(s.textKey)}</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="btn-gradient text-white font-semibold px-6 py-3 rounded-xl">
                  {t('hero.shop')}
                </Link>
                <Link to="/internship" className="btn-vivid text-white font-semibold px-6 py-3 rounded-xl">
                  {t('hero.applyInternship')}
                </Link>
                <Link to="/courses" className="bg-white/10 border border-white/50 backdrop-blur px-6 py-3 rounded-xl font-semibold hover:bg-white/20">
                  {t('hero.registerCourse')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => go(active - 1)}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur hover:bg-white/30 flex items-center justify-center text-xl"
      >
        ‹
      </button>
      <button
        onClick={() => go(active + 1)}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur hover:bg-white/30 flex items-center justify-center text-xl"
      >
        ›
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${i === active ? 'w-8 bg-sun-400' : 'w-2.5 bg-white/50 hover:bg-white'}`}
          />
        ))}
      </div>
    </section>
  );
}
