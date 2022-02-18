import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { SendBirdProvider } from "sendbird-uikit";
import "sendbird-uikit/dist/index.css";

ReactDOM.render(
  <React.StrictMode>
    <SendBirdProvider
      userId={process.env.REACT_APP_USER_ID}
      appId={process.env.REACT_APP_SB_APP_ID}
    >
      <App />
    </SendBirdProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
