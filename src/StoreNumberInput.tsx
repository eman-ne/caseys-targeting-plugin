import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const StoreNumberInput = ({ onChange, value: builderValue }: any) => {
  console.log("STORE NUMBER VALUE", builderValue);

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    const realValue = typeof value === "string" ? value.split(",") : value;
    onChange(realValue);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        id="outlined-basic"
        variant="outlined"
        value={builderValue}
        onChange={handleChange}
      />
    </Box>
  );
};

export default StoreNumberInput;
