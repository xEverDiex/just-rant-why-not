import React, { useState, useEffect } from "react";
import firebase, { storage } from "../utilities/firebase";

import createPost from "../pages/Homepage";

const db = firebase.firestore();
let today = new Date();
let date =
  today.getDate() +
  "-" +
  parseInt(today.getMonth() + 1) +
  "-" +
  today.getFullYear() +
  " " +
  today.toLocaleTimeString();

export default function Upload() {
  const root = db.collection("users").doc(currentUser.uid);
  const [payload, setPayload] = useState({
    contentPost: "",
    reactx: "",
  });
  const handleChange = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };
  return (
    <div>
      <form onSubmit={createPost}>
        <input
          type="file"
          style={{ float: "left" }}
          onChange={handleChange}
        ></input>
      </form>
    </div>
  );
}
