import { Builder } from "@builder.io/react";
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
  context: any;
};

type UsStateLocations = string[];

const states = [
  "Arkansas",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Michigan",
  "Minnesota",
  "Missouri",
  "Nebraska",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "South Dakota",
  "Tennessee",
  "Wisconsin",
];

const CaseysLocationSelector = (
  props: BuilderPluginProps<UsStateLocations>
) => {
  const [location, setLocation] = React.useState(
    props?.value?.length > 0 ? props.value : []
  );

  const handleChange = (event: SelectChangeEvent<typeof location>) => {
    const {
      target: { value },
    } = event;

    const realValue = typeof value === "string" ? value.split(",") : value;
    props?.onChange(realValue);
    setLocation(realValue);
  };

  return (
    <FormControl sx={{ m: 0, width: 200 }}>
      <Select
        multiple
        value={props?.value ?? location}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        {states.map((usState) => (
          <MenuItem key={usState} value={usState}>
            <Checkbox
              checked={
                props?.value?.includes(usState) ?? location.includes(usState)
              }
            />
            <ListItemText primary={usState} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

Builder.registerEditor({
  name: "CaseysLocationSelector",
  component: CaseysLocationSelector,
});
