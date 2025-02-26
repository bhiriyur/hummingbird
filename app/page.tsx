import { Grid2 as Grid } from "@mui/material";
import BuildingForm from "./components/bldgForm";
import MyCanvas from "./components/mycanvas";
import ResponsiveAppBar from "./components/topnav";

export default function Home() {
  return (
    <main>
      <ResponsiveAppBar/>
      <Grid container spacing={2}>
        <Grid size={6}>
          <BuildingForm></BuildingForm>
        </Grid>
        <Grid size={6}>
          <MyCanvas></MyCanvas>
        </Grid>
      </Grid>
    </main>
  );
}
