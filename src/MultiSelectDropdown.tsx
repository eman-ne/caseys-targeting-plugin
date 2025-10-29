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
};

type MultiSelectDropdownProps = BuilderPluginProps<string[]> & {
  options: string[];
  currentValue: string[];
  setCurrentValue: (value: string[]) => void;
};

export const fetchStoresAPI = async (
  storesListType: "divisions" | "regions" | "districts"
): Promise<string[]> => {
  const token = "";

  const response = await fetch(
    `https://dev.caseys.com/api/stores?storesListType=${storesListType}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data?.data?.map((item: { name: string }) => item?.name).sort() || [];
};

const MultiSelectDropdown = ({
  options,
  onChange,
  value,
  currentValue,
  setCurrentValue,
}: MultiSelectDropdownProps) => {
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
