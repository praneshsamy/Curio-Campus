import React, { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Row, Card } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./CreateRoom.css";

const socket = io.connect("http://localhost:5000");

function CustomRoom() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [showIdCard, setShowIdCard] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [idCopied, setIdCopied] = useState(false);
  const [missedCall, setMissedCall] = useState(false);
  const [didNotConnect, setDidNotConnect] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const callTimeoutRef = useRef(null);
  const cardRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
      callTimeoutRef.current = setTimeout(() => {
        setReceivingCall(false);
        setMissedCall(true);
        socket.emit("missedCall", { to: data.from, didNotConnect: true });
      }, 20000);
    });

    socket.on("missedCall", (data) => {
      if (data.to === me && data.didNotConnect) {
        setDidNotConnect(true);
      }
    });

    socket.on("didNotConnect", () => {
      setDidNotConnect(true);
    });

    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setShowIdCard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      socket.off("callUser");
      socket.off("missedCall");
      socket.off("didNotConnect");
      clearTimeout(callTimeoutRef.current);
    };
  }, []);

  const handleCopy = () => {
    setIdCopied(true);
    setTimeout(() => {
      setIdCopied(false);
    }, 2000);
  };

  const callUser = (id) => {
    setConnecting(true);
    socket.off("callAccepted");

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    const callTimeout = setTimeout(() => {
      socket.emit("callNotAnswered", { to: id });
      setConnecting(false);
    }, 20000);

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      setConnecting(false);
      clearTimeout(callTimeout);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    clearTimeout(callTimeoutRef.current);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    try {
      socket.emit("endCall", { to: caller });
      setCallEnded(true);
      setCallAccepted(false);
      setReceivingCall(false);
      setCaller("");
      setCallerSignal(null);
    } catch (error) {
      console.error('Error leaving the call:', error);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getTracks().find((track) => track.kind === "video");
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getTracks().find((track) => track.kind === "audio");
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const joinChat = () => {
    setShowIdCard(true);
  };

  const closeCard = () => {
    setShowIdCard(false);
    setName("");
  };

  return (
    <div>
      <div className="background-width">
        <div className="top-container">
          <h2 className="video-chat-logo">
            <span style={{ color: "#9abde2" }}>C</span>urio{" "}
            <span style={{ color: "#9abde2" }}>C</span>ampus
          </h2>

          {connecting && (
            <div className="connecting-notification">
              <h2>Connecting...</h2>
            </div>
          )}

{missedCall && (
          <div className="missed-call-notification">
            <h3>Missed Video Chat</h3>
            <p>Oops! you missed a vidoe chat from {name}.</p>
          </div>
        )}

          <div className="top-right">
            <button className="join-video-chat" onClick={joinChat}>
              Join Video
            </button>
          </div>
          <Card ref={cardRef} className={`copy-chat-id ${showIdCard ? "show-card" : ""}`}>
            <Card.Body>
              <Card.Title>Your ID</Card.Title>
              <Card.Text>{me}</Card.Text>
              <CopyToClipboard text={me} onCopy={handleCopy}>
                <button className="copy-id-btn">
                  <i className="bi bi-clipboard"></i>{" "}
                  {idCopied ? "ID Copied!" : "Copy ID"}
                </button>
              </CopyToClipboard>

              <Form.Group className="">
                <InputGroup >
                  <Form.Control

                    type="text"
                    placeholder="Your Name"
                    style={{backgroundColor:"transparent",border:"none",marginLeft:"-10px",padding:"10px"}}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="ID to call"
                    value={idToCall}
                    style={{backgroundColor:"transparent",border:"none",marginLeft:"-10px",padding:"10px"}}
                    onChange={(e) => setIdToCall(e.target.value)}
                  />
                  <Button
                    className="call-btn22"
                    variant="outline-secondary"
                    onClick={() => callUser(idToCall)}
                  >
                    <i className="bi bi-telephone"></i> Call
                  </Button>
                </InputGroup>
              </Form.Group>
              {/* <button onClick={closeCard} className="input-card-close">
                Close
              </button> */}
            </Card.Body>
          </Card>
        </div>

        <Row style={{ marginTop: "5vh" }}>
          <div>
            {receivingCall && !callAccepted ? (
              <div className="caller">
                <h1 className="caller-name">{name} is calling...</h1>
                <Button className="answer-button" onClick={answerCall}>
                  Answer
                </Button>
              </div>
            ) : null}
          </div>

          <div className="container">
            <div className="video-container">
              <div className="local-video">
                {stream && (
                  <video
                    playsInline
                    muted
                    ref={myVideo}
                    className="my-video-feed"
                    autoPlay
                  />
                )}
              </div>
              <div className="remote-video-wrapper">
                {callAccepted && !callEnded ? (
                  <video
                    playsInline
                    ref={userVideo}
                    className="user-video-feed"
                    autoPlay
                  />
                ) : null}
              </div>
            </div>

            <div className="controls">
              <div className="call-button">
                {callAccepted && !callEnded ? (
                  <button className="end-call" onClick={leaveCall}>
                    <i className="bi bi-telephone"></i>
                  </button>
                ) : null}
              </div>

              <button onClick={toggleVideo} className="video-control">
                {videoEnabled ? (
                  <i className="bi bi-camera-video"></i>
                ) : (
                  <i className="bi bi-camera-video-off"></i>
                )}
              </button>
              <button
                onClick={toggleAudio}
                className="audio-control"
                style={{ marginLeft: "10px" }}
              >
                {audioEnabled ? <i className="bi bi-mic"></i> : <i className="bi bi-mic-mute"></i>}
              </button>
            </div>
          </div>
        </Row>


        {didNotConnect && (
          <div className="did-not-connect-notification">
            <h2>Call Not Connected</h2>
            <p>The call was not answered.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomRoom;