import { TbBaselineDensityMedium } from "react-icons/tb";
function userprof() {
  const cards=[
    {
      id:String,
      name:String,
      follow:String,
      image:String
      
    },
    {
      id:String,
      name:String,
      follow:String,
      image:String
      
    },
    {
      id:String,
      name:String,
      follow:String,
      image:String
      
    },
    {
      id:String,
      name:String,
      follow:String,
      image:String
      
    },
    {
      id:String,
      name:String,
      follow:String,
      image:String
      
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
  <div className="">
    {cards.map((card)=>(
      <div className="border inline-block p-12 px-32 text-center bg-slate-800">
      <img className="w-14 h-14 rounded-full border justify-center inline-block ">{card.image}</img>
      <div className="text-center space-y-1 ">
      <h1 className="text-green-600 border pl-8 pr-8 text-center">{card.name}</h1>
      <h1 className="text-red-600 border text-center">{card.follow}</h1>
      </div>
    </div>
    }))
  </div>
</div>

    </div>
  );
}

export default userprof;
