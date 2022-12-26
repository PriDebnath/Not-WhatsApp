import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//components
import ChatPage from "./components/ChatPage";
import Home from "./components/Home";
import Nav from "./components/Nav";
//icons
import SendIcon from "@mui/icons-material/Send";
import DoneAllTwoToneIcon from "@mui/icons-material/DoneAllTwoTone";
import io from "socket.io-client";

//urls
import URLS from "./urls";
import authHelpers from "./authHelpers";

const socket = io(URLS.SERVER_URL);

function App() {
  let [data, setData]: any = useState({
    global: [
      {
        message: "Hello",
        id: "global",
        user: "Pri",
        fromClient: false,
        time: new Date().toLocaleTimeString(),
      },
    ],
  });

  let user = authHelpers.getDataFromLocalStorage("user") || "guest";

  useEffect(() => {
    socket.on("receive_message", (resData) => {
      console.log("received");
      setData((preData: any) => {
        return {
          ...preData,
          [resData.receiverId]: preData[resData.receiverId]
            ? [...preData[resData.receiverId], resData]
            : [resData],
        };
      });
      console.log({ resData });
      console.log(data);
    });
  }, [socket]);

  let [ids, setIds]: any = useState({});
  useEffect(() => {
    fetch(URLS.SERVER_URL)
      .then((res) => res.json())
      .then((data) => {
        //console.log(Object.values(data))
        delete data[socket.id];
        setIds(data);
      });
  }, []);

  useEffect(() => {
    socket.emit("send_message", {
      user,
      receiverId: "global",
      message: `${user} - joined`,
      time: new Date().toLocaleTimeString(),
      id: socket.id,
    });
  }, []);

  /*
=======
    },
  ]);
let [documentHeight,setDocumentHeight]
  =useState(document.body.clientHeight)

  let [user, setUser] = useState("guest");
  let [inputValue, setInputValue] = useState("");
  let [userNameChangeCont, setUserNameChangeCont] = useState(0);
>>>>>>> 9b3d7867d8b14f75bca6dde5e41c89bc903e5566
  useEffect(() => {
    socket.on("receive_message", (resData: any) => {
      setData([...data, resData]);

      console.log(resData);
      console.log(data);
    });
 setDocumentHeight(documentHeight+100)
    window.scrollTo({
      top:  documentHeight  ,
      behavior: "smooth",
    });
  }, [socket, data.length]);

useEffect(()=>{
 window.scrollTo({
 top :documentHeight,
 behavior : 'smooth'})
  },[inputValue])


  //console.log(data)

  //console.log(socket)
  let sendMessage = (e: any) => {
    socket.emit("send_message", {
      message: inputValue,
      user,
      time: new Date().toLocaleTimeString(),
    });
    setData([
      ...data,
      {
        message: inputValue,
        fromClient: true,
        time: new Date().toLocaleTimeString(),
        user,
      },
    ]);
    setInputValue("");
  };

  let storeUser = () => {
    if (userNameChangeCont < 3) {
      setUserNameChangeCont(userNameChangeCont + 1);
      console.log(userNameChangeCont);

      let promptValue = prompt("Your name ?");
      setUser(promptValue ? promptValue : "");
    } else {
      alert(" Name can be change 3 times only");
    }
  };

  */
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              socket={socket}
              data={data}
              setData={setData}
              ids={ids}
              setIds={setIds}
            />
          }
        />

        <Route
          path=":receiverId"
          element={
            <ChatPage
              socket={socket}
              data={data}
              setData={setData}
              ids={ids}
              setIds={setIds}
            />
          }
        />
      </Routes>

      <></>
    </BrowserRouter>
  );
}
export default App;
