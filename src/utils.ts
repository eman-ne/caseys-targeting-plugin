export const fetchStoresAPI = async (
  storesListType: "divisions" | "regions" | "districts",
  builderEnvironment?: string
): Promise<{ names: string[]; data: any[] }> => {
  // Changed return type here
  const environmentUrl =
    builderEnvironment === "701cf9c2b6384dbc814645e6d7dc14ea"
      ? "https://caseys.com/api/stores?storesListType="
      : "https://dev.caseys.com/api/stores?storesListType=";
  const environmentEncryptedToken =
    builderEnvironment === "701cf9c2b6384dbc814645e6d7dc14ea"
      ? "c6f8decb14728e894366511c7d14f9ee027d951b5a3bea0d63fcf89a676e949bcd9d097039a479892827cdc5df563a4cad8f9a6ac20d85a3db0f9803432bb8470ad954bbd71a3bb9fe98c57922aee653"
      : "1bcc714b4ab876b3bbbeacb063d60111008c9647aeb8b3ceca6bf9298294736a9f09ee4d95f4fa8b3e2948e16a433fb29873ca188e0e21ef1996665ec3bf3015531ff833627df94729dbe0fdf816c638";

  const response = await fetch(`${environmentUrl}${storesListType}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${environmentEncryptedToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  const names =
    result?.data?.map((item: { name: string }) => item?.name).sort() || [];

  // Return both names and full data
  return {
    names,
    data: result?.data || [],
  };
};

// Helper to extract ID from href
export const extractIdFromHref = (href: string): string => {
  return href.split("/").pop() || "";
};

// Get store numbers from districts
export const getStoreNumbersFromDistricts = (districts: any[]): string[] => {
  return districts.flatMap(
    (district) =>
      district._links?.children?.map((child: { href: string }) =>
        extractIdFromHref(child.href)
      ) || []
  );
};

// Get store numbers from regions (needs to fetch districts)
export const getStoreNumbersFromRegions = async (
  regions: any[],
  builderEnvironment?: string
): Promise<string[]> => {
  // Get all district IDs from regions
  const districtIds = regions.flatMap(
    (region) =>
      region._links?.children?.map((child: { href: string }) =>
        extractIdFromHref(child.href)
      ) || []
  );

  // Fetch all districts data
  const { data: allDistricts } = await fetchStoresAPI(
    "districts",
    builderEnvironment
  );

  // Filter to only selected districts and get their stores
  const selectedDistricts = allDistricts.filter((d) =>
    districtIds.includes(d.id.toString())
  );

  return getStoreNumbersFromDistricts(selectedDistricts);
};

// Get store numbers from divisions (needs to fetch regions and districts)
export const getStoreNumbersFromDivisions = async (
  divisions: any[],
  builderEnvironment?: string
): Promise<string[]> => {
  // Get all region IDs from divisions
  const regionIds = divisions.flatMap(
    (division) =>
      division._links?.children?.map((child: { href: string }) =>
        extractIdFromHref(child.href)
      ) || []
  );

  // Fetch all regions data
  const { data: allRegions } = await fetchStoresAPI(
    "regions",
    builderEnvironment
  );

  // Filter to only selected regions
  const selectedRegions = allRegions.filter((r) =>
    regionIds.includes(r.id.toString())
  );

  // Get stores from those regions
  return getStoreNumbersFromRegions(selectedRegions, builderEnvironment);
};
