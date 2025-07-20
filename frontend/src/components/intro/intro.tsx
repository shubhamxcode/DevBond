import { Globe } from '../magicui/globe';
import { BackgroundBeamsWithCollision } from '../ui/background-beams-with-collision';
import { Particles } from '../magicui/particles';

function IntroSection() {
  return (
    <section className="min-h-screen w-full min-w-0 flex-1 flex items-center bg-black/80 relative overflow-hidden lg:max-w-[1536px] lg:mx-auto px-2 sm:px-4 md:px-8">
      {/* Beams background with particles */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full min-w-0">
        <BackgroundBeamsWithCollision className="h-full w-full absolute inset-0 bg-black/60" >
          <Particles quantity={160} className="absolute inset-0 w-full h-full" color="#a5b4fc" />
        </BackgroundBeamsWithCollision>
      </div>
      {/* Main Content: Centered heading */}
      <div className="relative z-10 w-full min-w-0 flex flex-col items-center justify-center min-h-screen px-2 sm:px-4 flex-1">
        {/* Platform Name */}
        <div className="mb-8 text-center w-full">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-gradient-to-b from-white via-gray-300 to-gray-600 bg-clip-text drop-shadow-2xl tracking-tight">
            DevBond
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>
        {/* Tagline */}
        <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-300 text-center mb-8 sm:mb-12 max-w-4xl leading-relaxed">
          Where developers in similar fields <span className="text-blue-400 font-semibold">connect</span>, 
          <span className="text-purple-400 font-semibold"> collaborate</span>, and 
          <span className="text-green-400 font-semibold"> grow</span> together
        </p>
        {/* Globe Component */}
        <div className="flex items-center justify-center w-full mb-8 sm:mb-12">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
            <Globe />
          </div>
        </div>
        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 lg:mt-16 max-w-xs sm:max-w-2xl lg:max-w-4xl w-full">
          <div className="text-center group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-sm sm:text-base">Connect</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Find developers in your field</p>
          </div>
          
          <div className="text-center group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-sm sm:text-base">Collaborate</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Work on projects together</p>
          </div>
          
          <div className="text-center group sm:col-span-1 col-span-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-green-500/30 transition-colors">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-sm sm:text-base">Grow</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Level up your skills</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntroSection;