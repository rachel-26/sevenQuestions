
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { NavSidebar } from './components/NavSidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { AnalysisStudio } from './views/AnalysisStudio';
import { ReportsExport } from './views/ReportsExport';

const MainLayout = () => (
  <div className="flex min-h-screen bg-background-light font-body-base text-slate-900 antialiased">
    <NavSidebar />
    <main className="ml-[256px] flex-1 min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </main>
  </div>
);

const StudioLayout = () => (
  <div className="flex flex-col min-h-screen bg-background-light font-body-base text-slate-900 antialiased">
    <Header />
    <Outlet />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/reports" element={<ReportsExport />} />
        </Route>
        <Route element={<StudioLayout />}>
          <Route path="/studio" element={<AnalysisStudio />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
