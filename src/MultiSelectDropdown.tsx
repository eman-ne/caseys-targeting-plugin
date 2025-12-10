import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

const reshapeDistrictsData = () => {};

export const fetchStoresAPI = async (
  storesListType: "divisions" | "regions" | "districts",
  builderEnvironment?: string
): Promise<string[]> => {
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

  const data = await response.json();

  console.log("DATA", data);

  const districtNames =
    data?.data?.map((item: { name: string }) => item?.name).sort() || [];

  const districtStoreNumbers =
    data?.data?.flatMap(
      (district: any) =>
        district._links?.children?.map((child: { href: string }) =>
          child.href.split("/").pop()
        ) || []
    ) || [];

  console.log("STOR NUMBERS", districtStoreNumbers);

  return data?.data?.map((item: { name: string }) => item?.name).sort() || [];
};

const MultiSelectDropdown = (props: MultiSelectDropdownProps) => {
  const { options, onChange, value, currentValue, setCurrentValue } = props;
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    const realValue = typeof value === "string" ? value.split(",") : value;
    onChange(realValue);
    setCurrentValue(realValue);
  };

  return (
    <FormControl sx={{ m: 0, width: 200 }}>
      <Select
        multiple
        value={value ?? currentValue}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        {options?.length > 0 &&
          options.map((option: any) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                checked={
                  value?.includes(option) ?? currentValue.includes(option)
                }
              />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelectDropdown;
