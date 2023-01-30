import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import authHelpers from "../authHelpers";
import Nav from "./Nav";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
//icons
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DoneAllTwoToneIcon from "@mui/icons-material/DoneAllTwoTone";
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

const ChatPage = (props: any) => {

  const { socket, data, setData, ids, setIds }: any = props;
  const user = authHelpers.getDataFromLocalStorage("user") || "guest";
  const { receiverId }: any = useParams();
  const [inputValue, setInputValue] = useState("");
  const inputRef: any = useRef(null);


  useEffect(() => {
    socket.on("receive_message", (resData: any) => {
      const lastElement = document.getElementById("lastElement") // scrolling to this element to see the last elememt
      lastElement?.scrollIntoView()
    });

  }, [socket]);
  let sendMessage = (blob?: any) => {

    console.log({ blob })
    let sendData = {
      message: inputValue,
      ...(blob && { blob: blob, blobType: blob.type.split('/')[0] }),
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
    const lastElement = document.getElementById("lastElement") // scrolling to this element to see the last elememt
    lastElement?.scrollIntoView(false)
  };

  const handleInputChange = (elm: any) => {
      const blobFile = inputRef.current.files[0]
      sendMessage(blobFile)
    }

  

  const handleAttachFileClick = (e: any) => {
    inputRef.current.click()
  }


  // opening media on fullscreen

  const [dialogContent, setDialogContent]: any = useState(<h1 style={{ textAlign: "center" }}>Couldn't find Content</h1>)
  const [openFullImage, setOpenFullImage] = useState(false)

  const handleCloseFullImage = () => {
    setOpenFullImage(!openFullImage)
  }

  console.log({ dialogContent });

  // download file feature

  const handleFileDownload = (url: any, fileType: string) => {
    let a = document.createElement("a")
    a.href = url
    a.setAttribute("download", `not_whatsapp_by_pri.${fileType}`)
    a.click()
    a.style.display = "none"
  }
  const downloadIconStyle = {
    color: "white",
    position: "absolute",
    top: "0%",
    fontSize : "30px" ,
    right: "0%",
    cursor: "pointer",
    borderRadius: "0.2rem",
    background: "inherit",
    "& :hover": {
      color: "#25d366",
    }
  }

  return (
    <>
      <div className="chatPage">
        <Nav
          receiver={ids[receiverId]?.user}
          ids={ids}
          setIds={setIds}
          data={data}
          socket={socket}
        />

        <div

          className="chatCon"
        >
          {data[receiverId]?.map((d: any, i: number) => {

            let newBlob = d.blob && new Blob([d.blob])

            const url = newBlob && window.URL.createObjectURL(newBlob)

            return (
              <div
                className="message_con"
                style={{
                  justifyContent: d.fromClient ? "flex-end" : "flex-start",
                }}
                key={i}
              >

                <div
                  className="message"
                  key={i}
                  style={{
                    background: d.fromClient ? "#075E54" : "",
                    textAlign: d.fromClient ? "right" : "left",
                  }}
                >
                  {d.message}
                  {
                    url && d.blobType == 'image' && (
                      <>
                        <img src={url} alt="image"
                          onClick={(e) => {
                            console.log(d.blobType)
                            //  setDialogContent(e.currentTarget)
                            setDialogContent(<><img src={url} alt="image" /></>)
                            setOpenFullImage(!openFullImage)
                          }
                          }
                        />
                        <DownloadRoundedIcon
                          sx={downloadIconStyle}
                          onClick={() => handleFileDownload(url, "png")}
                        />

                      </>
                    )

                  }
                  {
                    url && d.blobType == 'video' && (
                      <>
                        <video src={url} controls
                          onClick={(e) => {
                            console.log(d.blobType)

                            //  setDialogContent(e.currentTarget)
                            setDialogContent(<video src={url} controls></video>)
                            setOpenFullImage(!openFullImage)
                          }}></video>
                        <DownloadRoundedIcon
                          sx={downloadIconStyle}
                          onClick={() => handleFileDownload(url, "mp4")}
                        />

                      </>
                    )
                  }
                  <small>
                    {`${d.user}  -  ${d?.id?.slice(0, 2) || ""
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
                </div>
              </div>
            );
          })}

        </div>
        <span id="lastElement" ></span>

        <form className="send_message_con"

          onSubmit={(e) => {
            e.preventDefault();
          }}>


          <div className="send_message_input_con">
            <input
              className="send_message_input"
              value={inputValue}
              // ref={inputRef}
              onChange={(e) => {
                setInputValue(e.target.value)
              }}
              type="text"
              placeholder="type somthing . . ."
              autoFocus
            />
            <AttachFileIcon className="attachFileIcon_con_icon"
              onClick={handleAttachFileClick}
            />
            <input type="file"
              style={{ display: "none" }}
              ref={inputRef}
              onChange={(e) => {
                handleInputChange(e.target)
              }} />
          </div>
          <button
            className="send_message_button"
            type="submit"
            onClick={(e) => sendMessage()}
          >
            <SendIcon />
          </button>

        </form>
      </div>

      <Dialog
        fullScreen
        open={openFullImage}
        onClose={handleCloseFullImage}
        onClick={handleCloseFullImage}
        sx={{

          "& .MuiPaper-root": {
            background: "rgba(0,0,0,0.01)",
            backdropFilter: "blur(4px)",
            color: "white",
            position: "relative",

          }
        }}
      >
        <div
          style={{
            width: "100vw",
            position: "absolute",
            top: "50%",
            transform: "translate(0,-50%)",
          }}>
          {dialogContent}

        </div>

      </Dialog>

    </>
  );
};

export default ChatPage;
