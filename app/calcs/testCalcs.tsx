import {
  BldgDynamics,
  building_properties,
  damper_properties,
  output_properties,
} from "./calcs";

const bldgProps: building_properties = {
  N: 42,
  H: 400,
  BX: 80,
  BY: 55,
  units: 1,
  S: 1,
};

const damperProps: damper_properties = {
  LocX: 2,
  LocY: 2,
  ModL: 40,
  ModW: 8,
  AccRedX: 0.4,
  AccRedY: 0.3,
  ZetaTotalX: 0.025,
  ZetaTotalY: 0.012,
  OptionX: false,
  OptionY: false,
};

const op: output_properties = BldgDynamics(bldgProps, damperProps);

console.log("Output = ", op);
