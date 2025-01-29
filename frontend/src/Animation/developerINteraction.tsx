import Lottie from 'lottie-react';
import Devinteraction from '../assets/animations/Animation - 1738109252006.json'

const LottieAnimation = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
      <Lottie animationData={Devinteraction} loop={true} autoplay={true} style={{ width: '50%', height: '100%' }} />
      
    </div>
  );
};

export default LottieAnimation;
