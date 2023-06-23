
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbars from '../Nav/Navbar';
import { useNavigate , useParams } from 'react-router-dom';
import baseURL from '../../../Config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Profiles() {
   
  
        const [token, setToken] = useState('');
      
        const [data, setData] = useState([]);
        const navigate = useNavigate();
      
      
      
        useEffect(() => {
          const storedToken = localStorage.getItem('token');
          if (storedToken) {
            setToken(storedToken);
          }
        }, []);
      
        useEffect(() => {
          if (token) {
            getsubadmin();
          }
        }, [token]);
      
      
        async function getsubadmin() {
          try {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
              navigate('/');
              return;
            }
      
      
           const  response = await axios.get(`${baseURL}/admins/myAccount`, {
              headers: {
                Authorization: 'Bearer ' + storedToken
              }
            });
          
            const subadmins = response.data.myAccount;     
            setData([subadmins]);
          } catch (error) {
            if (error.response.status === 401) {
              navigate('/');
            } else {
              console.error(error);
            }
          }
        }
      
        return (
    
          <div className="all-container" style={{backgroundColor: "#fdf3e3"}}>
            <Navbars />
      
            <div style={{ margin: '20px' }}>
            
        

         
       
      
              <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                  <th style={{ border: '1px solid black', padding: '5px' }}>التسلسل </th>
                    <th style={{ border: '1px solid black', padding: '5px' }}> الاسم الأول</th>
                    <th style={{ border: '1px solid black', padding: '5px' }}>الاسم الأخير</th>
                    <th style={{ border: '1px solid black', padding: '5px' }}>رقم الهاتف</th>
                    <th style={{ border: '1px solid black', padding: '5px' }}>الحساب الالكتروني</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) && data.map((subadmin) => (
                   <tr key={subadmin.adminId}>  
                   <td style={{ border: '1px solid black', padding: '5px' }}>{subadmin.adminId}</td>
                   <td style={{ border: '1px solid black', padding: '5px' }}>
                     {
                       subadmin.firstname
                     }
                   </td>
   
                   <td style={{ border: '1px solid black', padding: '5px' }}>
                     {
                       subadmin.lastname
                     }
                   </td>
   
   
                   <td style={{ border: '1px solid black', padding: '5px' }}>
                   {
                       subadmin.phonenumber
                     }
                   </td>
   
   
   
                   <td style={{ border: '1px solid black', padding: '5px' }}>
                   {
                       subadmin.email
                     }
                   </td>
   

   
                 </tr>
                  ))}
                </tbody>
              </table>
             
            </div>
          </div>
        );
      
      }
      





export default Profiles;