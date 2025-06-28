import { Outlet, useLocation } from "react-router-dom"
import Nav from "./components/navbar/nav"
import Footer from "./components/footer/footer"

function Layout() {
  const location = useLocation();
  
  // Check if current path is a chat page (starts with /developer/)
  const isChatPage = location.pathname.startsWith('/developer/');

  return (
    <div className="">
      <Nav />
      <main className="mt-20">
        <Outlet />
      </main>
      {!isChatPage && <Footer />}
    </div>
  )
}

export default Layout