"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import BuildingThreeD from "./buildingThreeD";

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{height: "600px"}}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const MyCanvas = () => {
  const [value, setValue] = React.useState(0);

  return (
    <Card sx={{ height: "100%", bgcolor: "#FFFFFA" }}>
      <Tabs
        value={value}
        onChange={(e, newValue: number) => {
          setValue(newValue);
        }}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="tabs"
      >
        <Tab label="Building" {...a11yProps(0)} />
        <Tab label="Damper" {...a11yProps(1)} />
        <Tab label="Performance" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <BuildingThreeD
          height={450}
          numFLoors={45}
          xWidth={50}
          yWidth={40}
        ></BuildingThreeD>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Damper Design
      </TabPanel>
      <TabPanel value={value} index={2}>
        Damper Performance
      </TabPanel>
    </Card>
  );
};

export default MyCanvas;
