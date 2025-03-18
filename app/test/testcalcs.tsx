import { BldgDynamics } from "../common/calcs";
import { buildingProps, damperProps, outputProps } from "../common/types";

const building: buildingProps = {
  N: 42,
  BZ: 400,
  BX: 80,
  BY: 55,
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

const units = 1;
const output: outputProps = BldgDynamics(building, damper, units);

console.log("Output = ", output);
