import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaClinicMedical } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';
import baseURL from './Config'

import { navigate, useNavigate } from 'react';
function AppointmentData() {
  const styles = {
    margin: 0,
    direction: 'rtl',
  };
  const container ={ display: 'flex',
    height: '100vh'

  }
  console.log('myFunction executed');

  const { state } = useLocation();
  const { workTimeId } = useParams();
  const [appointment, setAppointment] = useState(null);
const token = localStorage.getItem('token');
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


const requestOptions = {
          method: 'Get',
          headers: { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}` 
          },
        };
  useEffect(() => {
    async function fetchData() {
      console.log("hoiiiiiiiiiiiii")
      
      try {
        const response = await fetch(`${baseURL}/doctors/appoitment/${workTimeId || state?.workTimeId}`, requestOptions);
        const data = await response.json();
        setAppointment(data.appointment);
      } catch (error) {
        console.error('Error fetching appointment data:', error);
      }
    }
    fetchData();
  }, [workTimeId, state?.workTimeId]);


const groupedAppointments = [];
if (appointment?.length) { // add a check to make sure that appointment is not null
  for (let i = 0; i < appointment.length; i += 3) {
    groupedAppointments.push(appointment.slice(i, i + 3));
  }
}
return (
  <div style={styles}>
<div style={container}> 
 <div className="left-column">
        <div>
          <img src={process.env.PUBLIC_URL + '/images/log1.png'} alt="Logo" className='logo'/>   
        </div>
        <p className="square"></p>
        <div className='fields'>
          <div dir='rtl'>
            <p className='element'  style={{ fontWeight: 'bold', cursor: 'pointer', backgroundColor: hoveredProfile ? 'white' : 'blue', color: hoveredProfile ? 'orange' : 'white' }} onMouseEnter={handleMouseEnterProfile} onMouseLeave={handleMouseLeaveProfile} onClick={handleProfileClick}>
              <FaUser/> الملف الشخصي
            </p>
            <p className="element" style={{ fontWeight: 'bold', cursor: 'pointer', backgroundColor:  'white' , color:  'orange'}} onMouseEnter={handleMouseEnterClinics} >
              <FaClinicMedical/> العيادات
            </p>
            <p className="element" style={{ fontWeight: 'bold', cursor: 'pointer', backgroundColor: hoveredReports ? 'white' : 'blue', color: hoveredReports ? 'orange' : 'white' }} onMouseEnter={handleMouseEnterReports} onMouseLeave={handleMouseLeaveReports} onClick={handleReportsClick}>
              <BiLineChart/> التقارير
            </p>
            <p className="element" style={{ fontWeight: 'bold', cursor: 'pointer', backgroundColor: hoveredSetting ?'white' : 'blue', color: hoveredSetting ? 'orange' : 'white'  }} onMouseEnter={handleMouseEnterSetting} onMouseLeave={handleMouseLeaveSetting}>
              <IoSettingsOutline/> الإعدادات
            </p>
          </div>
        </div>
        </div>
        <div class="right-column">
<div className="grid-container">
  {groupedAppointments.map((group) => (
    <div className="grid-row" key={group[0].workTimeId}>
      {group.map((appointment) => (
        <div className="grid-item" key={appointment.id}>
          
          <div>{appointment.startingTime}</div>
          <div>{appointment.finishingTime}</div>
          <div>{appointment.day}</div>
          <div>{appointment.date}</div>
          <div>{appointment.patient ? appointment.patient.firstname : "متاح للحجز"}</div>
          <div>{appointment.patient ? appointment.patient.lastname : "متاح للحجز"}</div>

        </div>
       
      ))}
    </div>
  ))}
</div>
</div> </div></div>
);

}

export default AppointmentData;