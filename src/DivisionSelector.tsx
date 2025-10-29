import React, { useState, useEffect } from "react";
import MultiSelectDropdown, {
  fetchStoresAPI,
  BuilderPluginProps,
} from "./MultiSelectDropdown";
import { CircularProgress } from "@mui/material";

const DivisionSelector = ({
  onChange,
  value,
}: BuilderPluginProps<string[]>) => {
  const [division, setDivision] = useState(value?.length > 0 ? value : []);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDivisions = async () => {
      try {
        setLoading(true);

        const divisions = await fetchStoresAPI("divisions");
        setOptions(divisions);
      } catch (err) {
        console.error("Error fetching divisions:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDivisions();
  }, []);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <CircularProgress size={16} />
      </div>
    );
  }

  return (
    <MultiSelectDropdown
      options={options}
      onChange={onChange}
      value={value}
      currentValue={division}
      setCurrentValue={setDivision}
    />
  );
};

export default DivisionSelector;
