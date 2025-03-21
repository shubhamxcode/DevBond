import { Routes, Route } from "react-router-dom";

import Home from './components/Home/Home'
import Layout from "./layout";
import Field from "./components/devfields/field";
import Sinup from './components/loginuser/sinup'
import Login from "./components/loginuser/login";
import Userprof from "./userdata/userprofile/userprof";
import Connection from "./connections/connection";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/field" element={<Field />} />
        <Route path="/signup" element={<Sinup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Userprof />} />
        <Route path="/connection" element={<Connection/>}/>
      </Route>
    </Routes>
  );
}

export default App;
