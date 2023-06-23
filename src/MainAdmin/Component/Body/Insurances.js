
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbars from '../Nav/Navbar';
import { useNavigate } from 'react-router-dom';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactModal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../../../Config';


export function MyComponent({ getInsurances }) {
  const [isOpen, setIsOpen] = useState(false);
  const [companyName, setcompanyName] = useState('');
  const token = localStorage.getItem('token');

  function handlecompanyNameChange(event) {
    setcompanyName(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };
    try {debugger;
      const response = await axios.post(
        `${baseURL}/insurances`,
        { companyName },
        { headers }
      );
      if (response.status === 201) {
      console.log(response.data);
      setIsOpen(false);
      getInsurances(); // استدعاء دالة getInsurances()
      toast.success('تمت اضافة البيانات بنجاح!');
      }
    } catch (error) {
      if (error.response.status === 400 && error.response.data.message.includes("companyName should not be empty")) {
        toast.error('لا يمكن أن يكون الحقل فارغ!');
      }
      if (error.response.status === 400 && error.response.data.message.includes("insurance company with the name")) {
        const companyName = error.response.data.message.match(/\"(.+?)\"/)[1];
        toast.error(`شركة التأمين ${companyName} موجودة مسبقاً!`);
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
  <button onClick={openModal}>اضافة شركة تأمين</button>
  <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/>
</div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Form Modal"
      >
        <form onSubmit={handleSubmit}>
          <label htmlFor="companyName">: اسم شركة التأمين</label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={handlecompanyNameChange}
          />
          <button type="submit">اضافة</button>
          
        </form>
        <button onClick={closeModal}>اغلاق</button>
      </ReactModal>
    </div>
  );
}

function Insurances() {
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const [editingRow, setEditingRow] = useState(null);
  const [updatedCompanyName, setUpdatedCompanyName] = useState('');
  const [filterName, setFilterName] = useState('');

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
  }, [token, editingRow, filterName]);

  async function getInsurances() {
    try {debugger;
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }
  
      let response;
      if (filterName) {
        response = await axios.post(`${baseURL}/insurances/filter-by-names`, { filterName }, {
          headers: {
            Authorization: 'Bearer ' + storedToken,
          },
        });
      } else {
        response = await axios.get(`${baseURL}/insurances`, {
          headers: {
            Authorization: 'Bearer ' + storedToken,
          },
        });
      }
  
      const sortedData = response.data.insurances.sort((a, b) => a.insuranceId - b.insuranceId);
      setData(sortedData);
    } catch (error) {
      if (error.response.status === 401) {
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
      const response =   await axios.delete(`${baseURL}/insurances/${insuranceId}`, {
        headers: {
          Authorization: 'Bearer ' + storedToken
        }
      });
      if (response.status === 200) {
      getInsurances();
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

  async function updateInsurance(insuranceId) {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }
      const response = await axios.put(`${baseURL}/insurances/${insuranceId}`, { companyName: updatedCompanyName }, {
        headers: {
          Authorization: 'Bearer ' + storedToken
        }
      });
      if (response.status === 200) {
      setEditingRow(null);
      getInsurances();
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

  function handleEditRowClick(insuranceId, companyName) {
    setEditingRow(insuranceId);
    setUpdatedCompanyName(companyName);
  }

  function handleCancelEditClick() {
    setEditingRow(null);
    setUpdatedCompanyName('');
  }

  function handleUpdatedCompanyNameChange(event) {
    setUpdatedCompanyName(event.target.value);
  }

  return (
    
    <div className="all-container" style={{backgroundColor: "#fdf3e3"}}>
      <Navbars />

      <div style={{ margin: '20px' }}>
      
  
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ flex: 0 }}>
        <input id="filterName" type="text" value={filterName} onChange={handleFilterNameChange} />
      </div>
      <label htmlFor="filterName" style={{ margin: '0 10px' }}>: اسم شركة التأمين</label>
    </div>
    <br />
    <br />
    
      
      <MyComponent getInsurances={getInsurances} />
   
 

        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>التسلسل </th>
              <th style={{ border: '1px solid black', padding: '5px' }}>اسم شركة التأمين</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>التحكم</th>
            </tr>
          </thead>
          <tbody>
            {data.map((insurance) => (
              <tr key={insurance.insuranceId}>
                <td style={{ border: '1px solid black', padding: '5px' }}>{insurance.insuranceId}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {editingRow === insurance.insuranceId ? (
                    <input type="text" value={updatedCompanyName} onChange={handleUpdatedCompanyNameChange} />
                  ) : (
                    insurance.companyName
                  )}
                </td>
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {editingRow === insurance.insuranceId ? (
                    <div>
                      <button onClick={() => updateInsurance(insurance.insuranceId)}>حفظ</button>
                      <button onClick={handleCancelEditClick}>الغاء</button>
                      <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/>                      </div>            ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '70px' }}>
                      <div onClick={() => handleEditRowClick(insurance.insuranceId, insurance.companyName)}>
                        <FontAwesomeIcon icon={faEdit} color="#007bff" />
                      </div>
                      <div onClick={() => deleteInsurance(insurance.insuranceId)}>
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






export default Insurances;

