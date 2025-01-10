import { useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';

interface Card {
  id: number;
  num: number;
  image: JSX.Element;
  step: string;
  description: string;
}
const cards: Card[] = [
  { id: 1, num: 1, image: <IoCreateOutline />, step: 'Step 1: Signup', description: "Create Accounts using GitHub and LeetCode to Earn Points and Enhance Website Development Skills" },
  { id: 2, num: 2, image: <IoCreateOutline />, step: 'Step 2: Login with GitHub/LeetCode', description: "Create Accounts on GitHub and LeetCode to Earn Points and Enhance Website Development Skills" },
  { id: 3, num: 3, image: <IoCreateOutline />, step: 'Step 3: Select Your Field', description: "Create Accounts on GitHub and LeetCode to Earn Points and Enhance your profile and unlock developer sticker" },
];

function Work() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectcard = cards.find((card) => selectedId === card.id);

  return (
    <div className='bg-black min-h-screen text-white p-5'>
      <div id='content'>
        <h1 className='hover:underline text-center text-5xl font-bold'>HOW IT WORKS?</h1>
      </div>
      <div className='flex flex-wrap justify-around mt-10' id='cards'>
        {cards.map((card) => (
          <motion.div
            key={card.id}
            layoutId={String(card.id)}
            className='hover:cursor-pointer'
            onClick={() => setSelectedId(selectedId === card.id ? null : card.id)}
          >
            <div className='m-5 h-72 flex flex-col border border-gray-600 text-center items-center justify-center shadow-2xl shadow-gray-700 transition-all duration-300 hover:scale-110 hover:bg-gray-800'>
              <h1 className='text-2xl w-12 h-12 flex items-center justify-center rounded-full bg-gray-600 text-white'>{card.num}</h1>
              <h2 className='text-4xl text-white mt-4'>{card.image}</h2>
              <h2 className='text-xl text-green-400 mt-2'>{card.step}</h2>
              <p className='text-sm text-gray-300 mt-2 px-4'>{card.description}</p>
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {selectcard && (
            <motion.div
              key={selectcard.id}
              layoutId={String(selectcard.id)}
              className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-90 z-50'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className='bg-gray-800 p-6 rounded-lg shadow-lg text-center text-white'>
                <motion.div>
                  <motion.h5 className='m-auto text-2xl w-12 h-12 flex items-center justify-center rounded-full bg-gray-600 text-white'>{selectcard.num}</motion.h5>
                  <motion.h2 className='text-xl text-green-400 mt-4'>{selectcard.step}</motion.h2>
                  <motion.p className='text-gray-300 mt-2'>{selectcard.description}</motion.p>
                </motion.div>
                <motion.button
                  className='bg-green-600 text-white px-6 py-2 mt-6 rounded-lg hover:bg-green-500 transition-all'
                  onClick={() => setSelectedId(null)}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Work;
