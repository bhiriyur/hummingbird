"use client";

import { Grid2 as Grid } from "@mui/material";
import { useState } from "react";
import BuildingForm from "./components/mainform";
import ResponsiveAppBar from "./components/topnav";
import ViewTabs from "./components/viewtabs";

export default function Home() {
  const [bldg, setBldg] = useState({
    BX: 80,
    BY: 55,
    BZ: 450,
    N: 42,
    CYLDIA: 5,
    NCYLX: 3,
    LCYLX: 40,
    LOGS: "",
  });

  return (
    <main>
      <ResponsiveAppBar />
      <Grid container spacing={2}>
        <Grid size={{ sm: 12, md: 6 }}>
          <BuildingForm setBldg={setBldg}></BuildingForm>
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <ViewTabs {...bldg}></ViewTabs>
        </Grid>
      </Grid>
    </main>
  );
}
