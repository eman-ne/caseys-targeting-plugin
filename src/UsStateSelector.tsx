import React, { useState } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";

const US_STATES = [
  "Arkansas",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Michigan",
  "Minnesota",
  "Missouri",
  "Nebraska",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "South Dakota",
  "Tennessee",
  "Wisconsin",
];

const UsStateSelector = ({ onChange, value }: any) => {
  const [usState, setUsState] = useState(value?.length > 0 ? value : []);

  return (
    <MultiSelectDropdown
      options={US_STATES}
      onChange={onChange}
      value={value}
      currentValue={usState}
      setCurrentValue={setUsState}
    />
  );
};

export default UsStateSelector;
