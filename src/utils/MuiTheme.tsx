import { createTheme } from "@mui/material";

export const centerTableTheme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          textAlign: "center",
        },
      },
    },
  },
});
