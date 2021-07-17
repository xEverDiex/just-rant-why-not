import React, { useState } from "react";
import { Link } from "react-router-dom";
import background from "../components/css/image/bg.jpg";
import doge from "../components/css/image/textlogo.png";
//
import firebase from "../utilities/firebase";


//material ui / styles
import TextField from "@material-ui/core/TextField";
import { Button, ThemeProvider, makeStyles } from "@material-ui/core";
import "../components/css/general.css";
import theme from "../utilities/theme";

export default function Landingpage() {
  const useStyles = makeStyles((theme) => ({

    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
    body: {
      backgroundImage: `url(${background})`,
      width: "100%",
      height: "100vh",
      display: "flex",
      //flexDirection: "row",
      justifyContent: "flex-end",
    },
    body2: {
      display: "flex",
      width: "100vw",
      height: "auto",
      backgroundColor: "rgba(20, 20, 20, 0.8)",
      justifyContent: "center",
    },

    h1: {
      marginTop: "15vh",

    },

    logo: {
      width: "800px",
      height: "800px",
      backgroundImage: `url(${doge})`,
    },

    TextField: {
      margin: "5px",
      borderRadius: "10px",
      backgroundColor: "White",
    },

    //login header
    login: {
      textAlign: "center",
      backgroundColor: "#1E1D1D",
      fontFamily: "Impact",
      fontSize: "50px",
      color: "White",
      width: "22vw",
      minWidth: "420px",
      minHeight: "500px",
      height: "104.3vh",
    },
    linkA: {

      textDecoration: "none",
      color: "rgba(255, 255, 255, 0.87)",
    },
    regbut: {
      marginTop: "-4vh",
    },

  }));
  const classes = useStyles();

  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const handleChange = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  const login = (e) => {
    e.preventDefault();

    if (!payload.email || !payload.password) {
      alert("Cannot proceed with empty fields");
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then((userCredential) => {
          alert("Signed in.");
        })
        .catch((error) => {
          alert("No account existing.");
          
        });
    }
  };

  /*   const forgotPass = (e) => {
      firebase
        .auth()
        .sendPasswordResetEmail(payload.email)
        .then(() => {
          // Password reset email sent!
          // ..
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ..
        });
    }; */

  return (
    <ThemeProvider theme={theme}>
      <body className={classes.body} >
        <div className="left">
          <div className={classes.body2}>
            <div className={classes.logo}>

            </div>
          </div>
        </div>

        
        <div className={classes.login}>
          <div>
            <h2 className={classes.h1}>LOGIN</h2>
            <form style={{width:"50%", margin:"auto"}}>
              <TextField
                id="outlined"
                label="Email"
                variant="outlined"
                onChange={handleChange("email")}
                value={payload.email}
                /* InputLabelProps={{
                    className: classes.label,
                }}*/ //for label color
                className={classes.TextField}
              />
              <br />
              <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                onChange={handleChange("password")}
                value={payload.password}
                className={classes.TextField}
              />

              <br />
              <Button variant="contained" onClick={login} color="secondary" fullWidth="ture">
                Login
              </Button>

              <Button className={classes.regbut} variant="contained" color="primary"  fullWidth="ture">
              <Link to="/register" className={classes.linkA}>
                {" "}
                Register{" "}
              </Link>
            </Button>
            </form>


            
            <br />
            {/* <Button variant="contained" onClick={forgotPass} color="default ">
              Nakalimutan ang password
            </Button> */}
          </div>
        </div>


      </body>
    </ThemeProvider>
  );
}
