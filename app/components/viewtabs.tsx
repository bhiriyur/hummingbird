"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import { buildingProps } from "../common/types";
import { BuildingThreeD } from "./viewbuilding";
import { DamperX, DamperY } from "./viewdampers";

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  const boxStyle = { height: "100%", maxHeight: "600px", padding: "10px" };
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={boxStyle}
      {...other}
    >
      {value === index && <Box style={boxStyle}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function ShowCalcLogs(props: buildingProps) {
  return (
    <div
      id={"calc-logs"}
      aria-labelledby={"calc-logs"}
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        whiteSpace: "pre-line",
        backgroundColor: "black",
        color: "white",
        fontFamily: "monospace",
        fontSize: "medium",
        padding: "5px",
      }}
    >
      {props.LOGS || ""}
    </div>
  );
}

const ViewTabs = (props: buildingProps) => {
  const [value, setValue] = React.useState(0);
  return (
    <Card style={{ height: "100%", backgroundColor: "#FFFFFA" }}>
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
        <Tab label="Damper-X" {...a11yProps(1)} />
        <Tab label="Damper-Y" {...a11yProps(1)} />
        <Tab label="Calc-Logs" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <BuildingThreeD {...props}></BuildingThreeD>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DamperX {...props} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DamperY {...props} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ShowCalcLogs {...props} />
      </TabPanel>
    </Card>
  );
};

export default ViewTabs;
