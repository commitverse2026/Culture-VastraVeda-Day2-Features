import { useState } from "react"
import { useNavigate } from "react-router-dom"

const MODERATOR_PASSWORD = "mod123"

const initialThreads = [
  {
    id: 1,
    clothingItem: "Banarasi Saree",
    title: "Is Banarasi weaving technique originally Persian?",
    author: "Priya_Textiles",
    timestamp: "2024-01-15T10:30:00",
    status: "open",
    resolutionNote: "",
    replies: [
      {
        id: 1,
        author: "HistoryBuff_Raj",
        text: "Persian influence is documented in Mughal-era records, but the technique evolved uniquely in Varanasi.",
        timestamp: "2024-01-15T11:00:00",
        replies: [
          {
            id: 2,
            author: "Priya_Textiles",
            text: "That's a fair point. The zari work does show Central Asian influence though.",
            timestamp: "2024-01-15T11:30:00",
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: 2,
    clothingItem: "Phulkari Dupatta",
    title: "Phulkari — Punjab or Haryana origin?",
    author: "CraftResearcher",
    timestamp: "2024-01-14T09:00:00",
    status: "resolved",
    resolutionNote: "Both regions have documented traditions. Phulkari is recognized as a shared cultural heritage of the broader Punjab region.",
    replies: [
      {
        id: 3,
        author: "DelhiDesigner",
        text: "Haryana's Phulkari uses different motifs — the lotus pattern is distinctly Haryanvi.",
        timestamp: "2024-01-14T10:00:00",
        replies: []
      }
    ]
  }
]

function addReplyToThread(replies, targetId, newReply) {
  return replies.map(reply => {
    if (reply.id === targetId) {
      return { ...reply, replies: [...(reply.replies || []), newReply] }
    }
    if (reply.replies?.length > 0) {
      return { ...reply, replies: addReplyToThread(reply.replies, targetId, newReply) }
    }
    return reply
  })
}

function ReplyThread({ replies, depth = 0, onReply, threadStatus }) {
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState("")

  const handleSubmitReply = (parentId) => {
    if (!replyText.trim()) return
    onReply(parentId, replyText.trim())
    setReplyText("")
    setReplyingTo(null)
  }

  return (
    <div className={depth > 0 ? "ml-6 border-l border-zinc-700 pl-4 mt-3" : ""}>
      {replies.map(reply => (
        <div key={reply.id} className="mt-3">
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-amber-400">{reply.author}</span>
              <span className="text-xs text-zinc-500">
                {new Date(reply.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
            </div>
            <p className="text-sm text-zinc-200">{reply.text}</p>
            {depth < 3 && threadStatus === "open" && (
              <button
                onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                className="text-xs text-zinc-500 hover:text-amber-400 mt-2 transition-colors"
              >
                {replyingTo === reply.id ? "Cancel" : "↩ Reply"}
              </button>
            )}
          </div>

          {replyingTo === reply.id && (
            <div className="mt-2 ml-2">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                rows={2}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-zinc-200 resize-none focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleSubmitReply(reply.id)}
                className="mt-1 text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded-lg transition-colors"
              >
                Post Reply
              </button>
            </div>
          )}

          {reply.replies?.length > 0 && (
            <ReplyThread
              replies={reply.replies}
              depth={depth + 1}
              onReply={onReply}
              threadStatus={threadStatus}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function DebateBoard() {
  const nav = useNavigate()
  const [threads, setThreads] = useState(initialThreads)
  const [isMod, setIsMod] = useState(false)
  const [modInput, setModInput] = useState("")
  const [modError, setModError] = useState("")
  const [showNewThread, setShowNewThread] = useState(false)
  const [expandedThread, setExpandedThread] = useState(null)
  const [newReplyText, setNewReplyText] = useState("")
  const [resolutionText, setResolutionText] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [newThread, setNewThread] = useState({ clothingItem: "", title: "", author: "" })
  const idRef = { current: Date.now() }

  const handleModLogin = () => {
    if (modInput === MODERATOR_PASSWORD) {
      setIsMod(true)
      setModError("")
      setModInput("")
    } else {
      setModError("Incorrect password")
    }
  }

  const handleAddThread = () => {
    if (!newThread.title.trim() || !newThread.author.trim() || !newThread.clothingItem.trim()) return
    setThreads(prev => [{
      id: ++idRef.current,
      ...newThread,
      timestamp: new Date().toISOString(),
      status: "open",
      resolutionNote: "",
      replies: []
    }, ...prev])
    setNewThread({ clothingItem: "", title: "", author: "" })
    setShowNewThread(false)
  }

  const handleAddRootReply = (threadId) => {
    if (!newReplyText.trim()) return
    const newReply = {
      id: ++idRef.current,
      author: "You",
      text: newReplyText.trim(),
      timestamp: new Date().toISOString(),
      replies: []
    }
    setThreads(prev => prev.map(t =>
      t.id === threadId ? { ...t, replies: [...t.replies, newReply] } : t
    ))
    setNewReplyText("")
  }

  const handleNestedReply = (threadId, parentId, text) => {
    const newReply = {
      id: ++idRef.current,
      author: "You",
      text,
      timestamp: new Date().toISOString(),
      replies: []
    }
    setThreads(prev => prev.map(t =>
      t.id === threadId
        ? { ...t, replies: addReplyToThread(t.replies, parentId, newReply) }
        : t
    ))
  }

  const handleResolve = (threadId) => {
    if (!resolutionText.trim()) return
    setThreads(prev => prev.map(t =>
      t.id === threadId ? { ...t, status: "resolved", resolutionNote: resolutionText } : t
    ))
    setResolutionText("")
  }

  const handleReopen = (threadId) => {
    setThreads(prev => prev.map(t =>
      t.id === threadId ? { ...t, status: "open", resolutionNote: "" } : t
    ))
  }

  const handleDelete = (threadId) => {
    setThreads(prev => prev.filter(t => t.id !== threadId))
    if (expandedThread === threadId) setExpandedThread(null)
  }

  const filtered = threads.filter(t => filterStatus === "all" || t.status === filterStatus)

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-3xl mx-auto">
      <button onClick={() => nav("/")} className="text-sm text-zinc-400 mb-6 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-lg">
        ← Back
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">💬</span>
        <div>
          <p className="text-xs text-zinc-500">Feature 8</p>
          <h1 className="text-xl font-medium">Debate & Dispute Board</h1>
        </div>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium bg-red-900 text-red-300">Hard</span>
      </div>
      <p className="text-sm text-zinc-400 mb-6">Discuss controversial cultural origins. Moderators can resolve disputes.</p>

      {/* Moderator login */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
        {isMod ? (
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-900 text-amber-300 px-2 py-0.5 rounded-full font-medium">🛡 Moderator Active</span>
            <button onClick={() => setIsMod(false)} className="text-xs text-zinc-500 hover:text-white ml-auto">Log out</button>
          </div>
        ) : (
          <div className="flex gap-2 items-center flex-wrap">
            <input
              type="password"
              value={modInput}
              onChange={e => setModInput(e.target.value)}
              placeholder="Moderator password (mod123)"
              onKeyDown={e => e.key === "Enter" && handleModLogin()}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500"
            />
            <button onClick={handleModLogin} className="text-sm bg-zinc-700 hover:bg-zinc-600 px-3 py-1.5 rounded-lg transition-colors">
              Login as Mod
            </button>
            {modError && <span className="text-xs text-red-400">{modError}</span>}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex gap-2">
          {["all", "open", "resolved"].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1 rounded-full capitalize transition-colors ${
                filterStatus === s ? "bg-amber-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowNewThread(!showNewThread)}
          className="ml-auto text-sm bg-amber-600 hover:bg-amber-500 px-4 py-1.5 rounded-lg transition-colors"
        >
          + New Thread
        </button>
      </div>

      {/* New thread form */}
      {showNewThread && (
        <div className="bg-zinc-900 border border-amber-800 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium mb-3 text-amber-400">Start a new debate</p>
          <input
            value={newThread.clothingItem}
            onChange={e => setNewThread(p => ({ ...p, clothingItem: e.target.value }))}
            placeholder="Clothing item (e.g. Bandhani Saree)"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-amber-500"
          />
          <input
            value={newThread.title}
            onChange={e => setNewThread(p => ({ ...p, title: e.target.value }))}
            placeholder="Debate title / question"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-amber-500"
          />
          <input
            value={newThread.author}
            onChange={e => setNewThread(p => ({ ...p, author: e.target.value }))}
            placeholder="Your name"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-amber-500"
          />
          <div className="flex gap-2">
            <button onClick={handleAddThread} className="text-sm bg-amber-600 hover:bg-amber-500 px-4 py-1.5 rounded-lg transition-colors">
              Create Thread
            </button>
            <button onClick={() => setShowNewThread(false)} className="text-sm text-zinc-400 hover:text-white px-4 py-1.5 rounded-lg border border-zinc-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-zinc-500 mb-3">{filtered.length} thread{filtered.length !== 1 ? "s" : ""}</p>

      {/* Thread list */}
      <div className="space-y-4">
        {filtered.map(thread => (
          <div key={thread.id} className={`bg-zinc-900 border rounded-xl overflow-hidden ${
            thread.status === "resolved" ? "border-green-900" : "border-zinc-800"
          }`}>
            {/* Thread header — click to expand */}
            <div
              className="p-4 cursor-pointer hover:bg-zinc-800 transition-colors"
              onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">{thread.clothingItem}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      thread.status === "resolved" ? "bg-green-900 text-green-300" : "bg-amber-900 text-amber-300"
                    }`}>
                      {thread.status === "resolved" ? "✓ Resolved" : "● Open"}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{thread.title}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    by {thread.author} · {new Date(thread.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {thread.replies.length} repl{thread.replies.length === 1 ? "y" : "ies"}
                  </p>
                </div>
                <span className="text-zinc-500">{expandedThread === thread.id ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Expanded body */}
            {expandedThread === thread.id && (
              <div className="border-t border-zinc-800 p-4">

                {/* Resolution note */}
                {thread.status === "resolved" && thread.resolutionNote && (
                  <div className="bg-green-950 border border-green-800 rounded-lg p-3 mb-4">
                    <p className="text-xs text-green-400 font-medium mb-1">🏛 Moderator Resolution</p>
                    <p className="text-sm text-green-200">{thread.resolutionNote}</p>
                  </div>
                )}

                {/* Replies */}
                <ReplyThread
                  replies={thread.replies}
                  depth={0}
                  threadStatus={thread.status}
                  onReply={(parentId, text) => handleNestedReply(thread.id, parentId, text)}
                />

                {/* Root reply input */}
                {thread.status === "open" && (
                  <div className="mt-4">
                    <textarea
                      value={newReplyText}
                      onChange={e => setNewReplyText(e.target.value)}
                      placeholder="Share your perspective..."
                      rows={2}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 resize-none focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleAddRootReply(thread.id)}
                      className="mt-2 text-sm bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded-lg transition-colors"
                    >
                      Post Comment
                    </button>
                  </div>
                )}

                {/* Moderator controls */}
                {isMod && (
                  <div className="mt-4 border-t border-zinc-700 pt-4">
                    <p className="text-xs text-amber-400 font-medium mb-3">🛡 Moderator Controls</p>
                    {thread.status === "open" ? (
                      <div>
                        <textarea
                          value={resolutionText}
                          onChange={e => setResolutionText(e.target.value)}
                          placeholder="Write resolution note before closing..."
                          rows={2}
                          className="w-full bg-zinc-800 border border-amber-800 rounded-lg p-2 text-sm text-zinc-200 resize-none focus:outline-none focus:border-amber-500 mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolve(thread.id)}
                            className="text-xs bg-green-700 hover:bg-green-600 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            ✓ Mark Resolved
                          </button>
                          <button
                            onClick={() => handleDelete(thread.id)}
                            className="text-xs bg-red-900 hover:bg-red-800 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            🗑 Delete Thread
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReopen(thread.id)}
                          className="text-xs bg-amber-700 hover:bg-amber-600 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          ↩ Reopen Thread
                        </button>
                        <button
                          onClick={() => handleDelete(thread.id)}
                          className="text-xs bg-red-900 hover:bg-red-800 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          🗑 Delete Thread
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}