import { useState } from "react"
import { useNavigate } from "react-router-dom"

const INITIAL_ISSUES = [
  {
    id: 1,
    title: "Incorrect region for Banarasi Saree",
    description: "The saree is listed under West Bengal but it originates from Varanasi, Uttar Pradesh.",
    category: "Region",
    clothing: "Banarasi Saree",
    reporter: "Priya Sharma",
    status: "open",
    createdAt: "2024-03-01",
    resolution: "",
  },
  {
    id: 2,
    title: "Wrong fabric type for Phulkari",
    description: "Phulkari is embroidered on Khaddar fabric, not silk as currently listed.",
    category: "Fabric",
    clothing: "Phulkari Dupatta",
    reporter: "Arjun Mehta",
    status: "resolved",
    createdAt: "2024-03-05",
    resolution: "Updated fabric type to Khaddar after verification.",
  },
  {
    id: 3,
    title: "Missing embroidery details for Chikankari",
    description: "The Chikankari kurta entry is missing information about the shadow work technique.",
    category: "Embroidery",
    clothing: "Chikankari Kurta",
    reporter: "Sneha Iyer",
    status: "in-review",
    createdAt: "2024-03-10",
    resolution: "",
  },
]

const CATEGORIES = ["Region", "Fabric", "Embroidery", "Occasion", "Gender", "Other"]

const STATUS_STYLES = {
  open:      { label: "Open",      classes: "bg-red-900/50 text-red-300 border-red-700" },
  "in-review": { label: "In Review", classes: "bg-yellow-900/50 text-yellow-300 border-yellow-700" },
  resolved:  { label: "Resolved",  classes: "bg-green-900/50 text-green-300 border-green-700" },
}

