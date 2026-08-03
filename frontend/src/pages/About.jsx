import { Link } from 'react-router-dom';

const objectives = [
  'Provide quality technology devices at affordable prices',
  'Train the next generation of software developers, networkers and designers',
  'Give real work experience through internships',
  'Support businesses with IT services and maintenance',
];

const team = [
  { name: 'Billboard Founder', role: 'Founder & CEO', emoji: '👨‍💼' },
  { name: 'Software Lead', role: 'Head of Training', emoji: '👩‍💻' },
  { name: 'Network Engineer', role: 'Networking Instructor', emoji: '🧑‍🔧' },
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About Us</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-brand-700 mb-3">Company History</h2>
        <p className="text-gray-600 leading-relaxed">
          Billboard Technology was founded to solve two problems at once: getting reliable, affordable technology
          devices into people's hands, and preparing students for real careers in technology. Today we sell a wide
          range of devices and train software development, networking and graphic design students through short
          courses and internships.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold text-brand-700 mb-2">Our Mission</h2>
          <p className="text-gray-600">To make technology accessible, affordable and educational for everyone in our community.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold text-brand-700 mb-2">Our Vision</h2>
          <p className="text-gray-600">To become the leading technology hub in the region — known for both quality products and quality training.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-brand-700 mb-3">Our Objectives</h2>
        <ul className="space-y-2">
          {objectives.map((o) => (
            <li key={o} className="flex gap-2 text-gray-600">
              <span className="text-green-600">✔</span> {o}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-brand-700 mb-4">Our Team</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {team.map((m) => (
            <div key={m.name} className="bg-white rounded-xl p-6 text-center shadow">
              <div className="text-4xl mb-2">{m.emoji}</div>
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm text-gray-500">{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-700 mb-3">Our Partners</h2>
        <p className="text-gray-600 mb-4">We work with schools, suppliers and technology brands to bring you the best.</p>
        <Link to="/contact" className="bg-brand-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-brand-700">
          Partner With Us
        </Link>
      </section>
    </div>
  );
}
