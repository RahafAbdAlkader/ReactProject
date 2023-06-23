import React, { useState ,navigate} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, notification } from 'antd';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import { FaUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaClinicMedical } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import baseURL from './Config'

import moment from 'moment';
import { Checkbox } from 'antd';
import { useParams } from 'react-router-dom';

function Tjreba() {
  const styles = {
    margin: 0,
    direction: 'rtl',
  };
  const container ={ display: 'flex',
    height: '100vh'

  }
  navigate=useNavigate();

   const { clinicId } = useParams();
  const [startingTime, setStartingTime] = useState('');
  const [finishingTime, setFinishingTime] = useState('');
  const [days, setDays] = useState([]);
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const token = localStorage.getItem('token');
      const [done,setDone]=useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const [hoveredSetting, setHoveredSetting] = useState(false);
  const [hoveredReports, setHoveredReports] = useState(false);
  const [hoveredClinics, setHoveredClinics] = useState(true);
console.log(token)

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




  const handleTimeFinishing = (finishingTime) => {
    setFinishingTime(finishingTime);
  };
  
  const handleTimeStarting = (startingTime) => {
    setStartingTime(startingTime);
  };
  const handleChangeStartDate = (date) => {
  
      setStartDate(date);
    
  };
  const handleClinicClick = () => {
    navigate(`/Passed/${clinicId}`);
  
   }
  const handleChangeEndDate = (endDate) => {
    setEndDate(endDate);
  };
  const showReserve=(clinicId) =>{
    navigate(`/WorkTimeData/${clinicId}`)}  

  const handleDayChange = (checkedValues) => {
    setDays(checkedValues);
  };

  const handleNotify = () => {
    if (startingTime && finishingTime && days.length && startDate && endDate) {
      const today = new Date(); // Get today's date
      const selectedDate = new Date(startDate); // Convert the selected date to a Date object
    const selectedDateEnd =new Date(endDate)
      if (selectedDate < today) { // Compare the selected date with today's date
        notification.error({
          message: 'تاريخ غير صالح',
          description: 'يرجى اختيار تاريخ بعد اليوم',
        });
   
     
    } 
  if(startingTime && finishingTime && days.length && startDate && endDate && selectedDate > today && selectedDate < selectedDateEnd && startingTime-finishingTime < 0){
    notification.success({
      message: 'تم إدخال كافة المعلومات بنجاح ! ',
      description: ' ',
    });
    setDone(true);

    handleSetWorkTime();
  }
if(selectedDate > selectedDateEnd){
  notification.error({
    message: 'تاريخ غير صالح',
    description: 'يرجى اختيار تاريخ أحدث من التاريخ الذي قمت بإدخاله ',
  });}
  if(startingTime-finishingTime > 0 ){
    notification.error({
      message: 'وقت غير صالح',
      description:" يرجى اختيار وقت صحيح"
    });}
    }
    else {
      notification.error({
        message: 'المعلومات ناقصة ',
        description: 'يرجى ملئ كافة المعلومات',
      });
    }
}
  

  const handleSetWorkTime = () => {
    console.log("clinicId")
    console.log(clinicId)


    const formattedStartDate = new Date(startDate).toISOString().substring(0, 10); 
    const formattedEndDate = new Date(endDate).toISOString().substring(0, 10); 
    const formattedStartingTime = moment(startingTime).format('HH:mm');
    const formattedFinishingTime = moment(finishingTime).format('HH:mm');
  
    const dayNames = days.map((day) => day);
  
    const requestBody = {
      startingTime: formattedStartingTime,
      finishingTime: formattedFinishingTime,
      days: dayNames,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  
    fetch(`${baseURL}/doctors/set-work-time/${clinicId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  };

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
              <p className='element'  style={{ fontWeight: 'bold',cursor: 'pointer', backgroundColor: hoveredProfile ? 'white' : 'blue', color: hoveredProfile ? 'orange' : 'white' }} onMouseEnter={handleMouseEnterProfile} onMouseLeave={handleMouseLeaveProfile} onClick={handleProfileClick}>
                <FaUser/> الملف الشخصي
              </p>
              <p className="element" style={{ fontWeight: 'bold',cursor: 'pointer', backgroundColor:  'white' , color:  'orange'}} onMouseEnter={handleMouseEnterClinics} onClick={handleClinicClick} >
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
           <div className='Appoint' style={{textAlign:'center',border:'20px',fontWeight:'bold',backgroundColor:'blue',height:'32px',color:'white'}}>المواعيد </div>
<div>
  
    <div className='date'>
      <div>من</div>
      <div className='ele'>
      <DatePicker 
        selected={startDate}
        onChange={handleChangeStartDate}
        dateFormat="yyyy-MM-dd"
      />
      
   </div>
      </div>
      <div className='date'>
      <div>إلى</div>
      <div className='ele'>
      <DatePicker
        selected={endDate}
        onChange={handleChangeEndDate}
        dateFormat="yyyy-MM-dd"
      />
            </div>
            </div>
            <div className='date'>
            <div>من الساعة </div>
      <TimePicker
        onChange={handleTimeStarting}
        showSecond={false}
        defaultValue={startingTime}
        format="HH:mm"
        use12Hours={false} />
         </div>
         <div className='date'>
            <div>إلى الساعة</div>
      <TimePicker
        onChange={ handleTimeFinishing}
        showSecond={false}
        defaultValue={finishingTime}
        format="HH:mm"
        use12Hours={false} />
</div>
<div>
<div className='check'></div>
<div className='checkbox' >
      <Checkbox.Group onChange={handleDayChange} value={days}>
        <Checkbox value="الأحد">الأحد</Checkbox>
        <Checkbox value="الإثنين">الإثنين</Checkbox>
        <Checkbox value="الثلاثاء">الثلاثاء</Checkbox>
        <Checkbox value="الأربعاء">الأربعاء</Checkbox>
        <Checkbox value="الخميس">الخميس</Checkbox>
        <Checkbox value="الجمعة">الجمعة</Checkbox>
        <Checkbox value="السبت">السبت</Checkbox>
      </Checkbox.Group>
      </div>
<div  className='setwork'>
<div className='check'></div>

{done ? (    <button type="primary" className='Button' onClick={showReserve(clinicId)}>عرض الحجوزات </button>


      ) : ( <Button type="primary" className='Button'  onClick={handleNotify}> تأكيد     </Button>

              )}
    
       

      </div>
</div>
    </div>
    </div>
  </div>

    </div>
  );
}

export default Tjreba;



