import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbars from '../Nav/Navbar';
import { useNavigate } from 'react-router-dom';
import { faEdit} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactModal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function MyComponent({ getSubAdmin }) {
    const [isOpen, setIsOpen] = useState(false);
    const [firstname, setfirstname] = useState('');
    const [lastname, setlastname] = useState('');
    const [phonenumber, setphonenumber] = useState('');
    const [email, setemail] = useState('');

    const token = localStorage.getItem('token');
  
    function handlefirstnameChange(event) {
        setfirstname(event.target.value);
    }
    function handlelastnameChange(event) {
        setlastname(event.target.value);
      }
      function handlephonenumberChange(event) {
        setphonenumber(event.target.value);
      }
      function handleemailChange(event) {
        setemail(event.target.value);
      }
    async function handleSubmit(event) {
      event.preventDefault();
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await axios.post(
          'http://localhost:3000/admins',
          {  firstname ,
            lastname,
            phonenumber,
            email
 },
          { headers }
        );
        if (response.status === 201) {
        console.log(response.data);
        setIsOpen(false);
        getSubAdmin(); // استدعاء دالة getInsurances()
        toast.success('تمت اضافة البيانات بنجاح!');
        }
      } catch (error) {
        if (error.response.status === 400) {
          toast.success(' لا يمكن أن يكون الحقل فارغ أو يكون الحساب الالكتروني (الايميل) موجود مسبقا!');
        }
        console.error(error);
      }
    }
  
    function openModal() {
      setIsOpen(true);
    }
  
    function closeModal() {
      setIsOpen(false);
    }
  
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '10vh' }}>
    <button onClick={openModal}>اضافة مدير فرعي</button>
    <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/>
  </div>
        <ReactModal
          isOpen={isOpen}
          onRequestClose={closeModal}
          contentLabel="Form Modal"
        >
          <form onSubmit={handleSubmit}>
            <label htmlFor="firstname">: اسم المدير الفرعي </label>
            <input
              id="firstname"
              type="text"
              value={firstname}
              onChange={handlefirstnameChange}
            />
            <label htmlFor="lastname">: الكنية الخاصة بالمدير الفرعي </label>
            <input
              id="lastname"
              type="text"
              value={lastname}
              onChange={handlelastnameChange}
            />

            <label htmlFor="phonenumber">: رقم  الهاتف </label>
            <input
              id="phonenumber"
              type="tel"
              value={phonenumber}
              onChange={handlephonenumberChange}
            />

            <label htmlFor="email">:   الحساب الالكتروني (الايميل)</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleemailChange}
            />




            <button type="submit">اضافة</button>
            
          </form>
          <button onClick={closeModal}>اغلاق</button>
        </ReactModal>
      </div>
    );
  }




