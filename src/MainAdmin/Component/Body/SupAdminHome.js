import React from "react";
import './Css/MainAdminHome.css';
import { FaUserMd ,FaClinicMedical,FaChartBar} from 'react-icons/fa';
import { AiOutlineTeam} from 'react-icons/ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faShield } from '@fortawesome/free-solid-svg-icons';
import Navbars from "../Nav/Navbar";
import { useNavigate } from 'react-router-dom';
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons'
import { faStethoscope } from '@fortawesome/free-solid-svg-icons'
import Doctor from '../../../Assets/Doctor2.jpg';
const SupHome = () => {
  return (
    <div className="home-container" style={{backgroundImage: "url(" + Doctor + ")", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center"}}>
      <Navbars />
      <MyComponent />
      <MyComponents />
    </div>
  );
};
export const MyComponent = () => {

    const navigate = useNavigate();
    const handleClickSubAdmin = () => {
      navigate('/SubAdmin');  };
  
    const handleClick = () => {
      window.location.href = 'https://example.com';
    };
  
    return (
      <div className="icons-container">
        <div className="icon-with-name" onClick={handleClick}>
          <FaUserMd className="icon" />
          <span>الأطباء</span>
        </div>
        <div className="icon-with-name" onClick={handleClick}>
          <FaClinicMedical className="icon" />
          <span>  العيادات التخصصية</span>
        </div>
        <div className="icon-with-name" onClick={handleClickSubAdmin}>
          <AiOutlineTeam className="icon" />
          <span>المدراء الفرعيين</span>
        </div>
      </div>
    );
  };
  
  export const MyComponents = () => {
    const navigate = useNavigate();
    const handleClickInsurances = () => {
      navigate('/Insurances');  };
      const handleClickspecialties = () => {
        navigate('/specialty');  };
  
    return (
      <div className="icons-containers">
        <div className="icon-with-names" onClick={handleClickInsurances}>
          <FaChartBar className="icons" />
          <span>التقارير</span>
        </div>
        <div className="icon-with-names" onClick={handleClickspecialties}>
        <FontAwesomeIcon icon={faStethoscope} className="iconF" />
          {/* <AiOutlineMedicineBox className="icons" /> */}
          <span> الاختصاصات الطبية</span>
        </div>
        <div className="icon-with-names" onClick={handleClickInsurances}>
        <FontAwesomeIcon icon={faHandHoldingHeart} className="iconF" />
  
          {/* <FontAwesomeIcon icon={faShield}  className="iconF" /> */}
          <span>شركات التأمين</span>
        </div>
      </div>
    );
  };






export default SupHome;

