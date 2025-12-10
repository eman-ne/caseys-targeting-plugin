export declare const fetchStoresAPI: (storesListType: "divisions" | "regions" | "districts", builderEnvironment?: string) => Promise<{
    names: string[];
    data: any[];
}>;
export declare const extractIdFromHref: (href: string) => string;
export declare const getStoreNumbersFromDistricts: (districts: any[]) => string[];
export declare const getStoreNumbersFromRegions: (regions: any[], builderEnvironment?: string) => Promise<string[]>;
export declare const getStoreNumbersFromDivisions: (divisions: any[], builderEnvironment?: string) => Promise<string[]>;
