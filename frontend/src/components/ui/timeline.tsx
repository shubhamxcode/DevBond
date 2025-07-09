import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimelineItem {
  id: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
  bgGradient?: string;
}

interface TimelineProps {
  data: TimelineItem[];
  onItemClick?: (item: TimelineItem) => void;
}

const Timeline = ({ data, onItemClick }: TimelineProps) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      const visibleCount = Math.floor(scrollPercent * data.length * 1.5) + 1;
      const newVisibleItems = data.slice(0, Math.min(visibleCount, data.length)).map(item => item.id);
      setVisibleItems(newVisibleItems);
      const newActiveStep = Math.min(Math.floor(scrollPercent * data.length), data.length - 1);
      setActiveStep(newActiveStep);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data]);

  return (
    <div className="relative max-w-4xl mx-auto mt-16 px-2 md:px-4">
      {/* Timeline Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-gray-700 to-transparent z-0"></div>

      {/* Progress Line */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full z-10"
        initial={{ height: 0 }}
        animate={{ height: `${((activeStep + 1) / data.length) * 100}%` }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* Timeline Items (Desktop + Mobile Combined) */}
      {data.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, y: 50 }}
          animate={{
            opacity: visibleItems.includes(item.id) ? 1 : 0,
            x: visibleItems.includes(item.id) ? 0 : (index % 2 === 0 ? -100 : 100),
            y: visibleItems.includes(item.id) ? 0 : 50
          }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
          className={`relative mb-12 md:mb-16 flex flex-col md:flex-row items-center ${
            index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
          }`}
          style={{ zIndex: 20 }}
          onClick={() => onItemClick?.(item)}
          onMouseEnter={() => setActiveStep(index)}
          onTouchStart={() => setActiveStep(index)}
        >
          {/* Left Side (for even index) or Spacer (for odd index) */}
          {index % 2 === 0 ? (
            <div className="hidden md:block md:w-1/2 pr-8 text-right">
              <div className="inline-block max-w-md">
                {item.icon && (
                  <div className="text-xl md:text-2xl mb-2 flex justify-end">{item.icon}</div>
                )}
                <h3 className="text-lg md:text-xl font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-xs md:text-sm text-gray-400">{item.description}</p>
              </div>
            </div>
          ) : (
            <div className="hidden md:block md:w-1/2"></div>
          )}

          {/* Central Node */}
          <div className="absolute md:static left-1/2 md:left-auto transform md:translate-x-0 -translate-x-1/2 top-2 md:top-auto z-20">
            <div className={`w-4 h-4 rounded-full border-4 ${
              activeStep >= index
                ? "bg-gradient-to-br from-blue-500 to-purple-600 border-white shadow-lg"
                : "bg-black border-gray-600"
            }`}>
              <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
            </div>
          </div>

          {/* Right Side (for odd index) or Spacer (for even index) */}
          {index % 2 !== 0 ? (
            <div className="hidden md:block md:w-1/2 pl-8 text-left">
              <div className="inline-block max-w-md">
                {item.icon && (
                  <div className="text-xl md:text-2xl mb-2 flex justify-start">{item.icon}</div>
                )}
                <h3 className="text-lg md:text-xl font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-xs md:text-sm text-gray-400">{item.description}</p>
              </div>
            </div>
          ) : (
            <div className="hidden md:block md:w-1/2"></div>
          )}

          {/* Mobile layout: always show below the node */}
          <div className="block md:hidden w-full mt-8">
            <div className="max-w-xs mx-auto text-center">
              {item.icon && (
                <div className="text-xl mb-2 flex justify-center">{item.icon}</div>
              )}
              <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-gray-400">{item.description}</p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Dots */}
      <div className="flex justify-center mt-12 space-x-2">
        {data.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setActiveStep(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeStep === index
                ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
