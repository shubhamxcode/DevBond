import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="w-full h-auto">
        {/* <Sinupimg /> */}
      </div>
    ),
    step: "Step 1: Signup",
    description:
      "Create Accounts using GitHub and LeetCode to Earn Points and Enhance Website Development Skills",
  },
  {
    id: 2,
    image: (
      <div className="w-full h-auto">
        {/* <LoginBackground /> */}
      </div>
    ),
    step: "Step 2: Login with GitHub/LeetCode",
    description:
      "Create Accounts on GitHub and LeetCode to Earn Points and Enhance Website Development Skills",
  },
  {
    id: 3,
    image: (
      <div className="min-w-full m-auto mt-[-40px]">
        {/* <FieldBackground /> */}
      </div>
    ),
    step: "Step 3: Select Your Field",
    description:
      "Create Accounts on GitHub and LeetCode to Earn Points and Enhance your profile and unlock developer sticker",
  },
];

function Work() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectcard = cards.find((card) => selectedId === card.id);

  return (
    <div className="mt-24 bg-gradient-to-b from-black via-gray-900 to-black p-5">
      <div id="content" className="max-w-7xl mx-auto">
        <h1 className="text-center text-5xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">
          HOW IT WORKS?
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              layoutId={String(card.id)}
              className="cursor-pointer"
              onClick={() => setSelectedId(selectedId === card.id ? null : card.id)}
            >
              <motion.div
                className="h-96 flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 shadow-2xl hover:shadow-gray-500/50 transition-all duration-300 hover:scale-105"
                whileHover={{ y: -10 }}
              >
                <div className="text-4xl text-gray-300 mb-4 w-full">
                  {card.image}
                </div>
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  {card.step}
                </h2>
                <p className="text-sm text-gray-400 text-center">
                  {card.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectcard && (
            <motion.div
              key={selectcard.id}
              layoutId={String(selectcard.id)}
              className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-95 z-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-xl shadow-2xl border border-gray-600 max-w-md w-full mx-4"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
              >
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-300 mb-4">
                    {selectcard.step}
                  </h2>
                  <p className="text-gray-400 mb-6">{selectcard.description}</p>
                  <button
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all"
                    onClick={() => setSelectedId(null)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Work;