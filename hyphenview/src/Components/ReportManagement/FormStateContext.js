import React, { createContext, useState, useContext } from 'react';

const FormStateContext = createContext();

export const useFormState = () => useContext(FormStateContext);

export const FormStateProvider = ({ children }) => {
  const [formCreated, setFormCreated] = useState(false);
  const [formModified, setFormModified] = useState(false);
 
  const handleFormCreated = (value) => setFormCreated(value);
  const handleFormModified = (value) => setFormModified(value);

  return (
    <FormStateContext.Provider value={{ formCreated, formModified, handleFormCreated, handleFormModified }}>
      {children}
    </FormStateContext.Provider>
  );
};
