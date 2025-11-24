import React, { useState, useEffect } from "react";
import MultiSelectDropdown, {
  fetchStoresAPI,
  BuilderPluginProps,
} from "./MultiSelectDropdown";
import { CircularProgress } from "@mui/material";

const DistrictSelector = ({
  onChange,
  value,
  context,
}: BuilderPluginProps<string[]>) => {
  const [district, setDistrict] = useState(value?.length > 0 ? value : []);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const builderEnvironment = context?.user?.currentOrganization;

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        setLoading(true);

        const districts = await fetchStoresAPI("districts", builderEnvironment);
        setOptions(districts);
      } catch (err) {
        console.error("Error fetching districts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDistricts();
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
      currentValue={district}
      setCurrentValue={setDistrict}
    />
  );
};

export default DistrictSelector;
