import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../../../Config';
let adminIds;

function Sendemail() {
  const [email, setEmail] = useState('');
  const [adminId, setAdminId] = useState(null);

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSendEmail = async (event) => {
    event.preventDefault();

    try {
        
      const response = await axios.post(`${baseURL}/doctors/send-email`, {
        email: email
      });
      setAdminId(response.data.doctorId);
      adminIds=response.data.doctorId;
      console.log(adminIds);
      console.log(response.data);
      toast.success(` ${adminId}    تم ارسال البريد الإلكتروني بنجاح ورقم المسؤول هو !`);
      navigate('/ResetPassword');
    } catch (error) {
        if(error.response && error.response.status === 404 && error.response.data.message.includes("admin not found"))
        {
            toast.error('الحساب غير موجود !');
          }
      console.error(error);
     
    }
  };

  return (
    <div className="background-image">
              <form  className="form-container" onSubmit={handleSendEmail}>


              <div>
          <label>
            <span>: البريد الإلكتروني</span>
          </label>
          <br />
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <button className="button-container" type="submit"> ارسال</button>
        
        <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/> 
      </form>
    </div>
  );
}




export function ResetPassword() {

    const [code, setCode] = useState();
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

  
    const handleCodeChange = (event) => {
      setCode(event.target.value);
    };
  
    const handleNewPasswordChange = (event) => {
      setNewPassword(event.target.value);
    };
 
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
        debugger;
        const response = await axios.post(`${baseURL}/doctors/reset-password`, {
          doctorId: adminIds,
          code: parseInt(code),
          newPassword: newPassword
        });
        toast.success('تم إعادة تعيين كلمة المرور بنجاح!');
        navigate('/');
      } catch (error) {
        toast.error('حدث خطأ أثناء إعادة تعيين كلمة المرور.');
        console.error(error);
      }
    };


    return (
        
        <div    className="background-image">
            
        <form   className="form-container"  onSubmit={handleSubmit}>
        {/* <div>
        <span>: رقم المسؤول</span>
            {adminIds}</div> */}

          {/* <div>
            <label>
              <span>: رقم المسؤول</span>
            </label>
            <br />
            <input type="text" value={doctorId} onChange={handleDoctorIdChange} />
          </div> */}
          <div>
            <label>
              <span>: الرمز</span>
            </label>
            <br />
            <input type="text" value={code} onChange={handleCodeChange} />
          </div>
          <div>
            <label>
              <span>: كلمة المرور الجديدة</span>
            </label>
            <br />
            <input type="password" value={newPassword} onChange={handleNewPasswordChange} />
          </div>

          <br />
          <button  className="button-container" type="submit">إعادة تعيين كلمة المرور</button>
          <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/> 

        </form>
        
      </div>
    );
    
}

export default Sendemail;