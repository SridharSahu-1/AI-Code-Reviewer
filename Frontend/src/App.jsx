import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css"; // Theme for the editor
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Theme for the markdown code blocks
import axios from "axios";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false); // Default to false
  const [code, setCode] = useState(`function greet(name) {\n  console.log("Hello, " + name);\n}`);
  const [review, setReview] = useState("## Your AI-powered code review will appear here.");

  // This useEffect is only needed if you have other prism components
  // that need highlighting on initial load. For the editor, it's not strictly necessary.
  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    setReview("## Analyzing your code... Please wait.");
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      setReview(response.data);
    } catch (error) {
      console.error("Error fetching code review:", error);
      setReview("## An error occurred\n\nSorry, we couldn't fetch the code review. Please check the console for more details and ensure the server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Code Reviewer</h1>
        <p>Paste your code below and get an instant review from our AI assistant.</p>
      </header>

      <main className="main-content">
        <section className="editor-section">
          <h2 className="section-title">Your Code</h2>
          <div className="editor-wrapper">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={16}
              className="code-editor"
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 16,
                lineHeight: 1.5,
              }}
            />
          </div>
          <button onClick={reviewCode} className="review-button" disabled={loading}>
            {loading ? "Analyzing..." : "Review My Code"}
          </button>
        </section>

        <section className="review-section">
          <h2 className="section-title">AI Review</h2>
          <div className="review-output">
            {loading && !review.startsWith("## Analyzing") ? (
              <div className="spinner-wrapper">
                <div className="spinner"></div>
              </div>
            ) : (
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;