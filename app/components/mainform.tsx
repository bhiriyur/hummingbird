"use client";

import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Grid2 as Grid } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { useEffect, useState } from "react";
import * as calcs from "../common/calcs";
import { buildingProps, damperProps } from "../common/types";

const VARIANT = "outlined";
const INPUTSCOLOR = "#FEFEFE";
const OVERRIDESCOLOR = "#F5F5F5";
const BGCOLOR = "#FEFEFE";

const fix3 = (val: number) => Math.round(val * 1e3) / 1e3;

const building: buildingProps = {
  N: 42,
  BX: 80,
  BY: 55,
  BZ: 450,
};

const damper: damperProps = {
  LocX: 1,
  LocY: 2,
  ModL: 40,
  ModW: 8,
  AccRedX: 40,
  AccRedY: 30,
  ZetaTotalX: 2.5,
  ZetaTotalY: 2.5,
  OptionX: true,
  OptionY: true,
};

const recalculate = () => {
  console.log("Recalculating...");
  return calcs.BldgDynamics(building, damper);
};

const BuildingForm = ({ setBldg }: { setBldg: any }) => {
  const displayUnits = {
    force: "kips",
    length: "ft",
    time: "s",
  };

  const systems = [
    "Steel moment-resisting frame",
    "Steel braced frame",
    "Concrete shear walls",
  ];

  const locations = ["On Roof", "In Modules"];

  const [numFloors, setNumFloors] = useState(building.N);
  const [bldgHeight, setbldgHeight] = useState(building.BZ);
  const [bldgXwidth, setbldgXwidth] = useState(building.BX);
  const [bldgYwidth, setbldgYwidth] = useState(building.BY);
  const [bldgSystem, setbldgSystem] = useState(systems[0]);

  const [xPeriodChecked, setxPeriodChecked] = useState(true);
  const [xPeriod, setxPeriod] = useState(building?.TX || 4.5);

  const [yPeriodChecked, setyPeriodChecked] = useState(true);
  const [yPeriod, setyPeriod] = useState(building?.TY || 4.5);

  const [xIntrinsicDampingChecked, setxIntrinsicDampingChecked] =
    useState(true);
  const [xIntrinsicDamping, setxIntrinsicDamping] = useState(
    building?.ZetaX || 0.7
  );

  const [yIntrinsicDampingChecked, setyIntrinsicDampingChecked] =
    useState(true);
  const [yIntrinsicDamping, setyIntrinsicDamping] = useState(
    building?.ZetaY || 0.7
  );

  const [xModalMassChecked, setxModalMassChecked] = useState(true);
  const [xModalMass, setxModalMass] = useState(2000);

  const [yModalMassChecked, setyModalMassChecked] = useState(true);
  const [yModalMass, setyModalMass] = useState(2000);

  // DAMPER SETTINGS
  const [xDamperLocation, setxDamperLocation] = useState(locations[0]);
  const [yDamperLocation, setyDamperLocation] = useState(locations[1]);
  const [xAccelReduction, setxAccelReduction] = useState(damper?.AccRedX || 40);
  const [yAccelReduction, setyAccelReduction] = useState(damper?.AccRedY || 40);
  const [xTotalDamping, setxTotalDamping] = useState(1.5);
  const [yTotalDamping, setyTotalDamping] = useState(1.2);
  const [moduleLength, setmoduleLength] = useState(damper?.ModL || 20);
  const [moduleWidth, setmoduleWidth] = useState(damper?.ModW || 8);
  const [xOption, setXOption] = useState(false);
  const [yOption, setYOption] = useState(false);

  useEffect(() => {
    // console.clear();
    console.log("UseEffect Rerender");
    const systems = [
      "Steel moment-resisting frame",
      "Steel braced frame",
      "Concrete shear walls",
    ];
    const locations = ["On Roof", "In Modules"];

    building.N = numFloors;
    building.BZ = bldgHeight;
    building.BX = bldgXwidth;
    building.BY = bldgYwidth;
    building.S = systems.indexOf(bldgSystem) + 1;

    if (!xPeriodChecked) building.TX = xPeriod;
    if (!xIntrinsicDampingChecked) building.ZetaX = xIntrinsicDamping / 100;
    if (!xModalMassChecked) building.WX = xModalMass * 1000;
    if (!yPeriodChecked) building.TY = yPeriod;
    if (!yIntrinsicDampingChecked) building.ZetaY = yIntrinsicDamping / 100;
    if (!yModalMassChecked) building.WY = yModalMass * 1000;

    damper.LocX = locations.indexOf(xDamperLocation);
    damper.LocY = locations.indexOf(yDamperLocation);
    damper.ModL = moduleLength;
    damper.ModW = moduleWidth;
    damper.AccRedX = xAccelReduction / 100;
    damper.AccRedY = yAccelReduction / 100;
    damper.ZetaTotalX = xTotalDamping / 100;
    damper.ZetaTotalY = yTotalDamping / 100;
    damper.OptionX = xOption;
    damper.OptionY = yOption;

    console.log("BUILDING CHANGED: ", building);
    console.log("DAMPER CHANGED: ", damper);

    // Recalculate and update values
    const outputs = recalculate();

    // Set increment count
    setBldg({
      N: numFloors,
      BX: bldgXwidth,
      BY: bldgYwidth,
      BZ: bldgHeight,
      CYLDIA: calcs.CONSTANTS.CylDiameter * 3.28084, // TODO: Units checl
      XLOC: xDamperLocation,
      NCYLX: outputs.NCYLX,
      LCYLX: outputs.LCYLX, // TODO: Units check
      YLOC: yDamperLocation,
      NCYLY: outputs.NCYLY,
      LCYLY: outputs.LCYLY, // TODO: Units check
      MODL: moduleLength,
      MODW: moduleWidth,
      LOGS: outputs.CalcLogs,
    });

    console.log("OUTPUTS: ", outputs);

    if (xPeriodChecked) setxPeriod(fix3(outputs.TX));
    if (yPeriodChecked) setyPeriod(fix3(outputs.TY));
    // Percent values
    if (xIntrinsicDampingChecked)
      setxIntrinsicDamping(fix3(outputs.ZetaX * 100));
    if (yIntrinsicDampingChecked)
      setyIntrinsicDamping(fix3(outputs.ZetaY * 100));
    // kips / tonnes
    if (xModalMassChecked) setxModalMass(fix3(outputs.WX / 1000)); // TODO: Units check
    if (yModalMassChecked) setyModalMass(fix3(outputs.WY / 1000)); // TODO: Units check

    if (!xOption) {
      // Acceleration Reduction is given, Calculate ZetaTotal
      setxTotalDamping(fix3(outputs.ZetaTotalX * 100));
    } else {
      // ZetaTotal given, Calculate Acceleration Reduction
      setxAccelReduction(fix3(outputs.AccRedX * 100));
    }

    if (!yOption) {
      // Acceleration Reduction is given, Calculate ZetaTotal
      setyTotalDamping(fix3(outputs.ZetaTotalY * 100));
    } else {
      // ZetaTotal given, Calculate Acceleration Reduction
      setyAccelReduction(fix3(outputs.AccRedY * 100));
    }
  }, [
    numFloors,
    bldgHeight,
    bldgXwidth,
    bldgYwidth,
    bldgSystem,
    moduleLength,
    moduleWidth,
    xPeriod,
    yPeriod,
    xIntrinsicDamping,
    yIntrinsicDamping,
    xModalMass,
    yModalMass,
    xPeriodChecked,
    yPeriodChecked,
    xIntrinsicDampingChecked,
    yIntrinsicDampingChecked,
    xModalMassChecked,
    yModalMassChecked,
    xDamperLocation,
    yDamperLocation,
    xAccelReduction,
    yAccelReduction,
    xTotalDamping,
    yTotalDamping,
    xOption,
    yOption,
    setBldg,
  ]);

  return (
    <div>
      <Accordion defaultExpanded sx={{ backgroundColor: BGCOLOR }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">BUILDING</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: "100%" }}>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* Building Design */}
              <Grid size={3}>
                <TextField
                  fullWidth
                  value={numFloors}
                  onChange={(e) => {
                    setNumFloors(Number(e.target.value));
                  }}
                  id="bldgFloors"
                  label="Number of Floors"
                  variant={VARIANT}
                  type="number"
                  style={{ backgroundColor: INPUTSCOLOR }}
                ></TextField>
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  value={bldgHeight}
                  onChange={(e) => {
                    setbldgHeight(Number(e.target.value));
                  }}
                  id="bldgHeight"
                  label="Building Height"
                  variant={VARIANT}
                  type="number"
                  style={{ backgroundColor: INPUTSCOLOR }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {displayUnits.length}
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  value={bldgXwidth}
                  onChange={(e) => {
                    setbldgXwidth(Number(e.target.value));
                  }}
                  id="bldgXWidth"
                  label="X Width"
                  variant={VARIANT}
                  type="number"
                  style={{ backgroundColor: INPUTSCOLOR }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {displayUnits.length}
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  value={bldgYwidth}
                  onChange={(e) => {
                    setbldgYwidth(Number(e.target.value));
                  }}
                  id="bldgYWidth"
                  label="Y Width"
                  variant={VARIANT}
                  type="number"
                  style={{ backgroundColor: INPUTSCOLOR }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {displayUnits.length}
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>

              {/* Structural System */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  select={true}
                  value={bldgSystem}
                  onChange={(e) => {
                    setbldgSystem(e.target.value);
                  }}
                  id="bldgStructuralSystem"
                  label="Structural System"
                  slotProps={{
                    input: { id: "select-struc-system" },
                    inputLabel: { htmlFor: "select-struc-system" },
                  }}
                  variant={VARIANT}
                  style={{ backgroundColor: INPUTSCOLOR }}
                >
                  {systems.map((system) => (
                    <MenuItem key={system} value={system}>
                      {system}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Building Properties X */}
              <Grid size={4}>
                <TextField
                  fullWidth
                  value={xPeriod}
                  onChange={(e) => {
                    setxPeriod(Number(e.target.value));
                  }}
                  id="periodX"
                  label="X-Period"
                  variant={VARIANT}
                  type="number"
                  style={{
                    backgroundColor: xPeriodChecked
                      ? OVERRIDESCOLOR
                      : INPUTSCOLOR,
                  }}
                  slotProps={{
                    input: {
                      readOnly: xPeriodChecked ? true : false,
                      endAdornment: (
                        <InputAdornment position="end">
                          {displayUnits.time}
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Auto-compute value if checked">
                            <IconButton
                              aria-label={
                                xPeriodChecked ? "Default" : "Override"
                              }
                              onClick={() => {
                                setxPeriodChecked(!xPeriodChecked);
                              }}
                              edge="start"
                              size="small"
                            >
                              {xPeriodChecked ? (
                                <CheckBoxOutlined />
                              ) : (
                                <CheckBoxOutlineBlank />
                              )}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>
              <Grid size={4}>
                <Tooltip title="% of critical">
                  <TextField
                    fullWidth
                    value={xIntrinsicDamping}
                    onChange={(e) => {
                      setxIntrinsicDamping(Number(e.target.value));
                    }}
                    id="intrinsicDampingX"
                    label="X-Intrinsic Damping"
                    variant={VARIANT}
                    style={{
                      backgroundColor: xIntrinsicDampingChecked
                        ? OVERRIDESCOLOR
                        : INPUTSCOLOR,
                    }}
                    type="number"
                    slotProps={{
                      input: {
                        readOnly: xIntrinsicDampingChecked ? true : false,
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Auto-compute value if checked">
                              <IconButton
                                aria-label={
                                  xIntrinsicDampingChecked
                                    ? "Default"
                                    : "Override"
                                }
                                onClick={() => {
                                  setxIntrinsicDampingChecked(
                                    !xIntrinsicDampingChecked
                                  );
                                }}
                                edge="start"
                                size="small"
                              >
                                {xIntrinsicDampingChecked ? (
                                  <CheckBoxOutlined />
                                ) : (
                                  <CheckBoxOutlineBlank />
                                )}
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      },
                    }}
                  ></TextField>
                </Tooltip>
              </Grid>
              <Grid size={4}>
                <TextField
                  fullWidth
                  value={xModalMass}
                  onChange={(e) => {
                    setxModalMass(Number(e.target.value));
                  }}
                  id="modalMassX"
                  label="X-Modal Mass"
                  variant={VARIANT}
                  style={{
                    backgroundColor: xModalMassChecked
                      ? OVERRIDESCOLOR
                      : INPUTSCOLOR,
                  }}
                  type="number"
                  slotProps={{
                    input: {
                      readOnly: xModalMassChecked ? true : false,
                      endAdornment: (
                        <InputAdornment position="end">
                          {displayUnits.force}
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Auto-compute value if checked">
                            <IconButton
                              aria-label={
                                xModalMassChecked ? "Default" : "Override"
                              }
                              onClick={() => {
                                setxModalMassChecked(!xModalMassChecked);
                              }}
                              edge="start"
                              size="small"
                            >
                              {xModalMassChecked ? (
                                <CheckBoxOutlined />
                              ) : (
                                <CheckBoxOutlineBlank />
                              )}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>

              {/* Building Properties Y */}
              <Grid size={4}>
                <TextField
                  fullWidth
                  value={yPeriod}
                  onChange={(e) => {
                    setyPeriod(Number(e.target.value));
                  }}
                  id="periodY"
                  label="Y-Period"
                  variant={VARIANT}
                  style={{
                    backgroundColor: yPeriodChecked
                      ? OVERRIDESCOLOR
                      : INPUTSCOLOR,
                  }}
                  type="number"
                  slotProps={{
                    input: {
                      readOnly: yPeriodChecked ? true : false,
                      endAdornment: (
                        <InputAdornment position="end">
                          {displayUnits.time}
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Auto-compute value if checked">
                            <IconButton
                              aria-label={
                                yPeriodChecked ? "Default" : "Override"
                              }
                              onClick={() => {
                                setyPeriodChecked(!yPeriodChecked);
                              }}
                              edge="start"
                              size="small"
                            >
                              {yPeriodChecked ? (
                                <CheckBoxOutlined />
                              ) : (
                                <CheckBoxOutlineBlank />
                              )}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>
              <Grid size={4}>
                <Tooltip title="% of critical">
                  <TextField
                    fullWidth
                    value={yIntrinsicDamping}
                    onChange={(e) => {
                      setyIntrinsicDamping(Number(e.target.value));
                    }}
                    id="intrinsicDampingY"
                    label="Y-Intrinsic Damping"
                    variant={VARIANT}
                    style={{
                      backgroundColor: yIntrinsicDampingChecked
                        ? OVERRIDESCOLOR
                        : INPUTSCOLOR,
                    }}
                    type="number"
                    slotProps={{
                      input: {
                        readOnly: yIntrinsicDampingChecked ? true : false,
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title="Auto-compute value if checked">
                              <IconButton
                                aria-label={
                                  yIntrinsicDampingChecked
                                    ? "Default"
                                    : "Override"
                                }
                                onClick={() => {
                                  setyIntrinsicDampingChecked(
                                    !yIntrinsicDampingChecked
                                  );
                                }}
                                edge="start"
                                size="small"
                              >
                                {yIntrinsicDampingChecked ? (
                                  <CheckBoxOutlined />
                                ) : (
                                  <CheckBoxOutlineBlank />
                                )}
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      },
                    }}
                  ></TextField>
                </Tooltip>
              </Grid>
              <Grid size={4}>
                <TextField
                  fullWidth
                  value={yModalMass}
                  onChange={(e) => {
                    setyModalMass(Number(e.target.value));
                  }}
                  id="modalMassY"
                  label="Y-Modal Mass"
                  variant={VARIANT}
                  style={{
                    backgroundColor: yModalMassChecked
                      ? OVERRIDESCOLOR
                      : INPUTSCOLOR,
                  }}
                  type="number"
                  slotProps={{
                    input: {
                      readOnly: yModalMassChecked ? true : false,
                      endAdornment: (
                        <InputAdornment position="end">
                          {displayUnits.force}
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Auto-compute value if checked">
                            <IconButton
                              aria-label={
                                yModalMassChecked ? "Default" : "Override"
                              }
                              onClick={() => {
                                setyModalMassChecked(!yModalMassChecked);
                              }}
                              edge="start"
                              size="small"
                            >
                              {yModalMassChecked ? (
                                <CheckBoxOutlined />
                              ) : (
                                <CheckBoxOutlineBlank />
                              )}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={{ backgroundColor: BGCOLOR }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="h1">DAMPER</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: "100%" }}>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* X Damper */}
              <Grid size={4}>
                <TextField
                  fullWidth
                  select
                  value={xDamperLocation}
                  onChange={(e) => {
                    setxDamperLocation(e.target.value);
                  }}
                  id="damperLocationX"
                  label="X-Damper Location"
                  style={{ backgroundColor: INPUTSCOLOR }}
                  variant={VARIANT}
                  slotProps={{
                    input: { id: "select-xdamper-loc" },
                    inputLabel: { htmlFor: "select-xdamper-loc" },
                  }}
                >
                  {locations.map((system) => (
                    <MenuItem key={system} value={system}>
                      {system}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={4}>
                <TextField
                  fullWidth
                  value={xAccelReduction}
                  onChange={(e) => {
                    setxAccelReduction(Number(e.target.value));
                  }}
                  id="acclReductionX"
                  label="X-Accln. Reduction"
                  variant={VARIANT}
                  style={{
                    backgroundColor: xOption ? OVERRIDESCOLOR : INPUTSCOLOR,
                  }}
                  type="number"
                  slotProps={{
                    input: {
                      readOnly: xOption ? true : false,
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            aria-label={xOption ? "Default" : "Override"}
                            onClick={() => {
                              setXOption(!xOption);
                            }}
                            edge="start"
                            size="small"
                          >
                            {xOption ? (
                              <CheckBoxOutlined />
                            ) : (
                              <CheckBoxOutlineBlank />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>
              <Grid size={4}>
                <TextField
                  fullWidth
                  value={xTotalDamping}
                  id="totalDampingX"
                  onChange={(e) => {
                    setxTotalDamping(Number(e.target.value));
                  }}
                  label="X-Total Damping"
                  variant={VARIANT}
                  style={{
                    backgroundColor: !xOption ? OVERRIDESCOLOR : INPUTSCOLOR,
                  }}
                  type="number"
                  slotProps={{
                    input: {
                      readOnly: !xOption ? true : false,
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            aria-label={xOption ? "Default" : "Override"}
                            onClick={() => {
                              setXOption(!xOption);
                            }}
                            edge="start"
                            size="small"
                          >
                            {xOption ? (
                              <CheckBoxOutlineBlank />
                            ) : (
                              <CheckBoxOutlined />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>

              {/* Y Damper */}
              <Grid size={4}>
                <TextField
                  fullWidth
                  select
                  value={yDamperLocation}
                  onChange={(e) => {
                    setyDamperLocation(e.target.value);
                  }}
                  id="damperLocationY"
                  label="Y-Damper Location"
                  style={{ backgroundColor: INPUTSCOLOR }}
                  variant={VARIANT}
                  slotProps={{
                    input: { id: "select-ydamper-loc" },
                    inputLabel: { htmlFor: "select-ydamper-loc" },
                  }}
                >
                  {locations.map((system) => (
                    <MenuItem key={system} value={system}>
                      {system}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={4}>
                <TextField
                  fullWidth
                  value={yAccelReduction}
                  onChange={(e) => {
                    setyAccelReduction(Number(e.target.value));
                  }}
                  id="acclReductionY"
                  label="Y-Accln. Reduction"
                  variant={VARIANT}
                  style={{
                    backgroundColor: yOption ? OVERRIDESCOLOR : INPUTSCOLOR,
                  }}
                  type="number"
                  slotProps={{
                    input: {
                      readOnly: yOption ? true : false,
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            aria-label={yOption ? "Default" : "Override"}
                            onClick={() => {
                              setYOption(!yOption);
                            }}
                            edge="start"
                            size="small"
                          >
                            {yOption ? (
                              <CheckBoxOutlined />
                            ) : (
                              <CheckBoxOutlineBlank />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>
              <Grid size={4}>
                <TextField
                  fullWidth
                  value={yTotalDamping}
                  onChange={(e) => {
                    setyTotalDamping(Number(e.target.value));
                  }}
                  id="totalDampingY"
                  label="Y-Total Damping"
                  variant={VARIANT}
                  style={{
                    backgroundColor: !yOption ? OVERRIDESCOLOR : INPUTSCOLOR,
                  }}
                  type="number"
                  slotProps={{
                    input: {
                      readOnly: !yOption ? true : false,
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            aria-label={yOption ? "Default" : "Override"}
                            onClick={() => {
                              setYOption(!yOption);
                            }}
                            edge="start"
                            size="small"
                          >
                            {yOption ? (
                              <CheckBoxOutlineBlank />
                            ) : (
                              <CheckBoxOutlined />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>

              {/* Module Length and Width */}
              <Grid size={4}>
                <TextField
                  fullWidth
                  value={moduleLength}
                  onChange={(e) => {
                    setmoduleLength(Number(e.target.value));
                  }}
                  id="moduleLength"
                  label="Module Length"
                  variant={VARIANT}
                  type="number"
                  style={{ backgroundColor: INPUTSCOLOR }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {displayUnits.length}
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>
              <Grid size={4}>
                <TextField
                  fullWidth
                  value={moduleWidth}
                  onChange={(e) => {
                    setmoduleWidth(Number(e.target.value));
                  }}
                  id="moduleWidth"
                  label="Module Width"
                  variant={VARIANT}
                  style={{ backgroundColor: INPUTSCOLOR }}
                  type="number"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {displayUnits.length}
                        </InputAdornment>
                      ),
                    },
                  }}
                ></TextField>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default BuildingForm;
