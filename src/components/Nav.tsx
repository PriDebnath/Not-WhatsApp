import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Toolbar, Paper, List } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
// icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";

import authHelpers from "../authHelpers";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import URLS from "../urls";

export default function Nav(props: any) {
  let { receiverId }: any = useParams();

  const { receiver, ids, setIds, data, socket } = props;
  const navigate = useNavigate();

  const [user, setUser] = useState(
    authHelpers.getDataFromLocalStorage("user") || "Guest"
  );
  useEffect(() => {}, [user]);
  let storeUser = () => {
    let promptValue = prompt("Your name ?")?.slice(0, 8);

    if (promptValue) {
      console.log(promptValue);

      authHelpers.saveDataInLocalStorage("user", promptValue);
      setUser(promptValue);
    }
  };

  useEffect(() => {
    fetch(URLS.SERVER_URL)
      .then((res) => res.json())
      .then((data) => {
        //console.log(Object.values(data))
        delete data[socket.id];
        setIds(data);
      });
  }, [socket, data]);
  return (
    <Box sx={{ flexGrow: 1, background: "#273443" }} className="nav">
      <AppBar position="static" sx={{ background: "#273443" }}>
        <Toolbar>
          <IconButton>
            <ArrowBackIcon
              sx={{ color: "white" }}
              onClick={() => navigate(-1)}
            />
            <AccountCircleIcon
              sx={{
                fontSize: 40,
                color: "#808080",
              }}
            />
          </IconButton>
          <div className="appBar_div">
            <Typography variant="body1" component="div">
              {receiver ? receiver : "Guest"}
            </Typography>
            {/* {receiverId == "global" && (
              <Paper
                sx={{
                  maxWidth: "40%",
                  display: "flex",
                  overflow: "auto",
                  background: "inherit",
                  color: "white",
                  padding: "1%",
                  boxShadow: " inset 0px 0px 0.4rem black",
                  // "&:hover": {
                  //   boxShadow: " 0px 0px 0.4rem black",
                  // },
                }}
              >
                {Object.values(ids).map((id: any) => {
                  return (
                    <span
                      // sx={{
                      //   fontSize: "10px",
                      //   // minWidth: "50px",
                      //   display:"inline",
                      //   padding: "0px 10px",
                      // }}
                    >
                      {id?.user} ,{" "}
                    </span>
                  );
                })}
              </Paper>
            )} */}

            <Typography
              variant="body1"
              component="div"
              onClick={storeUser}
              sx={{ cursor: "pointer" }}
            >
              {user.slice(0, 8)}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
