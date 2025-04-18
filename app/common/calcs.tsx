import { buildingProps, damperProps, outputProps } from "../common/types";

export const CONSTANTS = {
  RhoBuild: 192.22156048751998, // kg/m^3 Nominal density of bulding 12 lb/ft**3
  wm: 250, // Module area mass (kg / m^2)
  wf: 75, // Facade area mass (kg / m ^2)
  acclg: 9.80665, // (accln due to graviTY: m / s**2)
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

const writeLog = (...args: any[]) => {
  let output = "";

  output += args[0];
  for (let i = 1; i < args.length; i++) {
    output += String(args[i]) + (i < args.length - 1 ? ", " : "");
  }

  output += "\n\n";

  return output;
};

export const BldgDynamics = (
  building: buildingProps,
  damper: damperProps,
  units: number
): outputProps => {
  // US -> SI
  const ft2m = (e: number) => 0.3048 * e;
  const m2ft = (e: number) => 3.28084 * e;
  const kgs2lbs = (e: number) => 2.205 * e;
  const lbs2kgs = (e: number) => 0.453592 * e;

  let { BX, BY, BZ: H } = building;
  const { N, S } = building;
  let { ModL, ModW, AccRedX, AccRedY, ZetaTotalX, ZetaTotalY } = damper;
  const { LocX, LocY, OptionX, OptionY } = damper;

  let CalcLogs =
    "NOTE: ALL CALCULATIONS ARE PERFORMED IN SI UNITS.\n\n";
  units = units || 1;
  CalcLogs += writeLog("UNITS =\n", units);

  if (units === 1) {
    BX = ft2m(BX);
    BY = ft2m(BY);
    H = ft2m(H);
    ModL = ft2m(ModL);
    ModW = ft2m(ModW);
  }

  CalcLogs += writeLog("BX, BY, ModL, ModW =\n", BX, BY, ModL, ModW);

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
  TX = building.TX ? building.TX : TX;
  TY = building.TY ? building.TY : TY;
  ZetaX = building.ZetaX ? building.ZetaX : ZetaX;
  ZetaY = building.ZetaY ? building.ZetaY : ZetaY;

  // // Based on mathcad calcs
  // TX = H / (ft2m(10) * 10);
  // TY = H / (ft2m(10) * 10);
  // ZetaX = 0.007;
  // ZetaY = 0.007;

  CalcLogs += writeLog("TX, TY, ZetaX, ZetaY =\n", TX, TY, ZetaX, ZetaY);

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
  const Wb =
    CONSTANTS.wm * (N * BX * BY) + CONSTANTS.wf * (2 * BX + 2 * BY) * H;

  // Modal Mass (tonnes / kips)
  let WX = Beta(H, BX) * Wb;
  let WY = Beta(H, BY) * Wb;

  if (building.WX) WX = units == 1 ? lbs2kgs(building.WX) : building.WX;
  if (building.WY) WY = units == 1 ? lbs2kgs(building.WY) : building.WY;

  CalcLogs += writeLog("Wb, WX, WY =\n", Wb, WX, WY);

  let ZetaAddHBX;
  let ZetaAddHBY;

  if (!OptionX) {
    // Acceleration Reduction is given, Calculate ZetaTotal
    ZetaAddHBX = ZetaX * (1 / (AccRedX - 1) ** 2 - 1);
    ZetaTotalX = ZetaX + ZetaAddHBX;
  } else {
    // ZetaTotal given, Calculate Acceleration Reduction
    ZetaAddHBX = ZetaTotalX - ZetaX;
    AccRedX = 1 - Math.sqrt(ZetaX / ZetaTotalX);
  }

  if (!OptionY) {
    // Acceleration Reduction is given, Calculate ZetaTotal
    ZetaAddHBY = ZetaY * (1 / (AccRedY - 1) ** 2 - 1);
    ZetaTotalY = ZetaY + ZetaAddHBY;
  } else {
    // ZetaTotal given, Calculate Acceleration Reduction
    ZetaAddHBY = ZetaTotalY - ZetaY;
    AccRedY = 1 - Math.sqrt(ZetaY / ZetaTotalY);
  }

  const AccRatioX = Math.sqrt(ZetaX / ZetaTotalX);
  const AccRatioY = Math.sqrt(ZetaY / ZetaTotalY);

  CalcLogs += writeLog(
    "ZetaX, ZetaAddHBX, ZetaTotalX =\n",
    ZetaX,
    ZetaAddHBX,
    ZetaTotalX
  );
  CalcLogs += writeLog(
    "ZetaY, ZetaAddHBY, ZetaTotalY =\n",
    ZetaY,
    ZetaAddHBY,
    ZetaTotalY
  );

  CalcLogs += writeLog("AccRedX, AccRatioX = \n", AccRedX, AccRatioX);
  CalcLogs += writeLog("AccRedY, AccRatioY = \n", AccRedY, AccRatioY);

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

  CalcLogs += writeLog("temp_MuX, mu_X =\n", temp_MuX, MuX);
  CalcLogs += writeLog("temp_MuY, mu_Y =\n", temp_MuY, MuY);

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

  CalcLogs += writeLog(
    "totalUsefulWaterMassX, AccUndampedX, freqHBX, DispTargetBuildX, DispTargetHBX =\n",
    totalUsefulWaterMassX,
    AccUndampedX,
    freqHBX,
    DispTargetBuildX,
    DispTargetHBX
  );
  CalcLogs += writeLog(
    "totalUsefulWaterMassY, AccUndampedY, freqHBY, DispTargetBuildY, DispTargetHBY =\n",
    totalUsefulWaterMassY,
    AccUndampedY,
    freqHBY,
    DispTargetBuildY,
    DispTargetHBY
  );

  let MaxCylLengthX = BX;
  let MaxCylLengthY = BY;

  if (LocX === 1) MaxCylLengthX = ModL;
  if (LocY === 1) MaxCylLengthY = ModL;

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

  CalcLogs += writeLog(
    "MembrangeLengthX, MaxCylLengthX, CenterLengthX = \n",
    MembrangeLengthX,
    MaxCylLengthX,
    CenterLengthX
  );
  CalcLogs += writeLog(
    "MembrangeLengthY, MaxCylLengthY, CenterLengthY = \n",
    MembrangeLengthY,
    MaxCylLengthY,
    CenterLengthY
  );

  const AreaCenter = (Math.PI * CONSTANTS.CylDiameter ** 2) / 4.0;
  const AreaMemHor = CONSTANTS.MembraneFill * AreaCenter;

  const AreaMemVertX = CONSTANTS.CylDiameter * MembrangeLengthX;
  const AreaMemVertY = CONSTANTS.CylDiameter * MembrangeLengthY;

  CalcLogs += writeLog("AreaCenter, AreaMemHor =\n", AreaCenter, AreaMemHor);
  CalcLogs += writeLog(
    "MaxCylLengthX, CenterLengthX, AreaMemVertX =\n",
    MaxCylLengthX,
    CenterLengthX,
    AreaMemVertX
  );
  CalcLogs += writeLog(
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

  CalcLogs += writeLog(
    "MassCenterX, MassEndHorX, MassEndVertX, WaterMassPerCylinderX =\n",
    MassCenterX,
    MassEndHorX,
    MassEndVertX,
    WaterMassPerCylinderX
  );
  CalcLogs += writeLog(
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

  CalcLogs += writeLog(
    "r1X, r2X, kStarX, mStarX, gammaStarX, freqStarX =\n",
    r1X,
    r2X,
    kStarX,
    mStarX,
    gammaStarX,
    freqStarX
  );
  CalcLogs += writeLog(
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

  CalcLogs += writeLog(
    "massUsefulX, kGravityX, kAirSpringX, kTotalX =\n",
    massUsefulX,
    kGravityX,
    kAirSpringX,
    kTotalX
  );
  CalcLogs += writeLog(
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

  CalcLogs += writeLog(
    "AreaAir, VolAirTotalX, VolAirInsideWaterCylX, VolAirCylX, EachAirCylLengthX =\n",
    AreaAir,
    VolAirTotalX,
    VolAirInsideWaterCylX,
    VolAirCylX,
    EachAirCylLengthX
  );
  CalcLogs += writeLog(
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

  CalcLogs += writeLog(
    "ExactNumWaterCylindersX, RoundUpNumWaterCylindersX, TotalLengthAirCylinderX, ExactNumAirCylindersX, RoundUpNumAirCylindersX =\n",
    ExactNumWaterCylindersX,
    RoundUpNumWaterCylindersX,
    TotalLengthAirCylinderX,
    ExactNumAirCylindersX,
    RoundUpNumAirCylindersX
  );
  CalcLogs += writeLog(
    "ExactNumWaterCylindersY, RoundUpNumWaterCylindersY, TotalLengthAirCylinderY, ExactNumAirCylindersY, RoundUpNumAirCylindersY =\n",
    ExactNumWaterCylindersY,
    RoundUpNumWaterCylindersY,
    TotalLengthAirCylinderY,
    ExactNumAirCylindersY,
    RoundUpNumAirCylindersY
  );

  // Calculate final output numbers
  const NCYLX = RoundUpNumAirCylindersX + RoundUpNumWaterCylindersX;
  const LCYLX = units == 1 ? m2ft(MaxCylLengthX) : MaxCylLengthX;
  const NCYLY = RoundUpNumAirCylindersY + RoundUpNumWaterCylindersY;
  const LCYLY = units == 1 ? m2ft(MaxCylLengthY) : MaxCylLengthY;

  // Convert Units back to US if required
  if (units === 1) {
    // WX, WY convert from tonnes to kips
    WX = kgs2lbs(WX);
    WY = kgs2lbs(WY);
  }

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
    ZetaTotalY,
    NCYLX,
    LCYLX,
    NCYLY,
    LCYLY,
    CalcLogs,
  };
};

export default BldgDynamics;
