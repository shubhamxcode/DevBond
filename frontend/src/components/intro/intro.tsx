import Introvideo from '../videos/Devbond intro.mp4';
import { useRef } from 'react';

function IntroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 4;
    }
  };

  return (
    <section className="min-h-screen flex items-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Content Section */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                BOND
              </span>
              <span className="text-white"> Connect and Grow</span>
            </h1>

            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8">
              At <span className="text-blue-400 font-semibold">BOND</span>, developers unite to 
              collaborate, solve challenges, and enhance their skills. Earn points by tackling 
              questions, boost your profile, and connect with peers in your field. With our 
              helpful chatbot by your side, you're never alone on your journey to success.
            </p>

            <div className="flex gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 
                               hover:from-blue-700 hover:to-purple-700 text-white font-semibold 
                               rounded-lg transform transition-all duration-300 hover:scale-105 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                               focus:ring-offset-gray-900">
                Get Started
              </button>
              <button className="px-8 py-4 border-2 border-gray-700 text-gray-300 
                               hover:border-gray-500 hover:text-white font-semibold rounded-lg 
                               transform transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </div>

          {/* Video Section */}
          <div className="flex-1 w-full max-w-2xl">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl 
                          border border-gray-800/50 backdrop-blur-sm">
              <video
                ref={videoRef}
                src={Introvideo}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
                onLoadedMetadata={handleLoadedMetadata}
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntroSection;