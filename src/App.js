
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Insurances from "./MainAdmin/Component/Body/Insurances";
import Specialty,{Subspecialty} from "./MainAdmin/Component/Body/specialty";

import LoginForm from "./MainAdmin/Component/Body/Login";
import Home from "./MainAdmin/Component/Body/MainAdminHome";
import SubAdmin from './MainAdmin/Component/Body/SubAdmin';
import SupHome from './MainAdmin/Component/Body/SupAdminHome';
import Clinics, { Doctors } from './MainAdmin/Component/Body/Clinic';
import DoctorAd from './MainAdmin/Component/Body/DoctorForAdmin';
import Profiles from './MainAdmin/Component/Body/AdminProfile';



import ClinicInformation from './clinicinformation';
import Tjreba from './tjreba';
import WorkTimeData from './get_worktime'
import AppointmentData from "./get_appo"

import HomePage from './Home-page'
import Report from './reports'
import Profile from './profile'
import Clinic from './clinics'
import Passed from './passed'
import Sendemail, { ResetPassword } from './MainAdmin/Component/Body/SendEmail';


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
        <Route path="/Clinics" element={<Clinics token={token} />} />
        <Route path="/DoctorAd" element={<DoctorAd token={token}/>} />
        <Route path="/doctor/:clinicId" element={<Doctors />} />
        <Route path="/Profiles" element={<Profiles token={token}/>} />
        <Route path="/SendEmail" element={<Sendemail/>} />
        <Route path="/ResetPassword" element={<ResetPassword/>} />


        
        




        //قسم ريم
        <Route path="/HomePage" element={< HomePage token={token}/>} />

        <Route path="/Tjreba/:clinicId" element={< Tjreba token={token}/>} />
        <Route path="/App/:workTimeId" element={<AppointmentData token={token}/>}/>
        <Route path="/WorkTimeData/:clinicId" element={< WorkTimeData token={token}/>} />
        <Route path="/HomePage/Profile"element={< Profile token={token}/>} />
        <Route path="/HomePage/Clinic"element={< Clinic token={token}/>} />
        <Route path="/HomePage/Profile/Clinic"element={< Clinic token={token}/>} />
        <Route path="/Clinic" element={< Clinic token={token}/>} />
        <Route path="/Profile" element={< Profile token={token}/>} />
        <Route path="/Passed/:clinicId" element={< Passed token={token}/>} />
        <Route path="/ClinicInformation/:clinicId" element={< ClinicInformation token={token}/>} />




      </Routes>
    </Router>
  );
}

export default App;