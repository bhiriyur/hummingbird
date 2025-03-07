"use client"

import { Grid2 as Grid } from "@mui/material";
import { useState } from "react";
import BuildingForm from "./components/bldgForm";
import MyCanvas from "./components/mycanvas";
import ResponsiveAppBar from "./components/topnav";

export default function Home() {

  const [bldg, setBldg] = useState({
    BX: 40,
    BY: 55,
    BZ: 450,
    N: 42,
    CYLDIA: 5,
    NCYLX: 3,
    LCYLX: 40,
    LOGS: ""
  })

  console.log("BUILDING bldg", bldg)

  return (
    <main>
      <ResponsiveAppBar />
      <Grid container spacing={2}>
        <Grid size={6}>
          <BuildingForm setBldg={setBldg}></BuildingForm>
        </Grid>
        <Grid size={6}>
          <MyCanvas {...bldg}></MyCanvas>
        </Grid>
      </Grid>
    </main>
  );
}
