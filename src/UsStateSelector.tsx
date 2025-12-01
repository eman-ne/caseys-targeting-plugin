import React, { useState } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";

const US_STATES = [
  "AR", // Arkansas
  "IL", // Illinois
  "IN", // Indiana
  "IA", // Iowa
  "KS", // Kansas
  "KY", // Kentucky
  "MI", // Michigan
  "MN", // Minnesota
  "MO", // Missouri
  "NE", // Nebraska
  "ND", // North Dakota
  "OH", // Ohio
  "OK", // Oklahoma
  "SD", // South Dakota
  "TN", // Tennessee
  "WI", // Wisconsin
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
