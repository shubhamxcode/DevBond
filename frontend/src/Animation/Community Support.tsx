import Lottie from 'lottie-react';
import Communtiy from '../assets/animations/Animation - 1738176864191.json'
const CommunitySupport = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
      <Lottie animationData={Communtiy} loop={true} autoplay={true} style={{ width: '50%', height: '100%' }} />
      
    </div>
  );
};

export default CommunitySupport;
