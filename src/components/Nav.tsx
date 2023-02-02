import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Toolbar, Paper, List } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import authHelpers from "../authHelpers";
import { useEffect, useState } from "react";
import URLS from "../urls";


const Nav = (props: any) => {
  const { receiver, ids, setIds, data, socket } = props;
  const navigate = useNavigate();

  const [user, setUser] = useState(
    authHelpers.getDataFromLocalStorage("user") || "Guest"
  );

  useEffect(() => {}, [user]);
  let storeUser = () => {
    let promptValue = prompt("Your name ?")?.slice(0, 8);

    if (promptValue) {
      authHelpers.saveDataInLocalStorage("user", promptValue);
      setUser(promptValue);
    }
  };

  

  useEffect(() => {
    fetch(URLS.SERVER_URL)
      .then((res) => res.json())
      .then((data) => {
        delete data[socket.id];  
        setIds(data);
      });
  }, [socket, data]);
  
  const userNamesArray =  Object.values(ids).map((id: any) => id.user)
  const userNames = userNamesArray.splice(1,userNamesArray.length-1).join(", ")
  
  return (
    <Box sx={{ flexGrow: 1, background: "#273443" }} className="nav">
      <AppBar position="static" sx={{ background: "#273443" ,p:1}}>
        <Toolbar sx={{ padding: "0px",  }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon
              sx={{ color: "white" }}   
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
              {receiver ? receiver : "guest"}
            </Typography>
            {receiver == "global chat" && (
              <div className="appBar_div_sender_users">
                  {userNames}
              </div>

            )}
        
          </div> 

            <Typography
              variant="body1"
              component="div"
              onClick={storeUser}
              sx={{ cursor: "pointer" ,minWidth:"3rem" ,whiteSpace :"nowrap"}}
            >
              {user.slice(0, 8)}
            </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Nav;
