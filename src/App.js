
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Insurances from "./MainAdmin/Component/Body/Insurances";
import Specialty,{Subspecialty} from "./MainAdmin/Component/Body/specialty";

import LoginForm from "./MainAdmin/Component/Body/Login";
import Home from "./MainAdmin/Component/Body/MainAdminHome";
import SubAdmin from './MainAdmin/Component/Body/SubAdmin';
import SupHome from './MainAdmin/Component/Body/SupAdminHome';
import Clinic from './MainAdmin/Component/Body/Clinic';
import DoctorAd from './MainAdmin/Component/Body/DoctorForAdmin';

function App() {
  const [token, setToken] = useState('');


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm setToken={setToken} />} />

       //قسم رهف 
        <Route path="/Home" element={<Home />} />
        <Route path="/SupHome" element={<SupHome />} />
        <Route path="/Insurances" element={<Insurances token={token} />} />
        <Route path="/specialty" element={<Specialty  token={token}/>}/>
        <Route path="/specialties/:specialtyId" element={<Subspecialty />} />
        <Route path="/SubAdmin" element={<SubAdmin token={token} />} />
        <Route path="/Clinic" element={<Clinic token={token} />} />
        <Route path="/DoctorAd" element={<DoctorAd token={token} />} />

        




        //قسم ريم
      </Routes>
    </Router>
  );
}

export default App;