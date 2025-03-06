const CONSTANTS = {
  RhoBuild: 192.22156048751998, // kg/m^3 Nominal density of bulding 12 lb/ft**3
  wm: 250, // Module area mass (kg / m^2)
  wf: 75, // Facade area mass (kg / m ^2)
  acclg: 9.807, // (accln due to graviTY: m / s**2)
  AccTargetBuild: (18 * 9.807) / 1000,
  FreqMod: 1.0, // 100 %
  MembraneFill: 0.55, // 55%
  ExtraVolumeFactor: 1.05, // 105%
  AdditionalLongitudinalClearance: 0.1, // 10 cm
  RoofClearance: 0, // Description TBD
  CylDiameter: 0.9, // 90 cm
  RhoWater: 998, // Density of water in kg / m**3
  HeatCapacityRatioAir: 1.4,
  Patm: 1.013e5, // N / m**2 (1 atm)
};

const DEBUG = true;

export interface building_properties {
  N: number; // number of floors
  H: number; // Building Height
  BX: number; // Building X- Width
  BY: number; // Building Y - Width
  units?: number; // Unit system 1 = US, 2 = SI (default = SI)
  S?: number; // Structural System (default = 1)
  TX?: number,
  TY?: number,
  ZetaX?: number;
  ZetaY?: number;
  WX?: number;
  WY?: number;
}

export interface damper_properties {
  LocX: number;
  LocY: number;
  ModL: number; // Module Length
  ModW: number; // Module width
  AccRedX: number; // acc reduction X
  AccRedY: number; // acc reduction Y
  ZetaTotalX: number; // total damping X
  ZetaTotalY: number; // total damping Y
  OptionX: boolean; // true if acc reduction is input
  OptionY: boolean; // false if total damping is input
}

export interface output_properties {
  TX: number;
  TY: number;
  ZetaX: number;
  ZetaY: number;
  WX: number;
  WY: number;
  AccRedX: number; // acc reduction X
  AccRedY: number; // acc reduction Y
  ZetaTotalX: number; // total damping X
  ZetaTotalY: number; // total damping Y  
}

