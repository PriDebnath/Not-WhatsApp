import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import io from "socket.io-client";

//components
import ChatPage from "./components/ChatPage";
import Home from "./components/Home";

//urls
import URLS from "./urls";
import authHelpers from "./authHelpers";


const socket = io(URLS.SERVER_URL);

function App() {
  let [data, setData]: any = useState({
    global: [
      {
        message: "Hello",
        blob : null ,
        blobType : "" ,
        id: "global",
        user: "Pri",
        fromClient: false,
        time: new Date().toLocaleTimeString(),
      },
    ],
  });
  const [statusText, setStatusText] = useState(
   ""
  );
  let user = authHelpers.getDataFromLocalStorage("user") || "guest";
  
  // adding new data and re-rendering component whenever it receives any data 

  useEffect(() => {
    socket.on("receive_message", (resData) => {
      console.log({resData});
      
      setData((preData: any) => {
        return {
          ...preData,
          [resData.receiverId]: preData[resData.receiverId]
            ? [...preData[resData.receiverId], resData]
            : [resData],
        };
      });
    });
  }, [socket]);


  let [ids, setIds]: any = useState({});

  // geting all  online users 

  useEffect(() => {
    fetch(URLS.SERVER_URL)
      .then((res) => res.json())
      .then((data) => {
        delete data[socket.id]; // remove the current user
        setIds(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // sending alert as user-joined

  useEffect(() => {
    try {
      socket.emit("send_message", {
        user,
        receiverId: "global",
        message: `${user} - joined`,
        time: new Date().toLocaleTimeString(),
        id: socket.id,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

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
              statusText={statusText}
              setStatusText={setStatusText}
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

    </BrowserRouter>
  );
}
export default App;
