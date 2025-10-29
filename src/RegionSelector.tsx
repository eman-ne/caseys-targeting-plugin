import React, { useState, useEffect } from "react";
import MultiSelectDropdown, {
  fetchStoresAPI,
  BuilderPluginProps,
} from "./MultiSelectDropdown";
import { CircularProgress } from "@mui/material";

const RegionSelector = ({ onChange, value }: BuilderPluginProps<string[]>) => {
  const [region, setRegion] = useState(value?.length > 0 ? value : []);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        setLoading(true);

        const regions = await fetchStoresAPI("regions");
        setOptions(regions);
      } catch (err) {
        console.error("Error fetching regions:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
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
      currentValue={region}
      setCurrentValue={setRegion}
    />
  );
};

export default RegionSelector;
