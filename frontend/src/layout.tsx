import { Outlet } from "react-router-dom"
import Nav from "./components/navbar/nav"
import Footer from "./components/footer/footer"

function Layout() {
  return (
    <div className="">
      <Nav />
      <main className="mt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout