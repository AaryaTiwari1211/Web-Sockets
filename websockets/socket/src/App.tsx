import { useEffect, useState } from "react";
import WebWorker from "./WebWorker";
import worker from "./app.worker";
function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [msg, setMsg] = useState<string>("");
  const [allMsg, setAllMsg] = useState<string[]>([]);

  const webWorker = new WebWorker(worker);

  const startConnection = () => {
    const ws = new WebSocket(`ws://localhost:1234`);
    setWs(ws);
    ws.onopen = () => {
      console.log("Connection Established!!");
    };
    ws.onmessage = (event) => {
      console.log(`Client received data as: ${event.data}`);
    };
  };

  const endConnection = () => {
    if (ws) {
      ws.close();
    }
  };

  const handleSend = () => {
    const dataToSend = {
      message: msg,
      time: Date(),
    };

    const jsonMsg = JSON.stringify(dataToSend);

    if (ws && ws.readyState === WebSocket.OPEN && msg.length != 0) {
      ws.send(jsonMsg);
      setMsg("");
      setAllMsg((prevAllMsg) => [...prevAllMsg, msg]);
    } else if (msg.length == 0) {
      console.error("Msg length cant be zero!");
    } else {
      console.error("WebSocket connection is not open.");
    }
  };

  useEffect(() => {
    console.log(bg);
    console.log(bgs[bg]);
  });

  const bgs = ["red", "blue", "green"];
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(10000);
  const [bg, setBg] = useState<number>(0);

  const add = () => {
    webWorker.postMessage({ start, end, type: "add" });
    console.log(`Working on addition from ${start} to ${end}`);

    webWorker.addEventListener("message", (e) => {
      const reply = e.data;
      console.log(`Answer for the addition is: ${reply}`);
    });
  };
  const subtract = () => {
    webWorker.postMessage({ start, end, type: "subtract" });
    console.log(`Working on subtraction from ${end} to ${start}`);

    webWorker.addEventListener("message", (e) => {
      const reply = e.data;
      console.log(`Answer for the subtraction is: ${reply}`);
    });
  };
  const changeBg = () => {
    setBg((bg + 1) % bgs.length);
  };

  return (
    <>
      <div className="flex justify-between m-10">
        <div className="flex flex-col gap-2">
          <button
            className="p-2 border border-black bg-blue-700 text-white"
            onClick={startConnection}
          >
            Start Connection
          </button>
          <button
            className="p-2 border border-black bg-blue-700 text-white"
            onClick={endConnection}
          >
            End Connection
          </button>
        </div>
        <div className="flex flex-col gap-10 max-w-[300px] my-10 justify-center">
          <input
            value={msg}
            className="border border-2 px-2 py-1"
            onChange={(e) => setMsg(e.target.value)}
          />
          <button
            onClick={handleSend}
            className="border border-2 border-black p-2 bg-blue-700 text-white"
          >
            Click to Send Message
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-lg">All Messages</p>
          <ol className="flex flex-col">
            {allMsg.map((m) => (
              <li className="text-md">{m}</li>
            ))}
          </ol>
        </div>
      </div>
      <hr />
      <div className={`${bgs[bg]}-200 w-full p-10`}>
        <p className="w-full text-center text-2xl font-bold">Demonstration of Web Workers</p>
        <div className="flex flex-col justify-center items-center gap-10 max-w-64">
          <button
            onClick={add}
            className="border border-2 border-black p-2 bg-blue-700 text-white"
          >
            Calculate Addition
          </button>
          <button
            onClick={subtract}
            className="border border-2 border-black p-2 bg-blue-700 text-white"
          >
            Calculate Subtraction
          </button>
          <button
            onClick={changeBg}
            className="border border-2 border-black p-2 bg-blue-700 text-white"
          >
            Change Background
          </button>

          <div className="flex gap-2 items-center">
            <p>Start:</p>
            <input
              type="number"
              value={start}
              className="border border-2 px-2 py-1"
              onChange={(e) => setStart(parseInt(e.target.value, 10))}
            />
          </div>
          <div className="flex gap-2 items-center">
            <p>End: </p>
            <input
              type="number"
              value={end}
              className="border border-2 px-2 py-1"
              onChange={(e) => setEnd(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
