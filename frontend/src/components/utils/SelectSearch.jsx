import React, { useState, useEffect } from 'react';
import Select, { createFilter } from 'react-select';

const SelectSearch = ({ value, onChange, option, selected }) => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  // Group options by parent-child relationship
  const processOptions = (options) => {
    if (!Array.isArray(options)) return [];
    
    // Create a map of parent IDs to their objects
    const parentMap = {};
    options.forEach(opt => {
      if (opt.parent === null) {
        parentMap[opt._id] = { ...opt, children: [] };
      }
    });
    
    // Assign children to their parents
    options.forEach(opt => {
      if (opt.parent && parentMap[opt.parent]) {
        parentMap[opt.parent].children.push(opt);
      }
    });
    
    // Format for react-select
    const formattedOptions = Object.values(parentMap).map(parent => ({
      label: parent.name,
      value: parent._id,
      isDisabled: true, // Parent categories are not selectable
      options: parent.children.map(child => ({
        label: child.name,
        value: child._id,
        parentName: parent.name // Store parent name for filtering
      }))
    }));
    
    return formattedOptions;
  };

  const processedOptions = processOptions(option);
  
  // Custom filter that searches in both parent and child names
  const customFilter = createFilter({
    matchFrom: 'any',
    stringify: option => {
      if (option.data.__isNew__) return '';
      // Include parent name in the searchable text
      return `${option.data.parentName || ''} ${option.label}`;
    },
  });
  
  return (
    <>
    {/* selected  {JSON.stringify(selected)} */}
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
        filterOption={customFilter}
        // Format the displayed option to show parent-child relationship
        formatOptionLabel={({ label }) => (
          <div>
            <span>{label}</span>
          </div>
        )}
      />
    </>
  );
};

export default SelectSearch;