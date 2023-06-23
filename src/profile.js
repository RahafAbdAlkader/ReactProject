import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, notification } from 'antd';
import baseURL from './Config'

import { FaUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaClinicMedical } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';

function Profile() {
  const [profile, setProfile] = useState({});
  const styles = {
    margin: 0,
    direction: 'rtl',
  };
  const container ={ display: 'flex',
    height: '100vh'

  }
    const [isEditing, setIsEditing] = useState(false);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(null);
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [insurances, setInsurances] = useState({ insurances: [] });
  //const [speciality, setSpeciality] = useState({});
  const phoneNumberRegex = /^09\d{8}$/; // Regular expression to match a 10-digit phone number starting with 09

  const [evaluate, setevaluate] = useState('');

  const navigate = useNavigate();

const token = localStorage.getItem('token');
console.log(token)
const requestOptions = {
    method: 'GET',
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}` 
    },
  };




  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${baseURL}/doctors/get-profile`, requestOptions);
        const data = await response.json();
        setProfile(data.doctor);
        const responsee = await fetch(`${baseURL}/doctors/get-inurance`, requestOptions);
        const dataa = await responsee.json();

        setInsurances(dataa);
        console.log(dataa)
        // const respons = await fetch('http://localhost:3000/doctors/get-sub', requestOptions);
        // const daa = await respons.json();
        // setSpeciality(daa);
      } catch (error) {
      

        console.error('Error fetching appointment data:', error);
      }
    }
    fetchData();
  }, []);
  const companyNames = insurances.insurances.map(insurance => insurance.companyName);
 

  const [hoveredProfile, setHoveredProfile] = useState(true);
  const [hoveredSetting, setHoveredSetting] = useState(false);
  const [hoveredReports, setHoveredReports] = useState(false);
  const [hoveredClinics, setHoveredClinics] = useState(false);


  const handleMouseEnterProfile = () => {
    setHoveredProfile(true);
  };


  const handleMouseEnterClinics = () => {
    setHoveredClinics(true);
  };

  const handleMouseLeaveClinics = () => {
    setHoveredClinics(false);
  };

  const handleMouseEnterReports = () => {
    setHoveredReports(true);
  };

  const handleMouseLeaveReports = () => {
    setHoveredReports(false);
  };
  const handlecancel=()=>{
    setIsEditing(false)
  }


  const handleMouseEnterSetting = () => {
    setHoveredSetting(true);
  };

  const handleMouseLeaveSetting = () => {
    setHoveredSetting(false);
  };

  const handleReportsClick = () => {
    navigate('/Report');
  };

  const handleClinicsClick = () => {
    navigate('/Clinic');
  };
  const handleNotify = () => {
  
    if (editedPhoneNumber && phoneNumberRegex.test(editedPhoneNumber))
    {
      notification.success({
        message: 'information Set',
        description: ' !تم تعديل المعلومات بنجاح',
      });
      handleSaveClick(); } else {
        console.log(profile.editedPhoneNumber)
      notification.error({
        message: 'رقم الهاتف خطأ ',
        description: ' يجب أن يبدأ الرقم ب 09 '+'وأن يتكون من 10 أرقام'+' وأن لا يحتوي على أحرف',
      });
    }
  };


  
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handlePhoneNumberChange = (event) => {
    setEditedPhoneNumber(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setEditedDescription(event.target.value);
  };

  const  handleSaveClick =async () => {

    
    const requestBody = {
      description: editedDescription,
      phonenumber: editedPhoneNumber,
  
    };
        const requestOptions = {
      method: 'PUT',
      headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` 
      },
      
      body:JSON.stringify(requestBody)
    };   
     try {
        const response = await fetch(`${baseURL}/doctors/update-profile`, requestOptions);
        const data = await response.json();
  
      } catch (error) {
        console.error('Error fetching appointment data:', error);
      }
    setProfile(() => ({
      lastname:profile.lastname,
      firstname:profile.firstname,
      evaluate:profile.evaluate,
      phonenumber: (editedPhoneNumber!==null ?editedPhoneNumber:profile.phonenumber) ,
      description:(editedDescription!==null ?editedDescription:profile.description) ,
    }));
    setIsEditing(false);
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
            <p className='element' style={{fontWeight:'bold',cursor: 'pointer', backgroundColor: 'white', color: 'orange' }} >
              <FaUser/> الملف الشخصي
            </p>
            <p className="element" style={{ fontWeight: 'bold',cursor: 'pointer', backgroundColor: hoveredClinics ? 'white' : 'blue', color: hoveredClinics ? 'orange' : 'white' }} onMouseEnter={handleMouseEnterClinics} onMouseLeave={handleMouseLeaveClinics} onClick={handleClinicsClick}>
              <FaClinicMedical/> العيادات
            </p>
            <p className="element" style={{ fontWeight: 'bold',cursor:' pointer', backgroundColor: hoveredReports ? 'white' : 'blue', color: hoveredReports ? 'orange' : 'white' }} onMouseEnter={handleMouseEnterReports} onMouseLeave={handleMouseLeaveReports} onClick={handleReportsClick}>
              <BiLineChart/> التقارير
            </p>
            <p className="element" style={{ fontWeight: 'bold', cursor: 'pointer',backgroundColor: hoveredSetting ?'white' : 'blue', color: hoveredSetting ? 'orange' : 'white'  }} onMouseEnter={handleMouseEnterSetting} onMouseLeave={handleMouseLeaveSetting}>
              <IoSettingsOutline/> الإعدادات
            </p>
          </div>
        </div>
      </div>
      <div className="right-column">

      {isEditing ? (
<div></div>              ) : (
                <button  style={{marginRight:'calc(100%/1.2)' ,cursor:'pointer'}} onClick={handleEditClick}>تعديل</button>
                )}

       <div className='appointp' >
       <div>
          <img src={process.env.PUBLIC_URL + '/images/log1.png'} alt="Logo" className='logo'/>   
        </div>
       <div>الوصف:</div>
              {isEditing ? (
                <textarea  style={{backgroundColor:'white',width:'605px',textAlign:'center',color:'blue',fontSize:'medium'}}  value={editedDescription? editedDescription : profile.description } onChange={handleDescriptionChange} />
              ) : (
                <div className='pass' style={{textAlign:'center',color:'blue',fontSize:'medium'}}>{editedDescription===''? profile.description : editedDescription}</div>
              )}
          
              <div>رقم الهاتف:</div>
              {isEditing ? (
                <input type="text" style={{backgroundColor:'white',textAlign:'center',color:'blue',fontSize:'medium'}}  value={editedPhoneNumber!==null?editedPhoneNumber :profile.phonenumber} onChange={handlePhoneNumberChange} />
              ) : (
                <div className='pass'style={{textAlign:'center',color:'blue',fontSize:'medium'}}>  {editedPhoneNumber!==null?editedPhoneNumber :profile.phonenumber}</div>
              )}
                  <div className='pass'style={{textAlign:'center',color:'blue',fontSize:'medium'}}> الإسم : {profile.firstname}</div>
                  <div className='pass'style={{textAlign:'center',color:'blue',fontSize:'medium'}}> الكنية : {profile.lastname}</div>
                  <div className='pass'style={{textAlign:'center',color:'blue',fontSize:'medium'}}> التقييم : {profile.evaluate }</div>
                  <div className='pass'style={{textAlign:'center',color:'blue',fontSize:'medium'}}>
                 شركات التأمين : { companyNames.map(companyName => <div><div>{companyName}</div></div>)}
    </div>       </div>


    {isEditing ? (
               <button style={{textAlign:'center',border:'20px',fontWeight:'bold',backgroundColor:'blue',height:'32px',color:'white',margin:'20px',width:'300px',fontSize:'medium' ,cursor:'pointer'}} onClick={handleNotify}>حفظ</button>
               ) : (
<div></div>              )}
{isEditing ? (   

<Button type="primary" className='Button' style ={{textAlign:'center',border:'20px',fontWeight:'bold',backgroundColor:'blue',height:'32px',color:'white',margin:'20px',width:'300px',fontSize:'medium'}}  onClick={handlecancel}> الغاء التعديل     </Button>

      ) : ( 
        <div></div>
              )}


    
                </div></div>
            
    </div>
  );
}
//     { companyNames.map(companyName => <p>{companyName}</p>)}
export default Profile;