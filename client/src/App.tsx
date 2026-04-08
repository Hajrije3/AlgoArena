import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage        from '@/pages/HomePage';
import VisualizerPage  from '@/pages/VisualizerPage';
import SortingPage     from '@/pages/SortingPage';
import NotFoundPage    from '@/pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<HomePage />}        />
        <Route path="/visualizer"  element={<VisualizerPage />}  />
        <Route path="/sorting"     element={<SortingPage />}     />
        <Route path="*"            element={<NotFoundPage />}    />
      </Routes>
    </BrowserRouter>
  );
}
