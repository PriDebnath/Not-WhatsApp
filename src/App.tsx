import { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import DoneAllTwoToneIcon from "@mui/icons-material/DoneAllTwoTone";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3001");


function App() {
  let [data, setData] = useState([
    {
      message: "Hello",
      user: "Pri",
      fromClient: false,
      time: new Date().toLocaleTimeString(),
    },
  ]);
  let [user, setUser] = useState("guest");
  let [inputValue, setInputValue] = useState("");
  let [userNameChangeCont, setUserNameChangeCont] = useState(0);
  useEffect(() => {
    socket.on("receive_message", (resData: any) => {
      setData([...data, resData]);

      console.log(resData);
      console.log(data);
    });
    window.scrollTo({
      top: document.body.clientHeight * 1000,
      behavior: "smooth",
    });
  }, [socket, data.length]);
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
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <nav>{user} in global chat not whatsapp</nav>
      <div className="user" onClick={() => storeUser()}>
        <p>👤</p>
        <p>{user.slice(0)}</p>
      </div>

      {data.map((d, i) => {
        return (
          <div
            className="message_con"
            style={{
              justifyContent: d.fromClient ? "flex-end" : "flex-start",
            }}
            key={i}
          >
            <p
              className="message"
              key={i}
              style={{
                background: d.fromClient ? "#075E54" : "",
                textAlign: d.fromClient ? "right" : "left",
              }}
            >
              {d.message}

              <small>
                {d.user.slice(0, 8) + " - " + d.time.slice(0, 4)}{" "}
                {d.fromClient && (
                  <DoneAllTwoToneIcon
                    sx={{
                      fontSize: "0.6rem",
                    }}
                    className="DoneAllTwoToneIcon"
                  />
                )}
              </small>
            </p>
          </div>
        );
      })}
      <div className="send_message_con">
        <input
          className="send_message_input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          placeholder="type somthing . . ."
        />
        <button
          className="send_message_button"
          type="submit"
          onClick={(e) => sendMessage(e)}
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
}
export default App;
