import React, { useState, useEffect } from "react";
import firebase from "../utilities/firebase";
import Navbar from "../components/Nav";
import { Delete as DeleteIcon } from "@material-ui/icons";
import {
  Grid,
  Card,
  CardContent,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";

export default function Profile() {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
    postCard: {
      width: "40vw",
      minWidth: "350px",
    },
    postContainer: {
      margin: "0",
      display: "inline-block",
    },
    date: {
      alignContent: "right",
      margin: "0",
      fontWeight: "400",
      fontSize: "12px",
      display: "inline-block",
      float: "right",
    },
    name: {
      fontWeight: "500",
      margin: "0",
      display: "inline-block",
    },
    cardButtonsContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "30px",
      borderTop: "1px solid grey",
    },
    cardButtons: {
      paddingLeft: "10px",
      paddingRight: "10px",
      margin: "10px",
    },
    postHolder: {
      marginBottom: "0px",
      paddingBottom: "0px !Important",
    },

    body: {
      backgroundColor: "#59595c",
      height: "auto",
    },

    comain: {
      height: "100vh",
      width: "auto",
      backgroundColor: "#59595c",
    },
  }));
  const classes = useStyles();

  const currentUser = firebase.auth().currentUser;
  const db = firebase.firestore();
  //const root = db.collection("users").doc(currentUser.uid);

  const [state, setstate] = useState({
    name: "",
    Userid: "",
    isLoading: true,
  });

  const [postList, setPost] = useState({
    content: [],
    postId: [],
  });

  //const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      db.collection("users")
        .doc(currentUser.uid)
        .collection("profile")
        .doc(currentUser.uid)
        .get()
        .then((doc) => {
          let name = doc.data().name;
          setstate({
            Userid: currentUser.uid,
            name: name,
            isLoading: false,
          });
        });
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchData = () => {
      db.collection("posts")
        .orderBy("created_at", "desc")
        .onSnapshot((doc) => {
          let postslist = [];
          doc.forEach((posts) => {
            if (posts.data().authot_id === currentUser.uid) {
              postslist.push({ ...posts.data(), postId: posts.id });
              setPost({
                content: postslist,
                postId: postslist.id,
              });
            } else {
              //
            }
          });
        });
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const deletePost = (docRef) => {
    var r = window.confirm("Delete Post?");
    if (r === true) {
      db.collection("posts")
        .doc(docRef)
        .delete()
        .then(() => {
          //success
        });
    } else {
      //cancelled
    }
  };

  if (state.isLoading) {
    return (
      <div className={classes.root}>
        <CircularProgress size={160} />
      </div>
    );
  }

  return (
    <div className={classes.comain}>
      <div className={classes.body}>
        <Navbar></Navbar>
        <div>
          
          <Grid container direction="column" spacing={2} alignContent="center" style={{height:"100%"}}>
            <Grid item className={classes.postCard}>
            <h1 color="primary">Your own posts.</h1>
              {postList.content.map((posts) => (
                <div>
                  
                  <Card>
                    <CardContent
                      key={posts.postId}
                      className={classes.postHolder}
                    >
                      <div>
                        <h5 className={classes.name}>{posts.author}</h5>
                        <i className={classes.date}>{posts.display_date}</i>
                      </div>
                      <br />
                      <div>
                        <h3>{posts.contentTitle} </h3>
                        {posts.contentPost}
                        <br/>
                        <img
                          src={posts.img_path}
                          alt=""
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div className={classes.cardButtonsContainer}>
                        <DeleteIcon
                          className={classes.cardButtons}
                          style={{ cursor: "pointer" }}
                          onClick={() => deletePost(posts.postId)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <br />
                </div>
              ))}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
