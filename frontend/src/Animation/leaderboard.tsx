
import  Lottie  from 'lottie-react';
import Leaderboardimg from '../assets/animations/Animation - 1738176221127.json'
const Leaderboard = () => {
  return (
    <Lottie
      animationData={Leaderboardimg}

      loop={true} // Set to true if you want the animation to loop
      autoplay={true} // Set to true to start the animation automatically
      style={{ width: '100%', height: '100%' }} // Adjust size as needed
    />
  );
};

export default Leaderboard;
