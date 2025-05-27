// PyqList.js
import React from 'react';
import { useParams } from 'react-router-dom';

const PyqList = () => {
  const { courseName } = useParams();

  return (
    <div>
      <h1>Previous Year Questions for {courseName}</h1>
      {/* Display the list of PYQs here */}
    </div>
  );
};

export default PyqList;
