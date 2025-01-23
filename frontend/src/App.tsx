
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './components/Home/Home'
import Layout from "./layout";
import Field from "./components/devfields/field";
import User from "./components/developer/user";
import Sinup from './components/loginuser/sinup'
import Login from "./components/loginuser/login";
function App() {
  

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path="/field" element={<Field/>}/>
          <Route path="/user" element={<User/>}/>
          <Route path="/signup" element={<Sinup/>}/>
          <Route path="/login" element={<Login/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