function SubAdmin() {
    const [data, setData] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();
  
    const [editingRow, setEditingRow] = useState(null);
    const [updatedfirstname, setUpdatedfirstname] = useState('');
    const [updatedlastname, setUpdatedlastname] = useState('');
    const [updatedphonenumber, setUpdatedphonenumber] = useState('');
    const [updatedemail, setUpdatedemail] = useState('');

    const [filterName, setFilterName] = useState('');
  
    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    }, []);
  
    useEffect(() => {
      if (token) {
        getSubAdmin();
      }
    }, [token, editingRow, filterName]);
  
    async function getSubAdmin() {
      try {debugger;
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          navigate('/');
          return;
        }
    
        let response;
        if (filterName) {
          response = await axios.post('http://localhost:3000/admins/filter-by-names', { filterName }, {
            headers: {
              Authorization: 'Bearer ' + storedToken,
            },
          });
        } else {
          response = await axios.get('http://localhost:3000/admins', {
            headers: {
              Authorization: 'Bearer ' + storedToken,
            },
          });
        }
    
        const sortedData = response.data.admins.sort((a, b) => a.adminId - b.adminId);
        setData(sortedData);
      } catch (error) {
        if (error.response.status === 401) {
          navigate('/');
        } else {
          console.error(error);
        }
      }
    }
  

  
    async function updateSubAdmin(adminId) {
      try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          navigate('/');
          return;
        }
        const response =  await axios.put(`http://localhost:3000/admins/update/${adminId}`, { 
            firstname: updatedfirstname ,
            lastname: updatedlastname ,
            phonenumber: updatedphonenumber,
            email: updatedemail 

        
        }, {
          headers: {
            Authorization: 'Bearer ' + storedToken
          }
        });
        if (response.status === 200) {
        setEditingRow(null);
        getSubAdmin();
        toast.success('تم تحديث البيانات بنجاح!');
    }
      } catch (error) {
        if (error.response.status === 400) {
            toast.success(' لا يمكن أن يكون الحقل فارغ أو يكون الحساب الالكتروني (الايميل) موجود مسبقا!');
        }
        if (error.response.status === 401) {
          navigate('/');
        } else {
          console.error(error);
        }
      }
    }
  
    function handleFilterNameChange(event) {
      setFilterName(event.target.value);
    }
  
    function handleEditRowClick(adminId, firstname,lastname,phonenumber,email) {
      setEditingRow(adminId);
      setUpdatedfirstname(firstname);
      setUpdatedlastname(lastname);
      setUpdatedphonenumber(phonenumber);
      setUpdatedemail(email);
    }
  
    function handleCancelEditClick() {
      setEditingRow(null);
      setUpdatedfirstname('');
      setUpdatedlastname('');
      setUpdatedphonenumber('');
      setUpdatedemail('');
    }
  
    function handleUpdatedfirstnameChange(event) {
      setUpdatedfirstname(event.target.value);

    }

    function handleUpdatedlastnameChange(event) {
        setUpdatedlastname(event.target.value);

      }

      function handleUpdatedphonenumber(event) {
        setUpdatedphonenumber(event.target.value);
      }

      function handleUpdatedemailChange(event) {
        setUpdatedemail(event.target.value);
      }
  
    return (
      
      <div className="all-container" style={{backgroundColor: "#fdf3e3"}}>
        <Navbars />
        <div style={{ margin: '20px' }}>
        
    
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: 0 }}>
          <input id="filterName" type="text" value={filterName} onChange={handleFilterNameChange} />
        </div>
        <label htmlFor="filterName" style={{ margin: '0 10px' }}>: اسم المدير الفرعي</label>
      </div>
      <br />
      <br />
      
        
        <MyComponent getSubAdmin={getSubAdmin} />
     
   
  
          <table style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '5px' }}>التسلسل </th>
                <th style={{ border: '1px solid black', padding: '5px' }}>الاسم</th>
                <th style={{ border: '1px solid black', padding: '5px' }}>الكنية</th>
                <th style={{ border: '1px solid black', padding: '5px' }}>رقم الهاتف </th>
                <th style={{ border: '1px solid black', padding: '5px' }}>الايميل</th>
                <th style={{ border: '1px solid black', padding: '5px' }}>التحكم</th>
              </tr>
            </thead>
            <tbody>
              {data.map((subadmin) => (
                <tr key={subadmin.adminId}>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{subadmin.adminId}</td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>
                    {editingRow === subadmin.adminId ? (
                      <input type="text" value={updatedfirstname} onChange={handleUpdatedfirstnameChange} />
                    ) : (
                        subadmin.firstname
                    )}
                  </td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>
                    {editingRow === subadmin.adminId ? (
                      <input type="text" value={updatedlastname} onChange={handleUpdatedlastnameChange} />
                    ) : (
                        subadmin.lastname
                    )}
                  </td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>
                    {editingRow === subadmin.adminId ? (
                      <input type="tel" value={updatedphonenumber} onChange={handleUpdatedphonenumber} />
                    ) : (
                        subadmin.phonenumber
                    )}
                  </td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>
                    {editingRow === subadmin.adminId ? (
                      <input type="email" value={updatedemail} onChange={handleUpdatedemailChange} />
                    ) : (
                        subadmin.email
                    )}
                  </td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>
                    {editingRow === subadmin.adminId ? (
                      <div>
                        <button onClick={() => updateSubAdmin(subadmin.adminId)}>حفظ</button>
                        <button onClick={handleCancelEditClick}>الغاء</button>
                        <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/> 
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '70px' }}>
                        <div onClick={() => handleEditRowClick(subadmin.adminId, subadmin.firstname)}>
                          <FontAwesomeIcon icon={faEdit} color="#007bff" />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         
        </div>
      </div>
    );
}




export default SubAdmin;









// export function MyComponent({ getSubAdmin }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [companyName, setcompanyName] = useState('');
//   const token = localStorage.getItem('token');

//   function handlecompanyNameChange(event) {
//     setcompanyName(event.target.value);
//   }

//   async function handleSubmit(event) {
//     event.preventDefault();
//     const headers = { Authorization: `Bearer ${token}` };
//     try {
//       const response = await axios.post(
//         'http://localhost:3000/insurances',
//         { companyName },
//         { headers }
//       );
//       console.log(response.data);
//       setIsOpen(false);
//       getInsurances(); // استدعاء دالة getInsurances()
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   function openModal() {
//     setIsOpen(true);
//   }

//   function closeModal() {
//     setIsOpen(false);
//   }

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '10vh' }}>
//   <button onClick={openModal}>اضافة شركة تأمين</button>
// </div>
//       <ReactModal
//         isOpen={isOpen}
//         onRequestClose={closeModal}
//         contentLabel="Form Modal"
//       >
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="companyName">: اسم شركة التأمين</label>
//           <input
//             id="companyName"
//             type="text"
//             value={companyName}
//             onChange={handlecompanyNameChange}
//           />
//           <button type="submit">اضافة</button>
//         </form>
//         <button onClick={closeModal}>اغلاق</button>
//       </ReactModal>
//     </div>
//   );
// }



