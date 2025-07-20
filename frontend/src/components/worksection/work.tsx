import { AnimatePresence, motion } from "framer-motion";
import Timeline from '../ui/timeline';
import { useState } from "react";

interface Card {
  id: number;
  image: JSX.Element;
  step: string;
  description: string;
}

const cards: Card[] = [
  {
    id: 1,
    image: (
      <div className="w-full h-auto flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          1
        </div>
      </div>
    ),
    step: "Create Account",
    description:
      "Sign up to DevBond and create your developer profile. Connect your GitHub and showcase your coding journey.",
  },
  {
    id: 2,
    image: (
      <div className="w-full h-auto flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          2
        </div>
      </div>
    ),
    step: "Connect & Authenticate",
    description:
      "Link your GitHub and LeetCode accounts to earn points, track your progress, and validate your skills automatically.",
  },
  {
    id: 3,
    image: (
      <div className="w-full h-auto flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          3
        </div>
      </div>
    ),
    step: "Choose Your Field",
    description:
      "Select your development specialization - frontend, backend, full-stack, mobile, or DevOps to connect with like-minded developers.",
  },
  {
    id: 4,
    image: (
      <div className="w-full h-auto flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          4
        </div>
      </div>
    ),
    step: "Start Collaborating",
    description:
      "Find developers in your field, join projects, share knowledge, and grow together in the DevBond community.",
  },
];

function Work() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectcard = cards.find((card) => selectedId === card.id);

  return (
    <section className="bg-black min-h-screen relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black to-gray-900/20"></div>
      <div className="container mx-auto px-2 sm:px-4 py-8 md:py-16 lg:py-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
            HOW IT WORKS
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Join DevBond in four simple steps and start building connections with developers worldwide
          </p>
        </div>
        {/* Timeline Component */}
        <div className="mt-4 md:mt-8">
          <Timeline data={cards.map(card => ({
            id: card.id,
            title: card.step,
            description: card.description,
            icon: card.image
          }))} />
        </div>
        {/* Modal */}
        <AnimatePresence>
          {selectcard && (
            <motion.div
              key={selectcard.id}
              className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-2 sm:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedId(null)}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-2xl p-4 sm:p-8 max-w-md w-full mx-2 sm:mx-4 shadow-2xl"
                initial={{ scale: 0.8, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: -50 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="mb-6">
                    {selectcard.image}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    {selectcard.step}
                  </h2>
                  <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                    {selectcard.description}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 font-medium"
                      onClick={() => setSelectedId(null)}
                    >
                      Got it!
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Work;