import { Builder } from "@builder.io/react";
import UsStateSelector from "./UsStateSelector";
import DivisionSelector from "./DivisionSelector";
import RegionSelector from "./RegionSelector";
import DistrictSelector from "./DistrictSelector";
import StoreNumberInput from "./StoreNumberInput";

Builder.registerEditor({
  name: "US State Selector Logs",
  component: UsStateSelector,
});

// Builder.registerEditor({
//   name: "US State Selector",
//   component: UsStateSelector,
// });

Builder.registerEditor({
  name: "Division Selector",
  component: DivisionSelector,
});

Builder.registerEditor({
  name: "Region Selector",
  component: RegionSelector,
});

Builder.registerEditor({
  name: "District Selector",
  component: DistrictSelector,
});

Builder.registerEditor({
  name: "Store Number Input",
  component: StoreNumberInput,
});
