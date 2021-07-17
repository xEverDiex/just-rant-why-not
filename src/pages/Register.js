import React, { useState } from "react";
import firebase from "../utilities/firebase";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import "../components/css/general.css";

import { ThemeProvider, makeStyles } from "@material-ui/core";
import theme from "../utilities/theme";

export default function Register() {
  //////////styles start
  const useStyles = makeStyles((theme) => ({
    body: {
      width: "100vw",
      height: "100vh",
      backgroundColor: "#1E1D1D",
      color: "White",
      fontFamily: "Impact",
      fontSize: "40px",
    },

    h2: {
      marginTop: "0px",
      paddingTop: "5vh",
    },

    center: {
      alignItems: "Center",
      textAlign: "Center",
    },

    textfield: {
      alignItems: "Center",
      textAlign: "Center",
    },

    TextField: {
      borderRadius: "10px",
      backgroundColor: "White",
      margin: "10px",
    },
    label: {
      color: "black",
    },
    genderlabel: {
      color: "white",
      fontSize: "20px",
    },
    /* 
 regbut: {
 marginTop: "-4vh",
  },
*/
  }));
  const classes = useStyles();
  ///////////styles end

  const [payload, setPayload] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    fullname: "",
    gender: null,
  });

  const handleChange = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };
  const db = firebase.firestore();
  const register = (e) => {
    e.preventDefault();
    if (!payload.email || !payload.password || !payload.confirmpassword) {
      alert("Cannot proceed with empty fields");
    } else if (payload.password !== payload.confirmpassword) {
      alert("Passwords do not match");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then((userCredential) => {
          var user = userCredential.user;
          db.collection("users")
            .doc(user.uid)
            .collection("profile")
            .doc(user.uid)
            .set({
              uid: user.uid,
              name: payload.fullname,
              gender: payload.gender,
              email: payload.email,
              password: payload.password,
            })
            .then(() => {
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
              alert("Push to Profile Collection Error");
            });
          alert("Welcome new user.");
        })
        .catch((error) => {
          //var errorCode = error.code;
          //var errorMessage = error.message;
          // ..
          alert("Something went wrong.");
        });
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.body}>
        <form className={classes.center}>
          <h2 className={classes.h2}>REGISTRATION</h2>
          <TextField
            id="filled-basic"
            label="Email"
            variant="filled"
            onChange={handleChange("email")}
            value={payload.email}
            className={classes.TextField}
          />
          <br />

          <TextField
            id="filled-basic"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="filled"
            onChange={handleChange("password")}
            value={payload.password}
            className={classes.TextField}
          />
          <br />

          <TextField
            id="filled-basic"
            label="Confirm Password"
            type="password"
            autoComplete="current-password"
            variant="filled"
            onChange={handleChange("confirmpassword")}
            value={payload.confirmpassword}
            className={classes.TextField}
          />
          <br />

          <TextField
            id="filled-basic"
            label="Fullname"
            variant="filled"
            placeholder="*First Name, Last Name"
            onChange={handleChange("fullname")}
            value={payload.fullname}
            className={classes.TextField}

            /*InputLabelProps={{
            className: classes.label,
        }}*/
          />
          <br />

          <FormControl component="fieldset">
            <FormLabel className={classes.genderlabel} component="legend">
              Gender
            </FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={payload.gender}
              onChange={handleChange("gender")}
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
          <br />

          <Button variant="contained" onClick={register}>
            Confirm
          </Button>
        </form>
      </div>
    </ThemeProvider>
  );
}
