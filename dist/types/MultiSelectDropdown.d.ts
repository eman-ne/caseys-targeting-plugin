import React from "react";
export type BuilderPluginProps<T> = {
    onChange: (value: T) => void;
    value: T;
};
type MultiSelectDropdownProps = BuilderPluginProps<string[]> & {
    options: string[];
    currentValue: string[];
    setCurrentValue: (value: string[]) => void;
};
export declare const fetchStoresAPI: (storesListType: "divisions" | "regions" | "districts") => Promise<string[]>;
declare const MultiSelectDropdown: ({ options, onChange, value, currentValue, setCurrentValue, }: MultiSelectDropdownProps) => React.JSX.Element;
export default MultiSelectDropdown;
