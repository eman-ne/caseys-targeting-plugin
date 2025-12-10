import React, { useState, useEffect, useMemo } from "react";
import MultiSelectDropdown, {
  // fetchStoresAPI,
  BuilderPluginProps,
} from "./MultiSelectDropdown";
import { CircularProgress } from "@mui/material";
import { fetchStoresAPI } from "./utils";

const DistrictSelector = ({
  onChange,
  value,
  context,
}: BuilderPluginProps<string[]>) => {
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [allDistrictsData, setAllDistrictsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const builderEnvironment = context?.user?.currentOrganization;

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        setLoading(true);
        const { names, data } = await fetchStoresAPI(
          "districts",
          builderEnvironment
        );
        setOptions(names);
        setAllDistrictsData(data);
      } catch (err) {
        console.error("Error fetching districts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDistricts();
  }, [builderEnvironment]);

  // Memoize the mapping of district names to store numbers
  const districtToStoresMap = useMemo(() => {
    const map = new Map<string, string[]>();

    allDistrictsData.forEach((district) => {
      const storeNumbers =
        district._links?.children?.map((child: { href: string }) =>
          child.href.split("/").pop()
        ) || [];
      map.set(district.name, storeNumbers);
    });

    return map;
  }, [allDistrictsData]);

  // Memoize the reverse mapping: store numbers to district names
  const storeToDistrictMap = useMemo(() => {
    const map = new Map<string, string>();

    allDistrictsData.forEach((district) => {
      const storeNumbers =
        district._links?.children?.map((child: { href: string }) =>
          child.href.split("/").pop()
        ) || [];

      storeNumbers.forEach((storeNum: string) => {
        map.set(storeNum, district.name);
      });
    });

    return map;
  }, [allDistrictsData]);

  // Initialize selectedDistricts from value (store numbers) on mount
  useEffect(() => {
    if (value && value.length > 0 && allDistrictsData.length > 0) {
      // Convert store numbers back to district names
      const districtNamesSet = new Set<string>();
      value.forEach((storeNum) => {
        const districtName = storeToDistrictMap.get(storeNum);
        if (districtName) {
          districtNamesSet.add(districtName);
        }
      });
      setSelectedDistricts(Array.from(districtNamesSet));
    }
  }, [value, storeToDistrictMap, allDistrictsData.length]);

  const handleChange = (newValue: string[]) => {
    setSelectedDistricts(newValue);

    // Get store numbers using cached map
    const storeNumbers = newValue.flatMap(
      (districtName) => districtToStoresMap.get(districtName) || []
    );

    // Pass store numbers to parent
    onChange(storeNumbers);
  };

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
      onChange={handleChange}
      value={selectedDistricts}
      currentValue={selectedDistricts}
      setCurrentValue={setSelectedDistricts}
    />
  );
};

export default DistrictSelector;

// import React, { useState, useEffect } from "react";
// import MultiSelectDropdown, {
//   fetchStoresAPI,
//   BuilderPluginProps,
// } from "./MultiSelectDropdown";
// import { CircularProgress } from "@mui/material";

// const DistrictSelector = ({
//   onChange,
//   value,
//   context,
// }: BuilderPluginProps<string[]>) => {
//   const [district, setDistrict] = useState(value?.length > 0 ? value : []);
//   const [options, setOptions] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   const builderEnvironment = context?.user?.currentOrganization;

//   useEffect(() => {
//     const loadDistricts = async () => {
//       try {
//         setLoading(true);

//         const districts = await fetchStoresAPI("districts", builderEnvironment);
//         setOptions(districts);
//       } catch (err) {
//         console.error("Error fetching districts:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDistricts();
//   }, []);

//   if (loading) {
//     return (
//       <div
//         style={{ display: "flex", justifyContent: "center", padding: "20px" }}
//       >
//         <CircularProgress size={16} />
//       </div>
//     );
//   }

//   return (
//     <MultiSelectDropdown
//       options={options}
//       onChange={onChange}
//       value={value}
//       currentValue={district}
//       setCurrentValue={setDistrict}
//     />
//   );
// };

// export default DistrictSelector;
