function Page() {
  interface CardDataType {
    id: number;
    num: number;
    image: string;
    title: string;
    description: string;
  }

  const cards: CardDataType[] = [
    { id: 1, num: 1, image: 'https://img.freepik.com/premium-photo/dark-image-dark-abstract-image-with-dark-background_994023-22344.jpg', title: 'Developer Interaction', description: 'Create accounts using GitHub and LeetCode to earn points and enhance website development skills.' },
    { id: 2, num: 2, image: 'https://img.freepik.com/premium-photo/dark-image-dark-abstract-image-with-dark-background_994023-22344.jpg', title: 'Profile Enhancement', description: 'Enhance your profile with achievements and projects on GitHub and LeetCode.' },
    { id: 3, num: 3, image: 'https://img.freepik.com/premium-photo/dark-image-dark-abstract-image-with-dark-background_994023-22344.jpg', title: 'Guidance Chatbot', description: 'Receive guidance and suggestions from our chatbot based on your progress.' },
    { id: 4, num: 4, image: 'https://img.freepik.com/premium-photo/dark-image-dark-abstract-image-with-dark-background_994023-22344.jpg', title: 'Leaderboard System', description: 'Compete with peers and track your performance on the leaderboard.' },
    { id: 5, num: 5, image: 'https://img.freepik.com/premium-photo/dark-image-dark-abstract-image-with-dark-background_994023-22344.jpg', title: 'Skill Badges', description: 'Earn badges for completing challenges and improving your skills.' },
    { id: 6, num: 6, image: 'https://img.freepik.com/premium-photo/dark-image-dark-abstract-image-with-dark-background_994023-22344.jpg', title: 'Community Support', description: 'Connect with other developers for support and networking opportunities.' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-12">
        Features
      </h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 border border-gray-700 hover:shadow-white/50"
          >
            <div className="relative group">
              <img src={card.image} alt={card.title} className="h-56 w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-white group-hover:text-gray-300 transition-colors duration-300">
                {card.num}. {card.title}
              </h2>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {card.description}
              </p>
              <button className="mt-4 px-6 py-2 bg-white text-black font-semibold rounded-full shadow-md hover:bg-gray-300 transition-all duration-300">
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
