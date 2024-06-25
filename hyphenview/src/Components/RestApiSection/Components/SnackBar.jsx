import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';

const SnackBarComponent = ({ error, setError, errorMessage }) => {
  const handleClose = () => {
    setError(false);
  };

  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [error, setError]);

  return (
    <>
      {error && (
        <Toast onClose={handleClose}>
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      )}
    </>
  );
};

export default SnackBarComponent;
