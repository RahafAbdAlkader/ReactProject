// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function Insurances() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     getInsurances();
//   }, []);

//   async function getInsurances() {
//     try {
//       const response = await axios.get('http://localhost:3000/insurances');
//       setData(response.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   return (
//     <>
//       <table>
//         <thead>
//           <tr>
//             <th>التسلسل</th>
//             <th>اسم شركة التأمين</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr key={index}>
//               <td>{row.insuranceId}</td>
//               <td>{row.companyName}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </>
//   );
// }






// export default Insurances






// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbars from '../Nav/Navbar';
// import MyComponent from './AddInsurances';

// function Insurances({ token }) {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     if (token) {
//       getInsurances();
//     }
//   }, [token]);

//   async function getInsurances() {
//     try {
//       const response = await axios.get('http://localhost:3000/insurances', {
//         headers: {
//           Authorization: 'Bearer ' + token
//         }
//       });
//       setData(response.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   }



//   return (
//     <>
//     <Navbars/>
//     <MyComponent token={token}/>
//     <br />
//     <br />
//     <br />
//     <br />
    
//       <table>
//         <thead>
//           <tr>
//             <th>التسلسل</th>
//             <th>اسم شركة التأمين</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr key={index}>
//               <td>{row.insuranceId}</td>
//               <td>{row.companyName}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </>
//   );
// }

// export default Insurances;


import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbars from '../Nav/Navbar';
import MyComponent from './AddInsurances';
import { useNavigate } from 'react-router-dom';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Insurances() {
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const [editingRow, setEditingRow] = useState(null);
  const [updatedCompanyName, setUpdatedCompanyName] = useState('');


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getInsurances();
    }
  },  [token, editingRow]);

  async function getInsurances() {
    try {
     const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا لم يكن التوكن موجودًا
        navigate('/');
        return;
      }
      const response = await axios.get('http://localhost:3000/insurances', {
        headers: {
          Authorization: 'Bearer ' + storedToken
        }
      });
      //setData(response.data.clinics);
      const sortedData = response.data.clinics.sort((a, b) => a.insuranceId - b.insuranceId); // ترتيب البيانات بالتسلسل
      setData(sortedData);
    } catch (error) {
      if (error.response.status === 401) {
        // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا كان التوكن غير صالح
        navigate('/');
      } else {
        console.error(error);
      }
    }
  }

  async function deleteInsurance(insuranceId) {
    try {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
    navigate('/');
    return;
    }
    await axios.delete(`http://localhost:3000/insurances/${insuranceId}`, {
  headers: {
    Authorization: 'Bearer ' + storedToken
  }
    });
    getInsurances(); // إعادة جلب البيانات بعد الحذف
    } catch (error) {
    if (error.response.status === 401) {
    navigate('/');
    } else {
    console.error(error);
    }
    }
  }


  async function updateInsurance(insuranceId) {
    try {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
    navigate('/');
    return;
    }
    await axios.put(`http://localhost:3000/insurances/${insuranceId}`, { companyName: updatedCompanyName },{
      headers: {
        Authorization: 'Bearer ' + storedToken
      }
    });
    setEditingRow(null);
    setUpdatedCompanyName('');
    } catch (error) {
    if (error.response.status === 401) {
    navigate('/');
    } else {
    console.error(error);
    }
    }
    }

    return (
      <>
        <Navbars />
        <MyComponent token={token} />
        <br />
        <br />
        <br />
        <br />
    
        <table>
      <thead>
        <tr>
        <th>التسلسل</th>
          <th>اسم شركة التأمين</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.insuranceId}</td>
            <td>
              {editingRow === row.insuranceId ? (
                <input
                  type="text"
                  value={updatedCompanyName}
                  onChange={(e) => setUpdatedCompanyName(e.target.value)}
                />
              ) : (
                row.companyName
              )}
            </td>
             <td>
              {editingRow === row.insuranceId ? (
                <button onClick={() => updateInsurance(row.insuranceId)}>حفظ</button>
              ) : (
  <div  onClick={() => setEditingRow(row.insuranceId)}>
  <FontAwesomeIcon icon={faEdit} color="#007bff"/>
        </div>
              )}
            </td>
             <td> 
  <div  onClick={() => deleteInsurance(row.insuranceId)}>
  <FontAwesomeIcon icon={faTrash} color="#dc3545"  />
        </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
    );
  }

export default Insurances;