export const BldgDynamics = (
  bldgProps: building_properties,
  damperProps: damper_properties
): output_properties => {
  // US -> SI
  const ft2m = (e: number) => 0.3048 * e;
  // const kgs2lbs = (e: number) => 2.205 * e;

  let { BX, BY, H } = bldgProps;
  const { N, units, S } = bldgProps;
  let { ModL, ModW, AccRedX, AccRedY, ZetaTotalX, ZetaTotalY } = damperProps;
  const { LocX, LocY, OptionX, OptionY } = damperProps;

  if (DEBUG) console.log("Inputs: ", bldgProps, damperProps);

  if (units === 1) {
    BX = ft2m(BX);
    BY = ft2m(BY);
    H = ft2m(H);
    ModL = ft2m(ModL);
    ModW = ft2m(ModW);
  }

  if (DEBUG) console.log("BX, BY, ModL, ModW =\n", BX, BY, ModL, ModW);

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

  // User override?
  TX = bldgProps.TX ? bldgProps.TX : TX;
  TY = bldgProps.TY ? bldgProps.TY : TY;
  ZetaX = bldgProps.ZetaX ? bldgProps.ZetaX : ZetaX;
  ZetaY = bldgProps.ZetaY ? bldgProps.ZetaY : ZetaY;
   

  // // Based on mathcad calcs
  // TX = H / (ft2m(10) * 10);
  // TY = H / (ft2m(10) * 10);
  // ZetaX = 0.007;
  // ZetaY = 0.007;

  if (DEBUG) console.log("TX, TY, ZetaX, ZetaY =\n", TX, TY, ZetaX, ZetaY);

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
  // const Wb = CONSTANTS.RhoBuild * BX * BY * H;
  const Wb = CONSTANTS.wm * (N * BX * BY) + CONSTANTS.wf * (2 * BX + 2 * BY) * H;

  // Modal Mass (tonnes / kips)
  const WX = bldgProps.WX ? bldgProps.WX : Beta(H, BX) * Wb;
  const WY = bldgProps.WY ? bldgProps.WY : Beta(H, BY) * Wb;

  if (DEBUG) console.log("Wb, WX, WY =\n", Wb, WX, WY);

  let ZetaAddHBX = ZetaTotalX - ZetaX;
  let ZetaAddHBY = ZetaTotalY - ZetaY;

  if (OptionX) {
    // Acceleration Reduction is given, Calculate ZetaTotal
    ZetaAddHBX = ZetaX * (1 / (AccRedX - 1) ** 2 - 1);
    ZetaTotalX = ZetaX + ZetaAddHBX;
  } else {
    // ZetaTotal given, Calculate Acceleration Reduction
    AccRedX = Math.sqrt(ZetaX / ZetaTotalX);
  }

  if (OptionY) {
    // Acceleration Reduction is given, Calculate ZetaTotal
    ZetaAddHBY = ZetaY * (1 / (AccRedY - 1) ** 2 - 1);
    ZetaTotalY = ZetaY + ZetaAddHBY;
  } else {
    // ZetaTotal given, Calculate Acceleration Reduction
    AccRedY = Math.sqrt(ZetaY / ZetaTotalY);
  }

  const AccRatioX = Math.sqrt(ZetaX / (ZetaX + ZetaAddHBX));
  const AccRatioY = Math.sqrt(ZetaY / (ZetaY + ZetaAddHBY));

  if (DEBUG) console.log(
    "ZetaX, ZetaAddHBX, ZetaTotalX =\n",
    ZetaX,
    ZetaAddHBX,
    ZetaTotalX
  );
  if (DEBUG) console.log(
    "ZetaY, ZetaAddHBY, ZetaTotalY =\n",
    ZetaY,
    ZetaAddHBY,
    ZetaTotalY
  );

  if (DEBUG) console.log("AccRedX, AccRatioX = \n", AccRedX, AccRatioX);
  if (DEBUG) console.log("AccRedY, AccRatioY = \n", AccRedY, AccRatioY);

  const temp_MuX =
    6 * ZetaAddHBX ** 2 +
    Math.sqrt(144 * ZetaAddHBX ** 4 + 40 * ZetaAddHBX ** 2 + 1) / 2 -
    0.5;
  const temp_MuY =
    6 * ZetaAddHBY ** 2 +
    Math.sqrt(144 * ZetaAddHBY ** 4 + 40 * ZetaAddHBY ** 2 + 1) / 2 -
    0.5;

  const MuX = Math.max(0.005, temp_MuX);
  const MuY = Math.max(0.005, temp_MuY);

  if (DEBUG) console.log("temp_MuX, mu_X =\n", temp_MuX, MuX);
  if (DEBUG) console.log("temp_MuY, mu_Y =\n", temp_MuY, MuY);

  const totalUsefulWaterMassX = WX * MuX;
  const totalUsefulWaterMassY = WY * MuY;

  const AccUndampedX = CONSTANTS.AccTargetBuild / AccRatioX;
  const AccUndampedY = CONSTANTS.AccTargetBuild / AccRatioY;

  const freqHBX = (Math.sqrt(1 + 0.5 * MuX) / (1 + MuX)) * (1 / TX);
  const freqHBY = (Math.sqrt(1 + 0.5 * MuY) / (1 + MuY)) * (1 / TY);

  const DispTargetBuildX =
    CONSTANTS.AccTargetBuild / (2 * Math.PI * freqHBX * CONSTANTS.FreqMod) ** 2;
  const DispTargetBuildY =
    CONSTANTS.AccTargetBuild / (2 * Math.PI * freqHBY * CONSTANTS.FreqMod) ** 2;

  const DispTargetHBX =
    (DispTargetBuildX * (1 + MuX)) / Math.sqrt(2 * MuX + 1.5 * MuX ** 2);
  const DispTargetHBY =
    (DispTargetBuildY * (1 + MuY)) / Math.sqrt(2 * MuY + 1.5 * MuY ** 2);

  const MembrangeLengthX =
    (DispTargetHBX / (1 - CONSTANTS.MembraneFill)) *
    CONSTANTS.ExtraVolumeFactor;
  const MembrangeLengthY =
    (DispTargetHBY / (1 - CONSTANTS.MembraneFill)) *
    CONSTANTS.ExtraVolumeFactor;

  if (DEBUG) console.log(
    "totalUsefulWaterMassX, AccUndampedX, freqHBX, DispTargetBuildX, DispTargetHBX =\n",
    totalUsefulWaterMassX,
    AccUndampedX,
    freqHBX,
    DispTargetBuildX,
    DispTargetHBX
  );
  if (DEBUG) console.log(
    "totalUsefulWaterMassY, AccUndampedY, freqHBY, DispTargetBuildY, DispTargetHBY =\n",
    totalUsefulWaterMassY,
    AccUndampedY,
    freqHBY,
    DispTargetBuildY,
    DispTargetHBY
  );

  let MaxCylLengthX = BX;
  let MaxCylLengthY = BY;

  if (LocX === 2) MaxCylLengthX = ModL;
  if (LocY === 2) MaxCylLengthY = ModL;

  // Deducting Roof Clearance
  MaxCylLengthX -= CONSTANTS.RoofClearance;
  MaxCylLengthY -= CONSTANTS.RoofClearance;

  const CenterLengthX =
    MaxCylLengthX -
    2 * MembrangeLengthX -
    CONSTANTS.AdditionalLongitudinalClearance;
  const CenterLengthY =
    MaxCylLengthY -
    2 * MembrangeLengthY -
    CONSTANTS.AdditionalLongitudinalClearance;

  if (DEBUG) console.log(
    "MembrangeLengthX, MaxCylLengthX, CenterLengthX = \n",
    MembrangeLengthX,
    MaxCylLengthX,
    CenterLengthX
  );
  if (DEBUG) console.log(
    "MembrangeLengthY, MaxCylLengthY, CenterLengthY = \n",
    MembrangeLengthY,
    MaxCylLengthY,
    CenterLengthY
  );

  const AreaCenter = (Math.PI * CONSTANTS.CylDiameter ** 2) / 4.0;
  const AreaMemHor = CONSTANTS.MembraneFill * AreaCenter;

  const AreaMemVertX = CONSTANTS.CylDiameter * MembrangeLengthX;
  const AreaMemVertY = CONSTANTS.CylDiameter * MembrangeLengthY;

  if (DEBUG) console.log("AreaCenter, AreaMemHor =\n", AreaCenter, AreaMemHor);
  if (DEBUG) console.log(
    "MaxCylLengthX, CenterLengthX, AreaMemVertX =\n",
    MaxCylLengthX,
    CenterLengthX,
    AreaMemVertX
  );
  if (DEBUG) console.log(
    "MaxCylLengthY, CenterLengthY, AreaMemVertY =\n",
    MaxCylLengthY,
    CenterLengthY,
    AreaMemVertY
  );

  const MassCenterX = CONSTANTS.RhoWater * AreaCenter * CenterLengthX;
  const MassCenterY = CONSTANTS.RhoWater * AreaCenter * CenterLengthY;

  const MassEndHorX = CONSTANTS.RhoWater * AreaMemHor * MembrangeLengthX;
  const MassEndHorY = CONSTANTS.RhoWater * AreaMemHor * MembrangeLengthY;

  const MassEndVertX = CONSTANTS.RhoWater * AreaMemHor * MembrangeLengthX;
  const MassEndVertY = CONSTANTS.RhoWater * AreaMemHor * MembrangeLengthY;

  const WaterMassPerCylinderX =
    CONSTANTS.RhoWater * AreaCenter * CenterLengthX +
    2 * CONSTANTS.RhoWater * AreaMemHor * MembrangeLengthX;
  const WaterMassPerCylinderY =
    CONSTANTS.RhoWater * AreaCenter * CenterLengthY +
    2 * CONSTANTS.RhoWater * AreaMemHor * MembrangeLengthY;

  if (DEBUG) console.log(
    "MassCenterX, MassEndHorX, MassEndVertX, WaterMassPerCylinderX =\n",
    MassCenterX,
    MassEndHorX,
    MassEndVertX,
    WaterMassPerCylinderX
  );
  if (DEBUG) console.log(
    "MassCenterY, MassEndHorY, MassEndVertY, WaterMassPerCylinderY =\n",
    MassCenterY,
    MassEndHorY,
    MassEndVertY,
    WaterMassPerCylinderY
  );

  const r1X = AreaMemVertX / AreaCenter;
  const r1Y = AreaMemVertY / AreaCenter;

  const r2X = AreaMemVertX / AreaMemHor;
  const r2Y = AreaMemVertY / AreaMemHor;

  const kStarX = 2 * CONSTANTS.RhoWater * CONSTANTS.acclg * AreaMemVertX;
  const kStarY = 2 * CONSTANTS.RhoWater * CONSTANTS.acclg * AreaMemVertY;

  const mStarX = MassCenterX * r1X ** 2 + MassEndHorX * r2X ** 2 + MassEndVertX;
  const mStarY = MassCenterY * r1Y ** 2 + MassEndHorY * r2Y ** 2 + MassEndVertY;

  const gammaStarX = MassCenterX * r1X + MassEndHorX * r2X;
  const gammaStarY = MassCenterY * r1Y + MassEndHorY * r2Y;

  const freqStarX = (1 / (2 * Math.PI)) * Math.sqrt(kStarX / mStarX);
  const freqStarY = (1 / (2 * Math.PI)) * Math.sqrt(kStarY / mStarY);

  if (DEBUG) console.log(
    "r1X, r2X, kStarX, mStarX, gammaStarX, freqStarX =\n",
    r1X,
    r2X,
    kStarX,
    mStarX,
    gammaStarX,
    freqStarX
  );
  if (DEBUG) console.log(
    "r1Y, r2Y, kStarY, mStarY, gammaStarY, freqStarY =\n",
    r1Y,
    r2Y,
    kStarY,
    mStarY,
    gammaStarY,
    freqStarY
  );

  const massUsefulX = gammaStarX ** 2 / mStarX;
  const massUsefulY = gammaStarY ** 2 / mStarY;

  const kGravityX = (2 * Math.PI * freqStarX) ** 2 * massUsefulX;
  const kGravityY = (2 * Math.PI * freqStarY) ** 2 * massUsefulY;

  const kAirSpringX = (2 * Math.PI * freqHBX) ** 2 * massUsefulX - kGravityX;
  const kAirSpringY = (2 * Math.PI * freqHBY) ** 2 * massUsefulY - kGravityY;

  const kTotalX = kGravityX + kAirSpringX;
  const kTotalY = kGravityY + kAirSpringY;

  if (DEBUG) console.log(
    "massUsefulX, kGravityX, kAirSpringX, kTotalX =\n",
    massUsefulX,
    kGravityX,
    kAirSpringX,
    kTotalX
  );
  if (DEBUG) console.log(
    "massUsefulY, kGravityY, kAirSpringY, kTotalY =\n",
    massUsefulY,
    kGravityY,
    kAirSpringY,
    kTotalY
  );

  const AreaAir = (Math.PI * CONSTANTS.CylDiameter ** 2) / 4;
  const VolAirTotalX =
    (CONSTANTS.HeatCapacityRatioAir * CONSTANTS.Patm * AreaAir ** 2) /
    kAirSpringX;
  const VolAirTotalY =
    (CONSTANTS.HeatCapacityRatioAir * CONSTANTS.Patm * AreaAir ** 2) /
    kAirSpringY;

  const VolAirInsideWaterCylX =
    (CONSTANTS.AdditionalLongitudinalClearance / 2) * AreaCenter +
    MembrangeLengthX * (AreaCenter - AreaMemHor);
  const VolAirInsideWaterCylY =
    (CONSTANTS.AdditionalLongitudinalClearance / 2) * AreaCenter +
    MembrangeLengthY * (AreaCenter - AreaMemHor);

  const VolAirCylX = VolAirTotalX - VolAirInsideWaterCylX;
  const VolAirCylY = VolAirTotalY - VolAirInsideWaterCylY;

  const EachAirCylLengthX = VolAirCylX / AreaAir;
  const EachAirCylLengthY = VolAirCylY / AreaAir;

  if (DEBUG) console.log(
    "AreaAir, VolAirTotalX, VolAirInsideWaterCylX, VolAirCylX, EachAirCylLengthX =\n",
    AreaAir,
    VolAirTotalX,
    VolAirInsideWaterCylX,
    VolAirCylX,
    EachAirCylLengthX
  );
  if (DEBUG) console.log(
    "AreaAir, VolAirTotalY, VolAirInsideWaterCylY, VolAirCylY, EachAirCylLengthY =\n",
    AreaAir,
    VolAirTotalY,
    VolAirInsideWaterCylY,
    VolAirCylY,
    EachAirCylLengthY
  );

  const ExactNumWaterCylindersX = totalUsefulWaterMassX / massUsefulX;
  const ExactNumWaterCylindersY = totalUsefulWaterMassY / massUsefulY;

  const RoundUpNumWaterCylindersX = Math.ceil(ExactNumWaterCylindersX);
  const RoundUpNumWaterCylindersY = Math.ceil(ExactNumWaterCylindersY);

  const TotalLengthAirCylinderX = RoundUpNumWaterCylindersX * EachAirCylLengthX;
  const TotalLengthAirCylinderY = RoundUpNumWaterCylindersY * EachAirCylLengthY;

  const ExactNumAirCylindersX = TotalLengthAirCylinderX / MaxCylLengthX;
  const ExactNumAirCylindersY = TotalLengthAirCylinderY / MaxCylLengthY;

  const RoundUpNumAirCylindersX = Math.ceil(ExactNumAirCylindersX);
  const RoundUpNumAirCylindersY = Math.ceil(ExactNumAirCylindersY);

  if (DEBUG) console.log(
    "ExactNumWaterCylindersX, RoundUpNumWaterCylindersX, TotalLengthAirCylinderX, ExactNumAirCylindersX, RoundUpNumAirCylindersX =\n",
    ExactNumWaterCylindersX,
    RoundUpNumWaterCylindersX,
    TotalLengthAirCylinderX,
    ExactNumAirCylindersX,
    RoundUpNumAirCylindersX
  );
  if (DEBUG) console.log(
    "ExactNumWaterCylindersY, RoundUpNumWaterCylindersY, TotalLengthAirCylinderY, ExactNumAirCylindersY, RoundUpNumAirCylindersY =\n",
    ExactNumWaterCylindersY,
    RoundUpNumWaterCylindersY,
    TotalLengthAirCylinderY,
    ExactNumAirCylindersY,
    RoundUpNumAirCylindersY
  );

  // Return
  return {
    TX,
    TY,
    ZetaX,
    ZetaY,
    WX,
    WY,
    AccRedX,
    AccRedY,
    ZetaTotalX,
    ZetaTotalY
  };
};

export default BldgDynamics;
