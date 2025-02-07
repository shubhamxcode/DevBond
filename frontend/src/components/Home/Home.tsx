import Intro from '../intro/intro'
import Feature from '../Features/fea'
import Work from '../worksection/work'

// import Signin from '../signin/signin'
function Home() {
  return (
    <div className="flex flex-col">
      <section className="min-h-screen">
        <Intro />
      </section>
      
      <section className="py-20">
        <Work />
      </section>
      
      <section className="py-20">
        <Feature />
      </section>
    </div>
  )
}

export default Home