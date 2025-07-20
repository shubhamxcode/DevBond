import { FaMagic, FaChartLine, FaRobot, FaTrophy, FaAward, FaUsers } from 'react-icons/fa';
import { AnimatePresence } from "framer-motion";
import Timeline from '../ui/timeline';

interface Card {
  id: number;
  image: JSX.Element;
  step: string;
  description: string;
}

const cards: Card[] = [
  {
    id: 1,
    image: (
      <div className="w-full h-auto flex items-center justify-center">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-800 rounded-full flex items-center justify-center text-white">
          <FaMagic className="text-lg" />
        </div>
      </div>
    ),
    step: "Interactive Feature",
    description: "Experience engaging animations that enhance your learning journey with immersive interactions.",
  },
  {
    id: 2,
    image: (
      <div className="w-full h-auto flex items-center justify-center">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-800 rounded-full flex items-center justify-center text-white">
          <FaChartLine className="text-lg" />
        </div>
      </div>
    ),
    step: "Profile Enhancement",
    description: "Enhance your profile with achievements and projects on GitHub and LeetCode platforms.",
  },
  {
    id: 3,
    image: (
      <div className="w-full h-auto flex items-center justify-center">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-800 rounded-full flex items-center justify-center text-white">
          <FaRobot className="text-lg" />
        </div>
      </div>
    ),
    step: "Guidance Chatbot",
    description: "Receive intelligent guidance and personalized suggestions from our AI chatbot.",
  },
  {
    id: 4,
    image: (
      <div className="w-full h-auto flex items-center justify-center">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-800 rounded-full flex items-center justify-center text-white">
          <FaTrophy className="text-lg" />
        </div>
      </div>
    ),
    step: "Leaderboard System",
    description: "Compete with peers and track your performance on our dynamic leaderboard.",
  },
  {
    id: 5,
    image: (
      <div className="w-full h-auto flex items-center justify-center">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-800 rounded-full flex items-center justify-center text-white">
          <FaAward className="text-lg" />
        </div>
      </div>
    ),
    step: "Skill Badges",
    description: "Earn exclusive badges for completing challenges and mastering new skills.",
  },
  {
    id: 6,
    image: (
      <div className="w-full h-auto flex items-center justify-center">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-800 rounded-full flex items-center justify-center text-white">
          <FaUsers className="text-lg" />
        </div>
      </div>
    ),
    step: "Community Support",
    description: "Connect with fellow developers for support, collaboration, and networking.",
  },
];

function Features() {
  return (
    <section className="bg-black min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-10 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">
          AMAZING FEATURES
        </h1>
        
        <Timeline data={cards.map(card => ({
          id: card.id,
          title: card.step,
          description: card.description,
          icon: card.image
        }))} disableAnimation={undefined} />

        <AnimatePresence>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Features;