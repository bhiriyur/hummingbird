"use client";

import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import logo from "../../public/cropped-hummingbird_logo_blue-32x32.png";

function ResponsiveAppBar() {
  const actions = [
    { icon: <PrintIcon />, name: "Print" },
    { icon: <ShareIcon />, name: "Share" },
  ];

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
              />
            ))}
          </SpeedDial>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
