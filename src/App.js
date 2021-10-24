import React from 'react'

import Routes from "./routes";
import {CssBaseline} from "@material-ui/core";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'dotenv'

import './App.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);


    }

  state = {
    toggleTheme: this.toggleTheme,
  };

  render() {
    return (
          <CssBaseline>
              <ReactNotification />
              <Routes />
          </CssBaseline>
    );
  }
}

