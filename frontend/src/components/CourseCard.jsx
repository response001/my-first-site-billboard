import { Link } from 'react-router-dom';
import { useLanguage } from '../services/LanguageContext';

const courseImages = {
  'Software Development': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=60',
  'Networking': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60',
  'Graphic Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=60',
};

export default function CourseCard({ course }) {
  const { t } = useLanguage();
  const topics = (course.topics || '').split(',').map((x) => x.trim()).filter(Boolean);
  const image = course.image || courseImages[course.name] || courseImages['Software Development'];

  return (
    <div className="bg-white rounded-2xl shadow card-hover overflow-hidden flex flex-col">
      <div className="h-44 overflow-hidden relative">
        <img src={image} alt={course.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <span className="absolute bottom-3 left-4 text-white font-extrabold text-2xl drop-shadow">{course.name}</span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <p className="text-sm text-gray-500 flex-1">{course.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {topics.slice(0, 5).map((x) => (
            <span key={x} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{x}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-gray-500">{t('common.duration')}: <strong className="text-gray-800">{course.duration}</strong></span>
          <Link to={`/courses/${course.slug}`} className="btn-vivid text-white text-sm px-4 py-1.5 rounded-lg font-semibold">
            {t('common.apply')}
          </Link>
        </div>
      </div>
    </div>
  );
}
