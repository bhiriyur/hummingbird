// Common interfaces across the project

export interface buildingProps {
  N: number; // number of floors
  BZ: number; // Building Height
  BX: number; // Building X- Width
  BY: number; // Building Y - Width
  units?: number; // Unit system 1 = US, 2 = SI (default = SI)
  S?: number; // Structural System (default = 1)
  TX?: number;
  TY?: number;
  ZetaX?: number;
  ZetaY?: number;
  WX?: number;
  WY?: number;
  CYLDIA?: number;
  XLOC?: string;
  YLOC?: string;
  NCYLX?: number;
  NCYLY?: number;
  LCYLX?: number;
  LCYLY?: number;
  MODL?: number;
  MODW?: number;
  LOGS?: string;
}

export interface damperProps {
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

export interface outputProps {
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
  NCYLX: number; // Number of Cylinders X
  LCYLX: number; // Length of Cylinders X
  NCYLY: number; // Number of Cylinders Y
  LCYLY: number; // Length of Cylinders Y
  CalcLogs: string;
}
