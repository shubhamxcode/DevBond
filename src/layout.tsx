import { Outlet } from "react-router-dom"
import Nav from "./components/navbar/nav"
import Footer from "./components/footer/footer"
function layout() {
  return (
    <div>
        <Nav/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default layout