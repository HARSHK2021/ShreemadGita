import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ParallaxHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div 
      ref={ref}
      className="h-screen w-full relative overflow-hidden"
    >
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-black/40 z-10"
          style={{ backgroundImage: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))" }}
        />
        <img
          src="https://images.unsplash.com/photo-1585504198199-20277593b94f?q=80&w=2574"
          alt="Ancient Indian Temple"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        style={{ y: textY }}
        className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4"
      >
        <div className="bg-amber-900/30 p-8 rounded-lg backdrop-blur-sm">
          <h1 className="text-5xl md:text-7xl font-bold text-amber-100 mb-6">
            श्रीमद्भगवद्गीता
          </h1>
          <p className="text-xl md:text-2xl text-amber-50 max-w-2xl">
            The divine song of eternal wisdom and spiritual enlightenment
          </p>
        </div>
      </motion.div>
    </div>
  );
}