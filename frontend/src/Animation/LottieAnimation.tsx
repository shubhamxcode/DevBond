
import  Lottie  from 'lottie-react';
import animationData from '../assets/animations/Animation - 1738108658993.json'; // Update the path to your downloaded animation
const LottieAnimation = () => {
  return (
    <Lottie
      animationData={animationData}

      loop={true} // Set to true if you want the animation to loop
      autoplay={true} // Set to true to start the animation automatically
      style={{ width: '100%', height: '100%' }} // Adjust size as needed
    />
  );
};

export default LottieAnimation;
