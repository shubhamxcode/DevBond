import Intro from '../intro/intro'
import Feature from '../Features/fea'
import Work from '../worksection/work'
import { Particles } from '../magicui/particles'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Home() {
  const accessToken = useSelector((state: any) => state.userProfile.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSetup = async () => {
      if (accessToken) {
        // Check setup status from backend
        const apiUrl = import.meta.env.DEV ? "http://localhost:4001" : import.meta.env.VITE_RENDER_URL_;
        try {
          const response = await axios.get(`${apiUrl}/api/users/check-setup`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            withCredentials: true,
          });
          const { isSetupComplete } = response.data.data;
          if (!isSetupComplete) {
            navigate('/setup-check');
          }
          // If setup is complete, stay on Home!
        } catch {
          // fallback: maybe navigate('/login') or show error
        }
      }
    };
    checkSetup();
  }, [accessToken, navigate]);

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Particles background with transparent black overlay */}
      <div className="absolute inset-0 z-0">
        <Particles quantity={1400} className="w-full h-full" />
      </div>
      {/* Main content */}
      <div className="relative z-10 flex flex-col">
        <section className="min-h-screen px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
          <Intro />
        </section>
        <section className="px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
          <Work />
        </section>
        <section className="px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
          <Feature />
        </section>
      </div>
    </div>
  )
}

export default Home