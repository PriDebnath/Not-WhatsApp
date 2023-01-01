import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//components
import ChatPage from "./components/ChatPage";
import Home from "./components/Home";
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
  const [statusText, setStatusText] = useState(
    "Available member will list here"
  );

  let user = authHelpers.getDataFromLocalStorage("user") || "guest";

  useEffect(() => {
    socket.on("receive_message", (resData) => {
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
  useEffect(() => {
    fetch(URLS.SERVER_URL)
      .then((res) => res.json())
      .then((data) => {
        delete data[socket.id];
        setIds(data);
      })
      .catch((error) => {
        setStatusText("Server is off ask  Pri to turn in on");
        console.log(error);
      });
  }, []);

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

      <></>
    </BrowserRouter>
  );
}
export default App;
