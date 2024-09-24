import {
  Box,
  Button,
  createTheme,
  CssBaseline,
  Paper,
  ThemeProvider,
} from "@mui/material";
import { useState } from "react";
import React from "react";
import { createThemeOptions } from "./theme";

import { Close, DarkMode, LightMode } from "@mui/icons-material";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import UserForm from "./Pages/UserForm/UserForm";
import { TabContentWrapper } from "./TabContentWrapper";
import { Synchronization } from "./Pages/Synchronization/Synchronization";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PublishedRecords } from "./Pages/PublishedRecords/PublishedRecords";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const POPUP_HEIGHT = 580;
export const HEADER_HEIGHT = 48;
export const HEADER_BORDER_HEIGHT = 1;

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setIsDarkMode((prevMode) => !prevMode);
      },
    }),
    []
  );

  const theme = React.useMemo(
    () => createTheme(createThemeOptions(isDarkMode)),
    [isDarkMode]
  );

  const [value, setValue] = React.useState<number>(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Paper
            sx={{
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: HEADER_BORDER_HEIGHT,
                borderColor: "divider",
                position: "fixed",
                width: "100%",
                height: HEADER_HEIGHT,
              }}
            >
              <Box>
                <Tabs value={value} onChange={handleChange} aria-label="tabs">
                  <Tab label="Опубликованные записи" {...a11yProps(0)} />
                  <Tab label="Синхронизация" {...a11yProps(1)} />
                  <Tab label="Форма" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  sx={{
                    minWidth: 0,
                  }}
                  onClick={colorMode.toggleColorMode}
                >
                  {isDarkMode ? <DarkMode /> : <LightMode />}
                </Button>
                <Button
                  sx={{
                    minWidth: 0,
                  }}
                  onClick={() => {
                    window.close();
                  }}
                >
                  <Close
                    sx={{
                      color: theme.palette.error.main,
                    }}
                  />
                </Button>
              </Box>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <TabContentWrapper>
                <PublishedRecords />
              </TabContentWrapper>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <TabContentWrapper>
                <Synchronization />
              </TabContentWrapper>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <TabContentWrapper>
                <UserForm />
              </TabContentWrapper>
            </CustomTabPanel>
          </Paper>
          <ToastContainer />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

export default App;
