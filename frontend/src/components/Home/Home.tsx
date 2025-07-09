import Intro from '../intro/intro'
import Feature from '../Features/fea'
import Work from '../worksection/work'
import { Particles } from '../magicui/particles'

function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Particles background with transparent black overlay */}
      <div className="absolute inset-0 z-0">
        <Particles quantity={1400} className="w-full h-full" />
      </div>
      {/* Main content */}
      <div className="relative z-10 flex flex-col">
        <section className="min-h-screen">
          <Intro />
        </section>
        <section className="">
          <Work />
        </section>
        <section className="">
          <Feature />
        </section>
      </div>
    </div>
  )
}

export default Home