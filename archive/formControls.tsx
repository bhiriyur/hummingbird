// import Grid from "@rjsf/mui";
// import { RJSFSchema, UiSchema } from "@rjsf/utils";

// export const formSchema: RJSFSchema = {
//   type: "object",
//   properties: {
//     units: {
//       title: "Units",
//       type: "string",
//       enum: ["US (ft, kips, s)", "SI (m, N, s)"],
//       default: "US (ft, kips, s)",
//     },
//     buildingDesign: {
//       title: "Building",
//       type: "object",
//       properties: {
//         floors: { type: "number", title: "Number of Floors", default: 42 },
//         height: { type: "number", title: "Building Height", default: 450 },
//         xWidth: { type: "number", title: "Building X-Width", default: 80 },
//         yWidth: { type: "number", title: "Building Y-Width", default: 55 },
//         structuralSystem: {
//           type: "string",
//           title: "Structural System",
//           default: "Concrete Core + Steel Modules",
//           enum: ["Concrete Core + Steel Modules", "Steel Frame"],
//         },
//       },
//     },
//     buildingProperties: {
//       title: "Building Properties",
//       type: "object",
//       properties: {
//         periodX: { type: "number", title: "Period (X)", default: 0 },
//         periodY: { type: "number", title: "Period (Y)", default: 0 },
//         dampingX: {
//           type: "number",
//           title: "Intrinsic Damping (X)",
//           default: 0,
//         },
//         dampingY: {
//           type: "number",
//           title: "Intrinsic Damping (Y)",
//           default: 0,
//         },
//         modelMassX: { type: "number", title: "Model Mass (X)", default: 0 },
//         modelMassYX: { type: "number", title: "Model Mass (Y)", default: 0 },
//       },
//     },
//     damperPerformance: {
//       title: "Damper Performance",
//       type: "object",
//       properties: {
//         accelerationReductionX: {
//           type: "number",
//           title: "Acceleration Reduction (X)",
//           default: 0,
//         },
//         accelerationReductionY: {
//           type: "number",
//           title: "Acceleration Reduction (Y)",
//           default: 0,
//         },
//         totalDampingX: {
//           type: "number",
//           title: "Total Damping (X)",
//           default: 0,
//         },
//         totalDampingY: {
//           type: "number",
//           title: "Total Damping (Y)",
//           default: 0,
//         },
//       },
//     },
//     damperDesign: {
//       title: "Damper Design",
//       type: "object",
//       properties: {
//         damperLocationX: {
//           type: "string",
//           title: "Damper Location (X)",
//           enum: ["On Roof", "In Modules"],
//           default: "On Roof",
//         },
//         damperLocationY: {
//           type: "string",
//           title: "Damper Location (Y)",
//           enum: ["On Roof", "In Modules"],
//           default: "In Modules",
//         },
//         moduleLength: { type: "number", title: "Module Length", default: 20 },
//         moduleWidth: { type: "number", title: "Module Width", default: 8 },
//       },
//     },
//   },
// };

// export const uiSchema: UiSchema = {
//   "ui:grid": [
//     {
//       damperLocationX: 6,
//       damperLocationY: 6,
//     },
//     {
//       moduleLength: 6,
//       moduleWidth: 6,
//     },
//   ],
// };

