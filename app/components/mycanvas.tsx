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

  const boxStyle = {"height": "100%", "maxHeight": "600px", "padding": "10px"};
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={ boxStyle }
      {...other}
    >
      {value === index && <Box style={ boxStyle }>{children}</Box>}
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
    <Card  style={{height:'100%', "backgroundColor": "#FFFFFA" }}>
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
          BX={80}
          BY={450}
          BZ={55}
          N={42}
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
