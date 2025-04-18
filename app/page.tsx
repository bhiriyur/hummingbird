"use client";

import { Grid2 as Grid } from "@mui/material";
import { useState } from "react";
import BuildingForm from "./components/mainform";
import ResponsiveAppBar from "./components/topnav";
import ViewTabs from "./components/viewtabs";

function DivCount({children, count}: {children: any, count: any}) {
  console.log("Count = ", count);
  return <div>{children}</div>;
}

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

  const [units, setUnits] = useState(1);
  const [count, setCount] = useState(1);

  return (
    <main>
      <ResponsiveAppBar
        toggleUnits={() => {
          console.log("Toggling units ", units);
          setCount(count + 1);
          if (units === 1) {
            setUnits(2);
          } else {
            setUnits(1);
          }
        }}
      />

      <DivCount count={count}>
        <Grid container spacing={2}>
          <Grid size={{ sm: 12, md: 6 }}>
            <BuildingForm setBldg={setBldg} units={units}></BuildingForm>
          </Grid>
          <Grid size={{ sm: 12, md: 6 }}>
            <ViewTabs {...bldg}></ViewTabs>
          </Grid>
        </Grid>
      </DivCount>
    </main>
  );
}
