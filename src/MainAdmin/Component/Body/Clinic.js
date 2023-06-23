
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbars from '../Nav/Navbar';
import { useNavigate , useParams } from 'react-router-dom';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactModal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleMap, Marker,useLoadScript} from "@react-google-maps/api";
import baseURL from '../../../Config';
ReactModal.setAppElement('#root');

const customStyles = {
  content: {
    width: '60%',
    height: '80%',
    margin: 'auto',
  },
};



function MyMap({ onLatLngStateChange }) {
    
    const { isLoaded } = useLoadScript({googleMapsApiKey: "AIzaSyDVF41CgrTFjwNaueGcVnPkELfZHcYyh58"});
    const [latLngState, setLatLngState] = useState({ lat: null, lng: null });
    if (!isLoaded) return <div>Loading...</div>;

    const handleMapClick = (event) => {
        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();
        setLatLngState({ lat, lng });
        onLatLngStateChange({ lat, lng }); // تحديث الحالة في MyComponent
        console.log(`Latitude: ${lat}`);
        console.log(`Longitude: ${lng}`);
      };
  
      return (
        <GoogleMap
          zoom={10}
          center={{ lat: 33.49176691222714, lng: 36.29683021456003 }}
          mapContainerClassName="mapContainer"
          onClick={handleMapClick}
        >
          {latLngState.lat && latLngState.lng && (
            <Marker position={latLngState} />
          )}
        </GoogleMap>
      );
    }



  export function MyComponent({ getClinic }) {
    const [isOpen, setIsOpen] = useState(false);
    const [clinicName, setclinicName] = useState("");
    const [governorates, setGovernorates] = useState([]);
    const [selectedGovernorate, setSelectedGovernorate] = useState("");
    const [areas, setAreas] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState("");

    const token = localStorage.getItem("token");


    const [latLngState, setLatLngState] = useState({ lat: null, lng: null }); 
        const navigate = useNavigate();
  
    useEffect(() => {
      fetch(`${baseURL}/governorates`)
        .then((response) => response.json())
        .then((data) => setGovernorates(data.governorates))
        .catch((error) => console.error(error));
    }, []);
  
    const handleGovernorateChange = (event) => {
      const selectedGovernorateId = event.target.value;
      setSelectedGovernorate(selectedGovernorateId);
  
      fetch(
        `${baseURL}/governorates/${selectedGovernorateId}/areas`
      )
        .then((response) => response.json())
        .then((data) => setAreas(data.Areas))
        .catch((error) => console.error(error));
    };
  
    const handleSelectChange = (event) => {
      setSelectedSpecialty(event.target.value);
    };
    
    function handleclinicNameChange(event) {
      setclinicName(event.target.value);
    }
  

      function handleLatLngStateChange(latLng) {
        setLatLngState(latLng);
      }
      async function handleSubmit(event) {
        event.preventDefault();
        try {
          
          const response = await axios.post(
            `${baseURL}/clinics/${selectedGovernorate}/${selectedSpecialty}`,
            {
              clinicName,
              Latitude: latLngState.lat,
              Longitude: latLngState.lng,
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          closeModal();
          getClinic(response.data.clinic);
          toast.success('تمت اضافة البيانات بنجاح!');
        } catch (error) {
          if (error.response.status === 400 || error.response.status === 404) {
            toast.error('لا يمكن أن يكون الحقل فارغ!');
          }
            console.log(error.response.data.message);
          console.error(error);
        }
      }
  
    useEffect(() => {
      const fetchSpecialties = async ()=> {
        const headers = { Authorization: `Bearer ${token}` };
        try {
          const response = await axios.get(
            `${baseURL}/specialties`,
            { headers }
          );
          const sortedData = response.data.sort(
            (a, b) => a.specialtyId - b.specialtyId
          );
          setSpecialties(sortedData);
        } catch (error) {
          if (error.response.status === 401) {
            // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا كان التوكن غير صالح
            navigate("/");
          } else {
            console.error(error);
          }
        }
      };
  
      fetchSpecialties();
    }, [token]);
  
    function openModal() {
      setIsOpen(true);
    }
  
    function closeModal() {
      setIsOpen(false);
    }
  
    return (
      <div>
        <div
// className="mapContainer"
        >
          <button onClick={openModal}>اضافة عيادة تخصصية</button>
          <ToastContainer
            position="top-center"
            className="Toastify__toast-container--top-center"
          />
        </div>
        <ReactModal
           isOpen={isOpen}
           onRequestClose={closeModal}
           contentLabel="Form Modal"
           style={customStyles}
           contentStyle={customStyles.content}
        >
          <form onSubmit={handleSubmit}>
            <label htmlFor="clinicName">: اسم العيادة التخصصية </label>
            <input
              id="clinicName"
              type="text"
              value={clinicName}
              onChange={handleclinicNameChange}
            />
            <label htmlFor="governorate">: المحافظة </label>
            <select
              id="governorate-select"
              value={selectedGovernorate}
              onChange={handleGovernorateChange}
            >
              <option value="">Select Governorate</option>
              {Array.isArray(governorates) &&
                governorates.map((governorate) => (
                  <option
                    key={governorate.governorateId}
                    value={governorate.governorateId}
                  >
                    {governorate.name}
                  </option>
                ))}
            </select>
  
            <label htmlFor="area-select">: المنطقة </label>
            <select id="area-select">
              <option value="">Select Area</option>
              {Array.isArray(areas) &&
                areas.map((area) => (
                  <option key={area.areaId} value={area.name}>
                    {area.name}
                  </option>
                ))}
            </select>
            <label htmlFor="specialty-select">:   اختصاص العيادة</label>
            <select value={selectedSpecialty} onChange={handleSelectChange}>
              <option value="">-- اختر التخصص --</option>
              {specialties.map((specialty) => (
                <option key={specialty.specialtyId} value={specialty.specialtyId}>
                  {specialty.specialtyName}
                </option>
              ))}
            </select>
  
            <MyMap onLatLngStateChange={handleLatLngStateChange} />         
          <p>Latitude: {latLngState.lat}</p>
          <p>Longitude: {latLngState.lng}</p>
            <button type="submit">اضافة</button>
          </form>
         
          <button onClick={closeModal}>اغلاق</button>
        </ReactModal>
      </div>
    );
  }


//   export function MyComponentEdit({ getClinic }) {
//     const [isOpen, setIsOpen] = useState(false);
//     const [clinicName, setclinicName] = useState("");
//     const [governorates, setGovernorates] = useState([]);
//     const [selectedGovernorate, setSelectedGovernorate] = useState("");
//     const [areas, setAreas] = useState([]);
//     const [specialties, setSpecialties] = useState([]);
//     const [selectedSpecialty, setSelectedSpecialty] = useState("");

//     const token = localStorage.getItem("token");


//     const [latLngState, setLatLngState] = useState({ lat: null, lng: null }); 
//         const navigate = useNavigate();
  
//     useEffect(() => {
//       fetch("http://localhost:3000/governorates")
//         .then((response) => response.json())
//         .then((data) => setGovernorates(data.governorates))
//         .catch((error) => console.error(error));
//     }, []);
  
//     const handleGovernorateChange = (event) => {
//       const selectedGovernorateId = event.target.value;
//       setSelectedGovernorate(selectedGovernorateId);
  
//       fetch(
//         `http://localhost:3000/governorates/${selectedGovernorateId}/areas`
//       )
//         .then((response) => response.json())
//         .then((data) => setAreas(data.Areas))
//         .catch((error) => console.error(error));
//     };
  
//     const handleSelectChange = (event) => {
//       setSelectedSpecialty(event.target.value);
//     };
    
//     function handleclinicNameChange(event) {
//       setclinicName(event.target.value);
//     }
  
//     function handleLatLngStateChange(latLng) {
//         setLatLngState(latLng);
//       }
  
//       async function handleSubmit(event) {
//         event.preventDefault();
//         try {debugger;
//           const response = await axios.post(
//             `http://localhost:3000/clinics/${selectedGovernorate}/${selectedSpecialty}`,
//             {
//               clinicName,
//               Latitude: latLngState.lat,
//               longitude: latLngState.lng,
//             },
//             {
//               headers: { Authorization: `Bearer ${token}` }
//             }
//           );
//           closeModal();
//           getClinic(response.data.clinic);
//         } catch (error) {
//             console.log(error.response.data.message);
//           console.error(error);
//         }
//       }
  
//     useEffect(() => {
//       const fetchSpecialties = async ()=> {
//         const headers = { Authorization: `Bearer ${token}` };
//         try {
//           const response = await axios.get(
//             "http://localhost:3000/specialties",
//             { headers }
//           );
//           const sortedData = response.data.sort(
//             (a, b) => a.specialtyId - b.specialtyId
//           );
//           setSpecialties(sortedData);
//         } catch (error) {
//           if (error.response.status === 401) {
//             // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا كان التوكن غير صالح
//             navigate("/");
//           } else {
//             console.error(error);
//           }
//         }
//       };
  
//       fetchSpecialties();
//     }, [token]);
  
//     function openModal() {
//       setIsOpen(true);
//     }
  
//     function closeModal() {
//       setIsOpen(false);
//     }
  
//     return (
//       <div>
//         <div
// // className="mapContainer"
//         >
//           <button onClick={openModal}>اضافة عيادة تخصصية</button>
//           <ToastContainer
//             position="top-center"
//             className="Toastify__toast-container--top-center"
//           />
//         </div>
//         <ReactModal
//            isOpen={isOpen}
//            onRequestClose={closeModal}
//            contentLabel="Form Modal"
//            style={customStyles}
//            contentStyle={customStyles.content}
//         >
//           <form onSubmit={handleSubmit}>
//             <label htmlFor="clinicName">: اسم العيادة التخصصية </label>
//             <input
//               id="clinicName"
//               type="text"
//               value={clinicName}
//               onChange={handleclinicNameChange}
//             />
//             <label htmlFor="governorate">: المحافظة </label>
//             <select
//               id="governorate-select"
//               value={selectedGovernorate}
//               onChange={handleGovernorateChange}
//             >
//               <option value="">Select Governorate</option>
//               {Array.isArray(governorates) &&
//                 governorates.map((governorate) => (
//                   <option
//                     key={governorate.governorateId}
//                     value={governorate.governorateId}
//                   >
//                     {governorate.name}
//                   </option>
//                 ))}
//             </select>
  
//             <label htmlFor="area-select">: المنطقة </label>
//             <select id="area-select">
//               <option value="">Select Area</option>
//               {Array.isArray(areas) &&
//                 areas.map((area) => (
//                   <option key={area.areaId} value={area.name}>
//                     {area.name}
//                   </option>
//                 ))}
//             </select>
//             <label htmlFor="specialty-select">:   اختصاص العيادة</label>
//             <select value={selectedSpecialty} onChange={handleSelectChange}>
//               <option value="">-- اختر التخصص --</option>
//               {specialties.map((specialty) => (
//                 <option key={specialty.specialtyId} value={specialty.specialtyId}>
//                   {specialty.specialtyName}
//                 </option>
//               ))}
//             </select>
  
//             <MyMap onLatLngStateChange={handleLatLngStateChange} />          // تغيير هذه الأسماء أيضًا
//           <p>Latitude: {latLngState.lat}</p>
//           <p>Longitude: {latLngState.lng}</p>
//             <button type="submit">اضافة</button>
//           </form>
         
//           <button onClick={closeModal}>اغلاق</button>
//         </ReactModal>
//       </div>
//     );
//   }





function Clinics() {
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const [editingRow, setEditingRow] = useState(null);
  const [updatedclinicName, setUpdatedclinicName] = useState('');
  const [filterName, setFilterName] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState([]); // إضافة حالة لتخزين الاختصاص المحدد
  const { clinicId } = useParams();

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


  // function handleGovernorateChange(event) {
  //   const governorateId = event.target.value;
  //   setSelectedGovernorate(governorateId);
  // }

  useEffect(() => {
    const fetchSpecialties = async ()=> {
      try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا لم يكن التوكن موجودًا
          navigate('/');
          return;
        }
        const response = await axios.get(
          "http://localhost:3000/specialties", {
            headers: {
              Authorization: 'Bearer ' + storedToken,
              },}
        );
        const sortedData = response.data.sort(
          (a, b) => a.specialtyId - b.specialtyId
        );
        setSelectedSpecialty(sortedData);
      } catch (error) {
        if (error.response.status === 401) {
          // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا كان التوكن غير صالح
          navigate("/");
        } else {
          console.error(error);
        }
      }
    };

    fetchSpecialties();
  }, [token]);

  async function getClinic() {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }
  
      let response;
      if (filterName) {
        response = await axios.post(`${baseURL}/clinics/filter-by-names`, { filterName }, {
          headers: {
            Authorization: 'Bearer ' + storedToken,
          },
        });
      } else {
        response = await axios.get(`${baseURL}/clinics`, {
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
      const response =   await axios.delete(`${baseURL}/clinics/${clinicId}`, {
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

  // تحديث الاختصاص المحدد بعد النقر على حقل الاختصاص
  function handleSpecialtyClick(specialty) {
    setSelectedSpecialty(specialty);
  }

  // تحديث القيمة في قاعدة البيانات عند النقر على زر الحفظ
  async function handleSaveClickSpecialty(clinicId) {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }
      const response = await axios.put(`${baseURL}/clinics/${clinicId}/specialties/${selectedSpecialty.specialtyId}`,{},{
        headers: {
          Authorization: 'Bearer ' + storedToken
        }
      });
      if (response.status === 200) {
        setSelectedSpecialty(null); // إعادة تعيين الاختصاص المحدد بعد الحفظ
        setEditingRow(null);
        getClinic();
        toast.success('تم التحديث بنجاح!');
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/');
      } else {
        console.error(error);
      }
    }
  }

    // تحديث القيمة في قاعدة البيانات عند النقر على زر الحفظ
    async function handleSaveClickArea(clinicId) {
      try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          navigate('/');
          return;
        }
        const response = await axios.put(`${baseURL}/clinics/${clinicId}/${selectedArea.areaId}`,{},{
          headers: {
            Authorization: 'Bearer ' + storedToken
          }
        });
        if (response.status === 200) {
          setSelectedSpecialty(null); // إعادة تعيين الاختصاص المحدد بعد الحفظ
          setEditingRow(null);
          getClinic();
          toast.success('تم التحديث بنجاح!');
        }
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
      
  
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ flex: 0 }}>
        <input id="filterName" type="text" value={filterName} onChange={handleFilterNameChange} />
      </div>
      <label htmlFor="filterName" style={{ margin: '0 10px' }}>: اسم العيادة التخصصية</label>
    </div>
    <br />
    <br />
    
      
      <MyComponent getClinic={getClinic} />

      {/* <MyComponentEdit getClinic={getClinic} /> */}

 

        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>التسلسل </th>
              <th style={{ border: '1px solid black', padding: '5px' }}>اسم العيادة التخصصية</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>الاختصاص</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>عدد الأطباء في العيادة</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>الأطباء</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>المحافظة</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>المنطقة</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>الموقع</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>التحكم</th>
            </tr>
          </thead>
          <tbody>
            {data.map((Clinic) => (
              <tr key={Clinic.clinicId}>
                <td style={{ border: '1px solid black', padding: '5px' }}>{Clinic.clinicId}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {
                    Clinic.clinicName
                  }
                </td>
                   {/* //للاختصاص */}
                   <td style={{ border: '1px solid black', padding: '5px' }}> 
                   {editingRow === Clinic.clinicId ? ( <div> <select value={selectedSpecialty ? selectedSpecialty.specialtyId : ''}
                    onChange={(event) => setSelectedSpecialty({ specialtyId: event.target.value })}> 
                    <option value="">-- اختر الاختصاص --</option> { Array.isArray(selectedSpecialty) && selectedSpecialty.map((specialty) => ( <option key={specialty.specialtyId} value={specialty.specialtyId}> {specialty.specialtyName} </option> )) } 
                    </select> <button onClick={() => handleSaveClickSpecialty(Clinic.clinicId)}>حفظ</button> 
                    <button onClick={handleCancelEditClick}>الغاء</button> </div> ) : ( <div onClick={() => handleEditRowClick(Clinic.clinicId, Clinic.clinicName)}> {Clinic.specialty.specialtyName} </div> )} </td>

                {/* عدد الاطباء */}
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {
                    Clinic.numDoctors
                  }
                </td>


                {/* عرض الاطباء */}
                <td style={{ border: '1px solid black', padding: '5px' }}>
                {editingRow !== Clinic.clinicId ? (
                  // تحويل المستخدم إلى الصفحة الجديدة عند النقر على الزر "عرض"
                  <button onClick={() => {
                    navigate(`/doctor/${Clinic.clinicId}`);
                  }}>عرض</button>
                ) : null}
              </td>



                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {
                    Clinic.area.governorate.name
                  }
                </td>

                <td style={{ border: '1px solid black', padding: '5px' }}> {editingRow === Clinic.clinicId ? ( <div> <select value={selectedArea ? selectedArea.areaId : ''} onChange={(event) => setSelectedArea({ areaId: event.target.value })} > <option value="">-- اختر المنطقة --</option> { Array.isArray(selectedArea) && selectedArea.map((area) => ( <option key={area.areaId} value={area.areaId}> {area.name} </option> )) } </select> <button onClick={() => handleSaveClickArea(Clinic.clinicId)}>حفظ</button> <button onClick={handleCancelEditClick}>الغاء</button> </div> ) : ( <div onClick={() => handleEditRowClick(Clinic.clinicId, Clinic.clinicName)}> {Clinic.area.name} </div> )} </td>
                <td style={{ border: '1px solid black', padding: '5px' }}>
              
                </td>
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {editingRow === Clinic.clinicId ? (
                    <div>
                      {/* <button onClick={() => updateClinic(Clinic.clinicId)}>حفظ</button> */}
                      <button onClick={handleCancelEditClick}>الغاء</button>
                      <ToastContainer  position="top-center" className="Toastify__toast-container--top-center"/>  
                                          </div>            ) : (
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








export function Doctors() {
  
  const [token, setToken] = useState('');

  const { clinicId } = useParams();
  const [doctorsData, setdoctorsData] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getdoctors();
    }
  }, [token]);


  async function getdoctors() {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
        return;
      }


     const  response = await axios.get(`${baseURL}/clinics/${clinicId}/doctors`, {
        headers: {
          Authorization: 'Bearer ' + storedToken
        }
      });
    
    const sortedData = response.data.doctors.sort((a, b) => a.doctorId - b.doctorId); // ترتيب البيانات بالتسلسل
    setdoctorsData(sortedData);
    } catch (error) {
      if (error.response.status === 401) {
        navigate('/');
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    getdoctors();
  }, [clinicId]);




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
              <th style={{ border: '1px solid black', padding: '5px' }}>الجنس</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>رقم الهاتف</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>النشاط</th>


            </tr>
          </thead>
          <tbody>
            {doctorsData.map((doctors) => (
              <tr key={doctors.doctorId}>
                <td style={{ border: '1px solid black', padding: '5px' }}>{doctors.doctorId}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {
                    doctors.firstname
                  }
                </td>

                <td style={{ border: '1px solid black', padding: '5px' }}>
                  {
                    doctors.lastname
                  }
                </td>


                <td style={{ border: '1px solid black', padding: '5px' }}>
                {
                    doctors.gender
                  }
                </td>



                <td style={{ border: '1px solid black', padding: '5px' }}>
                {
                    doctors.phonenumberForAdmin
                  }
                </td>

                <td style={{ border: '1px solid black', padding: '5px' }}>
  <input type="checkbox" checked={doctors.active} style={{ backgroundColor: 'green' }} disabled />
</td>

              </tr>
            ))}
          </tbody>
        </table>
       
      </div>
    </div>
  );



}




export default Clinics;

