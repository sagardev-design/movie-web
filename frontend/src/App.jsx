import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-[#101214] text-stone-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
