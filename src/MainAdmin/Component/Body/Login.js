// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function LoginForm({ setToken }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleEmailChange = (event) => {
//     setEmail(event.target.value);
//   };

//   const handlePasswordChange = (event) => {
//     setPassword(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3000/doctors/login', { email, password });
//       console.log(response.data);
//       setToken(response.data.token);
//       // تنفيذ أي إجراءات إضافية بناءً على الرد

//       // إذا تم تسجيل الدخول بنجاح، يمكنك التوجه إلى صفحة جديدة
//       if (response.status === 201) {
//         navigate('/Home');
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <form  className="form-container"   onSubmit={handleSubmit}>
//         <div>
//           <label>
//             <span>: البريد الإلكتروني</span>
//           </label>
//           <br />
//           <input type="email" value={email} onChange={handleEmailChange} />
//         </div>
//         <br />
//         <div>
//           <label>
//             <span>: كلمة المرور</span>
//           </label>
//           <br />
//           <input type="password" value={password} onChange={handlePasswordChange} />
//         </div>
//         <br />
//         <button type="submit">تسجيل الدخول</button>
//       </form>
//     </div>
//   );
// }

// export default LoginForm;



import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../../../Config';


function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/doctors/login`, { email, password });
      if (response.status === 201) {
      console.log(response.data.loginDetails['access_token']);
      localStorage.setItem('token', response.data.loginDetails['access_token']);
      localStorage.setItem('type', response.data.loginDetails['type']);
      toast.success('تم تسجيل الدخول بنجاح!');
      //const oken =response.data.type;
      //console.log(oken);
      // تنفيذ أي إجراءات إضافية بناءً على الرد

      // إذا تم تسجيل الدخول بنجاح، يمكنك التوجه إلى صفحة جديدة
      if (response.data.loginDetails['type']== 0) {
        navigate('/Home');
      }
      if (response.data.loginDetails['type']== 1) {
      navigate('/SupHome');
      }
      
      if (response.data.loginDetails['type']== 2) {
        navigate('/HomePage');
        }
    }
    } catch (error) {
      if (error.response.status === 401) {
        toast.error(' البريد الالكتروني أو كلمة المرور غير صحيحة!');
    }
    if (error.response.status === 400) {
      toast.error(' لا يمكن أن تكون كلمة السر أو البريد الالكتروني فارغ !');
  }
      console.error(error);
    }
  };
  

  const handleClicksendemail = () => {
    navigate('/SendEmail');  };
  
  return (
    <div className="background-image">
      <form  className="form-container"   onSubmit={handleSubmit}>
        <div>
          <label>
            <span>: البريد الإلكتروني</span>
          </label>
          <br />
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <br />
        <div>
          <label>
            <span>: كلمة المرور</span>
          </label>
          <br />
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <br />
        <button className="button-container" type="submit">تسجيل الدخول</button>
        
        <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/> 

        <button className="button-containers" type="submit" onClick={handleClicksendemail}>اعادة تعيين كلمة المرور</button>

      </form>


    </div>
  );
}

export default LoginForm;