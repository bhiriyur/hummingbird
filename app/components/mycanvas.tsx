"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
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
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("Setting value to ", newValue)
    setValue(newValue);
  };

  return (
    <div style={{ backgroundColor: "white", height: "100%" }}>
      <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab value={0} label="Item One" {...a11yProps(0)} />
            <Tab value={1}  label="Item Two" {...a11yProps(1)} />
            <Tab value={2}  label="Item Three" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={0} index={0} dir={theme.direction}>
          Item One
        </TabPanel>
        <TabPanel value={1} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
        <TabPanel value={2} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
      </Box>
    </div>
  );
};

export default MyCanvas;
