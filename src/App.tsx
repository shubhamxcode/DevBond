
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './components/Home/Home'
import Signin from './components/signin/signin'
import Layout from "./layout";
import Field from "./components/devfields/field";
import User from "./components/developer/user";
function App() {
  

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/field" element={<Field/>}/>
          <Route path="/user" element={<User/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
