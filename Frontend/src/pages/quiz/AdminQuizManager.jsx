import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../main";
import { FaPlus, FaTrash, FaEdit, FaCalendarAlt } from "react-icons/fa";
import "./adminquizmanager.css";

const initialQuestion = { question: "", options: ["", "", "", ""], answer: "" };

const AdminQuizManager = () => {
  // Floating Add Quiz Button: always visible at top-right inside container
  // (see JSX below for placement)

  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ courseId: "", title: "", questions: [ { ...initialQuestion } ], schedule: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${server}/api/course/all`);
      setCourses(res.data.courses || []);
    } catch {
      setCourses([]);
    }
  };

  const fetchQuizzes = () => {
    setLoading(true);
    axios.get(`${server}/api/quizzes`, { headers: { token: localStorage.getItem("token") } })
      .then(res => setQuizzes(res.data.quizzes))
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  };

  const handleFormChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };
  const handleQuestionChange = (idx, field, value) => {
    setForm(f => {
      const questions = f.questions.map((q, i) => i === idx ? { ...q, [field]: value } : q);
      return { ...f, questions };
    });
  };
  const handleOptionChange = (qIdx, optIdx, value) => {
    setForm(f => {
      const questions = f.questions.map((q, i) => i === qIdx ? { ...q, options: q.options.map((o, oi) => oi === optIdx ? value : o) } : q);
      return { ...f, questions };
    });
  };
  const addQuestion = () => setForm(f => ({ ...f, questions: [...f.questions, { ...initialQuestion }] }));
  const removeQuestion = idx => setForm(f => ({ ...f, questions: f.questions.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      console.log("[DEBUG] handleSubmit called", { editId, form });
      if (!server) {
        setError("Server URL is not set. Please check configuration.");
        console.error("[ERROR] server variable is undefined or empty.");
        setLoading(false);
        return;
      }
      if (editId) {
        // Update existing quiz
        await axios.put(`${server}/api/quizzes/${editId}`, {
          title: form.title,
          questions: form.questions,
          schedule: form.schedule,
        }, { headers: { token: localStorage.getItem("token") } });
        setSuccess("Quiz updated successfully!");
      } else {
        // Create new quiz
        await axios.post(`${server}/api/quizzes/generate`, {
          courseId: form.courseId,
          title: form.title,
          content: form.questions.map(q => q.question).join(" "), // for NLP, can be improved
          questions: form.questions,
          schedule: form.schedule
        }, { headers: { token: localStorage.getItem("token") } });
        setSuccess("Quiz created successfully!");
      }
      setForm({ courseId: "", title: "", questions: [{ ...initialQuestion }], schedule: "" });
      setEditId(null);
      fetchQuizzes();
      setShowForm(false);
    } catch (err) {
      setError(editId ? (err.response?.data?.message || "Failed to update quiz. Please check your input and try again.") : (err.response?.data?.message || "Failed to create quiz. Please check your input and try again."));
      console.error("[ERROR] handleSubmit:", err);
    }
    setLoading(false);
  };


  // Delete quiz logic
  const handleDeleteQuiz = async (id, title) => {
  console.log("[DEBUG] handleDeleteQuiz called for", id, title);
  if (!server) {
    setError("Server URL is not set. Please check configuration.");
    console.error("[ERROR] server variable is undefined or empty.");
    return;
  }

    if (!window.confirm(`Are you sure you want to delete the quiz: ${title}?`)) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.delete(`${server}/api/quizzes/${id}`, { headers: { token: localStorage.getItem("token") } });
      setSuccess(res.data?.message || "Quiz deleted successfully!");
      setQuizzes(qs => qs.filter(q => q._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete quiz. Please try again.");
      console.error("[ERROR] handleDeleteQuiz:", err);
    }
    setLoading(false);
  };


  // Edit quiz logic
  const handleEditQuiz = (quiz) => {
    setForm({
      title: quiz.title,
      questions: quiz.questions.map(q => ({ ...q })),
      schedule: quiz.schedule ? quiz.schedule.slice(0, 16) : ""
    });
    setEditId(quiz._id);
    setShowForm(true);
    setCurrentQ(0);
    setSuccess("");
    setError("");
  };

  return (
    <div className="admin-quiz-manager" style={{ position: 'relative' }}>
      {/* Floating Add Quiz Button */}
      <button
        className="fab-add-quiz"
        style={{ position: 'absolute', bottom: 28, right: 28, zIndex: 100 }}
        onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', questions: [{ ...initialQuestion }], schedule: '' }); setCurrentQ(0); setSuccess(''); setError(''); }}
        aria-label="Add new quiz"
        title="Add new quiz"
      >
        <FaPlus />
      </button>
      <div className="admin-quiz-header">
        <h2><FaCalendarAlt /> Quiz Management</h2>
        <div className="quiz-stats">
          <span title="Total quizzes">Total: <b>{quizzes.length}</b></span>
          <span title="Scheduled quizzes">
            Scheduled: <b>{quizzes.filter(q => q.schedule).length}</b>
          </span>
        </div>
      </div>
      {/* Floating Action Button for Add Quiz */}
      <button
        className="fab-add-quiz"
        onClick={() => {
          setShowForm(true);
          setEditId(null);
          setForm({ title: "", questions: [{ ...initialQuestion }], schedule: "" });
          setCurrentQ(0);
        }}
        aria-label="Add New Quiz"
        tabIndex={0}
        title="Add New Quiz"
        style={{ position: 'fixed', bottom: 36, right: 36, zIndex: 1001 }}
      >
        <FaPlus />
      </button>
      {showForm && (
        <div className="quiz-form-modal" tabIndex={-1} aria-modal="true" role="dialog">
          {/* Close (X) Button */}
          <button
            type="button"
            className="quiz-form-close-btn"
            style={{ position: 'absolute', top: 24, right: 32, background: 'transparent', border: 'none', fontSize: '1.7rem', color: '#888', cursor: 'pointer', zIndex: 1101 }}
            onClick={() => { setShowForm(false); setEditId(null); setForm({ title: '', questions: [{ ...initialQuestion }], schedule: '' }); setCurrentQ(0); setSuccess(''); setError(''); }}
            aria-label="Close quiz form"
            title="Close"
          >
            &times;
          </button>
          <form className="quiz-form" onSubmit={handleSubmit} autoComplete="off">
            <label>
              Course:
              <select
                value={form.courseId}
                onChange={e => handleFormChange("courseId", e.target.value)}
                required
                aria-label="Select Course"
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.title}</option>
                ))}
              </select>
            </label>
            <label>
              Quiz Title:
              <input type="text" value={form.title} onChange={e => handleFormChange("title", e.target.value)} required aria-label="Quiz Title" />
            </label>
            <label>
              Schedule (optional):
              <input type="datetime-local" value={form.schedule} onChange={e => handleFormChange("schedule", e.target.value)} aria-label="Schedule Quiz" />
            </label>
            {/* Modern stepper for question navigation */}
            <div className="questions-stepper">
              {form.questions.length > 0 && (
                <div className="stepper-controls">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setCurrentQ(i => Math.max(i - 1, 0))}
                    disabled={currentQ === 0}
                    aria-label="Previous Question"
                  >
                    Previous
                  </button>
                  <span className="stepper-indicator">
                    Question {currentQ + 1} of {form.questions.length}
                  </span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setCurrentQ(i => Math.min(i + 1, form.questions.length - 1))}
                    disabled={currentQ === form.questions.length - 1}
                    aria-label="Next Question"
                  >
                    Next
                  </button>
                </div>
              )}
              {/* Show only the current question */}
              {form.questions.length > 0 && (
                <div className="question-block" key={currentQ}>
                  <label>
                    Question {currentQ + 1}:
                    <input type="text" value={form.questions[currentQ].question} onChange={e => handleQuestionChange(currentQ, "question", e.target.value)} required aria-label={`Question ${currentQ + 1}`} />
                  </label>
                  <div className="options-row">
                    {form.questions[currentQ].options.map((opt, oi) => (
                      <input
                        key={oi}
                        type="text"
                        placeholder={`Option ${oi + 1}`}
                        value={opt}
                        onChange={e => handleOptionChange(currentQ, oi, e.target.value)}
                        required
                        aria-label={`Option ${oi + 1} for Question ${currentQ + 1}`}
                      />
                    ))}
                  </div>
                  <label>
                    Correct Answer:
                    <select value={form.questions[currentQ].answer} onChange={e => handleQuestionChange(currentQ, "answer", e.target.value)} required aria-label={`Correct answer for Question ${currentQ + 1}`}>
                      <option value="">Select correct option</option>
                      {form.questions[currentQ].options.map((opt, oi) => (
                        <option key={oi} value={opt}>{opt || `Option ${oi + 1}`}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="remove-q-btn"
                    onClick={() => { removeQuestion(currentQ); setCurrentQ(i => Math.max(0, i - (form.questions.length === 1 ? 0 : 1))); }}
                    aria-label={`Remove Question ${currentQ + 1}`}
                    title="Remove Question"
                    disabled={form.questions.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
              <button
                type="button"
                className="add-q-btn"
                onClick={() => { addQuestion(); setCurrentQ(form.questions.length); }}
                aria-label="Add Question"
                title="Add Question"
              >
                <FaPlus /> Add Question
              </button>
            </div>
            {/* Summary of all questions before submit */}
            {form.questions.length > 1 && (
              <div className="questions-summary">
                <h4>Questions Summary</h4>
                <ol>
                  {form.questions.map((q, idx) => (
                    <li key={idx} style={{ marginBottom: 6 }}>
                      <b>Q{idx + 1}:</b> {q.question ? q.question : <span style={{ color: '#dc3545' }}>[No question text]</span>}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div className="quiz-form-actions">
              <button className="submit-quiz-btn" type="submit" disabled={loading} aria-label={editId ? "Update Quiz" : "Create Quiz"}>
                {editId ? "Update Quiz" : "Create Quiz"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={() => { setEditId(null); setForm({ title: "", questions: [{ ...initialQuestion }], schedule: "" }); setShowForm(false); }}
                  aria-label="Cancel Edit"
                >
                  Cancel
                </button>
              )}
            </div>
            {error && <div className="quiz-error">{error}</div>}
            {success && <div className="quiz-success">{success}</div>}
          </form>
        </div>
      )}
      <div className="admin-quiz-list">
        <h3>Existing Quizzes</h3>
        {loading && <div>Loading...</div>}
        {quizzes.length === 0 && <div>No quizzes found.</div>}
        <div className="admin-quiz-list-cards">
          {quizzes.map(q => (
            <div className="admin-quiz-card" key={q._id} tabIndex={0} aria-label={`Quiz: ${q.title}`}> 
              <span className="admin-quiz-title">{q.title}</span>
              <span className="admin-quiz-questions">Questions: {q.questions.length}</span>
              {q.schedule && (
                <span className="admin-quiz-schedule" title="Scheduled Quiz">
                  <FaCalendarAlt style={{ marginRight: 4, color: '#007bff' }} />
                  {new Date(q.schedule).toLocaleString()}
                </span>
              )}
              <div className="admin-quiz-actions">
                <button
                  className="admin-quiz-edit-btn"
                  title="Edit Quiz"
                  aria-label={`Edit quiz ${q.title}`}
                  onClick={() => handleEditQuiz(q)}
                >
                  <FaEdit />
                </button>
                <button
                  className="admin-quiz-delete-btn"
                  title="Delete Quiz"
                  aria-label={`Delete quiz ${q.title}`}
                  onClick={() => handleDeleteQuiz(q._id, q.title)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminQuizManager;
