import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaClinicMedical } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import {navigat} from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { Button, notification } from 'antd';
import baseURL from './Config'


function ClinicInformation() {
  const navigate=useNavigate();
  const styles = {
    margin: 0,
    direction: 'rtl',
  };
  const container ={ display: 'flex',
    height: '100vh'

  }
  
  const [isEditing, setIsEditing] = useState(false);
  const [doctorClinic, setDoctorClinic] = useState({});
  const [appointmentDuring, setAppointmentDuring] = useState();
  const [daysToSeeLastAppointment, setDaysToSeeLastAppointment] = useState();
  const [checkupPrice, setCheckupPrice] = useState();

  const token = localStorage.getItem('token');

  const { clinicId } = useParams();
  const handleEditClick = () => {
    setIsEditing(true);
  };
          
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
  const handlecancel=()=>{
    setIsEditing(false)
  }

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
  
 const handleClinicClick = () => {
  navigate(`/Passed/${clinicId}`);

 }

  const handleReportsClick = () => {
    navigate('/Report');
  };

  const handleProfileClick = () => {
    navigate('/Profile');
  };


  const handleSaveClick = () => {            
    const requestBody = {
      appointmentDuring: parseInt(appointmentDuring),
      daysToSeeLastAppointment: parseInt(daysToSeeLastAppointment),
      checkupPrice: parseInt(checkupPrice),
    };   
  
    const requestOptions= {
      method: 'PUT',
      headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(requestBody)
    };   
   

    fetch(`${baseURL}/doctors/updateDoctoeClinicDetails/${clinicId}`, requestOptions)
     
        setDoctorClinic(requestBody);
        setIsEditing(false);
                     console.log(requestBody.appointmentDuring)
                     console.log(   requestBody.daysToSeeLastAppointment)
      
        if ((requestBody.appointmentDuring===0 ) || (requestBody.daysToSeeLastAppointment===0)){
          notification.error({
            message: 'يجب ألا تكون الخانتين الأولى والثانية فارغتين! ',
            description: ' ',
          })
      }
      else {
        notification.success({
          message: 'تم  تعديل المعلومات بنجاح ! ',
          description: ' ',
        });
      }
    
  };

  useEffect(() => {
    const requestOptions = {
      method: 'Get',
      headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` 
      },
    };
            
    async function fetchData() {
      console.log("hoiiiiiiiiiiiii")
      try {
        const response = await fetch(`${baseURL}/doctors/getDoctoeClinicDetails/${clinicId}`, requestOptions);
        const data = await response.json();

        if(data.doctorClinic != null) {
          setDoctorClinic(data.doctorClinic);
          setAppointmentDuring(data.doctorClinic.appointmentDuring);
          setDaysToSeeLastAppointment(data.doctorClinic.daysToSeeLastAppointment);
          setCheckupPrice(data.doctorClinic.checkupPrice);
           
      
        }
      } catch (error) {
        console.error('Error fetching clinic data:', error);
        // TODO: handle error
      }
    }

    fetchData();
  }, []);

  if (Object.keys(doctorClinic).length === 0) {
    return (   <div style={styles}>
      <div style={container}>
    <div className="left-column">
          <div>
            <img src={process.env.PUBLIC_URL + '/images/log1.png'} alt="Logo" className='logo'/>   
          </div>
          <p className="square"></p>
          <div className='fields'>
            <div dir='rtl'>
              <p className='element'  style={{ fontWeight: 'bold', backgroundColor: hoveredProfile ? 'white' : 'blue', color: hoveredProfile ? 'orange' : 'white' }} onMouseEnter={handleMouseEnterProfile} onMouseLeave={handleMouseLeaveProfile} onClick={handleProfileClick}>
                <FaUser/> الملف الشخصي
              </p>
              <p className="element" style={{ fontWeight: 'bold',cursor: 'hand', backgroundColor:  'white' , color:  'orange'}} onMouseEnter={handleMouseEnterClinics} onClick={handleClinicClick}>
                <FaClinicMedical/> العيادات
              </p>
              <p className="element" style={{ fontWeight: 'bold',cursor: 'pointer', backgroundColor: hoveredReports ? 'white' : 'blue', color: hoveredReports ? 'orange' : 'white' }} onMouseEnter={handleMouseEnterReports} onMouseLeave={handleMouseLeaveReports} onClick={handleReportsClick}>
                <BiLineChart/> التقارير
              </p>
              <p className="element" style={{ fontWeight: 'bold',cursor: 'pointer', backgroundColor: hoveredSetting ?'white' : 'blue', color: hoveredSetting ? 'orange' : 'white'  }} onMouseEnter={handleMouseEnterSetting} onMouseLeave={handleMouseLeaveSetting}>
                <IoSettingsOutline/> الإعدادات
              </p>
            </div>
          </div>
          </div>
    <div class="right-column">
      <div>
   
        <label className='pass' style={{backgroundColor:'white',textAlign:'center',color:'orange',fontSize:'medium'}}>
          مدة الموعد هي:
          <input type="number"  value={appointmentDuring} onChange={(e) => setAppointmentDuring(e.target.value)} />
        </label>
        <label className='pass' style={{backgroundColor:'white',textAlign:'center',color:'orange',fontSize:'medium'}}>
          المدة التي يستطيع فيها المريض الحجز:
          <input type="number"  value={daysToSeeLastAppointment} onChange={(e) => setDaysToSeeLastAppointment(e.target.value)} />
        </label>
        <label className='pass' style={{backgroundColor:'white',textAlign:'center',color:'orange',fontSize:'medium'}}>
          سعر الكشفية:
          <input type="number"  value={checkupPrice} onChange={(e) => setCheckupPrice(e.target.value)} />
        </label>
        <button onClick={handleSaveClick}>حفظ</button>
      </div>
      </div></div>
      </div>
    );
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
      {isEditing ? (
        <>
              <div style={{textAlign:'center',border:'20px',fontWeight:'bold',backgroundColor:'blue',height:'32px',color:'white'}}>معلومات العيادة</div>
<div style = {{margin:'20px'}}></div>
          <label className='pass'  >  مدة الموعد هي :
           
            <input type="number"  style={{width :"45px",backgroundColor:'white',textAlign:'center',color:'orange',fontSize:'medium'}} value={appointmentDuring} onChange={(e) => {
  console.log(e.target.value);
  setAppointmentDuring(e.target.value);
}} />          </label>
<div style = {{margin:'20px'}}></div>
          <label className='pass'>
              المدة التي يستطيع فيها المريض الحجز :  
            <input type="number"   value={daysToSeeLastAppointment}  style={{width :"45px",backgroundColor:'white',textAlign:'center',color:'orange',fontSize:'medium'}} onChange={(e) => setDaysToSeeLastAppointment(e.target.value)} />
          </label>
          <div style = {{margin:'20px'}}></div>
          <label className='pass' >
            سعر الكشفية : 
            <input type="number" style={{backgroundColor:'white',width :"50px",textAlign:'center',color:'orange',fontSize:'medium'}}  value={checkupPrice} onChange={(e) => setCheckupPrice(e.target.value)} />
          </label>
          <div>
          <button style={{textAlign:'center',border:'20px',fontWeight:'bold',backgroundColor:'blue',height:'32px',color:'white',margin:'20px',width:'300px',fontSize:'medium'}} onClick={handleSaveClick}>حفظ</button></div>
          {isEditing ? (   

<Button type="primary" className='Button' style ={{textAlign:'center',border:'20px',fontWeight:'bold',backgroundColor:'blue',height:'32px',color:'white',margin:'20px',width:'300px',fontSize:'medium'}}  onClick={handlecancel}> الغاء التعديل     </Button>

      ) : ( 
        <div></div>
              )}
        </>
      ) : (
        <>
          <div style={{textAlign:'center',border:'20px',fontWeight:'bold',backgroundColor:'blue',height:'32px',color:'white'}}>معلومات العيادة</div>
          <div className='pass'style={{backgroundColor:'white',textAlign:'center',color:'orange',fontSize:'medium'}}> مدة الموعد هي  {doctorClinic.appointmentDuring}</div>
          <div className='pass' style={{backgroundColor:'white',textAlign:'center',color:'orange',fontSize:'medium'}}> المدة التي يستطيع فيها المريض الحجز {doctorClinic.daysToSeeLastAppointment}</div>
          <div className='pass' style={{backgroundColor:'white',textAlign:'center',color:'orange',fontSize:'medium'}}> سعر الكشفية { doctorClinic.checkupPrice === NaN ? 0 : doctorClinic.checkupPrice}   </div>
          <button onClick={handleEditClick}>تعديل</button>

         
        </>
      )}
    </div> 
    </div></div>
</div>
  );
}
export default ClinicInformation;