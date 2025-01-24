import { TbBaselineDensityMedium } from "react-icons/tb";
function userprof() {
  const cards=[
    {
      id:1,
      name:"shubham",
      follow:"Follow",
      image:"/images/shubham varshney.jpeg"
      
    },
    {
      id:2,
      name:"shubham",
      follow:"Follow",
      image:"/images/shubham varshney.jpeg"
      
    },
    {
      id:3,
      name:"shubham",
      follow:"Follow",
      image:"/images/shubham varshney.jpeg"
      
    },
    {
      id:4,
      name:"shubham",
      follow:"Follow",
      image:"/images/shubham varshney.jpeg"
      
    },
    {
      id:5,
      name:"shubham",
      follow:"Follow",
      image:"/images/shubham varshney.jpeg"
      
    },
    {
      id:6,
      name:"shubham",
      follow:"Follow",
      image:"/images/shubham varshney.jpeg"
      
    },
    {
      id:7,
      name:"shubham",
      follow:"Follow",
      image:"/images/shubham varshney.jpeg"
      
    },
    {
      id:8,
      name:"shubham",
      follow:"Follow",
      image:"/images/shubham varshney.jpeg"
      
    },
    {
      id:9,
      name:"shubham",
      follow:"Follow",
      image:"/images/shubham varshney.jpeg"
      
    },
    {
      id:10,
      name:"shubham",
      follow:"Follow",
      image:"/images/shubham varshney.jpeg"
      
    },
    {
      id:11,
      name:"shubham",
      follow:"Follow",
      image:"/images/shubham varshney.jpeg"
      
    },
    {
      id:12,
      name:"shubham",
      follow:"Follow",
      image:"/images/shubham varshney.jpeg"
      
    },
    
  ]
  return (
    <div className=" ">
    <div className="flex justify-between ">
      <div className="flex text-white text-center gap-x-1">
        <div className="text-2xl inline-block">
          <TbBaselineDensityMedium />
        </div>
        <h1 className="text-xl">All</h1>
      </div>
      <div className="text-white flex justify-center items-center gap-x-2">
        <h1 className="border text-center flex justify-center px-32 py-1">
          search
        </h1>
        <div>
          <h1 className="border rounded-full w-10 h-10"></h1>
        </div>
      </div>
    </div>
    <div className="p-6 bg-gray-900 min-h-screen">
  <h1 className="text-white text-4xl font-semibold text-center mb-8">Suggestions</h1>
  
  {/* Container for multiple suggestion boxes */}
  <div className=" flex flex-wrap justify-evenly gap-y-4">
    {cards.map((card)=>(
       <div key={card.id} className=" space-x-4 hover:cursor-pointer hover:scale-105 transition-all duration-300  border inline-block  p-12 px-32 text-center bg-slate-800">
       <img src={card.image} alt={`${card.name}avatar`} className="w-14 h-14 rounded-full border text-center inline-block"/>
       <div className="text-center space-y-1 ">
       <h1 className="text-green-600 border pl-8 pr-8 text-center">{card.name}</h1>
       <h1 className="text-red-600 border text-center">{card.follow}</h1>
       </div>
     </div>
    ))}
  </div>
</div>

    </div>
  );
}

export default userprof;
