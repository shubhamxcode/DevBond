
import  Lottie  from 'lottie-react';
import Filedimg from '../assets/animations/Animation - 1738184285951.json'
const FieldBackground = () => {
  return (
    <Lottie
      animationData={Filedimg}

      loop={true} // Set to true if you want the animation to loop
      autoplay={true} // Set to true to start the animation automatically
      style={{ width: '100%', height: '100%' }} // Adjust size as needed
    />
  );
};

export default FieldBackground;
