
import  Lottie  from 'lottie-react';
import chatbot from '../assets/animations/Animation - 1738175973705.json'
const Chatbot = () => {
  return (
    <Lottie
      animationData={chatbot}

      loop={true} // Set to true if you want the animation to loop
      autoplay={true} // Set to true to start the animation automatically
      style={{ width: '100%', height: '100%' }} // Adjust size as needed
    />
  );
};

export default Chatbot;
