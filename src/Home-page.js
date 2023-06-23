import './index.css'
import React, { useState } from 'react';
import { navigate, useNavigate } from 'react-router-dom';
import Report from "./reports"
import { FaUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaClinicMedical } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';
import Profile  from './profile';
function Homepage (){

          const navigate=useNavigate();
          const styles = {
            margin: 0,
            direction: 'rtl',
          };
          const container ={ display: 'flex',
            height: '100vh'

          }
          
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const [hoveredClinics, setHoveredClinics] = useState(false);
  const [hoveredReports, setHoveredReports] = useState(false);
  const [hoveredSetting, setHoveredSetting] = useState(false);
  const [hoveredcompany, setHoveredcompany] = useState(false);

  const handleMouseEnterProfile = () => {
    setHoveredProfile(true);
  };

  const handleMouseLeaveProfile = () => {
    setHoveredProfile(false);
  };

  const handleMouseLeaveClinics = () => {
    setHoveredClinics(false);
  };

  const handleMouseEnterClinics = () => {
    setHoveredClinics(true);
  };

  const handleMouseEnterReports = () => {
    setHoveredReports(true);
  };

  const handleMouseLeaveReports = () => {
    setHoveredReports(false);
  };

  const handleMouseEnterhoveredcompany = () => {
    setHoveredcompany(true);
  };

  const handleMouseLeavehoveredcompany = () => {
    setHoveredcompany(false);
  };

  const handleMouseEnterSetting = () => {
    setHoveredSetting(true);
  };

  const handleMouseLeaveSetting = () => {
    setHoveredSetting(false);
  };

  const handleReportsClick = () => {
  //   const homepagePath = '/';
  // const loginPath = '/login';
  // const currentPath = window.location.pathname;

  // if (currentPath !== homepagePath && currentPath !== loginPath) {
  //   window.history.replaceState(null, '', homepagePath);
  // }

  navigate('/Report');
  };

  const handleclinicsClick = () => {
    // const homepagePath = '/';
    // const loginPath = '/login';
    // const currentPath = window.location.pathname;
  
    // if (currentPath !== homepagePath && currentPath !== loginPath) {
    //   window.history.replaceState(null, '', homepagePath);
    // }
  
    navigate('/Clinic');
  };

  const handleSettingsClick = () => {};

  const handleProfileClick = () => {
    // const homepagePath = '/';
    // const loginPath = '/login';
    // const currentPath = window.location.pathname;
  
    // if (currentPath !== homepagePath && currentPath !== loginPath) {
    //   window.history.replaceState(null, '', homepagePath);
    // }
  
    navigate('/Profile');
  };

    

return(
  <div style={styles}>
<div style={container}>
<div className="left-column">
      <div>
         <img src={process.env.PUBLIC_URL + '/images/log1.png'} alt="Logo" className="logo" />
       </div>
       <p className="square"></p>
       <div className="fields">
         <div dir="rtl">
           <p
             className="element"
             style={{ fontWeight: 'bold', cursor: 'pointer', backgroundColor: hoveredProfile ? 'white' : 'blue', color: hoveredProfile ? 'orange' : 'white' }}
             onMouseEnter={handleMouseEnterProfile}
            onMouseLeave={handleMouseLeaveProfile}
            onClick={handleProfileClick}
           >
             <FaUser /> الملف الشخصي           </p>
           <p
             className="element"
             style={{ fontWeight: 'bold', cursor: 'pointer', backgroundColor: hoveredClinics ? 'white' : 'blue', color: hoveredClinics ? 'orange' : 'white' }}
             onMouseEnter={handleMouseEnterClinics}
             onMouseLeave={handleMouseLeaveClinics}
            onClick={handleclinicsClick}
          >
            <FaClinicMedical />العيادات
          </p>
          <p
            className="element"
            style={{ fontWeight: 'bold', cursor:'pointer', backgroundColor: hoveredReports ? 'white' : 'blue', color: hoveredReports ? 'orange' : 'white' }}
            onMouseEnter={handleMouseEnterReports}
            onMouseLeave={handleMouseLeaveReports}
            onClick={handleReportsClick}
          >
            <BiLineChart />التقارير
          </p>
       
          <p
            className="element"
            style={{ fontWeight: 'bold', cursor: 'pointer', backgroundColor: hoveredSetting ? 'white' : 'blue', color: hoveredSetting ? 'orange' : 'white' }}
            onMouseEnter={handleMouseEnterSetting}
            onMouseLeave={handleMouseLeaveSetting}
          >
            <IoSettingsOutline />الإعدادات
        </p>
         </div>
       </div>
     </div>
  <div class="right-column">
 
          <img src={process.env.PUBLIC_URL + '/images/Doctor2.jpg'}    style={{ width: '100%', height: '100%' }}/>   

         
</div>
</div>
</div>

);}
export default Homepage;


