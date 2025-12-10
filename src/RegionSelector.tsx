import React, { useState, useEffect, useMemo } from "react";
import MultiSelectDropdown, {
  // fetchStoresAPI,
  BuilderPluginProps,
} from "./MultiSelectDropdown";
import { CircularProgress } from "@mui/material";
import { fetchStoresAPI } from "./utils";

const extractIdFromHref = (href: string): string => href.split("/").pop() || "";

const RegionSelector = ({
  onChange,
  value,
  context,
}: BuilderPluginProps<string[]>) => {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [allRegionsData, setAllRegionsData] = useState<any[]>([]);
  const [allDistrictsData, setAllDistrictsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const builderEnvironment = context?.user?.currentOrganization;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [regions, districts] = await Promise.all([
          fetchStoresAPI("regions", builderEnvironment),
          fetchStoresAPI("districts", builderEnvironment),
        ]);

        setOptions(regions.names);
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

  // Memoize region name to store numbers mapping
  const regionToStoresMap = useMemo(() => {
    const map = new Map<string, string[]>();

    allRegionsData.forEach((region) => {
      const districtIds =
        region._links?.children?.map((child: { href: string }) =>
          extractIdFromHref(child.href)
        ) || [];

      const storeNumbers = districtIds.flatMap(
        (districtId: string) => districtIdToStoresMap.get(districtId) || []
      );

      map.set(region.name, storeNumbers);
    });

    return map;
  }, [allRegionsData, districtIdToStoresMap]);

  // Memoize the reverse mapping: store numbers to region names
  const storeToRegionMap = useMemo(() => {
    const map = new Map<string, string>();

    allRegionsData.forEach((region) => {
      const storeNumbers = regionToStoresMap.get(region.name) || [];

      storeNumbers.forEach((storeNum) => {
        map.set(storeNum, region.name);
      });
    });

    return map;
  }, [allRegionsData, regionToStoresMap]);

  // Initialize selectedRegions from value (store numbers) on mount
  useEffect(() => {
    if (value && value.length > 0 && allRegionsData.length > 0) {
      // Convert store numbers back to region names
      const regionNamesSet = new Set<string>();
      value.forEach((storeNum) => {
        const regionName = storeToRegionMap.get(storeNum);
        if (regionName) {
          regionNamesSet.add(regionName);
        }
      });
      setSelectedRegions(Array.from(regionNamesSet));
    }
  }, [value, storeToRegionMap, allRegionsData.length]);

  const handleChange = (newValue: string[]) => {
    setSelectedRegions(newValue);

    // Get store numbers using cached map
    const storeNumbers = newValue.flatMap(
      (regionName) => regionToStoresMap.get(regionName) || []
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
      value={selectedRegions}
      currentValue={selectedRegions}
      setCurrentValue={setSelectedRegions}
    />
  );
};

export default RegionSelector;

// import React, { useState, useEffect } from "react";
// import MultiSelectDropdown, {
//   fetchStoresAPI,
//   BuilderPluginProps,
// } from "./MultiSelectDropdown";
// import { CircularProgress } from "@mui/material";

// const RegionSelector = ({
//   onChange,
//   value,
//   context,
// }: BuilderPluginProps<string[]>) => {
//   const [region, setRegion] = useState(value?.length > 0 ? value : []);
//   const [options, setOptions] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   const builderEnvironment = context?.user?.currentOrganization;

//   useEffect(() => {
//     const loadRegions = async () => {
//       try {
//         setLoading(true);

//         const regions = await fetchStoresAPI("regions", builderEnvironment);
//         setOptions(regions);
//       } catch (err) {
//         console.error("Error fetching regions:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadRegions();
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
//       currentValue={region}
//       setCurrentValue={setRegion}
//     />
//   );
// };

// export default RegionSelector;
