"use client";

import BalanceIcon from "@mui/icons-material/Balance";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useState } from "react";
import logo from "../../public/cropped-hummingbird_logo_blue-32x32.png";

function ResponsiveAppBar({toggleUnits} : {toggleUnits: () => void}) {
 
  const actions = [
    { icon: <PrintIcon />, name: "Print" },
    { icon: <ShareIcon />, name: "Share" },
    { icon: <BalanceIcon />, name: "Toggle units US/SI", handler: toggleUnits },
  ];

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const vertical = "bottom";
  const horizontal = "right";

  return (
    <AppBar
      position="static"
      color="inherit"
      enableColorOnDark
      className="mb-5"
    >
      <Container maxWidth={false}>
        <Toolbar>
          <Box>
            <Image alt="logo" src={logo} height={40} />
          </Box>
          <Typography
            variant="h5"
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            HUMMINGBIRD DESIGNER
          </Typography>
          <SpeedDial
            FabProps={{ size: "small", style: { backgroundColor: "primary" } }}
            ariaLabel="SpeedDial"
            sx={{ position: "absolute", right: 16 }}
            icon={<SpeedDialIcon />}
            direction="left"
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.handler || handleOpen}
              />
            ))}
          </SpeedDial>
        </Toolbar>
      </Container>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={5000}
        onClose={handleClose}
        message="This feature is coming soon. Please stay tuned."
      />
    </AppBar>
  );
}
export default ResponsiveAppBar;
