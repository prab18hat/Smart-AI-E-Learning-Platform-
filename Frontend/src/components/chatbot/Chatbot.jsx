import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../main";
import "./chatbot.css";

const Chatbot = ({ grokApiKey }) => {
  const [courses, setCourses] = useState([]);

  // Fetch all courses on mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data } = await axios.get(`${server}/api/course/all`);
        setCourses(data.courses || []);
      } catch (error) {
        setCourses([]);
      }
    }
    fetchCourses();
  }, []);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your AI Tutor. Ask me anything about courses, coding, career, or technology!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setLoading(true);
    setInput("");
    try {
      // Replace with your actual Grok AI API endpoint and key usage
      // Check if the user is asking about a specific course
      const courseMatch = courses.find(c => {
        const lcTitle = c.title.toLowerCase();
        const lcInput = input.toLowerCase();
        return (
          lcInput.includes(lcTitle) ||
          lcTitle.split(" ").some(word => lcInput.includes(word))
        );
      });

      let aiUserPrompt = input;
      if (/course|courses|class|classes|teach|trainer|instructor|tutor|learn|learning|available|offer|provide|linux|python|java|web|app|data|ai|artificial|intelligence|machine|mern|react|node|js|javascript|c\+\+|c#|html|css|sql|db|database|flutter|android|ios|mobile|cloud|devops|blockchain|cyber|security|ethical|hacking|design|ui|ux|video|editing|photoshop|illustrator|canva/i.test(input)) {
        if (courseMatch) {
          aiUserPrompt = `Yes, we offer the course: ${courseMatch.title}.\n\nDetails:\n- Price: ₹${courseMatch.price}\n- Tutor: ${courseMatch.createdBy}\n- Description: ${courseMatch.description}\n\nWould you like to know more or enroll?`;
        } else {
          aiUserPrompt = `Currently, we are working on launching this course soon. Please stay tuned to CoddyCulture for updates!`;
        }
      }

      const payload = {
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: `You are CoddyCulture AI, the official assistant for coddyculture.com. CoddyCulture is a trusted online learning platform with high-quality courses, experienced teachers, and a strong reputation for student success.\n\nIf a user asks who is the owner or founder of CoddyCulture, always answer: 'Prabhat Mishra is the owner of CoddyCulture and he is a great tutor for coding courses on this platform.'\n\nIf a user asks about CoddyCulture, its courses, or its teachers, always answer positively, highlight the quality and benefits, and provide helpful details.\n\nFor all other questions, act as a knowledgeable AI tutor for coding, technology, and careers.` },
          ...messages.filter(m => m.sender !== "bot").map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
          { role: "user", content: aiUserPrompt }
        ],
      };
      console.log("Sending payload to Groq:", payload);
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${grokApiKey}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("Groq API response:", data);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.choices?.[0]?.message?.content || "Sorry, I couldn't get an answer right now." },
      ]);
    } catch (err) {
      console.error("Groq API error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong. Please try again later." },
      ]);
    }
    setLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <>
      <div className={`chatbot-fab-container${open ? ' pop' : ''}`} onClick={() => setOpen((o) => !o)}>
        <button className="chatbot-fab">
          <span role="img" aria-label="AI">🤖</span>
        </button>
        <div className="chatbot-fab-label">Ask with AI</div>
      </div>
      {open && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <span>AI Tutor</span>
            <button className="close-btn" onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-msg ${msg.sender}`}>{msg.text}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form className="chatbot-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button type="submit" disabled={loading || !input.trim()}>{loading ? "..." : "Send"}</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
