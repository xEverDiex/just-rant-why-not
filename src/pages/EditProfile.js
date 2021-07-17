import React, { useState, useEffect } from "react";
import firebase from "../utilities/firebase";
import { Link } from "react-router-dom";
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

export default function EditProfile() {
  //////////styles start
  const useStyles = makeStyles((theme) => ({
    body: {
      width: "100vw",
      height: "100%",
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
  const currentUser = firebase.auth().currentUser;
  const db = firebase.firestore();

  const [payload, setPayload] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    name: "",
    gender: null,
  });

  const [profile, setProfile] = useState({
    uid: [],
    name: [],
    email: [],
    password: [],
    gender: [],
  });

  const handleChange = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  const Update = (e) => {
    e.preventDefault();
    var current = currentUser.uid;
    const user = firebase.auth().currentUser;
    if (
      !payload.email ||
      !payload.password ||
      !payload.confirmpassword ||
      !payload.name
    ) {
      alert("Empty Fields");
    } else if (payload.password !== payload.confirmpassword) {
      alert("Passwords do not match.");
    } else {
      user.updateEmail(payload.email).then(() => {
        user.updatePassword(payload.confirmpassword).then(() => {
          db.collection("users")
            .doc(current)
            .collection("profile")
            .doc(current)
            .update({
              uid: current,
              name: payload.name,
              gender: payload.gender,
              email: payload.email,
              password: payload.password,
            })
            .then(() => {
              alert("Success Updating, Please re-login");
              logout();
            });
        });
      });
    }
  };
  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };
  useEffect(() => {
    const fetchData = () => {
      var current = currentUser.uid;

      db.collection("users")
        .doc(current)
        .collection("profile")
        .doc(current)
        .get()
        .then((document) => {
          let userList = [];
          userList.push(document.data());
          setProfile({
            Userid: userList.id,
            name: userList,
            email: userList,
            password: userList,
            gender: userList,
            //isLoading: false,
          });
        });
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.body}>
        {profile.name.map((profile) => (
          <form className={classes.center}>
            <h2 className={classes.h2}>EDIT ACCOUNT</h2>
            <div key={profile.uid}>
              <TextField
                id="outlined-helperText"
                label="Fullname"
                variant="filled"
                placeholder="*First Name, Last Name"
                onChange={handleChange("name")}
                value={payload.name}
                helperText={"Current Name: " + profile.name}
                className={classes.TextField}
              />
              <br />
              <TextField
                id="outlined-helperText"
                label="Email"
                className={classes.TextField}
                onChange={handleChange("email")}
                value={payload.email}
                variant="outlined"
                helperText={"Current Email: " + profile.email}
              />
              <br />

              <TextField
                id="outlined-helperText"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="filled"
                onChange={handleChange("password")}
                value={payload.password}
                helperText={"Current Password: " + profile.password}
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

              <FormControl component="fieldset">
                <FormLabel className={classes.genderlabel} component="legend">
                  Gender
                </FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  //defaultValue={profile.gender}
                  value={payload.gender}
                  onChange={handleChange("gender")}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </FormControl>
              <br />

              <Button variant="contained" onClick={Update}>
                Confirm
              </Button>
              <br />
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/homepage"
              >
                Cancel
              </Button>
            </div>
          </form>
        ))}
      </div>
    </ThemeProvider>
  );
}
