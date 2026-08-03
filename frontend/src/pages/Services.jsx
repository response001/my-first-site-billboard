import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Computer Repair',
    desc: 'Hardware and software repair for all brands of computers and laptops.',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'Phone Repair',
    desc: 'Screen replacement, battery, charging port and software fixes for phones.',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'Network Installation',
    desc: 'Home and office network setup, Wi-Fi coverage and troubleshooting.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'CCTV Installation',
    desc: 'Security camera systems with remote viewing and 24/7 recording.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'Website Development',
    desc: 'Professional business websites built with modern technology.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'Software Installation',
    desc: 'Operating systems, office tools and design software installed for you.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'Graphic Design',
    desc: 'Logos, branding, posters and social media design for your business.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'Technical Support',
    desc: 'Fast, friendly help for all your technology problems, on-site or remote.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=60',
  },
];

export default function Services() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="rounded-3xl overflow-hidden relative mb-8 h-52">
        <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=60" alt="Services" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-brand-700/70 to-accent-500/60 flex items-center px-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Our Services</h1>
            <p className="text-gray-200 mt-1">Professional technology services for individuals and businesses.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((s) => (
          <div key={s.title} className="bg-white rounded-2xl shadow card-hover overflow-hidden flex flex-col">
            <div className="h-40 overflow-hidden">
              <img src={s.image} alt={s.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm flex-1">{s.desc}</p>
              <Link to="/contact" className="mt-4 inline-flex items-center gap-1 text-brand-600 font-semibold text-sm hover:gap-2 transition-all">
                Request Service →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl btn-gradient text-white p-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Need help with your device or business?</h2>
        <p className="text-gray-100 mb-6">Our team is ready to assist you with any technology challenge.</p>
        <Link to="/contact" className="inline-block bg-white text-brand-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
