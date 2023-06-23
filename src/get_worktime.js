import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentData  from './get_appo';
import { FaUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaClinicMedical } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';
import { useParams } from 'react-router-dom';
import baseURL from './Config'


function WorkTimeData() {
  const styles = {
    margin: 0,
    direction: 'rtl',
  };
  const container ={ display: 'flex',
    height: '100vh'

  }
  const [workTimeData, setWorkTimeData] = useState([]);
  const { clinicId } = useParams();
  const [appointmentworkTimeId, setAppointmentWorkTimeId] = useState(null);
 const token = localStorage.getItem('token');

        
 const [hoveredProfile, setHoveredProfile] = useState(false);
 const [hoveredSetting, setHoveredSetting] = useState(false);
 const [hoveredReports, setHoveredReports] = useState(false);
 const [hoveredClinics, setHoveredClinics] = useState(true);
 const navigate = useNavigate();


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

 const handleClinicClick = () => {
  navigate(`/Passed/${clinicId}`);

 }
const requestOptions = {
    method: 'Get',
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${baseURL}/doctors/work-time/${clinicId}`, requestOptions);
      const data = await response.json();
      console.log(response)
      setWorkTimeData(data.workTimes);
    }
    fetchData();
  }, []);

  const handleClick = (workTimeId) => {
    setAppointmentWorkTimeId(workTimeId);

  };

  const groupedAppointments = [];

  for (let i = 0; i < workTimeData.length; i += 3) {
    groupedAppointments.push(workTimeData.slice(i, i + 3));
  }

  return (     <div style={styles}>
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
            <p className="element" style={{ fontWeight: 'bold',cursor: 'pointer',  backgroundColor:  'white' , color:  'orange'}} onMouseEnter={handleMouseEnterClinics} onClick={handleClinicClick}>
              <FaClinicMedical/> العيادات
            </p>
            <p className="element" style={{ fontWeight: 'bold',cursor: 'pointer',  backgroundColor: hoveredReports ? 'white' : 'blue', color: hoveredReports ? 'orange' : 'white' }} onMouseEnter={handleMouseEnterReports} onMouseLeave={handleMouseLeaveReports} onClick={handleReportsClick}>
              <BiLineChart/> التقارير
            </p>
            <p className="element" style={{ fontWeight: 'bold',cursor: 'pointer',  backgroundColor: hoveredSetting ?'white' : 'blue', color: hoveredSetting ? 'orange' : 'white'  }} onMouseEnter={handleMouseEnterSetting} onMouseLeave={handleMouseLeaveSetting}>
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
            <div className="grid-item" key={appointment.workTimeId}>
              <div>{appointment.day}</div>
              <div>{appointment.date}</div>
              <button  style={{cursor :'pointer'}} onClick={() =>     navigate(`/App/${appointment.workTimeId}`)}>
              عرض الحجز
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
    </div>
    </div>
</div>
  );
}

export default WorkTimeData;