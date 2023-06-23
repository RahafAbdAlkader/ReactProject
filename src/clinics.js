import './index.css'
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaClinicMedical } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';
import { navigate} from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Passed from './passed';

import baseURL from './Config'


function Clinic (){
  const styles = {
    margin: 0,
    direction: 'rtl',
  };
  const container ={ display: 'flex',
    height: '100vh'

  }
  
          const [ClinicData, setClinicData] = useState([]);
           const [clinicId, setclinicId] = useState(null);
           const [isEditing, setIsEditing] = useState(false);

          // const { clinicId } = useParams();
        
          const navigate = useNavigate();
        
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const [hoveredSetting, setHoveredSetting] = useState(false);
  const [hoveredReports, setHoveredReports] = useState(false);
  const [hoveredClinics, setHoveredClinics] = useState(true);


  const handleMouseEnterProfile = () => {
    setHoveredProfile(true);
  };


  const handleMouseEnterClinics = () => {
    setHoveredClinics(true);
  };

  const handleMouseLeaveProfile = () => {
    setHoveredClinics(false);
  };

  const handleMouseEnterReports = () => {
    setHoveredReports(true);
  };

  const handleMouseLeaveReports = () => {
    setHoveredReports(false);
  };

  const handleMouseEnterSetting = () => {
    setHoveredSetting(true);
  };

  const handleMouseLeaveSetting = () => {
    setHoveredSetting(false);
  };

  const handleReportsClick = () => {
    navigate('/Report');
  };

  const handleProfileClick = () => {
    navigate('/Profile');
  };

  const handleClicked = (clinicId) => {

    // const clinic ='Clinic'
    // const currentPath = window.location.pathname;
  
    // if (currentPath !== clinic) {
    //   window.history.replaceState(null, '', homepagePath);
    // }
  
    navigate(`/Passed/${clinicId}`);
  };


  
  const handleEditClick = () => {
    setIsEditing(true);
  };

 const  handleClinicClick = () => {
  navigate(`/HomePage`);
};
 const token = localStorage.getItem('token');
const requestOptions = {
            method: 'Get',
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
            },
          };
        
          useEffect(() => {
            async function fetchData() {
              const response = await fetch(baseURL+'/doctors/get-clinic', requestOptions);
              const data = await response.json();
              setClinicData(data.clinics);
            }
            fetchData();
          }, []);
        
          const handleClick = (clinicId) => {
            setclinicId(clinicId);
        
          };
        
          const groupedAppointments = [];
        
          for (let i = 0; i < ClinicData.length; i += 3) {
            groupedAppointments.push(ClinicData.slice(i, i + 3));
          }
       
          return(
            <div style={styles}>
<div style={container}>
            <div className="left-column">
              <div>
                <img src={process.env.PUBLIC_URL + '/images/log1.png'} alt="Logo" className='logo'/>   
              </div>
              <p className="square"></p>
              <div className='fields'>
                <div dir='rtl'>
                  <p className='element'  style={{ fontWeight: 'bold',cursor:'pointer', backgroundColor: hoveredProfile ? 'white' : 'blue', color: hoveredProfile ? 'orange' : 'white' }} onMouseEnter={handleMouseEnterProfile} onMouseLeave={handleMouseLeaveProfile} onClick={handleProfileClick}>
                    <FaUser/> الملف الشخصي
                  </p>
                  <p className="element" style={{ fontWeight: 'bold',cursor:'pointer', backgroundColor:  'white' , color:  'orange'}} onMouseEnter={handleMouseEnterClinics} onClick={handleClinicClick} >
                    <FaClinicMedical/> العيادات
                  </p>
                  <p className="element" style={{ fontWeight: 'bold',cursor:'pointer' ,backgroundColor: hoveredReports ? 'white' : 'blue', color: hoveredReports ? 'orange' : 'white' }} onMouseEnter={handleMouseEnterReports} onMouseLeave={handleMouseLeaveReports} onClick={handleReportsClick}>
                    <BiLineChart/> التقارير
                  </p>
                  <p className="element" style={{ fontWeight: 'bold',cursor:'pointer', backgroundColor: hoveredSetting ?'white' : 'blue', color: hoveredSetting ? 'orange' : 'white'  }} onMouseEnter={handleMouseEnterSetting} onMouseLeave={handleMouseLeaveSetting}>
                    <IoSettingsOutline/> الإعدادات
                  </p>
                </div>
              </div>
            </div>
              <div class="right-column">
            
              <div className="grid-container" >
      {groupedAppointments.map((group) => (
        <div className="grid-row" key={group[0].clinicId} >
          {group.map((appointment) => (
            <div className="grid-item" key={appointment.clinicName} style={{ cursor: 'pointer' }}  onClick={() =>    handleClicked(appointment.clinicId)}>
              <div> {appointment.phonenumber}</div>
              <div>{appointment.clinicName}</div>
              <button style={{ cursor: 'pointer' }}   onClick={() =>     handleClicked(appointment.clinicId)}>
                العيادة    {  appointment.clinicId}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>


              </div>
            </div></div>
            );}
export default Clinic;

