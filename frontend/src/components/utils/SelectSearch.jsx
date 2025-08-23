import React, { useState, useEffect } from 'react';
import Select from 'react-select';


const SelectSearch = ({ value, onChange, option, selected }) => {
  const [options, setOptions] = useState([]);
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

    const processedOptions = Array.isArray(option) 
    ? option.map(opt => ({
        ...opt,
        isDisabled: opt.parent === null
      }))
    : [];

  return (
    <>
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={selected}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name="category"
        options={processedOptions}
        onChange={onChange}
      />

      <div
        style={{
          color: 'hsl(0, 0%, 40%)',
          display: 'inline-block',
          fontSize: 12,
          fontStyle: 'italic',
          marginTop: '1em',
        }}
      >
      </div>
    </>
  );
};

export default SelectSearch;