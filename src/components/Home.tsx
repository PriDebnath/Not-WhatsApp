import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

// import { useSelector, useDispatch } from "react-redux";
// import { storeMessage } from "../state4/userSlice"
// import jsonData from "../state4/data"

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
// icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import authHelpers from "../authHelpers";

import URLS from "../urls";

let Home = (props: any) => {
  const { socket, data, setData, ids, setIds }: any = props;
  socket.connect();

  // authHelpers.saveDataInLocalStorage("socketId", socket.id);
  let user = authHelpers.getDataFromLocalStorage("user") || "guest";

  useEffect(() => {
    fetch(URLS.SERVER_URL)
      .then((res) => res.json())
      .then((data) => {
        //console.log(Object.values(data))
        delete data[socket.id];
        setIds(data);
      });
  }, [socket, data]);

  useEffect(() => {
    //socket.emit("send_message",{id:socket.id})
  }, []);
  // useEffect(() => {
  //   socket.on("receive_message", () => {
  //     console.log("received message");
  //   });
  // }, [socket]);

  //console.log({ids})
  return (
    <List sx={{ width: "100%", bgcolor: "#131e1e", minHeight: "100vh" }}>
      {Object.values(ids).map((id: any, i: number) => {
        return (
          <ListItem
            alignItems="flex-start"
            key={i}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <IconButton>
              <AccountCircleIcon
                sx={{
                  fontSize: 40,
                  color: "#808080",
                }}
              />
            </IconButton>

            <Link className="link" to={`/${id.id}`}>
              <Typography variant="h6" component="div">
                {id.user}
                <Typography variant="h6" sx={{ fontSize: "10px" }}>
                  {data[id.id]?.[data[id.id].length - 1]?.message}
                </Typography>
              </Typography>

              <Typography
                variant="h6"
                component="div"
                className="messageCounter"
              >
                {data[id.id]?.length ? data[id.id]?.length : 0}
              </Typography>
            </Link>
          </ListItem>
        );
      })}
    </List>
  );
};

export default Home;
