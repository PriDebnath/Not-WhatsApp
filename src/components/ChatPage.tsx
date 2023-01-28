import React, { useState, useEffect, useMemo, useRef } from "react";

import { useParams } from "react-router-dom";
import authHelpers from "../authHelpers";
import Nav from "./Nav";
//icons
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DoneAllTwoToneIcon from "@mui/icons-material/DoneAllTwoTone";



const ChatPage = (props: any) => {

  const { socket, data, setData, ids, setIds }: any = props;

  const user = authHelpers.getDataFromLocalStorage("user") || "guest";

  const { receiverId }: any = useParams();

  const [inputValue, setInputValue] = useState("");
  const [blob,setBlob]=useState(null)
  const inputRef:any = useRef(null);
  const [inputType,setInputType] = useState("text")

  useEffect(() => {
    socket.on("receive_message", (resData: any) => {
      window.scrollTo({
        top: document.body.clientHeight * 1000,
        behavior: "smooth",
      });
    });
  }, [socket]);

  
  let sendMessage = (blob?: any) => {
    let sendData = {
      message: inputValue,
      ...(blob && {blob : blob}), 
      user,
      time: new Date().toLocaleTimeString(),
      id: socket.id,
      receiverId,
    };

    socket.emit("send_message", sendData);
    setData((preData: any) => {
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
    setInputValue("")
    window.scrollTo({
      top: document.body.clientHeight * 1000,
      behavior: "smooth",
    });
  };

  const handleInputChange = (elm:any)=>{
    if(elm.type=="text"){
      setInputValue(elm.value)

    }else{
      setBlob( inputRef.current.files[0])
      sendMessage(inputRef.current.files[0])
      setInputType("text")
      inputRef.current.type="text"

    }

  }

 const handleAttachFileClick =(e:any)=>{
  console.log();
  inputRef.current.type="file"
  inputRef.current.click()

  
 }

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
          let newBlob  = d.blob && new Blob([d.blob])
          console.log({newBlob});
          
          const imgUrl = newBlob &&  window.URL.createObjectURL(newBlob)
          console.log({imgUrl});
          
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
   { imgUrl && <img src={imgUrl} alt="image" /> }
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
        
         
          <div className="send_message_input_con">
  <input
            className="send_message_input"
            value={inputValue}
            ref={inputRef}
            onChange={(e)=>{
              handleInputChange(e.target)
            }}
            type={inputType}
            placeholder="type somthing . . ."
            autoFocus
          />
   <AttachFileIcon  className="attachFileIcon_con_icon" 
            onClick={handleAttachFileClick}
            />
          </div>
          <button
            className="send_message_button"
            type="submit"
            onClick={(e) => sendMessage()}
          >
            <SendIcon />
          </button> 
         
        </div>
      </form>
    </div>
  );
};

export default ChatPage;