export default function Feature9Page() {
  const nav = useNavigate()
  const [issues, setIssues]         = useState(INITIAL_ISSUES)
  const [isAdmin, setIsAdmin]       = useState(false)
  const [showForm, setShowForm]     = useState(false)
  const [filterStatus, setFilter]   = useState("all")
  const [selectedIssue, setSelected] = useState(null)
  const [resolution, setResolution] = useState("")

  const [form, setForm] = useState({
    title: "", description: "", category: "Region",
    clothing: "", reporter: "",
  })
  const [errors, setErrors] = useState({})

  // ── Validation ──────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title       = "Title is required"
    if (!form.description.trim()) e.description = "Description is required"
    if (!form.clothing.trim())    e.clothing    = "Clothing item is required"
    if (!form.reporter.trim())    e.reporter    = "Your name is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit new issue ────────────────────────────────────
  const submitIssue = () => {
    if (!validate()) return
    setIssues((prev) => [
      ...prev,
      {
        ...form,
        id: Date.now(),
        status: "open",
        createdAt: new Date().toISOString().split("T")[0],
        resolution: "",
      },
    ])
    setForm({ title: "", description: "", category: "Region", clothing: "", reporter: "" })
    setErrors({})
    setShowForm(false)
  }

  // ── Moderator: update status ────────────────────────────
  const updateStatus = (id, status) => {
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === id
          ? { ...iss, status, resolution: status === "resolved" ? resolution : iss.resolution }
          : iss
      )
    )
    setSelected(null)
    setResolution("")
  }

  // ── Filter ───────────────────────────────────────────────
  const filtered = filterStatus === "all"
    ? issues
    : issues.filter((i) => i.status === filterStatus)

  const counts = {
    all:        issues.length,
    open:       issues.filter((i) => i.status === "open").length,
    "in-review": issues.filter((i) => i.status === "in-review").length,
    resolved:   issues.filter((i) => i.status === "resolved").length,
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-3xl mx-auto">

      {/* ── Header ── */}
      <button
        onClick={() => nav("/")}
        className="text-sm text-zinc-400 mb-6 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-lg"
      >
        ← Back
      </button>

      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🐛</span>
          <div>
            <p className="text-xs text-zinc-500">Feature 9</p>
            <h1 className="text-xl font-medium">Issue Tracker</h1>
          </div>
        </div>
        <button
          onClick={() => setIsAdmin((v) => !v)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            isAdmin
              ? "bg-purple-900/50 border-purple-700 text-purple-300"
              : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
          }`}
        >
          {isAdmin ? "🛡 Admin Mode ON" : "Enter Admin Mode"}
        </button>
      </div>
      <p className="text-sm text-zinc-400 mb-6">
        Report inaccuracies in cultural clothing data for moderator review.
      </p>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { key: "all",       label: "Total",     color: "text-white" },
          { key: "open",      label: "Open",      color: "text-red-400" },
          { key: "in-review", label: "In Review", color: "text-yellow-400" },
          { key: "resolved",  label: "Resolved",  color: "text-green-400" },
        ].map(({ key, label, color }) => (
          <div key={key} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${color}`}>{counts[key]}</p>
            <p className="text-xs text-zinc-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Filter + Report Button ── */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex gap-2">
          {["all", "open", "in-review", "resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${
                filterStatus === s
                  ? "bg-orange-700 border-orange-600 text-white"
                  : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white"
              }`}
            >
              {s === "in-review" ? "In Review" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-sm bg-orange-700 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg"
        >
          {showForm ? "Cancel" : "+ Report Issue"}
        </button>
      </div>

      {/* ── Report Issue Form ── */}
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-orange-400 mb-4">Report a Cultural Accuracy Issue</h3>
          <div className="space-y-3">

            <div>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Issue title *"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  value={form.clothing}
                  onChange={(e) => setForm((f) => ({ ...f, clothing: e.target.value }))}
                  placeholder="Clothing item *"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
                {errors.clothing && <p className="text-red-400 text-xs mt-1">{errors.clothing}</p>}
              </div>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the inaccuracy in detail *"
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 resize-none"
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <input
                value={form.reporter}
                onChange={(e) => setForm((f) => ({ ...f, reporter: e.target.value }))}
                placeholder="Your name *"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
              {errors.reporter && <p className="text-red-400 text-xs mt-1">{errors.reporter}</p>}
            </div>

            <button
              onClick={submitIssue}
              className="w-full bg-orange-700 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium"
            >
              Submit Issue
            </button>
          </div>
        </div>
      )}

      {/* ── Issue List ── */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-10">No issues found.</p>
        )}
        {filtered.map((issue) => (
          <div
            key={issue.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >
            {/* Issue Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-sm font-semibold text-white">{issue.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${STATUS_STYLES[issue.status].classes}`}>
                {STATUS_STYLES[issue.status].label}
              </span>
            </div>

            {/* Meta */}
            <div className="flex gap-3 text-xs text-zinc-500 mb-3 flex-wrap">
              <span>👗 {issue.clothing}</span>
              <span>🏷 {issue.category}</span>
              <span>👤 {issue.reporter}</span>
              <span>📅 {issue.createdAt}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-400 mb-3">{issue.description}</p>

            {/* Resolution note */}
            {issue.resolution && (
              <div className="bg-green-900/20 border border-green-800 rounded-lg px-3 py-2 text-xs text-green-300 mb-3">
                ✅ Resolution: {issue.resolution}
              </div>
            )}

            {/* Admin Controls */}
            {isAdmin && issue.status !== "resolved" && (
              <div className="border-t border-zinc-800 pt-3 mt-2">
                {selectedIssue === issue.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Add resolution note (optional)..."
                      rows={2}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 resize-none"
                    />
                    <div className="flex gap-2">
                      {issue.status === "open" && (
                        <button
                          onClick={() => updateStatus(issue.id, "in-review")}
                          className="text-xs bg-yellow-800 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg"
                        >
                          Mark In Review
                        </button>
                      )}
                      <button
                        onClick={() => updateStatus(issue.id, "resolved")}
                        className="text-xs bg-green-800 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg"
                      >
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => setSelected(null)}
                        className="text-xs bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelected(issue.id)}
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg"
                  >
                    🛡 Moderate
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}