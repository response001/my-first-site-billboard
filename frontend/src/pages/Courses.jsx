import { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import { api } from '../services/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.courses().then((d) => setCourses(d.courses)).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Short Courses</h1>
        <p className="text-gray-500">Three-month professional training programs to build your career in tech.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((c) => <CourseCard key={c.id} course={c} />)}
        {courses.length === 0 && <p className="text-gray-500">Loading courses...</p>}
      </div>
    </div>
  );
}
