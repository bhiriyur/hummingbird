const CONSTANTS = {
  wm: 250, // Module area mass (kg / m^2)
  wf: 75, // Facade area mass (kg / m ^2)
  acclg: 9.807, // (accln due to graviTY: m / s**2)
  AccTargetBuild: 18*9.807/1000,
  FreqMod: 1.0, // 100 %
  MembraneFill: 0.55, // 55%
  ExtraVolumeFactor: 1.05, // 105%
  AdditionalLongitudinalClearance: 0.1, // 10 cm
  CylDiameter: 0.9, // 90 cm
  RhoWater: 998, // Density of water in kg / m**3
  HeatCapacityRatioAir: 1.4,
  Patm: 1.013e5,   // N / m**2 (1 atm)
};

enum unit_systems {
  US = 1, // kips, ft, s
  SI = 2, // tonne, m, s
}

enum structural_systems {
  "Modules only (steel moment-resisting frame)" = 1,
  "Modules + Steel branced frame" = 2,
  "Modules + Concrete shear walls" = 3,
}

interface building_properties {
  N: number; // number of floors
  H: number; // Building Height
  BX: number; // Building X- Width
  BY: number; // Building Y - Width
  units?: unit_systems; // Unit system (default = SI)
  S?: structural_systems; // Structural System (default = 1)
}

enum damper_locations {
  "On Roof" = 1,
  "In Modules" = 2,
}

interface damper_properties {
  LocX: damper_locations;
  LocY: damper_locations;
  ModL: number; // Module Length
  ModW: number; // Module width
  AccRedX: number; // acc reduction X
  AccRedY: number; // acc reduction Y
  ZetaTotalX: number; // total damping X
  ZetaTotalY: number; // total damping Y
  OptionX: boolean; // true if acc reduction is input
  OptionY: boolean; // false if total damping is input
}

interface output_properties {
  TX: number;
  TY: number;
  ZetaX: number;
  ZetaY: number;
  WX: number;
  WY: number;
}

