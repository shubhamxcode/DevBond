import Introvideo from '../videos/Devbond intro.mp4';
import { useRef } from 'react';

function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 4;
    }
  };

  return (
    <div className="bg-black">
      <div className="flex flex-col md:flex-row bg-gradient-to-b from-black via-gray-900 to-black p-4 sm:p-6 md:p-8 gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10">
        {/* Text Content */}
        <div className="flex flex-col justify-center items-center text-center text-white font-bold md:w-1/2 xl:w-3/5">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-4xl xl:text-6xl 2xl:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-3 sm:mb-4 md:mb-6 font-sans px-2 whitespace-nowrap overflow-hidden">
            BOND Connect and Grow
          </h1>

          <p className="px-2 sm:px-4 md:px-6 lg:px-8 text-sm xs:text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-gray-200 font-medium mb-4 sm:mb-6 md:mb-8 leading-normal sm:leading-relaxed font-roboto max-w-xl lg:max-w-2xl xl:max-w-3xl">
            At <span className="font-bold text-blue-400">BOND</span>, developers unite to collaborate, solve challenges, and enhance their skills. Earn points by tackling questions, boost your profile, and connect with peers in your field. With our helpful chatbot by your side, you're never alone on your journey to success. Join us and take your development career to new heights!
          </p>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl sm:rounded-2xl md:rounded-3xl text-lg sm:text-xl md:text-2xl font-semibold text-white cursor-pointer hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-sans w-full max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md">
            <button className="w-full">Learn More</button>
          </div>
        </div>

        {/* Video Section */}
        <div className="flex justify-center items-center w-full md:w-1/2 xl:w-2/5 mt-2 sm:mt-4 md:mt-0 px-2 sm:px-4">
          <video
            ref={videoRef}
            src={Introvideo}
            autoPlay
            muted
            loop
            className="rounded-lg sm:rounded-xl md:rounded-3xl w-full max-w-[95%] sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl border-2 border-gray-800 shadow-xl"
            onLoadedMetadata={handleLoadedMetadata}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

export default Page;