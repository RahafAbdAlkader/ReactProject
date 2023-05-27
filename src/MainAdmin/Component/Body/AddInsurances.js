// import React, { useState } from 'react';
// import ReactModal from 'react-modal';

// function MyComponent() {
//     const [isOpen, setIsOpen] = useState(false);
//     const [companyName, setcompanyName] = useState('');
  
//     function handlecompanyNameChange(event) {
//       setcompanyName(event.target.value);
//     }
  
//     function handleSubmit(event) {
//       event.preventDefault();
//       // Do something with the company name here
//       setIsOpen(false);
//     }
  
//     function openModal() {
//       setIsOpen(true);
//     }
  
//     function closeModal() {
//       setIsOpen(false);
//     }
  
//     return (
//       <div>
//         <button onClick={openModal}>Open Form</button>
//         <ReactModal
//           isOpen={isOpen}
//           onRequestClose={closeModal}
//           contentLabel="Form Modal"
//         >
//           <form onSubmit={handleSubmit}>
//             <label htmlFor="companyName">: اسم شركة التأمين</label>
//             <input
//               id="companyName"
//               type="text"
//               value={companyName}
//               onChange={handlecompanyNameChange}
//             />
//             <button type="submit">Save</button>
//           </form>
//           <button onClick={closeModal}>Close Form</button>
//         </ReactModal>
//       </div>
//     );
//   }

// export default MyComponent;




import React, { useState } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';


function MyComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [companyName, setcompanyName] = useState('');
    const token = localStorage.getItem('token');

    function handlecompanyNameChange(event) {
      setcompanyName(event.target.value);
    }

    async function handleSubmit(event) {
      event.preventDefault();
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await axios.post(
          'http://localhost:3000/insurances',
          { companyName },
          { headers }
        );
        console.log(response.data);
        setIsOpen(false);
      } catch (error) {
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
        <button onClick={openModal}>Open Form</button>
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
            <button type="submit">Save</button>
          </form>
          <button onClick={closeModal}>Close Form</button>
        </ReactModal>
      </div>
    );
  }

export default MyComponent;