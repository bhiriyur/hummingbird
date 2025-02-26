"use client";

import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Grid2 as Grid } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { IndexType } from "typescript";

const VARIANT = "outlined";
const TIMEUNIT = "s";
const FORCEUNIT = "kips"

const BuildingDesign = () => {
  const [numFloors, setNumFloors] = useState(42);
  const [bldgHeight, setbldgHeight] = useState(450);
  const [bldgXwidth, setbldgXwidth] = useState(80);
  const [bldgYwidth, setbldgYwidth] = useState(55);
  const systems = ["Concrete Core + Steel Modules", "Steel Frame"];
  const [bldgSystem, setbldgSystem] = useState(systems[0]);

  const [xPeriodChecked, setxPeriodChecked] = useState(true);
  const [xPeriod, setxPeriod] = useState(4.5);

  const [yPeriodChecked, setyPeriodChecked] = useState(true);
  const [yPeriod, setyPeriod] = useState(4.0);


  const [xIntrinsicDampingChecked, setxIntrinsicDampingChecked] = useState(true);
  const [xIntrinsicDamping, setxIntrinsicDamping] = useState(0.7);

  const [yIntrinsicDampingChecked, setyIntrinsicDampingChecked] = useState(true);
  const [yIntrinsicDamping, setyIntrinsicDamping] = useState(0.7);  

  
  const [xModalMassChecked, setxModalMassChecked] = useState(true);
  const [xModalMass, setxModalMass] = useState(2000);

  const [yModalMassChecked, setyModalMassChecked] = useState(true);
  const [yModalMass, setyModalMass] = useState(2000);

  const [checked, setChecked] = useState(true);
  const handleClick = () => setChecked(!checked);
  
  return (
    <Box sx={{ width: "100%" }}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* Building Design */}
        <Grid size={3}>
          <TextField
            fullWidth
            defaultValue={numFloors}
            onChange={(e) => {setNumFloors(Number(e.target.value));}}
            id="bldgFloors"
            label="Number of Floors"
            variant={VARIANT}
            type="number"
          ></TextField>
        </Grid>
        <Grid size={3}>
          <TextField
            fullWidth
            defaultValue={bldgHeight}
            onChange={(e) => {setbldgHeight(Number(e.target.value));}}
            id="bldgHeight"
            label="Building Height"
            variant={VARIANT}
            type="number"
          ></TextField>
        </Grid>
        <Grid size={3}>
          <TextField
            fullWidth
            defaultValue={bldgXwidth}
            onChange={(e) => {setbldgXwidth(Number(e.target.value));}}
            id="bldgXWidth"
            label="X Width"
            variant={VARIANT}
            type="number"
          ></TextField>
        </Grid>
        <Grid size={3}>
          <TextField
            fullWidth
            defaultValue={bldgYwidth}
            onChange={(e) => {setbldgYwidth(Number(e.target.value));}}
            id="bldgYWidth"
            label="Y Width"
            variant={VARIANT}
            type="number"
          ></TextField>
        </Grid>

        {/* Structural System */}
        <Grid size={12}>
          <TextField
            fullWidth
            select
            defaultValue={bldgSystem}
            onChange={(e) => setbldgSystem(e.target.value)}>
            id="bldfStructuralSystem"
            label="Structural System"
            variant={VARIANT}
          >
            {systems.map((system) => (
              <MenuItem key={system} value={system}>
                {system}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Divider */}
        {/* <Grid size={12}>
          <Divider style={{ padding: 5 }} textAlign="left">
            PROPERTIES
          </Divider>
        </Grid> */}

        {/* Building Properties X */}
        <Grid size={4}>
          <TextField
            fullWidth
            defaultValue={xPeriod}
            id="periodX"
            label="X-Period"
            variant={VARIANT}
            type="number"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">{TIMEUNIT}</InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label={xPeriodChecked ? "Default" : "Override"}
                      onClick={() => {setxPeriodChecked(!xPeriodChecked)}}
                      edge="start"
                      size="small"
                    >
                      {xPeriodChecked ? (
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
            defaultValue={xIntrinsicDamping}
            id="intrinsicDampingX"
            label="X-Intrinsic Damping"
            variant={VARIANT}
            type="number"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">%</InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label={xIntrinsicDampingChecked ? "Default" : "Override"}
                      onClick={() => {setxIntrinsicDampingChecked(!xIntrinsicDampingChecked)}}
                      edge="start"
                      size="small"
                    >
                      {xIntrinsicDampingChecked ? (
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
            defaultValue={xModalMass}
            id="modalMassX"
            label="X-Modal Mass"
            variant={VARIANT}
            type="number"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">{FORCEUNIT}</InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label={xModalMassChecked ? "Default" : "Override"}
                      onClick={() => {setxModalMassChecked(!xModalMassChecked)}}
                      edge="start"
                      size="small"
                    >
                      {xModalMassChecked ? (
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

        {/* Building Properties Y */}
        <Grid size={4}>
          <TextField
            fullWidth
            value={yPeriod}
            id="periodY"
            label="Y-Period"
            variant={VARIANT}
            type="number"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">{TIMEUNIT}</InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label={yPeriodChecked ? "Default" : "Override"}
                      onClick={() => {setyPeriodChecked(!yPeriodChecked)}}
                      edge="start"
                      size="small"
                    >
                      {yPeriodChecked ? (
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
            value={yIntrinsicDamping}
            id="intrinsicDampingY"
            label="Y-Intrinsic Damping"
            variant={VARIANT}
            type="number"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">%</InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label={yIntrinsicDampingChecked ? "Default" : "Override"}
                      onClick={() => {setyIntrinsicDampingChecked(!yIntrinsicDampingChecked)}}
                      edge="start"
                      size="small"
                    >
                      {yIntrinsicDampingChecked ? (
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
            value={yModalMass}
            id="modalMassY"
            label="Y-Modal Mass"
            variant={VARIANT}
            type="number"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">{FORCEUNIT}</InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label={yModalMassChecked ? "Default" : "Override"}
                      onClick={() => {setyModalMassChecked(!yModalMassChecked)}}
                      edge="start"
                      size="small"
                    >
                      {yModalMassChecked ? (
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
      </Grid>
    </Box>
  );
};

const DamperPerformance = () => {
  const systems = ["On Roof", "In Modules"];
  return (
    <Box sx={{ width: "100%"}}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* X Damper */}
        <Grid size={4}>
          <TextField
            fullWidth
            select
            value={systems[0]}
            id="damperLocationX"
            label="X-Damper Location"
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
            value={80}
            id="acclReductionX"
            label="X-Accln. Reduction"
            variant={VARIANT}
            type="number"
          ></TextField>
        </Grid>
        <Grid size={4}>
          <TextField
            fullWidth
            value={80}
            id="totalDampingX"
            label="X-Total Damping"
            variant={VARIANT}
            type="number"
          ></TextField>
        </Grid>

        {/* Y Damper */}
        <Grid size={4}>
          <TextField
            fullWidth
            select
            value={systems[1]}
            id="damperLocationY"
            label="Y-Damper Location"
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
            value={80}
            id="acclReductionY"
            label="Y-Accln. Reduction"
            variant={VARIANT}
            type="number"
          ></TextField>
        </Grid>
        <Grid size={4}>
          <TextField
            fullWidth
            value={80}
            id="totalDampingY"
            label="Y-Total Damping"
            variant={VARIANT}
            type="number"
          ></TextField>
        </Grid>

        <Grid size={4}>
          <TextField
            fullWidth
            value={80}
            id="moduleLength"
            label="Module Length"
            variant={VARIANT}
            type="number"
          ></TextField>
        </Grid>  
        <Grid size={4}>
          <TextField
            fullWidth
            value={80}
            id="moduleWidth"
            label="Module Width"
            variant={VARIANT}
            type="number"
          ></TextField>
        </Grid>                
      </Grid>
    </Box>
  );
};

const BuildingForm = () => {
  return (
    <div>
      <Accordion defaultExpanded sx={{backgroundColor: "#FFFFFA"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">BUILDING</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <BuildingDesign />
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={{backgroundColor: "#FFFFFA"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="h1">DAMPER</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DamperPerformance />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default BuildingForm;
