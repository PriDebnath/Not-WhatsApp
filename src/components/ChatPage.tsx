import React, { useState, useEffect, useMemo } from "react";

import { useParams } from "react-router-dom";
import authHelpers from "../authHelpers";
import Nav from "./Nav";
//icons
import SendIcon from "@mui/icons-material/Send";
import DoneAllTwoToneIcon from "@mui/icons-material/DoneAllTwoTone";

let ChatPage = (props: any) => {
  const { socket, data, setData, ids, setIds }: any = props;

  let user = authHelpers.getDataFromLocalStorage("user") || "guest";

  let { receiverId }: any = useParams();
  console.log({ receiverId });

  let [inputValue, setInputValue] = useState("");

  let [documentHeight, setDocumentHeight] = useState(
    document.body.clientHeight + 100
  );

  useEffect(() => {
    socket.on("receive_message", (resData: any) => {
      setDocumentHeight((preHeight) => preHeight + 100);
      console.log("received in chat");
      // window.scrollTo({ top: documentHeight, behavior: "smooth" });
      window.scrollTo({
        top: document.body.clientHeight * 1000,
        behavior: "smooth",
      });
      console.log({ data });
    });
  }, [socket]);

  //console.log(socket)
  let sendMessage = (e: any) => {
    let sendData = {
      message: inputValue,
      user,
      time: new Date().toLocaleTimeString(),
      id: socket.id,
      receiverId,
    };

    socket.emit("send_message", sendData);
    console.log({ sendData });
    setData((preData: any) => {
      console.log({ preData });
      return {
        ...preData,
        [receiverId]: preData[receiverId]
          ? [
              ...preData[receiverId],
              {
                ...sendData,
                fromClient: true,
              },
            ]
          : [{ ...sendData, fromClient: true }],
      };
    });
    /*
   jsonData.addData({
     ...sendData ,
    fromClient : true,
   })
   
    setInputValue("")
   console.log(jsonData)
   */
    console.log("sent");
    // setDocumentHeight((preHeight) => preHeight + 200);
    // window.scrollTo({ top: documentHeight, behavior: "smooth" });
    window.scrollTo({
      top: document.body.clientHeight * 1000,
      behavior: "smooth",
    });
  };

  return (
    <div className="chatPage">
      <Nav
        receiver={ids[receiverId]?.user}
        ids={ids}
        setIds={setIds}
        data={data}
        socket={socket}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {data[receiverId]?.map((d: any, i: number) => {
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
                  {`${d.user}  -  ${
                    d?.id?.slice(0, 2) || ""
                  }  -  ${d?.time?.slice(0, 5)}`}{" "}
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
            autoFocus
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
    </div>
  );
};

export default ChatPage;
