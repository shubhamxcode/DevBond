import { TbBaselineDensityMedium } from "react-icons/tb";

function UserProf() {
  const cards = [
    {
      id: 1,
      name: "shubham",
      follow: "Follow",
      image: "assets/images/shubham varshney.jpeg"
    },
    {
      id: 2,
      name: "shubham",
      follow: "Follow",
      image: "/images/shubham varshney.jpeg"
    },
    {
      id: 3,
      name: "shubham",
      follow: "Follow",
      image: "/images/shubham varshney.jpeg"
    },
    {
      id: 4,
      name: "shubham",
      follow: "Follow",
      image: "/images/shubham varshney.jpeg"
    },
    {
      id: 5,
      name: "shubham",
      follow: "Follow",
      image: "/images/shubham varshney.jpeg"
    },
    {
      id: 6,
      name: "shubham",
      follow: "Follow",
      image: "/images/shubham varshney.jpeg"
    },
    {
      id: 7,
      name: "shubham",
      follow: "Follow",
      image: "/images/shubham varshney.jpeg"
    },
    {
      id: 8,
      name: "shubham",
      follow: "Follow",
      image: "/images/shubham varshney.jpeg"
    },
    {
      id: 9,
      name: "shubham",
      follow: "Follow",
      image: "/images/shubham varshney.jpeg"
    },
    {
      id: 10,
      name: "shubham",
      follow: "Follow",
      image: "/images/shubham varshney.jpeg"
    },
    {
      id: 11,
      name: "shubham",
      follow: "Follow",
      image: "/images/shubham varshney.jpeg"
    },
    {
      id: 12,
      name: "shubham",
      follow: "Follow",
      image: "assets/images/shubham varshney.jpeg"
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-x-2">
          <TbBaselineDensityMedium className="text-white text-2xl" />
          <h1 className="text-white text-xl">All</h1>
        </div>
        <div className="flex items-center gap-x-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white">👤</span>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="text-center mb-12">
        <h1 className="text-white text-5xl font-semibold">Developer Suggestions</h1>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-gray-800 p-6 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <img
              src={card.image}
              alt={`${card.name} avatar`}
              className="w-20 h-20 rounded-full mx-auto border-2 border-blue-500"
            />
            <div className="mt-4 text-center">
              <h2 className="text-white text-xl font-semibold">{card.name}</h2>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                {card.follow}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProf;