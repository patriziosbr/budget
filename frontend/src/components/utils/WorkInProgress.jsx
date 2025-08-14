import React from 'react';

const WorkInProgress = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
    >
      <rect width="100" height="100" fill="#f3f3f3" />
      <path
        d="M25 50 L50 75 L75 50 L50 25 Z"
        fill="#ffc107"
        stroke="#333"
        strokeWidth="2"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="10"
        fill="#333"
      >
        WIP
      </text>
    </svg>
  );
};

export default WorkInProgress;