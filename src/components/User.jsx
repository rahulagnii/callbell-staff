import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { navigate } from "@reach/router";
import { Row, Col, Image, Typography, Card } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { SwipeAction, List } from "antd-mobile";
import useSound from "use-sound";
import beep from "../beep.wav";
import db from "../firebase";
import logo from "../bell.png";

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
      .onSnapshot(({ docs }) => {
        // snapshot.docChanges().map((value) => {
        //   if (value.type === "added" || value.type === "modified") {
        //     notification.warning({
        //       message: `Table No ${value.doc.data().tableNo}`,
        //       description: `${value.doc.data().event}`,
        //       placement: "bottomRight",
        //     });
        //   }
        //   return null;
        // });
        setNotify(docs.map((doc) => doc.data()));
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
      db.collection("tables").doc(tableNo).delete();
    } else {
      db.collection("notifications").doc(id).delete();
    }
  };

  useEffect(() => {
    if (notify.length > 0) {
      play();
    }
  }, [notify]);

  return (
    <div className="container center">
      <Row>
        <Col span={22}>
          <Image width={50} src={logo} style={{ marginTop: 5 }} />
          <Title style={{ color: "white" }} level={2}>
            Call Bell
          </Title>
        </Col>
        <Col span={2}>
          <LogoutOutlined
            style={{
              fontSize: "25px",
              fontWeight: "bold",
              color: "red",
              marginTop: 30,
            }}
            onClick={signOut}
          />
        </Col>
      </Row>
      {notify.map(({ tableNo, event, id }) => {
        return (
          <SwipeAction
            style={{
              width: "100%",
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
            <Card>
              <List.Item extra="More" arrow="horizontal">
                <strong>{`Table ${tableNo} ${event}`}</strong>
              </List.Item>
            </Card>
          </SwipeAction>
        );
      })}
    </div>
  );
};

export default User;
