import Lottie from 'lottie-react';
import Loginimg from '../assets/animations/Animation - 1738182077369.json'
const LoginBackground = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
      <Lottie animationData={Loginimg} loop={true} autoplay={true} style={{ width: '50%', height: '100%' }} />
      
    </div>
  );
};

export default LoginBackground;
