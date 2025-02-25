import { useState } from 'react';
import { Menu, X, Scroll, BookOpen, Users, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', href: '#' },
    { icon: BookOpen, label: 'Bhagavad Gita', href: '#gita' },
    { icon: Users, label: 'Characters', href: '#characters' },
    { icon: Scroll, label: 'Chapters', href: '#chapters' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-2 bg-amber-900/80 rounded-full text-amber-100"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-y-0 right-0 w-full sm:w-80 bg-gradient-to-b from-amber-900 to-amber-950 text-amber-100 p-8 shadow-xl z-40"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2"
            >
              <X size={24} />
            </button>

            <div className="mt-12">
              <nav className="space-y-4">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center space-x-4 p-4 hover:bg-amber-800/30 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={20} />
                    <span className="text-lg">{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}