import React from 'react';

export interface errorClass {
  isError: boolean;
  errorType?: string;
}

const DisplayError = ({ isError, errorType }: errorClass): JSX.Element => {
  if (isError === true) {
    return (
      <div className="center" style={{ color: 'red' }}>
        {errorType}
      </div>
    );
    // Return the error
  }
  return <div />;
};

export default DisplayError;
