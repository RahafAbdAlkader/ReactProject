
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
export function MyComponent({ getdoctors }) {
    const [isOpen, setIsOpen] = useState(false);
    const [firstname, setfirstname] = useState('');
    const [lastname, setlastname] = useState('');
    const [phonenumberForAdmin, setphonenumber] = useState('');
    const [email, setemail] = useState('');
    const [gender, setGender] = useState('male');

    const token = localStorage.getItem('token');
    const [selectedClinicIds, setSelectedClinicIds] = useState([]);
    const [clinics, setClinics] = useState([]);

    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState("");


    const [subSpecialties, setSubSpecialties] = useState([]);
    const [selectedSubSpecialtyIds, setSelectedSubSpecialtyIds] = useState([]);

    const [selectedinsuranceIds, setSelectedInsuranceIds] = useState([]);
    const [insurances, setInsurances] = useState([]);
    const navigate = useNavigate();

    const handleSelectChange = (event) => {
        setSelectedSpecialty(event.target.value);
      };

    useEffect(() => {
        const fetchClinics = async () => {
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const response = await axios.get(
                    `${baseURL}/clinics`,
                    { headers }
                );
                const sortedData = response.data.clinics.sort(
                    (a, b) => a.clinicId - b.clinicId
                );
                setClinics(sortedData);
            } catch (error) {
                if (error.response.status === 401) {
                    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا كان التوكن غير صالح
                    navigate("/");
                } else {
                    console.error(error);
                }
            }
        };

        fetchClinics();
    }, [token]);


    useEffect(() => {
        const fetchinsurances = async () => {
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const response = await axios.get(
                    `${baseURL}/insurances`,
                    { headers }
                );
                const sortedData = response.data.insurances.sort(
                    (a, b) => a.insuranceId - b.insuranceId
                );
                setInsurances(sortedData);
            } catch (error) {
                if (error.response.status === 401) {
                    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا كان التوكن غير صالح
                    navigate("/");
                } else {
                    console.error(error);
                }
            }
        };

        fetchinsurances();
    }, [token]);


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


      async function fetchSubSpecialties(specialtyId) {
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.get(
                `${baseURL}/specialties/${specialtyId}/subSpecialties`,
                { headers }
            );
            if (response && response.data) {
                const sortedData = response.data.subSpecialties.sort(
                    (a, b) => a.subSpecialtyId - b.subSpecialtyId
                );
                setSubSpecialties(sortedData);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Redirect the user to the login page if the token is not valid
                navigate("/");
            } else {
                console.error(error);
            }
        }
    }


    useEffect(() => {
        if (selectedSpecialty) {
            fetchSubSpecialties(selectedSpecialty);
        } else {
            setSubSpecialties([]);
        }
    }, [selectedSpecialty, token]);



    function handleClinicSelect(event) {
        const options = event.target.options;
        const selectedIds = [];

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedIds.push(options[i].value);
            }
        }

        setSelectedClinicIds(selectedIds);
    }

    function handleInsuranceSelect(event) {
        const options = event.target.options;
        const selectedIds = [];

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedIds.push(options[i].value);
            }
        }

        setSelectedInsuranceIds(selectedIds);
    }

    function handleSubSpecialtySelect(event) {
        const options = event.target.options;
        const selectedIds = [];

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedIds.push(options[i].value);
            }
        }

        setSelectedSubSpecialtyIds(selectedIds);
    }

    function handlefirstnameChange(event) {
        setfirstname(event.target.value);
    }
    function handlelastnameChange(event) {
        setlastname(event.target.value);
    }
    function handlephonenumberForAdminChange(event) {
        setphonenumber(event.target.value);
    }
    function handleemailChange(event) {
        setemail(event.target.value);
    }
    console.log(selectedSubSpecialtyIds);

    async function handleSubmit(event) {
        debugger;
        event.preventDefault();
        const headers = { Authorization: `Bearer ${token}` };  const body = {    
            email,             
            phonenumberForAdmin,
            gender,
            firstname,  
            lastname,  
            clinics: selectedClinicIds.map(id => ({ clinicId: id})),
            subSpecialties: selectedSubSpecialtyIds.map(id => ({ subSpecialtyId: id})), 
            insurances: selectedinsuranceIds.map(id => ({ insuranceId: id }))
          }
          
          try {
              const response = await axios.post(
                `${baseURL}/doctors`, 
                body,   
                { headers }       
              );  
            if (response.status === 201) {
                console.log(response.data);
                setIsOpen(false);
                getdoctors(); // استدعاء دالة getInsurances()
                toast.success('تمت اضافة البيانات بنجاح!');
            }
        } catch (error) {
            if (error.response.status === 400) {
                toast.error(' لا يمكن أن يكون الحقل فارغ أو يكون الحساب الالكتروني (الايميل) موجود مسبقا!');
            }
            console.log(error.response.data.message);

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
                <button onClick={openModal}>اضافة طبيب </button>
                <ToastContainer position="top-center" className="Toastify__toast-container--top-center" />
            </div>
            <ReactModal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="Form Modal"
            >
                <form onSubmit={handleSubmit}>
                    <label htmlFor="firstname">: اسم الطبيب  </label>
                    <input
                        id="firstname"
                        type="text"
                        value={firstname}
                        onChange={handlefirstnameChange}
                    />
                    <label htmlFor="lastname">: الكنية الخاصة بالطبيب  </label>
                    <input
                        id="lastname"
                        type="text"
                        value={lastname}
                        onChange={handlelastnameChange}
                    />
                    <label htmlFor="email">:الجنس</label>

                    <select value={gender} onChange={(event) => setGender(event.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    <label htmlFor="phonenumberForAdmin">: رقم  الهاتف </label>
                    <input
                        id="phonenumberForAdmin"
                        type="tel"
                        value={phonenumberForAdmin}
                        onChange={handlephonenumberForAdminChange}
                    />

                    <label htmlFor="email">:   الحساب الالكتروني (الايميل)</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleemailChange}
                    />

                    <label htmlFor="Clinic">:   العيادات </label>
                    <select multiple value={selectedClinicIds} onChange={handleClinicSelect}>
                        <option value="">Select clinics</option>
                        {clinics.map(clinic => (
                            <option key={clinic.clinicId} value={clinic.clinicId}>
                                {clinic.clinicName}
                            </option>
                        ))}
                    </select>


                    <label htmlFor="Clinic">:   شركات التأمين </label>
                    <select multiple value={selectedinsuranceIds} onChange={handleInsuranceSelect}>
                        {insurances.map(insurance => (
                            <option key={insurance.insuranceId} value={insurance.insuranceId}>
                                {insurance.companyName}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="specialty-select">:   الاختصاص الرئيسي</label>
            <select value={selectedSpecialty} onChange={handleSelectChange}>
              <option value="">-- اختر التخصص --</option>
              {specialties.map((specialty) => (
                <option key={specialty.specialtyId} value={specialty.specialtyId}>
                  {specialty.specialtyName}
                </option>
              ))}
            </select>
<label htmlFor="subSpecialty-select">:   الاختصاص الفرعي</label>

<select multiple value={selectedSubSpecialtyIds} onChange={handleSubSpecialtySelect}>
                        {subSpecialties.map(subSpecialty => (
        <option key={subSpecialty.subSpecialtyId} value={subSpecialty.subSpecialtyId}>
            {subSpecialty.subSpecialtyName}
        </option>

                        ))}
                    </select>


                    <button type="submit">اضافة</button>

                </form>
                <button onClick={closeModal}>اغلاق</button>
            </ReactModal>
        </div>
    );
}


function DoctorAd() {



    const [token, setToken] = useState('');
    const [filterName, setFilterName] = useState('');
    const [editingRow, setEditingRow] = useState(null);
    const [type, settype] = useState(3);

    const [doctorsData, setdoctorsData] = useState([]);
    const navigate = useNavigate();

    const [updatedfirstname, setUpdatedfirstname] = useState('');
    const [updatedlastname, setUpdatedlastname] = useState('');
    const [updatedphonenumber, setUpdatedphonenumber] = useState('');
    const [updatedemail, setUpdatedemail] = useState('');
    const [updatedgender, setUpdatedGender] = useState('male');
    const [updatedactive, setUpdatedActive] = useState('');


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
    }, [token, editingRow, filterName, type]);


    async function getdoctors() {
        try {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                navigate('/');
                return;
            }
            let response;
            if (filterName) {
                response = await axios.post(`${baseURL}/doctors/filter-by-names`, { filterName }, {
                    headers: {
                        Authorization: 'Bearer ' + storedToken,
                    },
                });
            } else if (type) {
                response = await axios.get(`${baseURL}/doctors/${type}`, {
                    headers: {
                        Authorization: 'Bearer ' + storedToken
                    }
                });
            }
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


    function handleFilterNameChange(event) {
        setFilterName(event.target.value);
    }

    async function updatedoctors(doctorId) {
        try {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                navigate('/');
                return;
            }
            const response = await axios.put(`http://localhost:3000/doctors/update/${doctorId}`, {
                firstname: updatedfirstname,
                lastname: updatedlastname,
                phonenumberForAdmin: updatedphonenumber,
                email: updatedemail,
                gender: updatedgender,
                active:updatedactive
            }, {
                headers: {
                    Authorization: 'Bearer ' + storedToken
                }
            });
            if (response.status === 200) {
                setEditingRow(null);
                getdoctors();
                toast.success('تم تحديث البيانات بنجاح!');
            }
        } catch (error) {
            if (error.response.status === 400) {
                toast.error(' لا يمكن أن يكون الحقل فارغ أو يكون الحساب الالكتروني (الايميل) موجود مسبقا!');
            }
            if (error.response.status === 401) {
                navigate('/');
            } else {
                console.error(error);
            }
        }
    }





    function handleEditRowClick(adminId, firstname, lastname, phonenumberForAdmin, email, gender,active) {
        setEditingRow(adminId);
        setUpdatedfirstname(firstname);
        setUpdatedlastname(lastname);
        setUpdatedphonenumber(phonenumberForAdmin);
        setUpdatedemail(email);
        setUpdatedGender(gender);
        setUpdatedActive(active);
    }

    function handleCancelEditClick() {
        setEditingRow(null);
        setUpdatedfirstname('');
        setUpdatedlastname('');
        setUpdatedphonenumber('');
        setUpdatedemail('');
        setUpdatedGender('');
        setUpdatedActive('');
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

        <div className="all-container" style={{ backgroundColor: "#fdf3e3" }}>
            <Navbars />
            <div style={{ margin: '20px' }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ flex: 0 }}>
                        <input id="filterName" type="text" value={filterName} onChange={handleFilterNameChange} />
                    </div>
                    <label htmlFor="filterName" style={{ margin: '0 10px' }}>: اسم الطبيب </label>
                </div>
                <br />
                <br />
                <MyComponent getdoctors={getdoctors} />

                <table style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '5px' }}>التسلسل </th>
                            <th style={{ border: '1px solid black', padding: '5px' }}> الاسم الأول</th>
                            <th style={{ border: '1px solid black', padding: '5px' }}>الاسم الأخير</th>
                            <th style={{ border: '1px solid black', padding: '5px' }}>الجنس</th>
                            <th style={{ border: '1px solid black', padding: '5px' }}>رقم الهاتف</th>
                            <th style={{ border: '1px solid black', padding: '5px' }}>البريد الالكتروني</th>
                            <th style={{ border: '1px solid black', padding: '5px' }}>النشاط</th>
                            <th style={{ border: '1px solid black', padding: '5px' }}>التحكم</th>


                        </tr>
                    </thead>
                    <tbody>
                        {doctorsData.map((doctors) => (
                            <tr key={doctors.doctorId}>
                                <td style={{ border: '1px solid black', padding: '5px' }}>{doctors.doctorId}</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>
                                    {editingRow === doctors.doctorId ? (
                                        <input type="text" value={updatedfirstname} onChange={handleUpdatedfirstnameChange} />
                                    ) : (
                                        doctors.firstname
                                    )}

                                </td>

                                <td style={{ border: '1px solid black', padding: '5px' }}>
                                    {editingRow === doctors.doctorId ? (
                                        <input type="text" value={updatedlastname} onChange={handleUpdatedlastnameChange} />
                                    ) : (
                                        doctors.lastname
                                    )}

                                </td>


                                <td style={{ border: '1px solid black', padding: '5px' }}>
                                {editingRow === doctors.doctorId ? (
                                                                    <select value={updatedlastname} onChange={(event) => setUpdatedGender(event.target.value)}>
                                                                    <option value="male">Male</option>
                                                                    <option value="female">Female</option>
                                                                </select>
                                     ) : (
                                        doctors.gender
                                   ) }
                                </td>


                                <td style={{ border: '1px solid black', padding: '5px' }}>
                                    {editingRow === doctors.doctorId ? (
                                        <input type="tel" value={updatedphonenumber} onChange={handleUpdatedphonenumber} />
                                    ) : (
                                        doctors.phonenumberForAdmin
                                    )}


                                </td>

                                <td style={{ border: '1px solid black', padding: '5px' }}>
                                {editingRow === doctors.doctorId ? (
                      <input type="email" value={updatedemail} onChange={handleUpdatedemailChange} />
                    ) : (
                        doctors.email
                    )}
                  </td>

                                <td style={{ border: '1px solid black', padding: '5px' }}>
                                {editingRow === doctors.doctorId ? (
                                    <input type="checkbox" checked={doctors.active} style={{ backgroundColor: 'green' }} />

                                    ) : (
                                    <input type="checkbox" checked={doctors.active} style={{ backgroundColor: 'green' }} disabled />
                                    )}
                                </td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>
                                    {editingRow === doctors.doctorId ? (
                                        <div>
                                            <button onClick={() => updatedoctors(doctors.doctorId)}>حفظ</button>
                                            <button onClick={handleCancelEditClick}>الغاء</button>
                                            <ToastContainer position="top-center" className="Toastify__toast-container--top-center" />
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '70px' }}>
                                            <div onClick={() => handleEditRowClick(doctors.doctorId, doctors.firstname, doctors.lastname, doctors.phonenumberForAdmin,doctors.email,doctors.gender,doctors.active)}>
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
export default DoctorAd;