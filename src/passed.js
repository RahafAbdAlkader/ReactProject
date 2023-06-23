import React, { useState } from 'react';
import { useParams} from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaClinicMedical } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';
import { navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Tjreba  from './tjreba';
import WorkTimeData from './get_worktime';
import ClinicInformation from './clinicinformation';
import baseURL from './Config'

function Passed (){
          const navigate = useNavigate();

       
          const [hoveredr, setHoveredr] = useState(false);
          const [ClinicData, setClinicData] = useState([]);
           const { clinicId } = useParams();
          
           const styles = {
            margin: 0,
            direction: 'rtl',
          };
          const container ={ display: 'flex',
            height: '100vh'
        
          }
      
            
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
         
         
    
                  const [appointment, setAppointment] = useState([]);
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
                    console.log("hoiiiiiiiiiiiii")
                    try {
                      const response = await fetch(`${baseURL}/doctors/appoitment/1`, requestOptions);
                      const data = await response.json();
                      setAppointment(data.appointment);
                    } catch (error) {
                      console.error('Error fetching appointment data:', error);
                    }
                  }
                  fetchData();
                },[]);
              const groupedAppointments = [];
              if (appointment?.length) { // add a check to make sure that appointment is not null
                for (let i = 0; i < appointment.length; i += 3) {
                  groupedAppointments.push(appointment.slice(i, i + 3));
                }
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
                  <p className='element'  style={{ fontWeight: 'bold', backgroundColor: hoveredClinics ? 'white' : 'blue', color: hoveredClinics ? 'orange' : 'white' }} onMouseEnter={handleMouseEnterProfile} onMouseLeave={handleMouseLeaveProfile} onClick={handleProfileClick}>
                    <FaUser/> الملف الشخصي
                  </p>
                  <p className="element" style={{ fontWeight: 'bold', backgroundColor:  'white' , color:  'orange'}} onMouseEnter={handleMouseEnterClinics} >
                    <FaClinicMedical/> العيادات
                  </p>
                  <p className="element" style={{ fontWeight: 'bold', backgroundColor: hoveredReports ? 'white' : 'blue', color: hoveredReports ? 'orange' : 'white' }} onMouseEnter={handleMouseEnterReports} onMouseLeave={handleMouseLeaveReports} onClick={handleReportsClick}>
                    <BiLineChart/> التقارير
                  </p>
                  <p className="element" style={{ fontWeight: 'bold', backgroundColor: hoveredSetting ?'white' : 'blue', color: hoveredSetting ? 'orange' : 'white'  }} onMouseEnter={handleMouseEnterSetting} onMouseLeave={handleMouseLeaveSetting}>
                    <IoSettingsOutline/> الإعدادات
                  </p>
                </div>
              </div>
              </div>
      
                      <div class="right-column">
                              <div className='appointp'>
                    
<div >
<button   className='pass'     style={{ cursor: 'pointer' }}  onClick={() =>     navigate(`/Tjreba/${clinicId}`)} >
مواعيد العيادة
</button>
</div>
<div>
<button className='pass'  style={{ cursor: 'pointer' }}  onClick={() =>     navigate(`/WorkTimeData/${clinicId}`)} >
حجوزات العيادة
</button>
</div>

<div>
<button className='pass'  style={{ cursor: 'pointer' }}   onClick={() =>     navigate(`/ClinicInformation/${clinicId}`)} >
معلومات العيادة
</button>
</div>

<div style={{textAlign:'center',border:'20px',fontWeight:'bold',backgroundColor:'blue',height:'32px',color:'white'}}> مواعيد اليوم </div>
</div>
                      <div className="grid-container">
              {groupedAppointments.map((group) => (
                <div className="grid-row" key={group[0].id}>
                  {group.map((appointment) => (
                    <div className="grid-item" key={appointment.clinicName}>
                      <div> {appointment.day}</div>
                      <div>{appointment.startingTime}</div>
                      <div>{  appointment.finishingTime}</div>
                      <div>{  appointment.date}</div>

                      <div>{  appointment.patient}</div>

                    </div>
                  ))}
                </div>
              ))}
            </div>
        
        
                      </div>
                    </div></div>
                    );
}
export default Passed;