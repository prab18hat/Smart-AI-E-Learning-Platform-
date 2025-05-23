import React, { useState } from "react";
import "./personalizedPath.css";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";

// Helper to format plain text or markdown to styled HTML
function formatRecommendation(text) {
  // Simple markdown-like bullet points and section headers
  let html = text
    .replace(/\n\n/g, '<br/>')
    .replace(/^\s*- (.*)$/gm, '<li>$1</li>')
    .replace(/^(\d+\.) (.*)$/gm, '<li>$1 $2</li>')
    .replace(/\n(?=<li>)/g, '')
    .replace(/<li>/, '<ul><li>')
    .replace(/(<\/li>)(?![\s\S]*<li>)/, '$1</ul>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br/>');
  // Section headers (lines ending with colon)
  html = html.replace(/(^|<br\/>)([A-Za-z0-9 ,'-]+:)/g, '$1<h4>$2</h4>');
  return html;
}

const PersonalizedPath = ({ grokApiKey }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const { mycourse } = CourseData();
  const { user } = UserData();

  const handleRecommend = async () => {
    setLoading(true);
    setRecommendation("");
    // Prepare user progress summary for AI
    const progressSummary = mycourse && mycourse.length > 0
      ? mycourse.map(c => `- ${c.title} (Tutor: ${c.createdBy}, Progress: ${c.progress || "N/A"}%)`).join("\n")
      : "No courses enrolled yet.";
    const prompt = `You are an expert learning advisor for CoddyCulture.\n\nHere is the user's current progress and enrolled courses:\n${progressSummary}\n\nBased on this, recommend a personalized learning path with next best courses, resources, or study plans. Be specific and motivating. If the user is new, suggest a beginner roadmap.`;
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${grokApiKey}`,
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: "You are an expert AI advisor for personalized learning on CoddyCulture." },
            { role: "user", content: prompt }
          ],
        }),
      });
      const data = await response.json();
      setRecommendation(data.choices?.[0]?.message?.content || "Sorry, could not generate a plan right now.");
    } catch (err) {
      setRecommendation("Sorry, something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <>
      <div className={`personalized-path-fab${open ? " pop" : ""}`} onClick={() => setOpen(o => !o)}>
        <button className="personalized-path-btn" title="Get My Learning Path">
          <span role="img" aria-label="Learning Path">📈</span>
        </button>
        <div className="personalized-path-label">My Learning Path</div>
      </div>
      {open && (
        <div className="personalized-path-popup">
          <div className="personalized-path-header">
            <h3>Personalized Learning Path</h3>
            <button className="personalized-path-close" onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className="personalized-path-body">
            <button className="personalized-path-generate" onClick={handleRecommend} disabled={loading}>
              {loading ? "Analyzing..." : "Show My Path"}
            </button>
            {recommendation && (
              <div className="personalized-path-result" dangerouslySetInnerHTML={{ __html: formatRecommendation(recommendation) }} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalizedPath;
