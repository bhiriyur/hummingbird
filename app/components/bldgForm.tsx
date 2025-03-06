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

import { useState } from "react";
// import { building_properties, damper_properties } from "../calcs/calcs";

interface UnitSytem {
  force?: string;
  length?: string;
  time?: string;
}

const VARIANT = "outlined";
const INPUTSCOLOR = "#FEFEFE";
const OVERRIDESCOLOR = "#F5F5F5";
const BGCOLOR = "#FEFEFE";

const BuildingDesign = (units: UnitSytem) => {
  const [numFloors, setNumFloors] = useState(42);
  const [bldgHeight, setbldgHeight] = useState(450);
  const [bldgXwidth, setbldgXwidth] = useState(80);
  const [bldgYwidth, setbldgYwidth] = useState(55);
  const systems = [
    "Modules only (steel moment-resisting frame)",
    "Modules + Steel branced frame",
    "Modules + Concrete shear walls",
  ];
  const [bldgSystem, setbldgSystem] = useState(systems[0]);

  const [xPeriodChecked, setxPeriodChecked] = useState(true);
  const [xPeriod, setxPeriod] = useState(4.5);

  const [yPeriodChecked, setyPeriodChecked] = useState(true);
  const [yPeriod, setyPeriod] = useState(4.0);

  const [xIntrinsicDampingChecked, setxIntrinsicDampingChecked] =
    useState(true);
  const [xIntrinsicDamping, setxIntrinsicDamping] = useState(0.7);

  const [yIntrinsicDampingChecked, setyIntrinsicDampingChecked] =
    useState(true);
  const [yIntrinsicDamping, setyIntrinsicDamping] = useState(0.7);

  const [xModalMassChecked, setxModalMassChecked] = useState(true);
  const [xModalMass, setxModalMass] = useState(2000);

  const [yModalMassChecked, setyModalMassChecked] = useState(true);
  const [yModalMass, setyModalMass] = useState(2000);

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
                  <InputAdornment position="end">{units.length}</InputAdornment>
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
                  <InputAdornment position="end">{units.length}</InputAdornment>
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
                  <InputAdornment position="end">{units.length}</InputAdornment>
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
              console.log(e);
              console.log(e.target.value);
              console.log(bldgSystem);
              setbldgSystem(e.target.value);
            }}
            id="bldgStructuralSystem"
            label="Structural System"
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
              backgroundColor: xPeriodChecked ? OVERRIDESCOLOR : INPUTSCOLOR,
            }}
            slotProps={{
              input: {
                readOnly: xPeriodChecked ? true : false,
                endAdornment: (
                  <InputAdornment position="end">{units.time}</InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title="Auto-compute value if checked">
                      <IconButton
                        aria-label={xPeriodChecked ? "Default" : "Override"}
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
                            xIntrinsicDampingChecked ? "Default" : "Override"
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
              backgroundColor: xModalMassChecked ? OVERRIDESCOLOR : INPUTSCOLOR,
            }}
            type="number"
            slotProps={{
              input: {
                readOnly: xModalMassChecked ? true : false,
                endAdornment: (
                  <InputAdornment position="end">{units.force}</InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title="Auto-compute value if checked">
                      <IconButton
                        aria-label={xModalMassChecked ? "Default" : "Override"}
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
              backgroundColor: yPeriodChecked ? OVERRIDESCOLOR : INPUTSCOLOR,
            }}
            type="number"
            slotProps={{
              input: {
                readOnly: yPeriodChecked ? true : false,
                endAdornment: (
                  <InputAdornment position="end">{units.time}</InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title="Auto-compute value if checked">
                      <IconButton
                        aria-label={yPeriodChecked ? "Default" : "Override"}
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
                            yIntrinsicDampingChecked ? "Default" : "Override"
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
              backgroundColor: yModalMassChecked ? OVERRIDESCOLOR : INPUTSCOLOR,
            }}
            type="number"
            slotProps={{
              input: {
                readOnly: yModalMassChecked ? true : false,
                endAdornment: (
                  <InputAdornment position="end">{units.force}</InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title="Auto-compute value if checked">
                      <IconButton
                        aria-label={yModalMassChecked ? "Default" : "Override"}
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
  );
};

const DamperPerformance = (units: UnitSytem) => {
  const systems = ["On Roof", "In Modules"];
  const [xDamperLocation, setxDamperLocation] = useState(systems[0]);
  const [yDamperLocation, setyDamperLocation] = useState(systems[1]);
  const [xAccelReduction, setxAccelReduction] = useState(40);
  const [yAccelReduction, setyAccelReduction] = useState(30);
  const [xTotalDamping, setxTotalDamping] = useState(1.5);
  const [yTotalDamping, setyTotalDamping] = useState(1.2);
  const [moduleLength, setmoduleLength] = useState(20);
  const [moduleWidth, setmoduleWidth] = useState(8);

  const [xOption, setXOption] = useState(false);
  const [yOption, setYOption] = useState(false);

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
          >
            {systems.map((system) => (
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
            style={{ backgroundColor: xOption ? OVERRIDESCOLOR : INPUTSCOLOR }}
            type="number"
            slotProps={{
              input: {
                readOnly: xOption ? true : false,
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
            style={{ backgroundColor: !xOption ? OVERRIDESCOLOR : INPUTSCOLOR }}
            type="number"
            slotProps={{
              input: {
                readOnly: !xOption ? true : false,
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
          >
            {systems.map((system) => (
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
            style={{ backgroundColor: yOption ? OVERRIDESCOLOR : INPUTSCOLOR }}
            type="number"
            slotProps={{
              input: {
                readOnly: yOption ? true : false,
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
            style={{ backgroundColor: !yOption ? OVERRIDESCOLOR : INPUTSCOLOR }}
            type="number"
            slotProps={{
              input: {
                readOnly: !yOption ? true : false,
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
                  <InputAdornment position="end">{units.length}</InputAdornment>
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
                  <InputAdornment position="end">{units.length}</InputAdornment>
                ),
              },
            }}
          ></TextField>
        </Grid>
      </Grid>
    </Box>
  );
};

const BuildingForm = () => {
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
          <BuildingDesign force="kips" length="ft" time="s" />
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
          <DamperPerformance force="kips" length="ft" time="s" />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default BuildingForm;
