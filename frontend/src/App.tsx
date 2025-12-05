import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PapersPage from './pages/PapersPage';
import DetailPage from './pages/DetailPage';
import UploadPage from './pages/UploadPage';
import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/papers" element={<PapersPage />} />
            <Route path="/papers/:id" element={<DetailPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

