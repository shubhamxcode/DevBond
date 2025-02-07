import { Outlet } from "react-router-dom"
import Nav from "./components/navbar/nav"
import Footer from "./components/footer/footer"

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout