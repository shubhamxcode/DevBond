import { Routes, Route } from "react-router-dom";

import Home from './components/Home/Home'
import Layout from "./layout";
import Field from "./components/devfields/field";
import Sinup from './components/loginuser/sinup'
import Login from "./components/loginuser/login";
import Userprof from "./userdata/userprofile/userprof";
import Connection from "./connections/connection";
import ResumeParserUI from "./components/resumeparsing/resumeparsing";
import Developer from "./components/chatarea/developer";
import FollowRequestsPage from "./components/FollowRequests/FollowRequestsPage";
import UserResumeInfo from "./userdata/userprofile/userresumeinfo";
import SetupCheck from "./components/SetupCheck";
import ResumeEdit from "./components/resumeEdit/ResumeEdit";
import FieldEdit from "./components/fieldEdit/FieldEdit";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { hydrateUserProfile } from './Redux/store';
import type { AppDispatch } from './Redux/store';
function App() {
  const dispatch: AppDispatch = useDispatch();
  const accessToken = useSelector((state: any) => state.userProfile.accessToken);
  useEffect(() => {
    if (accessToken) {
      dispatch(hydrateUserProfile());
    }
  }, [accessToken, dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/field" element={<Field />} />
        <Route path="/signup" element={<Sinup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Userprof />} />
        <Route path="/connection" element={<Connection/>}/>
        <Route path="/developer/:recipientId" element={<Developer/>}/>
        <Route path="/follow-requests" element={<FollowRequestsPage/>}/>
        <Route path="/Resumeparsing" element={<ResumeParserUI/>}/>
        <Route path="/userinfo/:userId" element={<UserResumeInfo/>}/>
        <Route path="/setup-check" element={<SetupCheck/>}/>
        <Route path="/resume-edit" element={<ResumeEdit/>}/>
        <Route path="/field-edit" element={<FieldEdit/>}/>
      </Route>
    </Routes>
  );
}

export default App;
