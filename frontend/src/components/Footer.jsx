import { Link } from 'react-router-dom';
import { useLanguage } from '../services/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl text-white mb-3">
            <img src="/logo.PNG" alt="Billboard Technology logo" className="w-11 h-11 object-cover rounded-lg shadow-sm ring-1 ring-white/10" />
            onBillBoard<span className="text-gradient">.com</span>
          </div>
          <p className="text-sm text-gray-400">{t('footer.aboutText')}</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">{t('footer.quickLinks')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-accent-400">{t('nav.products')}</Link></li>
            <li><Link to="/internship" className="hover:text-accent-400">{t('nav.internship')}</Link></li>
            <li><Link to="/courses" className="hover:text-accent-400">{t('nav.courses')}</Link></li>
            <li><Link to="/blog" className="hover:text-accent-400">{t('nav.blog')}</Link></li>
            <li><Link to="/about" className="hover:text-accent-400">{t('nav.about')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">{t('footer.services')}</h4>
          <ul className="space-y-2 text-sm">
            <li>Device Repair</li>
            <li>Software Installation</li>
            <li>Network Installation</li>
            <li>CCTV Installation</li>
            <li>Website Development</li>
            <li>Technical Support</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">{t('footer.contact')}</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📍 Chic Building, 1st Floor, Nyarugenge, Kigali</li>
            <li>📞 0787 724 701 / 0727 367 824</li>
            <li>✉️ reponseimanirabizi@gmail.com</li>
            <li className="flex gap-3 pt-1">
              <a href="#" className="hover:text-accent-400">Facebook</a>
              <a href="#" className="hover:text-accent-400">Instagram</a>
              <a href="#" className="hover:text-accent-400">LinkedIn</a>
              <a href="#" className="hover:text-accent-400">WhatsApp</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 text-center text-xs text-gray-500 py-4">
        &copy; {new Date().getFullYear()} Billboard Technology (onBillBoard.com). {t('footer.copyright')}
      </div>
    </footer>
  );
}
