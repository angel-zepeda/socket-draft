import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");
  const [data, setData] = useState([
    {
      pressure: 0,
      temp: 0,
      time: 0,
      wave: 0,
      weight: 0,
    },
  ]);

  // @ts-ignore
  useEffect(() => {
    const newSocket = io(`http://10.10.0.119:5000`);
    // @ts-ignore
    setSocket(newSocket);
    console.log(newSocket);

    return () => newSocket.close();
  }, [setSocket]);

  const sendEvent = () => {
    if (socket) {
      // @ts-ignore
      socket.emit("send-get", name, function (dataFromServer) {
        console.log(dataFromServer);
      });
    }
  };

  // useEffect(() => {
  //   const getLive = () => {
  //     if (socket) {
  //       // @ts-ignore
  //       socket.emit("live", "", (data) => {
  //         console.log(data);
  //       });

  //       // @ts-ignore
  //       socket.on("stats", (data) => {
  //         console.log(data);
  //         setData(data);
  //       });
  //     }
  //   };

  //   getLive();
  // }, [socket]);

  const generateData = () => {
    if (socket) {
      // @ts-ignore
      socket.emit("live", "", (data) => {
        console.log(data);
      });

      // @ts-ignore
      socket.on("stats", (newData) => {
        setData((prev) => [...prev, newData]);
      });
    }
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <button style={{ padding: "1rem" }} onClick={sendEvent}>
        Enviar evento
      </button>

      <button onClick={generateData}>Generate Data</button>
      <div>
        {data &&
          data.map((item) => (
            <>
              {" "}
              <p>{`${JSON.stringify(item)}`},</p>{" "}
            </>
          ))}
      </div>
    </div>
  );
}

export default App;
