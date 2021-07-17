import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "../utilities/firebase";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsIcon from "@material-ui/icons/Settings";
import MenuIcon from "@material-ui/icons/Menu";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";

//design plugins
import "./css/general.css";
import { ThemeProvider, Avatar, makeStyles, Button } from "@material-ui/core";

import theme from "../utilities/theme";

export default function Nav() {
  const currentUser = firebase.auth().currentUser;
  const db = firebase.firestore();

  const useStyles = makeStyles((theme) => ({
    post_header: {
      display: "flex",
      alignItems: "center",
      marginTop: "-10px",
      marginLeft: "-30px",
    },
    profile: {
      display: "flex",
      alignItems: "center",
      margin: "10px",
    },
    main: {
      backgroundColor: "#1E1D1D",
      color: "White",
    },
    list: {
      width: 250,
    },
    fullList: {
      width: "auto",
    },
    /*     logout:{
      display: "inline-block",
      float: "right",
    } */
  }));

  const classes = useStyles();

  const [draw, setDraw] = useState({
    right: false,
  });

  const [user, setUser] = useState({
    name: [],
    Userid: [],
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDraw({ ...draw, [anchor]: open });
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

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["", ""].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon
              component={Link}
              to="/profile"
              style={{ alignItems: "center" }}
            >
              {index % 2 === 0 ? (
                <Button
                  component={Link}
                  to="/edit"
                  style={{ textTransform: "capitalize"}}
                >
                  {" "}
                  <SettingsIcon style={{ marginRight: "10px" }} />
                  Profile
                </Button>
              ) : (
                <Button style={{ textTransform: "capitalize"}}>
                  <ExitToAppOutlinedIcon style={{ marginRight: "10px" }} onClick={logout} />
                  Sign-out
                </Button>
              )}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  useEffect(() => {
    const fetchData = () => {
      db.collection("users")
        .doc(currentUser.uid)
        .collection("profile")
        .doc(currentUser.uid)
        .get()
        .then((doc) => {
          let userState = [];
          userState.push(doc.data());
          setUser({
            name: userState,
            Userid: currentUser.uid,
          });
        });
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.main}>
        <nav>
          <ul className={classes.post_header}>
            <li>
              <Link to="/homepage">
                {" "}
                <HomeRoundedIcon style={{ fontSize: "40px" }}></HomeRoundedIcon>
              </Link>
            </li>
            <li>
              <Link to="/profile">
                {user.name.map((user) => (
                  <div key={user.Userid} className={classes.profile}>
                    <Avatar
                      className={classes.avatar}
                      alt="avatar"
                      style={{ margin: "10px" }}
                    >
                      {user.name[0]}
                    </Avatar>
                    <p style={{ display: "inline-block" }}>{user.name}</p>
                  </div>
                ))}
              </Link>
            </li>

            {["Right"].map((anchor) => (
              <div
                key={anchor}
                style={{
                  float: "right",
                  marginLeft: "auto",
                  marginRight: "10px",
                }}
              >
                <MenuIcon
                  onClick={toggleDrawer(anchor, true)}
                  style={{ margin: "15px", fontSize: "40px" }}
                >
                  {anchor}
                </MenuIcon>
                <Drawer
                  anchor={anchor}
                  open={draw[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                >
                  {list(anchor)}
                </Drawer>
              </div>
            ))}
          </ul>
        </nav>
      </div>
    </ThemeProvider>
  );
}
