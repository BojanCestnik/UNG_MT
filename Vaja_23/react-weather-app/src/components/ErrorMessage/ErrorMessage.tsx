import React from 'react';
import { useAppContext } from '../../context/AppContext';

const ErrorMessage: React.FC = () => {
  const { isError, errorMessage } = useAppContext();

  if (!isError) return null;

  return (
    <div
      role="alert"
      style={{
        margin: '1rem auto',
        padding: '0.75rem 1rem',
        maxWidth: '40rem',
        borderRadius: '8px',
        border: '1px solid #e57373',
        background: 'rgba(229, 115, 115, 0.15)',
        color: '#c62828',
        textAlign: 'center',
        overflowWrap: 'anywhere',
      }}
    >
      <strong>Could not load weather.</strong>
      <br />
      {errorMessage ?? 'Unknown error'}
    </div>
  );
};

export default ErrorMessage;
