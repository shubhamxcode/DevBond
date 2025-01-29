import Lottie from 'lottie-react';
import Sinupimg from '../assets/animations/Animation - 1738181655558.json'
const Sinupbackground = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
      <Lottie animationData={Sinupimg} loop={true} autoplay={true} style={{ width: '50%', height: '100%' }} />
      
    </div>
  );
};

export default Sinupbackground;
