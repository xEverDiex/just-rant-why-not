import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
//routes
import PublicRoute from "./routers/PublicRoute";
import PrivateRoute from "./routers/PrivateRoute";
//themeing_design
import { ThemeProvider } from "@material-ui/core";
import theme from "./utilities/theme";
//importantShits
import React, { useState, useEffect } from "react";
import firebase from "./utilities/firebase";
//pages
import Register from "./pages/Register";
import EditProfile from "./pages/EditProfile";
import LandingPage from "./pages/Landingpage";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";

import Notfound from "./pages/404";

function App() {
  const [values, setValues] = useState({
    isAuthenticated: false,
    isLoading: true,
    //user:{}
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        setValues({ isAuthenticated: true, isLoading: false });
      } else {
        // No user is signed in.
        setValues({ isAuthenticated: false, isLoading: false });
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/landingpage"></Redirect>
          </Route>

          <PublicRoute
            component={Register}
            isAuthenticated={values.isAuthenticated}
            restricted={true}
            path="/register"
            exact
          />

          <PublicRoute
            component={LandingPage}
            isAuthenticated={values.isAuthenticated}
            restricted={true}
            path="/landingpage"
            exact
          />

          <PrivateRoute
            component={Homepage}
            isAuthenticated={values.isAuthenticated}
            restricted={true}
            path="/homepage"
            exact
          />

          <PrivateRoute
            component={Profile}
            isAuthenticated={values.isAuthenticated}
            restricted={true}
            path="/profile"
            exact
          />

          <PrivateRoute
            component={EditProfile}
            isAuthenticated={values.isAuthenticated}
            restricted={true}
            path="/edit"
            exact
          />

          <Route component={Notfound}></Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
