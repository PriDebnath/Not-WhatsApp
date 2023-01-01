import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import authHelpers from "../authHelpers";

import URLS from "../urls";

let Home = (props: any) => {
  const { socket, data, setData, ids, setIds, statusText, setStatusText }: any =
    props;
  try {
    socket.connect();
  } catch (error) {
    console.log(error);
  }

  useEffect(() => {
    fetch(URLS.SERVER_URL)
      .then((res) => res.json())
      .then((data) => {
        delete data[socket.id];
        setIds(data);
        setStatusText( "Available member will list here");
      })
      .catch((error) => {
        setStatusText("Server is off , ask  Pri to turn it on");
        console.log({ error });
      });
  }, [socket, data]);

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
              <Typography variant="body1" component="div">
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
      <Typography
        variant="body1"
        component="div"
        sx={{
          textAlign: "center",
          marginTop: "40vh",
        }}
      >
        {statusText}
        <span className="dot"> .</span>
      </Typography>
    </List>
  );
};

export default Home;
