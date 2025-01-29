
import  Lottie  from 'lottie-react';
import SkillBadges from '../assets/animations/Animation - 1738176530960.json'
const Badges = () => {
  return (
    <Lottie
      animationData={SkillBadges}

      loop={true} // Set to true if you want the animation to loop
      autoplay={true} // Set to true to start the animation automatically
      style={{ width: '100%', height: '100%' }} // Adjust size as needed
    />
  );
};

export default Badges;
