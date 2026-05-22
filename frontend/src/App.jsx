import { useState } from "react";
import Hero from "./components/Hero";
import DownloadPage from "./components/DownloadPage";

export default function App() {
  const [currentView, setCurrentView] = useState('hero');

  const showDownloadPage = () => setCurrentView('download');
  const showHero = () => setCurrentView('hero');

  return (
    <>
      {currentView === 'hero' && <Hero onDownloadClick={showDownloadPage} />}
      {currentView === 'download' && <DownloadPage onBack={showHero} />}
    </>
  );
}