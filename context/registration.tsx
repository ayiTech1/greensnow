import React, { createContext, useContext, useState } from 'react';

type RegistrationData = {
  role?: 'EMPLOYER' | 'EMPLOYEE';
  socialData?: {
    email?: string;
    name?: string;
  };
  basicInfo?: {
    name: string;
    phone: string;
    email: string;
  };
  additionalInfo?: {
    homeAddress: string;
    dateOfBirth: Date;
    password: string;
  };
};

type RegistrationContextType = {
  registrationData: RegistrationData;
  setRole: (role: 'EMPLOYER' | 'EMPLOYEE') => void;
  setSocialData: (data: { email?: string; name?: string }) => void;
  setBasicInfo: (info: { name: string; phone: string; email: string }) => void;
  setAdditionalInfo: (info: { homeAddress: string; dateOfBirth: Date; password: string }) => void;
  clearRegistrationData: () => void;
};

const RegistrationContext = createContext<RegistrationContextType>({} as RegistrationContextType);

export const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});

  const value = {
    registrationData,
    setRole: (role: 'EMPLOYER' | 'EMPLOYEE') => 
      setRegistrationData(prev => ({ ...prev, role })),
    setSocialData: (socialData: { email?: string; name?: string }) => 
      setRegistrationData(prev => ({ ...prev, socialData })),
    setBasicInfo: (basicInfo: { name: string; phone: string; email: string }) => 
      setRegistrationData(prev => ({ ...prev, basicInfo })),
    setAdditionalInfo: (additionalInfo: { homeAddress: string; dateOfBirth: Date; password: string }) => 
      setRegistrationData(prev => ({ ...prev, additionalInfo })),
    clearRegistrationData: () => setRegistrationData({}),
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => useContext(RegistrationContext);