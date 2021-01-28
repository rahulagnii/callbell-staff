import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { navigate } from "@reach/router";
import { message, Typography, notification } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { NavBar, SwipeAction, List, Card } from "antd-mobile";
import useSound from "use-sound";
import beep from "../beep.wav";
import db from "../firebase";

const User = () => {
  const auth = firebase.auth();
  auth.onAuthStateChanged((user) => {
    if (!user) {
      navigate("/");
    }
  });
  const signOut = () => {
    auth.signOut();
  };
  const [play] = useSound(beep);
  const [notify, setNotify] = useState([]);
  const { Title } = Typography;
  const getNotification = () => {
    db.collection("notifications")
      .orderBy("created", "desc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().map((value) => {
          if (value.type === "added" || value.type === "modified") {
            notification.warning({
              message: `Table No ${value.doc.data().tableNo}`,
              description: `${value.doc.data().event}`,
              placement: "bottomRight",
            });
          }
          return null;
        });
        setNotify(snapshot.docs.map((doc) => doc.data()));
      });
  };

  useEffect(() => {
    getNotification();
  }, []);

  const taskCompleted = (id, event, tableNo) => {
    if (event === "Asking Bill") {
      db.collection("notifications").doc(id).delete();
      db.collection("notifications").doc(`waiter${tableNo}`).delete();
      db.collection("notifications").doc(`sugar${tableNo}`).delete();
      db.collection("notifications").doc(`water${tableNo}`).delete();
      db.collection("tables")
        .doc(tableNo)
        .delete()
        .then(() => {
          message.success("Task successfully deleted!");
        })
        .catch((error) => {
          message.success(`Error removing task: , ${error}`);
        });
    } else {
      db.collection("notifications")
        .doc(id)
        .delete()
        .then(() => {
          message.success("Task successfully deleted!");
        })
        .catch((error) => {
          message.success(`Error removing task: , ${error}`);
        });
    }
  };

  useEffect(() => {
    if (notify.length > 0) {
      play();
    }
  }, [notify]);

  return (
    <div>
      <NavBar
        mode="light"
        style={{ padding: "40px 5px" }}
        rightContent={
          <LogoutOutlined
            style={{ fontSize: "25px", fontWeight: "bold", color: "red" }}
            onClick={signOut}
          />
        }
      >
        <Title>Call Bell</Title>
      </NavBar>
      <List style={{ marginTop: "20px" }} className="container">
        {notify.map(({ tableNo, event, id }) => {
          return (
            <SwipeAction
              style={{
                width: "100%",
                height: "150px",
              }}
              autoClose
              right={[
                {
                  text: "Close",
                  onPress: () => taskCompleted(id, event, tableNo),
                  style: {
                    backgroundColor: "#F4333C",
                    color: "white",
                    width: "100px",
                  },
                },
              ]}
            >
              <List.Item
                style={{
                  height: "150px",
                  padding: "1px",
                }}
                extra="More"
                arrow="horizontal"
              >
                <Card style={{ height: "150px" }}>
                  <Card.Header
                    title={`Table No. ${tableNo}`}
                    style={{ fontSize: "20px", fontWeight: "bold" }}
                  />
                  <Card.Body className="task">
                    <div>{event}</div>
                  </Card.Body>
                </Card>
              </List.Item>
            </SwipeAction>
          );
        })}
      </List>
    </div>
  );
};

export default User;
