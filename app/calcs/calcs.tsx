const BUILDING_CONSTANTS = {
  wm: 250, // Module area mass (kg / m^2)
  wf: 75, // Facade area mass (kg / m ^2)
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
  Bx: number; // Building X- Width
  By: number; // Building Y - Width
  units?: unit_systems; // Unit system (default = SI)
  S?: structural_systems; // Structural System (default = 1)
}

interface output_properties {
  Tx: number;
  Ty: number;
  Epsx: number;
  Epsy: number;
  Wx: number;
  Wy: number;
}

const BldgDynamics = (props: building_properties): output_properties => {
  // US -> SI
  const ft2m = (e: number) => 0.3048 * e;
  const kgs2lbs = (e: number) => 2.205 * e;

  let { Bx, By, N, H, units, S } = props;
  if (units === 1) {
    Bx = ft2m(Bx);
    By = ft2m(By);
  }

  // Period and Intrinsic Damping
  let Tx, Ty, Epsx, Epsy;
  if (S === 1) {
    Tx = N / 10;
    Ty = N / 10;
    Epsx = 1.0;
    Epsy = 1.0;
  } else if (S === 2) {
    Tx = N / 12;
    Ty = N / 12;
    Epsx = 1.0;
    Epsy = 1.0;
  } else {
    Tx = N / 12;
    Ty = N / 12;
    Epsx = 1.5;
    Epsy = 1.5;
  }

  const Beta = (H: number, B: number) => {
    // Beta coefficient for Modal mass calcs
    const H_by_B = H / B;

    // Chart interpolation
    if (H_by_B >= 3.0) {
      return 0.25;
    } else if (H_by_B <= 1.0) {
      return 0.5;
    } else {
      return 0.5 - ((H_by_B - 1) * 0.25) / 2;
    }
  };

  // Building Mass
  const Wb =
    BUILDING_CONSTANTS.wm * (N * Bx * By) +
    BUILDING_CONSTANTS.wf * (2 * Bx + 2 * By) * H;

  // Modal Mass (tonnes / kips)
  const Wx = (units == 1 ? kgs2lbs(1) : 1) * Beta(H, Bx) * Wb * 0.001;
  const Wy = (units == 1 ? kgs2lbs(1) : 1) * Beta(H, By) * Wb * 0.001;

  return {
    Tx,
    Ty,
    Epsx,
    Epsy,
    Wx,
    Wy,
  };
};
