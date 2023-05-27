import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState('');
  const [type, setType] = useState(0);

  const setAuthData =(token, type) => {
    setAccessToken(token);
    setType(type);
  };

  return (
    <AuthContext.Provider value={{ accessToken, type, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;