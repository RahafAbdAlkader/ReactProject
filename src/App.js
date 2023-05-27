// import Insurances from "./MainAdmin/Component/Body/Insurances";
// import LoginForm from "./MainAdmin/Component/Body/Login";
// import Home from "./MainAdmin/Component/Body/MainAdminHome";
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import { useEffect, useState } from 'react';
// function App() {
//   const [token, setToken] = useState('');

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginForm setToken={setToken} />} />
//         <Route path="/Home" element={<Home />} />
//         <Route path="/Insurances" element={<Insurances token={token} />} />
//       </Routes>
//     </Router>
//   );
// }
// export default App;




import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Insurances from "./MainAdmin/Component/Body/Insurances";
import LoginForm from "./MainAdmin/Component/Body/Login";
import Home from "./MainAdmin/Component/Body/MainAdminHome";

function App() {
  const [token, setToken] = useState('');


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm setToken={setToken} />} />

       //قسم رهف 
        <Route path="/Home" element={<Home />} />
        <Route path="/Insurances" element={<Insurances token={token} />} />




        //قسم ريم
      </Routes>
    </Router>
  );
}

export default App;