const BldgDynamics = (
  bldgProps: building_properties,
  damperProps: damper_properties
): output_properties => {
  // US -> SI
  const ft2m = (e: number) => 0.3048 * e;
  const kgs2lbs = (e: number) => 2.205 * e;

  let { BX, BY, N, H, units, S } = bldgProps;
  let {
    LocX,
    LocY,
    ModL,
    ModW,
    AccRedX,
    AccRedY,
    ZetaTotalX,
    ZetaTotalY,
    OptionX,
    OptionY,
  } = damperProps;

  console.log("Inputs: ",  bldgProps, damperProps);

  if (units === 1) {
    BX = ft2m(BX);
    BY = ft2m(BY);
    ModL = ft2m(ModL);
    ModW = ft2m(ModW);
  }

  console.log("BX, BY, ModL, ModW = ", BX, BY, ModL, ModW);

  // Period and Intrinsic Damping
  let TX, TY, ZetaX, ZetaY;
  if (S === 1) {
    TX = N / 10;
    TY = N / 10;
    ZetaX = 1.0 / 100;
    ZetaY = 1.0 / 100;
  } else if (S === 2) {
    TX = N / 12;
    TY = N / 12;
    ZetaX = 1.0 / 100;
    ZetaY = 1.0 / 100;
  } else {
    TX = N / 12;
    TY = N / 12;
    ZetaX = 1.5 / 100;
    ZetaY = 1.5 / 100;
  }

  console.log("TX, TY, ZetaX, ZetaY = ", TX, TY, ZetaX, ZetaY)

  const Beta = (H: number, B: number) => {
    // Beta coefficient for Modal mass calcs
    const H_BY_B = H / B;

    // Chart interpolation
    if (H_BY_B >= 3.0) {
      return 0.25;
    } else if (H_BY_B <= 1.0) {
      return 0.5;
    } else {
      return 0.5 - ((H_BY_B - 1) * 0.25) / 2;
    }
  };

  // Building Mass
  const Wb =
    CONSTANTS.wm * (N * BX * BY) +
    CONSTANTS.wf * (2 * BX + 2 * BY) * H;

  // Modal Mass (tonnes / kips)
  const WX = (units == 1 ? kgs2lbs(1) : 1) * Beta(H, BX) * Wb * 0.001;
  const WY = (units == 1 ? kgs2lbs(1) : 1) * Beta(H, BY) * Wb * 0.001;

  console.log("Wb, WX, WY = ", Wb, WX, WY);

  let ZetaAddHBX = ZetaTotalX - ZetaX;
  let ZetaAddHBY = ZetaTotalY - ZetaY;

  if (OptionX) {
    ZetaAddHBX = ZetaX * (1 / (AccRedX / 100 - 1) ** 2 - 1);
    ZetaTotalX = ZetaX + ZetaAddHBX;
  }

  if (OptionY) {
    ZetaAddHBY = ZetaY * (1 / (AccRedY / 100 - 1) ** 2 - 1);
    ZetaTotalY = ZetaY + ZetaAddHBY;
  }

  const AccRatioX = Math.sqrt(ZetaX / (ZetaX + ZetaAddHBX));
  const AccRatioY = Math.sqrt(ZetaY / (ZetaY + ZetaAddHBY));

  console.log("ZetaAddHBX, ZetaTotalX, AccRatioX = ", ZetaAddHBX, ZetaTotalX, AccRatioX);
  console.log("ZetaAddHBY, ZetaTotalY, AccRatioY = ", ZetaAddHBY, ZetaTotalY, AccRatioY);

  const temp_MuX =
    6 * ZetaAddHBX ** 2 +
    Math.sqrt(144 * ZetaAddHBX ** 4 + 40 * ZetaAddHBX ** 2 + 1) / 2 -
    0.5;
  const temp_MuY =
    6 * ZetaAddHBY ** 2 +
    Math.sqrt(144 * ZetaAddHBY ** 4 + 40 * ZetaAddHBY ** 2 + 1) / 2 -
    0.5;

  const MuX = Math.max(0.5, temp_MuX);
  const MuY = Math.max(0.5, temp_MuY);

  console.log("temp_MuX, mu_X = ", temp_MuX, MuX);
  console.log("temp_MuY, mu_Y = ", temp_MuY, MuY);

  const totalUsefulWaterMassX = WX * MuX;
  const totalUsefulWaterMassY = WY * MuY;

  const AccUndampedX = CONSTANTS.AccTargetBuild / AccRatioX;
  const AccUndampedY = CONSTANTS.AccTargetBuild / AccRatioY;

  const freqHBX = Math.sqrt(1 + 0.5 * MuX) / (1 + MuX) * (1 / TX);
  const freqHBY = Math.sqrt(1 + 0.5 * MuY) / (1 + MuY) * (1 / TY);

  const DispTargetBuildX = CONSTANTS.AccTargetBuild / (2 * Math.PI * freqHBX * CONSTANTS.FreqMod) ** 2;
  const DispTargetBuildY = CONSTANTS.AccTargetBuild / (2 * Math.PI * freqHBY * CONSTANTS.FreqMod) ** 2;

  const DispTargetHBX = DispTargetBuildX * (1 + MuX) / (Math.sqrt(2 * MuX + 1.5 * (MuX) ** 2));
  const DispTargetHBY = DispTargetBuildY * (1 + MuY) / (Math.sqrt(2 * MuY + 1.5 * (MuY) ** 2));

  const MembrangeLengthX = DispTargetHBX / (1 - CONSTANTS.MembraneFill) * CONSTANTS.ExtraVolumeFactor;
  const MembrangeLengthY = DispTargetHBY / (1 - CONSTANTS.MembraneFill) * CONSTANTS.ExtraVolumeFactor;

  console.log("totalUsefulWaterMassX, AccUndampedX, freqHBX, DispTargetBuildX, MembrangeLengthX = ", totalUsefulWaterMassX, AccUndampedX, freqHBX, DispTargetBuildX, MembrangeLengthX)
  console.log("totalUsefulWaterMassY, AccUndampedY, freqHBY, DispTargetBuildY, MembrangeLengthY = ", totalUsefulWaterMassY, AccUndampedY, freqHBY, DispTargetBuildY, MembrangeLengthY)

  let MaxCycleLengthX = BX;
  let MaxCycleLengthY = BY;

  if (LocX === 2) MaxCycleLengthX = ModL;
  if (LocY === 2) MaxCycleLengthY = ModL;

  const CenterLengthX = MaxCycleLengthX - 2 * MembrangeLengthX - CONSTANTS.AdditionalLongitudinalClearance;
  const CenterLengthY = MaxCycleLengthY - 2 * MembrangeLengthY - CONSTANTS.AdditionalLongitudinalClearance;

  const AreaCenter = Math.PI * CONSTANTS.CylDiameter ** 2 / 4.0;
  const AreaMemHor = CONSTANTS.MembraneFill * AreaCenter;
  
  const AreaMemVertX = CONSTANTS.CylDiameter * MembrangeLengthX;
  const AreaMemVertY = CONSTANTS.CylDiameter * MembrangeLengthY;

  const MassCenterX = CONSTANTS.RhoWater * AreaCenter * CenterLengthX;
  const MassCenterY = CONSTANTS.RhoWater * AreaCenter * CenterLengthY;

  const MassEndHorX = CONSTANTS.RhoWater * AreaMemHor * MembrangeLengthX;
  const MassEndHorY = CONSTANTS.RhoWater * AreaMemHor * MembrangeLengthY;

  const MassEndVertX = CONSTANTS.RhoWater * AreaMemVertX * MembrangeLengthX;
  const MassEndVertY = CONSTANTS.RhoWater * AreaMemVertY * MembrangeLengthY;

  const WaterMassPerCylinderX = CONSTANTS.RhoWater * AreaCenter * CenterLengthX + 2 * CONSTANTS.RhoWater * AreaMemHor * MembrangeLengthX;
  const WaterMassPerCylinderY = CONSTANTS.RhoWater * AreaCenter * CenterLengthY + 2 * CONSTANTS.RhoWater * AreaMemHor * MembrangeLengthY;

  const r1X = AreaMemVertX / AreaCenter;
  const r1Y = AreaMemVertY / AreaCenter;

  const r2X = AreaMemVertX / AreaMemHor;
  const r2Y = AreaMemVertY / AreaMemHor;

  const kStarX = 2 * CONSTANTS.RhoWater * CONSTANTS.acclg * AreaMemVertX;
  const kStarY = 2 * CONSTANTS.RhoWater * CONSTANTS.acclg * AreaMemVertY;

  const mStarX = MassCenterX * r1X + MassEndHorX * (r2X ** 2) + MassEndVertX;
  const mStarY = MassCenterY * r1Y + MassEndHorY * (r2Y ** 2) + MassEndVertY;

  const gammaStarX = MassCenterX * r1X + MassEndHorX * r2X;
  const gammaStarY = MassCenterY * r1Y + MassEndHorY * r2Y;

  const freqStarX = 1 / (2 * Math.PI) * Math.sqrt(kStarX / mStarX);
  const freqStarY = 1 / (2 * Math.PI) * Math.sqrt(kStarY / mStarY);

  const massUsefulX = (gammaStarX ** 2) / mStarX;
  const massUsefulY = (gammaStarY ** 2) / mStarY;

  const kGravityX = ((2 * Math.PI * freqStarX) ** 2) * massUsefulX;
  const kGravityY = ((2 * Math.PI * freqStarY) ** 2) * massUsefulY;

  const kAirSpringX = ((2 * Math.PI * freqHBX) ** 2) * massUsefulX - kGravityX;
  const kAirSpringY = ((2 * Math.PI * freqHBY) ** 2) * massUsefulY - kGravityY;

  const kTotalX = kGravityX + kAirSpringX;
  const kTotalY = kGravityY + kAirSpringY;

  const AreaAir = Math.PI * (CONSTANTS.CylDiameter ** 2) / 4;
  const VolAirTotalX = CONSTANTS.HeatCapacityRatioAir * CONSTANTS.Patm * (AreaAir ** 2) / kAirSpringX;
  const VolAirTotalY = CONSTANTS.HeatCapacityRatioAir * CONSTANTS.Patm * (AreaAir ** 2) / kAirSpringY;

  const VolAirInsideWaterCylX = CONSTANTS.AdditionalLongitudinalClearance / 2 * AreaCenter + MembrangeLengthX * (AreaCenter - AreaMemHor);
  const VolAirInsideWaterCylY = CONSTANTS.AdditionalLongitudinalClearance / 2 * AreaCenter + MembrangeLengthY * (AreaCenter - AreaMemHor);

  const VolAirCylX = VolAirTotalX - VolAirInsideWaterCylX;
  const VolAirCylY = VolAirTotalY - VolAirInsideWaterCylY;

  const EachAirCylLengthX = VolAirCylX / AreaAir;
  const EachAirCylLengthY = VolAirCylY / AreaAir;

  const ExactNumWaterCylindersX = totalUsefulWaterMassX / massUsefulX;
  const ExactNumWaterCylindersY = totalUsefulWaterMassY / massUsefulY;

  const RoundUpNumWaterCylindersX = Math.ceil(ExactNumWaterCylindersX);
  const RoundUpNumWaterCylindersY = Math.ceil(ExactNumWaterCylindersY);

  const TotalLengthAirCylinderX = RoundUpNumWaterCylindersX * EachAirCylLengthX;
  const TotalLengthAirCylinderY = RoundUpNumWaterCylindersY * EachAirCylLengthY;

  const ExactNumAirCylindersX = TotalLengthAirCylinderX / MaxCycleLengthX;
  const ExactNumAirCylindersY = TotalLengthAirCylinderY / MaxCycleLengthY;

  const RoundUpNumAirCylindersX = Math.ceil(ExactNumAirCylindersX);
  const RoundUpNumAirCylindersY = Math.ceil(ExactNumAirCylindersY);


  // Return
  return {
    TX,
    TY,
    ZetaX,
    ZetaY,
    WX,
    WY,
  };
};

export default BldgDynamics;
