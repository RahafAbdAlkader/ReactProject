
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbars from '../Nav/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactModal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../../../Config';
//الاختصاصات الرئيسية
function Specialty() {
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const [editingRow, setEditingRow] = useState(null);
  const [updatedspecialtyName, setUpdatedspecialtyName] = useState('');
  const [filterName, setFilterName] = useState('');

  const { specialtyId } = useParams(); // استخراج id الاختصاص الرئيسي من الURL
  const [subSpecialtyData, setSubSpecialtyData] = useState([]); // حالة داخلية لتخزين البيانات المسترجعة من API جديدة

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getspecialty();
    }
  }, [token, editingRow, filterName]);

  useEffect(() => {
    if (token) {
      //getSubSpecialties();
    }
  }, [token, specialtyId]); // جلب البيانات المتعلقة بالاختصاص الفرعي عندما يتم تغيير id الاختصاص الرئيسي


  async function getspecialty() {
    try {debugger;
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا لم يكن التوكن موجودًا
        navigate('/');
        return;
      }
      let response;
      if (filterName) {
        response = await axios.post(`${baseURL}/specialties/filter-by-names`, { filterName }, {
          headers: {
            Authorization: 'Bearer ' + storedToken,
          },
        });
        const sortedData = response.data.specialties.sort((a, b) => a.specialtyId - b.specialtyId); // ترتيب البيانات بالتسلسل
        setData(sortedData);
      } else {
        response = await axios.get(`${baseURL}/specialties`, {
        headers: {
          Authorization: 'Bearer ' + storedToken,
          },
        });
        const sortedData = response.data.sort((a, b) => a.specialtyId - b.specialtyId); // ترتيب البيانات بالتسلسل
        setData(sortedData);

      }

    } catch (error) {
      if (error.response.status === 401) {
        // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا كان التوكن غير صالح
        navigate('/');
      } else {
        console.error(error);
      }
    }
  }
  

  async function deletespecialty(specialtyId) {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }
      const response =  await axios.delete(`${baseURL}/specialties/${specialtyId}`, {
        headers: {
          Authorization: 'Bearer ' + storedToken
        }
      });
      getspecialty(); // إعادة جلب البيانات بعد الحذف
      toast.success('تم الحذف  بنجاح!');

    } catch (error) {
      if (error.response.status === 401) {
        navigate('/');
      } else {
        console.error(error);
      }
    }
  }


  async function updatespecialty(specialtyId) {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }
      const response = await axios.put(`${baseURL}/specialties/${specialtyId}`, { specialtyName: updatedspecialtyName }, {
        headers: {
          Authorization: 'Bearer ' + storedToken
        }
      });
      if (response.status === 200) {
      setEditingRow(null);
      setUpdatedspecialtyName('');
      toast.success('تم تحديث البيانات بنجاح!');
      }
    } catch (error) {

      if (error.response.status === 400 ) {

      toast.error('لا يمكن أن يكون الحقل فارغ!');
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

  function handleEditRowClick(specialtyId, specialtyName) {
    setEditingRow(specialtyId);
    setUpdatedspecialtyName(specialtyName);
  }

  function handleCancelEditClick() {
    setEditingRow(null);
    setUpdatedspecialtyName('');
  }

  function handleUpdatedspecialtyNameChange(event) {
    setUpdatedspecialtyName(event.target.value);
  }



  return (
    
    <div className="all-container" style={{backgroundColor: "#fdf3e3"}}>
      <Navbars />
      <div style={{ margin: '20px' }}>
      
  
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ flex: 0 }}>
        <input id="filterName" type="text" value={filterName} onChange={handleFilterNameChange} />
      </div>
      <label htmlFor="filterName" style={{ margin: '0 10px' }}>:  الاختصاص الرئيسي</label>
    </div>
    <br />
    <br />
    
      
      <MyComponentSpecialty getspecialty={getspecialty} />
   
 

        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>التسلسل </th>
              <th style={{ border: '1px solid black', padding: '5px' }}> الاختصاص الرئيسي</th>
              <th style={{ border: '1px solid black', padding: '5px' }}> الاختصاصات الفرعية</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>التحكم</th>
            </tr>
          </thead>
          <tbody>
            {data.map((specialty) => (
              <tr key={specialty.specialtyId}>
                <td style={{ border: '1px solid black', padding: '5px' }}>{specialty.specialtyId}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {editingRow === specialty.specialtyId ? (
                    <input type="text" value={updatedspecialtyName} onChange={handleUpdatedspecialtyNameChange} />
                  ) : (
                    specialty.specialtyName
                  )}
                </td>

                <td style={{ border: '1px solid black', padding: '5px' }}>
                {editingRow !== specialty.specialtyId ? (
                  // تحويل المستخدم إلى الصفحة الجديدة عند النقر على الزر "عرض"
                  <button onClick={() => {
                    navigate(`/specialties/${specialty.specialtyId}`);
                  }}>عرض</button>
                ) : null}
              </td>


                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {editingRow === specialty.specialtyId ? (
                    <div>
                      <button onClick={() => updatespecialty(specialty.specialtyId)}>حفظ</button>
                      <button onClick={handleCancelEditClick}>الغاء</button>
                      <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/> 

                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '70px' }}>
                      <div onClick={() => handleEditRowClick(specialty.specialtyId, specialty.specialtyName)}>
                        <FontAwesomeIcon icon={faEdit} color="#007bff" />
                      </div>
                      <div onClick={() => deletespecialty(specialty.specialtyId)}>
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



//الاختصاصات الفرعية
export function Subspecialty() {
  
  const [token, setToken] = useState('');

  const { specialtyId } = useParams();
  const [subSpecialtyData, setSubSpecialtyData] = useState([]);
  const navigate = useNavigate();

  const [editingRow, setEditingRow] = useState(null);
  const [updatedsubSpecialtyName, setUpdatedsubSpecialtyName] = useState('');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getSubSpecialties();
    }
  }, [token, editingRow, filterName]);

  async function getSubSpecialties() {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }

      let response;
      if (filterName) {
        response = await axios.post(`${baseURL}/subSpecialties/filter-by-names/${specialtyId}`, { filterName }, {
          headers: {
            Authorization: 'Bearer ' + storedToken,
          },
        });

      }else {
       response = await axios.get(`${baseURL}/specialties/${specialtyId}/subSpecialties`, {
        headers: {
          Authorization: 'Bearer ' + storedToken
        }
      });
    }
    const sortedData = response.data.subSpecialties.sort((a, b) => a.subSpecialtyId - b.subSpecialtyId); // ترتيب البيانات بالتسلسل
    setSubSpecialtyData(sortedData);
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/');
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    getSubSpecialties();
  }, [specialtyId]);


  async function deletesubspecialty(id) {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }
      const response =    await axios.delete(`${baseURL}/subSpecialties/${id}`, {
        headers: {
          Authorization: 'Bearer ' + storedToken
        }
      });
      if (response.status === 200) {
      getSubSpecialties(); // إعادة جلب البيانات بعد الحذف
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

  async function updatesubspecialty(id) {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }
      const response = await axios.put(`${baseURL}/subSpecialties/${id}`, { subSpecialtyName: updatedsubSpecialtyName }, {
        headers: {
          Authorization: 'Bearer ' + storedToken
        }
      });
      if (response.status === 200) {
      setEditingRow(null);
      setUpdatedsubSpecialtyName('');
      getSubSpecialties(); // تحديث الاختصاصات الفرعية
      toast.success('تم تحديث البيانات بنجاح!');
    }
    } catch (error) {

      if (error.response.status === 400 ) {

      toast.error('لا يمكن أن يكون الحقل فارغ!');
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

  function handleEditRowClick(subSpecialtyId, subSpecialtyName) {
    setEditingRow(subSpecialtyId);
    setUpdatedsubSpecialtyName(subSpecialtyName);
  }

  function handleCancelEditClick() {
    setEditingRow(null);
    setUpdatedsubSpecialtyName('');
  }

  function handleUpdatedsubspecialtyNameChange(event) {
    setUpdatedsubSpecialtyName(event.target.value);
  }

  return (
    
    <div className="all-container" style={{backgroundColor: "#fdf3e3"}}>
      <Navbars />
      <div style={{ margin: '20px' }}>
      
  
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ flex: 0 }}>
        <input id="filterName" type="text" value={filterName} onChange={handleFilterNameChange} />
      </div>
      <label htmlFor="filterName" style={{ margin: '0 10px' }}>:  الاختصاص الفرعي</label>
    </div>
    <br />
    <MyComponentsubSpecialty getSubSpecialties={getSubSpecialties} />

    
      
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>التسلسل </th>
              <th style={{ border: '1px solid black', padding: '5px' }}> الاختصاص الفرعي</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>التحكم</th>
            </tr>
          </thead>
          <tbody>
            {subSpecialtyData.map((subspecialty) => (
              <tr key={subspecialty.subSpecialtyId}>
                <td style={{ border: '1px solid black', padding: '5px' }}>{subspecialty.subSpecialtyId}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {editingRow === subspecialty.subSpecialtyId ? (
                    <input type="text" value={updatedsubSpecialtyName} onChange={handleUpdatedsubspecialtyNameChange} />
                  ) : (
                    subspecialty.subSpecialtyName
                  )}
                </td>
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {editingRow === subspecialty.subSpecialtyId ? (
                    <div>
                      <button onClick={() => updatesubspecialty(subspecialty.subSpecialtyId)}>حفظ</button>
                      <button onClick={handleCancelEditClick}>الغاء</button>
                      <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/> 

                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '70px' }}>
                      <div onClick={() => handleEditRowClick(subspecialty.subSpecialtyId, subspecialty.subSpecialtyName)}>
                        <FontAwesomeIcon icon={faEdit} color="#007bff" />
                      </div>
                      <div onClick={() => deletesubspecialty(subspecialty.subSpecialtyId)}>
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

//اضافة اختصاص فرعي
export function MyComponentsubSpecialty({ getSubSpecialties }) {
  const [isOpen, setIsOpen] = useState(false);
  const [subSpecialtyName, setsubSpecialtyName] = useState('');
  const { specialtyId } = useParams();
  const token = localStorage.getItem('token');

  function handlesubSpecialtyNameChange(event) {
    setsubSpecialtyName(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await axios.post(
        `${baseURL}/subSpecialties/${specialtyId}`,
        { subSpecialtyName },
        { headers }
      );
      if (response.status === 201) {
      console.log(response.data);
      setIsOpen(false);
      getSubSpecialties(); // استدعاء دالة getInsurances()
      toast.success('تمت اضافة البيانات بنجاح!');
      }
    } catch (error) {
      if (error.response.status === 409 && error.response.data.message.includes("this subSpecialty is alreadyExists")) {
        toast.error('الاختصاص الفرعي موجود مسبقا!');
      }
      if (error.response.status === 400 && error.response.data.message.includes("subSpecialtyName should not be empty")) {

      toast.error('لا يمكن أن يكون الحقل فارغ!');
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
  <button onClick={openModal}>اضافة اختصاص فرعي</button>
  <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/> 

</div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Form Modal"
      >
        <form onSubmit={handleSubmit}>
          <label htmlFor="subSpecialtyName">:  الاختصاص الفرعي</label>
          <input
            id="subSpecialtyName"
            type="text"
            value={subSpecialtyName}
            onChange={handlesubSpecialtyNameChange}
          />
          <button type="submit">اضافة</button>
        </form>
        <button onClick={closeModal}>اغلاق</button>
      </ReactModal>
    </div>
  );
}


export default Specialty;

//اضافة اختصاص رئيسي
export function MyComponentSpecialty({ getspecialty }) {
  const [isOpen, setIsOpen] = useState(false);
  const [specialtyName, setspecialtyName] = useState('');
  const token = localStorage.getItem('token');

  function handlespecialtyNameChange(event) {
    setspecialtyName(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await axios.post(
        `${baseURL}/specialties`,
        { specialtyName },
        { headers }
      );
      if (response.status === 201) {
      console.log(response.data);
      setIsOpen(false);
      getspecialty(); // استدعاء دالة getInsurances()
      toast.success('تمت اضافة البيانات بنجاح!');
      }
    } catch (error) {
      if (error.response.status === 400 && error.response.data.message.includes("Specialty name must be unique")) {
        toast.error('الاختصاص الرئيسي موجود مسبقا!');
      }
      if (error.response.status === 400 && error.response.data.message.includes("specialtyName should not be empty")) {

      toast.error('لا يمكن أن يكون الحقل فارغ!');
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
  <button onClick={openModal}>اضافة اختصاص رئيسي</button>
  <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/> 

</div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Form Modal"
      >
        <form onSubmit={handleSubmit}>
          <label htmlFor="specialtyName">:  الاختصاص الرئيسي</label>
          <input
            id="specialtyName"
            type="text"
            value={specialtyName}
            onChange={handlespecialtyNameChange}
          />
          <button type="submit">اضافة</button>
        </form>
        <button onClick={closeModal}>اغلاق</button>
      </ReactModal>
    </div>
  );
}










