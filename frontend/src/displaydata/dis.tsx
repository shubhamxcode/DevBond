import axios from 'axios'
import { useEffect,useState} from 'react'
function dis() {
    const [data, setdata] = useState([])
    useEffect(() => {
        axios.get('/shubham')
        .then((res)=>{
            setdata(res.data)
        }).catch((error)=>{
            console.log("hey there is an error:",error);
            
        })
    }, [])
  return (
    <div className='text-red-600'>
        {data}
    </div>
  )
}

export default dis