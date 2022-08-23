import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme';
import "@fontsource/work-sans";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Diagnostics from './views/Diagnostics';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<><CssBaseline /><App /></>} />
        <Route 
          path="diagnostics" 
          element={<><CssBaseline /><App children={<Diagnostics/>} /></>} />
      </Routes>
      
    </BrowserRouter>
  </ThemeProvider>,
  document.querySelector('#root'),
);
