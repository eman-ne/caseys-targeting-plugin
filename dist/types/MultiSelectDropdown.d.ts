import React from "react";
export type BuilderPluginProps<T> = {
    onChange: (value: T) => void;
    value: T;
    context?: {
        user?: {
            currentOrganization?: string;
        };
    };
};
type MultiSelectDropdownProps = BuilderPluginProps<string[]> & {
    options: string[];
    currentValue: string[];
    setCurrentValue: (value: string[]) => void;
};
export declare const fetchStoresAPI: (storesListType: "divisions" | "regions" | "districts", builderEnvironment?: string) => Promise<string[]>;
declare const MultiSelectDropdown: (props: MultiSelectDropdownProps) => React.JSX.Element;
export default MultiSelectDropdown;
