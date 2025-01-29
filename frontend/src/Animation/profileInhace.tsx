import Lottie from 'lottie-react';
import ProfileInhace from '../assets/animations/Animation - 1738162703362.json'

const Profileinhance = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
      <Lottie animationData={ProfileInhace} loop={true} autoplay={true} style={{ width: '50%', height: '100%' }} />
      
    </div>
  );
};

export default Profileinhance;
