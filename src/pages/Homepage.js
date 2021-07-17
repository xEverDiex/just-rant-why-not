import React, { useState, useEffect } from "react";
import firebase from "../utilities/firebase";
import Navbar from "../components/Nav";
import "../components/css/general.css";

//import Modal from "../components/Openpostmodal";

import {
  Grid,
  Card,
  CardContent,
  makeStyles,
  TextField,
  Button,
  Avatar,
} from "@material-ui/core";
import ImageRoundedIcon from "@material-ui/icons/ImageRounded";

const Homepage = () => {
  let today = new Date();
  let date =
    today.getDate() +
    "-" +
    parseInt(today.getMonth() + 1) +
    "-" +
    today.getFullYear() +
    " " +
    today.toLocaleTimeString();

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    postCard: {
      width: "40vw",
      minWidth: "350px",
    },

    postContainer: {
      margin: "0px",
      display: "inline-block",
    },
    title: {
      fontWeight: "500",
      margin: "0",
      display: "inline-block",
    },
    date: {
      justifyContent: "right",
      fontWeight: "400",
      fontSize: "12px",
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
      paddingLeft: "5px",

      margin: "0px",
    },
    postHolder: {
      marginBottom: "0px",
      paddingBottom: "0px !Important",
    },

    commentSection: {
      backgroundColor: "#eeeeee",
    },

    main: {
      backgroundColor: "#59595c",
      width: "auto",
      marginRight: "none",
    },

    buttoncom: {
      marginLeft: "20px",
      marginRight: "20px",
    },

    comain: {
      height: "100vh",
      width: "auto",
      backgroundColor: "#59595c",
    },

    commentCont: {
      width: "100%",
      display: "flex",
      justifyContent: "flex-end",
    },
  }));

  const classes = useStyles();
  const currentUser = firebase.auth().currentUser;
  const db = firebase.firestore();

  // eslint-disable-next-line
  const [state, setstate] = useState({
    Userid: [],
    isLoading: true,
    name: [],
  });

  const [postList, setPost] = useState({
    content: [],
    postId: [],
  });

  const [payload, setPayload] = useState({
    contentPost: "",
    commentPost: "",
    contentTitle: "",
  });

  const [file, setFile] = useState(null);
  // eslint-disable-next-line
  const [url, setURL] = useState("");

  const handleChange = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  const handleComment = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  function handlePhoto(e) {
    setFile(e.target.files[0]);
  }

  const [modalIsOpen, setIsOpen] = useState(false);

  const [individualPost, setIndividualPost] = useState({
    content: [],
    postId: [],
  });

  const [comments, setComments] = useState({
    currentPost: [],
    comment: [],
    commentatorUid: [],
    commentator: [],
    created_at: [],
  });

  const seeComments = (docId) => {
    setIsOpen(true);
    db.collection("posts")
      .doc(docId)
      .get()
      .then((doc) => {
        let postlist = [];
        postlist.push(doc.data());
        setIndividualPost({
          content: postlist,
          postId: postlist.id,
        });
        db.collection("posts")
          .doc(docId)
          .collection("commentsection")
          .orderBy("created_at", "asc")
          .onSnapshot((doc) => {
            let commentlist = [];
            doc.forEach((b) => {
              commentlist.push(b.data());
              setComments({
                currentPost: commentlist,
                comment: commentlist,
                commentatorUid: commentlist,
                commentator: commentlist,
                created_at: commentlist,
                commentId: commentlist,
              });
            });
          });
      });
  };

  const closeComments = () => {
    setIsOpen(false);
  };

  //retrieve profile
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
          setstate({
            name: userState,
            Userid: currentUser.uid,
            isLoading: false,
          });
        });
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  //global posts
  useEffect(() => {
    const fetchData = () => {
      db.collection("posts")
        .orderBy("created_at", "desc")
        .onSnapshot((doc) => {
          let postlist = [];
          doc.forEach((post) => {
            postlist.push(post.data());
            setPost({
              content: postlist,
              postId: postlist.id,
            });
          });
        });
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const createPost = (e) => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("profile")
      .doc(currentUser.uid)
      .get()
      .then((docRef) => {
        var name = docRef.data().name;
        db.collection("posts")
          .add({
            contentPost: payload.contentPost,
            contentTitle: payload.contentTitle,
            author: name,
            authot_id: currentUser.uid,
            created_at: new Date(),
            display_date: date,
            comment_count: 0,
          })
          .then((docRef) => {
            let forComment = docRef.id;
            if (!file) {
              console.log(forComment);
              db.collection("posts")
                .doc(forComment)
                .update({ postId: forComment });
              db.collection("posts")
                .doc(forComment)
                .collection("commentsection")
                .add({
                  currentPost: forComment,
                  comment: "Welcome to comment section.",
                  commentatorUid: "5Qt9oLNlG7cPEnmE20FNKJ794CE2",
                  commentator: "Just Rant",
                  created_at: new Date(),
                })
                .then((docRef) => {
                  let commentId = docRef.id;
                  db.collection("posts")
                    .doc(forComment)
                    .collection("commentsection")
                    .doc(commentId)
                    .update({
                      commentId: commentId,
                    });
                  setPayload({
                    contentPost: "",
                  });
                });
            } else {
              console.log(forComment + " photo");
              const storage = firebase.storage();
              const ref = storage.ref(`/images/${forComment}/${file.name}`);
              ref.put(file).then((snapshot) => {
                ref.getDownloadURL().then((url) => {
                  setFile(null);
                  setURL(url);
                  console.log(url);
                  //if post has photo
                  db.collection("posts")
                    .doc(forComment)
                    .update({
                      img_path: url,
                    })
                    .then(() => {
                      db.collection("posts")
                        .doc(forComment)
                        .update({ postId: forComment });
                      db.collection("posts")
                        .doc(forComment)
                        .collection("commentsection")
                        .add({
                          currentPost: forComment,
                          comment: "Welcome to comment section.",
                          commentatorUid: "5Qt9oLNlG7cPEnmE20FNKJ794CE2",
                          commentator: "Just Rant",
                          created_at: new Date(),
                        })
                        .then((docRef) => {
                          let commentId = docRef.id;
                          db.collection("posts")
                            .doc(forComment)
                            .collection("commentsection")
                            .doc(commentId)
                            .update({
                              commentId: commentId,
                            });
                          setPayload({
                            contentPost: "",
                            contentTitle: "",
                          });
                        });
                    });
                });
              });
              //uploadTask.on("state_changed", console.log, console.error, () => {
            }
          });
      })
      .catch((error) => {});
  };

  const createComment = (docId) => {
    db.collection("posts")
      .doc(docId)
      .get()
      .then((docId) => {
        let currentPost = docId.id;
        db.collection("posts")
          .doc(currentPost)
          .collection("commentsection")
          .add({
            currentPost: docId.id,
            comment: payload.commentPost,
            commentatorUid: currentUser.uid,
            created_at: new Date(),
          })
          .then((docRef) => {
            let commentId = docRef.id;
            db.collection("users")
              .doc(currentUser.uid)
              .collection("profile")
              .doc(currentUser.uid)
              .get()
              .then((docRef) => {
                db.collection("users")
                  .doc(currentUser.uid)
                  .collection("profile")
                  .doc(currentUser.uid)
                  .get()
                  .then((doc) => {
                    let name = doc.data().name;
                    db.collection("posts")
                      .doc(currentPost)
                      .collection("commentsection")
                      .doc(commentId)
                      .update({
                        commentator: name,
                        commentId: commentId,
                      })
                      .then(() => {
                        //
                      });
                  });
              });
          });
      });

    setPayload({
      commentPost: "",
    });
  };

  while (modalIsOpen === true) {
    return (
      <div className={classes.comain}>
        <div className={classes.main}>
          <Navbar></Navbar>
          <Grid container direction="column" spacing={2} alignContent="center">
            <Grid item className={classes.postCard}>
              {individualPost.content.map((posts) => (
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
                      <div
                        style={{ marginBottom: "45px", wordWrap: "break-word" }}
                      >
                        <h2 className={classes.title}>{posts.contentTitle}</h2>
                        <br />
                        <p>{posts.contentPost}</p>
                      </div>

                      <div>
                        <img
                          src={posts.img_path}
                          alt=""
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "contain",
                          }}
                        ></img>
                      </div>
                      <br />
                      <div className={classes.commentSectiondiv}>
                        <Card className={classes.commentSection}>
                          {comments.comment.map((comment) => (
                            <CardContent
                              key={comment.commentId}
                              style={{ borderBottom: "solid 1px #4f5b62" }}
                            >
                              <h5 className={classes.name}>
                                {comment.commentator}
                              </h5>
                              <div>{comment.comment}</div>
                            </CardContent>
                          ))}
                        </Card>
                      </div>
                      <input
                        type="text"
                        placeholder="add comment"
                        onChange={handleComment("commentPost")}
                        style={{
                          border: "none",
                          outline: "none",
                          borderBottom: "solid 1px #4f5b62",
                          width: "99%",
                          height: "45px",
                          fontSize: "15px",
                          marginTop: "20px",
                        }}
                        value={payload.commentPost}
                      ></input>
                    </CardContent>
                    <Button
                      disabled={!payload.commentPost}
                      className={classes.buttoncom}
                      onClick={() => createComment(posts.postId)}
                      color="primary"
                    >
                      Post Comment
                    </Button>

                    <Button onClick={closeComments} color="secondary">
                      Close Thread
                    </Button>
                  </Card>
                  <br />
                </div>
              ))}
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.main}>
      <Navbar></Navbar>
      <div>
        <Grid container direction="column" spacing={2} alignContent="center">
          <Grid
            item
            className={classes.postCard}
            style={{
              border: "none",
              borderBottom: "4px solid #1E1D1D",
              borderRight: "4px solid #1E1D1D",
              padding: "0px",
              margin: "15px",
              borderRadius: "5px",
            }}
          >
            <Card>
              <CardContent>
                <TextField
                  id="standard-textarea"
                  label="Rant title"
                  multiline
                  style={{width:"60%", backgroundColor:"", borderRadius:"10px"}}
                  defaultValue="Title: "
                  onChange={handleChange("contentTitle")}
                  value={payload.contentTitle}
                />
                <br></br>
                <TextField
                  id="standard-textarea"
                  placeholder="Rant rant rant rant..."
                  multiline
                  fullWidth={true}
                  onChange={handleChange("contentPost")}
                  value={payload.contentPost}
                />
                <br /> <br />
                <label style={{ border: "none", padding: "15px" }}>
                <ImageRoundedIcon style={{fontSize:"40px"}} />
                  <input type="file" onChange={handlePhoto} style={{display:"none"}}/>
                </label>
                <Button
                  color="primary"
                  style={{ float: "right" }}
                  disabled={!payload.contentPost || !payload.contentTitle}
                  onClick={createPost}
                >
                  Post
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container direction="column" spacing={2} alignContent="center">
          <Grid item className={classes.postCard}>
            {postList.content.map((posts) => (
              <div>
                <Card>
                  <CardContent
                    key={posts.postId}
                    className={classes.postHolder}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        className={classes.avatar}
                        alt="avatar"
                        style={{ margin: "10px" }}
                      >
                        {posts.author[0]}
                      </Avatar>
                      <h5 className={classes.name}>{posts.author}</h5>
                      <i
                        className={classes.date}
                        style={{
                          alignSelf: "flex-start",
                          float: "right",
                          marginLeft: "auto",
                        }}
                      >
                        {posts.display_date}
                      </i>
                    </div>

                    <div>
                      <h2
                        className={classes.title}
                        style={{ wordWrap: "break-word" }}
                      >
                        {posts.contentTitle}
                      </h2>
                    </div>

                    <div className={classes.cardButtonsContainer}>
                      <div className={classes.commentCont}>
                        <Button
                          color="primary"
                          onClick={() => seeComments(posts.postId)}
                        >
                          View Thread
                        </Button>
                      </div>
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
  );
};
export default Homepage;
