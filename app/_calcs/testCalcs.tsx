import { buildingProps, damperProps, outputProps } from "../common/types";

import { BldgDynamics } from "./calcs";

const building: buildingProps = {
  N: 42,
  BZ: 400,
  BX: 80,
  BY: 55,
  units: 1,
  S: 1,
  LOGS: "",
};

const damper: damperProps = {
  LocX: 2,
  LocY: 2,
  ModL: 20,
  ModW: 8,
  AccRedX: 0.4,
  AccRedY: 0.3,
  ZetaTotalX: 0.025,
  ZetaTotalY: 0.012,
  OptionX: false,
  OptionY: false,
};

const output: outputProps = BldgDynamics(building, damper);

console.log("Output = ", output);
