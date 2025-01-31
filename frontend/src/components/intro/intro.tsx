import { motion } from "framer-motion";

import Introvideo from '../videos/Devbond intro.mp4'
import { useRef } from 'react';

function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 4; // Start video at 3 seconds
    }
  };

  return (
    <>
      <motion.div
        className="bg-black min-h-screen"
        initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 4.5,
          delay: 1,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-8 gap-8 md:gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex flex-col justify-center items-center text-center text-white font-bold md:w-3/5">
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-6 font-sans"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              BOND Connect and Grow
            </motion.h1>
            <motion.p
              className="px-4 md:px-10 text-lg md:text-xl lg:text-2xl text-gray-200 font-medium mb-8 leading-relaxed font-roboto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              At <span className="font-bold text-blue-400">BOND</span>, developers unite to collaborate, solve challenges, and enhance their skills. Earn points by tackling questions, boost your profile, and connect with peers in your field. With our helpful chatbot by your side, you're never alone on your journey to success. Join us and take your development career to new heights!
            </motion.p>

            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-3xl text-2xl font-semibold text-white cursor-pointer hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-sans"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              
            >
              <button className="w-full">Learn More</button>
            </motion.div>
          </div>

          {/* Lottie Animation Section */}
          <motion.div
            className="flex justify-center items-center md:w-2/5 mt-8 md:mt-0"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
           
          </motion.div>
        </div>
      </motion.div>
      <video
              ref={videoRef}
              src={Introvideo}
              autoPlay
              muted
              loop
              className=" rounded-3xl flex m-auto w-[100%] border-2 border-gray-800"
              onLoadedMetadata={handleLoadedMetadata}
            >
              Your browser does not support the video tag.
            </video>
    </>
  );
}

export default Page;