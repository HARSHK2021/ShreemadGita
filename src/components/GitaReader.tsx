import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, BookOpen } from 'lucide-react';

interface Chapter {
  id: number;
  name: string;
  name_translated: string;
  verses_count: number;
  chapter_number: number;
  name_meaning: string;
  chapter_summary: string;
}

interface Verse {
  id: number;
  verse_number: number;
  text: string;
  transliteration: string;
  word_meanings: string;
  translations: {
    id: number;
    description: string;
    author_name: string;
    language: string;
  }[];
}

const RAPID_API_KEY = 'ca86e3ac8emsh6f0955a0d6f5cf1p1d88e1jsn7e869f180c7a';
const RAPID_API_HOST = 'bhagavad-gita3.p.rapidapi.com';

export default function GitaReader() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [verseNumber, setVerseNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChapterList, setShowChapterList] = useState(false);

  useEffect(() => {
    fetchChapters();
  }, []);

  useEffect(() => {
    if (currentChapter) {
      fetchVerse();
    }
  }, [currentChapter, verseNumber]);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'https://bhagavad-gita3.p.rapidapi.com/v2/chapters/?skip=0&limit=18',
        {
          headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': RAPID_API_HOST
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch chapters');

      const data = await response.json();
      setChapters(data);
      setCurrentChapter(data[0]);
    } catch (err) {
      setError('Failed to fetch chapters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVerse = async () => {
    if (!currentChapter) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${currentChapter.chapter_number}/verses/${verseNumber}/`,
        {
          headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': RAPID_API_HOST
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch verse');

      const data = await response.json();
      setCurrentVerse(data);
    } catch (err) {
      setError('Failed to fetch verse. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateVerse = (direction: 'prev' | 'next') => {
    if (!currentChapter) return;

    if (direction === 'prev' && verseNumber > 1) {
      setVerseNumber(prev => prev - 1);
    } else if (direction === 'next' && verseNumber < currentChapter.verses_count) {
      setVerseNumber(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-amber-950 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl text-amber-100 text-center font-sanskrit">
            श्रीमद्भगवद्गीता
          </h2>
          <button
            onClick={() => setShowChapterList(!showChapterList)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100/10 hover:bg-amber-100/20 rounded-lg text-amber-100 transition-colors"
          >
            <BookOpen size={20} />
            <span>Chapters</span>
          </button>
        </div>

        <AnimatePresence>
          {showChapterList && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {chapters.map(chapter => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setCurrentChapter(chapter);
                    setVerseNumber(1);
                    setShowChapterList(false);
                  }}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    currentChapter?.id === chapter.id
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-amber-100/10 text-amber-100 hover:bg-amber-100/20'
                  }`}
                >
                  <h3 className="font-semibold">
                    Chapter {chapter.chapter_number}: {chapter.name_translated}
                  </h3>
                  <p className="text-sm opacity-80">{chapter.verses_count} verses</p>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-2xl p-8 border-2 border-amber-300">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-96"
              >
                <Loader2 className="w-8 h-8 animate-spin text-amber-900" />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-red-600 text-center h-96 flex items-center justify-center"
              >
                {error}
              </motion.div>
            ) : currentVerse && currentChapter ? (
              <motion.div
                key={`${currentChapter.chapter_number}-${verseNumber}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="bg-amber-50/50 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl text-amber-900 mb-4 font-semibold">
                    {currentChapter.name_translated}
                  </h3>
                  <p className="text-2xl text-amber-950 mb-6 text-center font-sanskrit leading-relaxed">
                    {currentVerse.text}
                  </p>
                  <p className="text-lg text-amber-800 italic text-center">
                    {currentVerse.transliteration}
                  </p>
                </div>

                <div className="bg-amber-50/50 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl text-amber-900 mb-4 font-semibold">
                    Translation & Meaning
                  </h3>
                  {currentVerse.translations.map(translation => (
                    <div key={translation.id} className="mb-4 last:mb-0">
                      <p className="text-lg text-amber-800">
                        {translation.description}
                      </p>
                      <p className="text-sm text-amber-700 mt-2">
                        - {translation.author_name}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50/50 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl text-amber-900 mb-4 font-semibold">
                    Word Meanings
                  </h3>
                  <p className="text-lg text-amber-800">
                    {currentVerse.word_meanings}
                  </p>
                </div>
                
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={() => navigateVerse('prev')}
                    disabled={verseNumber === 1}
                    className="p-4 text-amber-900 disabled:opacity-50 hover:bg-amber-300/50 rounded-full transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  
                  <span className="text-amber-900 font-semibold">
                    Chapter {currentChapter.chapter_number}, Verse {verseNumber}
                  </span>
                  
                  <button
                    onClick={() => navigateVerse('next')}
                    disabled={verseNumber === currentChapter.verses_count}
                    className="p-4 text-amber-900 disabled:opacity-50 hover:bg-amber-300/50 rounded-full transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}