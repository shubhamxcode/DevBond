
import { motion } from "framer-motion";

function Page() {
  return (
    <>
    <motion.div className=''
    initial={{ opacity: 0, scale:2 }}
    animate={{ opacity: 3, scale:1 }}
    transition={{
      duration: 4.5,
      delay:1,
      ease: [0, 0.71, 0.2, 1.01]
    }}>
    <div className='flex min-h-screen '>
      <div className='flex flex-col justify-center items-center text-center text-white font-bold gap-y-8 p-8'>
        <h1 className=' hover:underline text-4xl md:text-5xl lg:text-6xl text-slate-300'>BOND Connect and Grow</h1>
        <p className='px-4 md:px-20 text-lg md:text-2xl lg:text-3xl text-gray-400'>
        At BOND, developers unite to collaborate, solve challenges, and enhance their skills.
        Earn points by tackling questions, boost your profile, and connect with peers in your field.
        With our helpful chatbot by your side, you&apos;re never alone on your journey to success.
        Join us and take your development career to new heights!
</p>

        <motion.div
        className='bg-blue-800 px-4 rounded-3xl text-3xl font-thin'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}>
          <button>Learn More</button>
        </motion.div>
      </div>
    </div>
    </motion.div>
    </>
  );
}

export default Page;