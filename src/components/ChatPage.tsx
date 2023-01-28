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
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const ChatPage = (props: any) => {

  const { socket, data, setData, ids, setIds }: any = props;

  const user = authHelpers.getDataFromLocalStorage("user") || "guest";

  const { receiverId }: any = useParams();

  const [inputValue, setInputValue] = useState("");
  const [blob, setBlob] = useState(null)
  const inputRef: any = useRef(null);
  const [inputType, setInputType] = useState("text")

  useEffect(() => {
    socket.on("receive_message", (resData: any) => {
      window.scrollTo({
        top: document.body.clientHeight * 1000,
        behavior: "smooth",
      });
    });
  }, [socket]);


  let sendMessage = (blob?: any) => {
   console.log({blob})
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
    window.scrollTo({
      top: document.body.clientHeight * 1000,
      behavior: "smooth",
    });
  };

  const handleInputChange = (elm: any) => {
    if (elm.type == "text") {
      setInputValue(elm.value)

    } else {
      const blobFile = inputRef.current.files[0]

      setBlob(blobFile)
      sendMessage(blobFile)
      // setInputType("text")

    }
    inputRef.current.type = "text"

  }

  const handleAttachFileClick = (e: any) => {
    inputRef.current.type = "file"
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {data[receiverId]?.map((d: any, i: number) => {
            // console.log('m',d.blob);

            let newBlob = d.blob && new Blob([d.blob])
            // console.log({newBlob});

            const url = newBlob && window.URL.createObjectURL(newBlob)
            // console.log({url});

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
                  {
                    url && d.blobType == 'image' && (
                      <>
                        <img src={url} alt="image"
                          onClick={(e) => {

                             setDialogContent(e.currentTarget)
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
                            setDialogContent(e.currentTarget)
                            setDialogContent(<video src={url} controls></video>)
                            setOpenFullImage(!openFullImage)
                          }}></video>
                        <DownloadRoundedIcon
                          sx={downloadIconStyle }
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
                onChange={(e) => {
                  handleInputChange(e.target)
                }}
                type="text"
                placeholder="type somthing . . ."
                autoFocus
              />
              <AttachFileIcon className="attachFileIcon_con_icon"
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
      <Dialog
        fullScreen
        open={openFullImage}
        // open={true}
        onClose={handleCloseFullImage}
        // TransitionComponent={Transition}
        sx={{
          background: "#273443",
          "& .MuiPaper-root": {
            background: "#273443",
            color: "white",

          }
        }}
      >

        <Toolbar sx={{ position: "fixed", zIndex: 10 }}>
          <IconButton
            edge="end"
            onClick={handleCloseFullImage}
            aria-label="close"
          >
            <CloseRoundedIcon
              sx={{ color: "white", position: "fixed", right: "1rem", top: "1rem", }}
            />
          </IconButton>



        </Toolbar>

        {dialogContent}

      </Dialog>

    </>
  );
};

export default ChatPage;
