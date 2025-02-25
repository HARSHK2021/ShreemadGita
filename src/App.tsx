import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import ParallaxHero from './components/ParallaxHero';
import Navigation from './components/Navigation';
import GitaReader from './components/GitaReader';

function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audio] = useState(new Audio('https://files.catbox.moe/vowb8o.mp3'));

  useEffect(() => {
    audio.loop = true;
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-amber-950">
      <Navigation />
      
      <button
        onClick={toggleMusic}
        className="fixed bottom-4 right-4 z-50 p-3 bg-amber-900/80 rounded-full text-amber-100 hover:bg-amber-800/80 transition-colors"
      >
        {isMusicPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      <ParallaxHero />
      
      <section id="gita">
        <GitaReader />
      </section>
    </div>
  );
}

export default App;