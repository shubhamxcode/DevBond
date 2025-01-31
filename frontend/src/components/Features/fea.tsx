import { FaMagic, FaChartLine, FaRobot, FaTrophy, FaAward, FaUsers } from 'react-icons/fa'; // Import icons from React Icons


function Page() {
  interface CardDataType {
    id: number;
    num: number;
    image?: string; // Optional for cards without an image
    animation?: React.ReactNode; // Optional for cards with an animation
    icon: React.ReactNode; // Updated to use React.ReactNode for icons
    title: string;
    description: string;
  }

  const cards: CardDataType[] = [
    { 
      id: 1, 
      num: 1, 
       
      icon: <FaMagic className="text-4xl text-purple-600" />, // Purple color
      title: 'Interactive Feature', 
      description: 'Experience engaging animations that enhance your learning journey.' 
    },
    { 
      id: 2, 
      num: 2, 
     
      icon: <FaChartLine className="text-4xl text-green-500" />, // Green color
      title: 'Profile Enhancement', 
      description: 'Enhance your profile with achievements and projects on GitHub and LeetCode.' 
    },
    { 
      id: 3, 
      num: 3, 
      
      icon: <FaRobot className="text-4xl text-blue-400" />, // Blue color
      title: 'Guidance Chatbot', 
      description: 'Receive guidance and suggestions from our chatbot based on your progress.' 
    },
    { 
      id: 4, 
      num: 4, 
     
      icon: <FaTrophy className="text-4xl text-yellow-400" />, // Yellow color
      title: 'Leaderboard System', 
      description: 'Compete with peers and track your performance on the leaderboard.'
    },
    { 
      id: 5, 
      num: 5, 
     
      icon: <FaAward className="text-4xl text-red-500" />, // Red color
      title: 'Skill Badges',
      description: 'Earn badges for completing challenges and improving your skills.' 
    },
    { 
      id: 6, 
      num: 6, 
     
      icon: <FaUsers className="text-4xl text-pink-400" />, // Pink color
      title: 'Community Support',  
      description: 'Connect with other developers for support and networking opportunities.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col justify-center items-center p-8">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-12 font-poppins">
        Features
      </h1>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl w-full">
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative bg-gradient-to-t from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-gray-500 group"
          >
            <div className="relative h-60 w-full overflow-hidden rounded-t-2xl">
              {card.image ? (
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-700">
                  {card.animation}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white text-2xl font-semibold flex items-center gap-3">
                <span className="drop-shadow-md">{card.icon}</span> {/* Render the icon here */}
                <span>{card.num}.</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-gray-300 transition-colors duration-300">
                {card.title}
              </h2>
              <p className="text-gray-400 group-hover:text-gray-200 transition-colors duration-300 mb-4">
                {card.description}
              </p>
              <button className="px-6 py-2 bg-gradient-to-b from-slate via-gray-900 to-gray text-white font-semibold rounded-full shadow-md hover:from-purple-400 hover:to-indigo-500 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;