import * as React from 'react';
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import Organization from './pages/organization';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Organization/>
    </ThemeProvider>
  );
};

export default App;
