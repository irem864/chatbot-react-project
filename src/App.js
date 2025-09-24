import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "You", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:270m",
          prompt: input,
          stream: false,
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, { sender: "Bot", text: data.response }]);
    } catch (error) {
      setMessages([...newMessages, { sender: "Bot", text: "Error!" }]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>React Chatbot (Ollama)</h1>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div key={i}><b>{msg.sender}:</b> {msg.text}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "80%", marginRight: "10px" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;

