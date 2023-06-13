
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbars from '../Nav/Navbar';
import { useNavigate } from 'react-router-dom';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactModal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// export function MyComponent({ getInsurances }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [clinicName, setclinicName] = useState('');
//   const token = localStorage.getItem('token');

//   function handleclinicNameChange(event) {
//     setclinicName(event.target.value);
//   }

//   async function handleSubmit(event) {
//     event.preventDefault();
//     const headers = { Authorization: `Bearer ${token}` };
//     try {
//       const response = await axios.post(
//         'http://localhost:3000/insurances',
//         { clinicName },
//         { headers }
//       );
//       if (response.status === 201) {
//       console.log(response.data);
//       setIsOpen(false);
//       getInsurances(); // استدعاء دالة getInsurances()
//       toast.success('تمت اضافة البيانات بنجاح!');
//       }
//     } catch (error) {
//       if (error.response.status === 400) {
//         toast.success('لا يمكن أن يكون الحقل فارغ!');
//       }
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
//   <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/>
// </div>
//       <ReactModal
//         isOpen={isOpen}
//         onRequestClose={closeModal}
//         contentLabel="Form Modal"
//       >
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="clinicName">: اسم شركة التأمين</label>
//           <input
//             id="clinicName"
//             type="text"
//             value={clinicName}
//             onChange={handleclinicNameChange}
//           />
//           <button type="submit">اضافة</button>
          
//         </form>
//         <button onClick={closeModal}>اغلاق</button>
//       </ReactModal>
//     </div>
//   );
// }

function Clinic() {
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const [editingRow, setEditingRow] = useState(null);
  const [updatedclinicName, setUpdatedclinicName] = useState('');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getClinic();
    }
  }, [token, editingRow, filterName]);

  async function getClinic() {
    try {debugger;
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }
  
      let response;
      if (filterName) {
        response = await axios.post('http://localhost:3000/clinics/filter-by-names', { filterName }, {
          headers: {
            Authorization: 'Bearer ' + storedToken,
          },
        });
      } else {
        response = await axios.get('http://localhost:3000/clinics', {
          headers: {
            Authorization: 'Bearer ' + storedToken,
          },
        });
      }
  
      const sortedData = response.data.clinics.sort((a, b) => a.clinicId - b.clinicId);
      setData(sortedData);
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/');
      } else {
        console.error(error);
      }
    }
  }

  async function deleteClinic(clinicId) {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }
      const response =   await axios.delete(`http://localhost:3000/clinics/${clinicId}`, {
        headers: {
          Authorization: 'Bearer ' + storedToken
        }
      });
      if (response.status === 200) {
      getClinic();
      toast.success('تم الحذف  بنجاح!');
      }
    } catch (error) {
      if (error.response.status === 401) {
       navigate('/');
      } else {
        console.error(error);
      }
    }
  }

  async function updateClinic(clinicId) {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }
      const response = await axios.put(`http://localhost:3000/clinics/${clinicId}`, { clinicName: updatedclinicName }, {
        headers: {
          Authorization: 'Bearer ' + storedToken
        }
      });
      if (response.status === 200) {
      setEditingRow(null);
      getClinic();
      toast.success('تم تحديث البيانات بنجاح!');
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.success('لا يمكن أن يكون الحقل فارغ!');
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

  function handleEditRowClick(clinicId, clinicName) {
    setEditingRow(clinicId);
    setUpdatedclinicName(clinicName);
  }

  function handleCancelEditClick() {
    setEditingRow(null);
    setUpdatedclinicName('');
  }

  function handleUpdatedclinicNameChange(event) {
    setUpdatedclinicName(event.target.value);
  }

  return (
    
    <div className="all-container" style={{backgroundColor: "#fdf3e3"}}>
      <Navbars />
      <div style={{ margin: '20px' }}>
      
  
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ flex: 0 }}>
        <input id="filterName" type="text" value={filterName} onChange={handleFilterNameChange} />
      </div>
      <label htmlFor="filterName" style={{ margin: '0 10px' }}>: اسم العيادة التخصصية</label>
    </div>
    <br />
    <br />
    
      
      {/* <MyComponent getInsurances={getInsurances} /> */}
   
 

        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>التسلسل </th>
              <th style={{ border: '1px solid black', padding: '5px' }}>اسم العيادة التخصصية</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>الاختصاص</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>عدد الأطباء في العيادة</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>المحافظة</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>المنطقة</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>التحكم</th>
            </tr>
          </thead>
          <tbody>
            {data.map((Clinic) => (
              <tr key={Clinic.clinicId}>
                <td style={{ border: '1px solid black', padding: '5px' }}>{Clinic.clinicId}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {editingRow === Clinic.clinicId ? (
                    <input type="text" value={updatedclinicName} onChange={handleUpdatedclinicNameChange} />
                  ) : (
                    Clinic.clinicName
                  )}
                </td>
                   {/* //للاختصاص */}
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {
                    Clinic.area.name
                  }
                </td>
                {/* عدد الاطباء */}
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {
                    Clinic.numDoctors
                  }
                </td>

                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {
                    Clinic.area.governorate.name
                  }
                </td>

                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {
                    Clinic.area.name
                  }
                </td>


                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {editingRow === Clinic.clinicId ? (
                    <div>
                      <button onClick={() => updateClinic(Clinic.clinicId)}>حفظ</button>
                      <button onClick={handleCancelEditClick}>الغاء</button>
                      <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/>                      </div>            ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '70px' }}>
                      <div onClick={() => handleEditRowClick(Clinic.clinicId, Clinic.clinicName)}>
                        <FontAwesomeIcon icon={faEdit} color="#007bff" />
                      </div>
                      <div onClick={() => deleteClinic(Clinic.clinicId)}>
                        <FontAwesomeIcon icon={faTrash} color="#dc3545"/>
                        <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/> 
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






export default Clinic;

