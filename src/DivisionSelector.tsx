import React, { useState, useEffect, useMemo } from "react";
import MultiSelectDropdown, {
  // fetchStoresAPI,
  BuilderPluginProps,
} from "./MultiSelectDropdown";
import { CircularProgress } from "@mui/material";
import { fetchStoresAPI } from "./utils";

const extractIdFromHref = (href: string): string => href.split("/").pop() || "";

const DivisionSelector = ({
  onChange,
  value,
  context,
}: BuilderPluginProps<string[]>) => {
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [allDivisionsData, setAllDivisionsData] = useState<any[]>([]);
  const [allRegionsData, setAllRegionsData] = useState<any[]>([]);
  const [allDistrictsData, setAllDistrictsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const builderEnvironment = context?.user?.currentOrganization;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [divisions, regions, districts] = await Promise.all([
          fetchStoresAPI("divisions", builderEnvironment),
          fetchStoresAPI("regions", builderEnvironment),
          fetchStoresAPI("districts", builderEnvironment),
        ]);

        setOptions(divisions.names);
        setAllDivisionsData(divisions.data);
        setAllRegionsData(regions.data);
        setAllDistrictsData(districts.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [builderEnvironment]);

  // Memoize district ID to stores mapping
  const districtIdToStoresMap = useMemo(() => {
    const map = new Map<string, string[]>();

    allDistrictsData.forEach((district) => {
      const storeNumbers =
        district._links?.children?.map((child: { href: string }) =>
          extractIdFromHref(child.href)
        ) || [];
      map.set(district.id.toString(), storeNumbers);
    });

    return map;
  }, [allDistrictsData]);

  // Memoize region ID to store numbers mapping
  const regionIdToStoresMap = useMemo(() => {
    const map = new Map<string, string[]>();

    allRegionsData.forEach((region) => {
      const districtIds =
        region._links?.children?.map((child: { href: string }) =>
          extractIdFromHref(child.href)
        ) || [];

      const storeNumbers = districtIds.flatMap(
        (districtId: string) => districtIdToStoresMap.get(districtId) || []
      );

      map.set(region.id.toString(), storeNumbers);
    });

    return map;
  }, [allRegionsData, districtIdToStoresMap]);

  // Memoize division name to store numbers mapping
  const divisionToStoresMap = useMemo(() => {
    const map = new Map<string, string[]>();

    allDivisionsData.forEach((division) => {
      const regionIds =
        division._links?.children?.map((child: { href: string }) =>
          extractIdFromHref(child.href)
        ) || [];

      const storeNumbers = regionIds.flatMap(
        (regionId: string) => regionIdToStoresMap.get(regionId) || []
      );

      map.set(division.name, storeNumbers);
    });

    return map;
  }, [allDivisionsData, regionIdToStoresMap]);

  // Memoize the reverse mapping: store numbers to division names
  const storeToDivisionMap = useMemo(() => {
    const map = new Map<string, string>();

    allDivisionsData.forEach((division) => {
      const storeNumbers = divisionToStoresMap.get(division.name) || [];

      storeNumbers.forEach((storeNum) => {
        map.set(storeNum, division.name);
      });
    });

    return map;
  }, [allDivisionsData, divisionToStoresMap]);

  // Initialize selectedDivisions from value (store numbers) on mount
  useEffect(() => {
    if (value && value.length > 0 && allDivisionsData.length > 0) {
      // Convert store numbers back to division names
      const divisionNamesSet = new Set<string>();
      value.forEach((storeNum) => {
        const divisionName = storeToDivisionMap.get(storeNum);
        if (divisionName) {
          divisionNamesSet.add(divisionName);
        }
      });
      setSelectedDivisions(Array.from(divisionNamesSet));
    }
  }, [value, storeToDivisionMap, allDivisionsData.length]);

  const handleChange = (newValue: string[]) => {
    setSelectedDivisions(newValue);

    // Get store numbers using cached map
    const storeNumbers = newValue.flatMap(
      (divisionName) => divisionToStoresMap.get(divisionName) || []
    );

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
      value={selectedDivisions}
      currentValue={selectedDivisions}
      setCurrentValue={setSelectedDivisions}
    />
  );
};

export default DivisionSelector;

// import React, { useState, useEffect } from "react";
// import MultiSelectDropdown, {
//   fetchStoresAPI,
//   BuilderPluginProps,
// } from "./MultiSelectDropdown";
// import { CircularProgress } from "@mui/material";

// const DivisionSelector = ({
//   onChange,
//   value,
//   context,
// }: BuilderPluginProps<string[]>) => {
//   const [division, setDivision] = useState(value?.length > 0 ? value : []);
//   const [options, setOptions] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   const builderEnvironment = context?.user?.currentOrganization;

//   useEffect(() => {
//     const loadDivisions = async () => {
//       try {
//         setLoading(true);

//         const divisions = await fetchStoresAPI("divisions", builderEnvironment);
//         setOptions(divisions);
//       } catch (err) {
//         console.error("Error fetching divisions:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDivisions();
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
//       currentValue={division}
//       setCurrentValue={setDivision}
//     />
//   );
// };

// export default DivisionSelector;
