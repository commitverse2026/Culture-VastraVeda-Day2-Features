import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

// ─── Mock Data Store ──────────────────────────────────────────────────────────
const MOCK_CLOTHING = [
  { id: "c001", name: "Banarasi Silk Saree", fabric: "Pure Silk", color: "Deep Crimson", origin: "Varanasi, UP", era: "19th Century", condition: "Excellent", tags: ["silk","bridal","zari","traditional"] },
  { id: "c002", name: "Phulkari Dupatta", fabric: "Cotton", color: "Saffron Orange", origin: "Punjab", era: "Early 20th Century", condition: "Good", tags: ["embroidery","phulkari","punjab","cotton"] },
  { id: "c003", name: "Kanjeevaram Pattu", fabric: "Silk", color: "Royal Blue with Gold", origin: "Kanchipuram, TN", era: "Modern (2010s)", condition: "Mint", tags: ["silk","south-indian","temple-border","kanjeevaram"] },
  { id: "c004", name: "Chanderi Suit", fabric: "Chanderi Cotton", color: "Ivory White", origin: "Chanderi, MP", era: "Contemporary", condition: "Excellent", tags: ["chanderi","fusion","lightweight","cotton"] },
  { id: "c005", name: "Bandhani Ghagra", fabric: "Georgette", color: "Multi-color Tie-dye", origin: "Rajasthan", era: "Traditional", condition: "Good", tags: ["bandhani","rajasthani","tie-dye","festive"] },
]

const MOCK_TAGS = ["silk","bridal","zari","traditional","embroidery","phulkari","punjab","cotton","south-indian","temple-border","kanjeevaram","chanderi","fusion","bandhani","rajasthani","festive"]

const MOCK_FABRICS = [
  { id: "f001", name: "Pure Silk", origin: "Karnataka & UP", properties: ["lustrous","soft","breathable"], count: 2 },
  { id: "f002", name: "Cotton", origin: "Pan-India", properties: ["lightweight","breathable","durable"], count: 2 },
  { id: "f003", name: "Georgette", origin: "Rajasthan, Gujarat", properties: ["sheer","flowy","elegant"], count: 1 },
]

// ─── API Key Pool (pre-seeded + user-generated) ───────────────────────────────
const SEED_KEYS = [
  { key: "vv_live_sk_a1b2c3d4e5f6", label: "Default Key", created: "10 Apr 2026", requests: 142, active: true },
]

// ─── Endpoint Definitions ─────────────────────────────────────────────────────
const ENDPOINTS = [
  {
    id: "list-clothing",
    method: "GET",
    path: "/v1/clothing",
    summary: "List all clothing entries",
    description: "Returns a paginated list of all clothing items in the VastraVeda catalogue. Supports filtering by fabric, tag, origin, and condition.",
    params: [
      { name: "page", type: "integer", in: "query", required: false, default: "1", description: "Page number (1-indexed)" },
      { name: "limit", type: "integer", in: "query", required: false, default: "10", description: "Items per page (max 100)" },
      { name: "fabric", type: "string", in: "query", required: false, default: "", description: "Filter by fabric type" },
      { name: "tag", type: "string", in: "query", required: false, default: "", description: "Filter by tag name" },
    ],
    mockFn: (params) => {
      let items = [...MOCK_CLOTHING]
      if (params.fabric) items = items.filter(i => i.fabric.toLowerCase().includes(params.fabric.toLowerCase()))
      if (params.tag) items = items.filter(i => i.tags.includes(params.tag.toLowerCase()))
      const page = Number(params.page) || 1
      const limit = Math.min(Number(params.limit) || 10, 100)
      const start = (page - 1) * limit
      const slice = items.slice(start, start + limit)
      return { success: true, page, limit, total: items.length, data: slice }
    },
  },
  {
    id: "get-clothing",
    method: "GET",
    path: "/v1/clothing/{id}",
    summary: "Get single clothing entry",
    description: "Fetch a specific clothing item by its unique ID (e.g. c001). Returns full metadata including fabric details, origin, era, condition, and tags.",
    params: [
      { name: "id", type: "string", in: "path", required: true, default: "c001", description: "Clothing item ID (e.g. c001)" },
    ],
    mockFn: (params) => {
      const item = MOCK_CLOTHING.find(i => i.id === (params.id || "c001"))
      if (!item) return { success: false, error: "Item not found", code: 404 }
      return { success: true, data: item }
    },
  },
  {
    id: "list-tags",
    method: "GET",
    path: "/v1/tags",
    summary: "List all tags",
    description: "Returns all available clothing tags in the platform. Useful for building filter UIs and tag clouds.",
    params: [],
    mockFn: () => ({ success: true, total: MOCK_TAGS.length, data: MOCK_TAGS }),
  },
  {
    id: "list-fabrics",
    method: "GET",
    path: "/v1/fabrics",
    summary: "List fabric types",
    description: "Returns all fabric types catalogued in VastraVeda, including their physical properties and item counts.",
    params: [],
    mockFn: () => ({ success: true, total: MOCK_FABRICS.length, data: MOCK_FABRICS }),
  },
  {
    id: "search",
    method: "GET",
    path: "/v1/search",
    summary: "Full-text search",
    description: "Search clothing items by a free-text query across name, description, tags, fabric, and origin fields.",
    params: [
      { name: "q", type: "string", in: "query", required: true, default: "silk", description: "Search query string" },
    ],
    mockFn: (params) => {
      const q = (params.q || "silk").toLowerCase()
      const results = MOCK_CLOTHING.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.fabric.toLowerCase().includes(q) ||
        i.origin.toLowerCase().includes(q) ||
        i.tags.some(t => t.includes(q))
      )
      return { success: true, query: params.q || "silk", total: results.length, data: results }
    },
  },
  {
    id: "submit-clothing",
    method: "POST",
    path: "/v1/clothing",
    summary: "Submit a new clothing entry",
    description: "Creates a new clothing entry in the VastraVeda platform. Requires authentication via API key in the Authorization header.",
    params: [
      { name: "name", type: "string", in: "body", required: true, default: "Mysore Silk Saree", description: "Clothing item name" },
      { name: "fabric", type: "string", in: "body", required: true, default: "Pure Silk", description: "Primary fabric type" },
      { name: "color", type: "string", in: "body", required: false, default: "Royal Purple", description: "Primary color" },
      { name: "origin", type: "string", in: "body", required: false, default: "Mysore, Karnataka", description: "Geographic origin" },
      { name: "era", type: "string", in: "body", required: false, default: "Contemporary", description: "Historical era" },
      { name: "tags", type: "array", in: "body", required: false, default: '["silk","south-indian"]', description: "Array of tags" },
    ],
    mockFn: (params) => {
      if (!params.name) return { success: false, error: "name is required", code: 400 }
      const newId = "c" + String(MOCK_CLOTHING.length + 1).padStart(3, "0")
      const newItem = {
        id: newId,
        name: params.name || "Mysore Silk Saree",
        fabric: params.fabric || "Pure Silk",
        color: params.color || "Royal Purple",
        origin: params.origin || "Mysore, Karnataka",
        era: params.era || "Contemporary",
        condition: "New",
        tags: params.tags ? JSON.parse(params.tags) : ["silk","south-indian"],
        createdAt: new Date().toISOString(),
      }
      return { success: true, message: "Clothing entry created successfully", data: newItem }
    },
  },
  {
    id: "stats",
    method: "GET",
    path: "/v1/stats",
    summary: "Platform statistics",
    description: "Returns high-level platform statistics including total items, fabric breakdown, and top tags.",
    params: [],
    mockFn: () => ({
      success: true,
      data: {
        totalItems: MOCK_CLOTHING.length,
        totalFabrics: MOCK_FABRICS.length,
        totalTags: MOCK_TAGS.length,
        fabricBreakdown: { "Silk": 2, "Cotton": 2, "Georgette": 1 },
        topTags: ["silk","cotton","traditional","bridal","embroidery"],
        lastUpdated: new Date().toISOString(),
      }
    }),
  },
]

// ─── Utilities ────────────────────────────────────────────────────────────────
function methodColor(m) {
  return {
    GET: "bg-emerald-900/50 text-emerald-300 border border-emerald-700/50",
    POST: "bg-blue-900/50 text-blue-300 border border-blue-700/50",
    PUT: "bg-amber-900/50 text-amber-300 border border-amber-700/50",
    DELETE: "bg-rose-900/50 text-rose-300 border border-rose-700/50",
  }[m] || "bg-zinc-800 text-zinc-300"
}

function generateApiKey() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  const part = (n) => Array.from({length: n}, () => chars[Math.floor(Math.random()*chars.length)]).join("")
  return `vv_live_sk_${part(8)}${part(4)}`
}

function StatusBadge({ code }) {
  const ok = code < 400
  return (
    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full
      ${ok ? "bg-emerald-900/60 text-emerald-300" : "bg-rose-900/60 text-rose-300"}`}>
      {code || 200}
    </span>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function EndpointRow({ ep, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 rounded-xl border flex items-center gap-3 transition-all duration-150
        ${isSelected
          ? "border-cyan-600 bg-cyan-950/30"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
        }`}
    >
      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md shrink-0 ${methodColor(ep.method)}`}>
        {ep.method}
      </span>
      <span className="text-sm font-mono text-zinc-200 truncate">{ep.path}</span>
      <span className="text-xs text-zinc-500 ml-auto hidden sm:block shrink-0 truncate max-w-[140px]">{ep.summary}</span>
    </button>
  )
}

function ParamInput({ param, value, onChange }) {
  const isBody = param.in === "body"
  const isPath = param.in === "path"
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-zinc-800/60 last:border-0">
      <div className="w-36 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-cyan-300">{param.name}</span>
          {param.required && <span className="text-rose-400 text-xs">*</span>}
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium
            ${isPath ? "bg-amber-900/40 text-amber-300" : isBody ? "bg-blue-900/40 text-blue-300" : "bg-zinc-800 text-zinc-400"}`}>
            {param.in}
          </span>
        </div>
        <p className="text-xs text-zinc-600 mt-0.5">{param.type}</p>
      </div>
      <div className="flex-1">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`${param.default || "—"}`}
          className="w-full bg-zinc-800/70 border border-zinc-700 text-xs font-mono text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition placeholder-zinc-600"
        />
        <p className="text-xs text-zinc-600 mt-1">{param.description}</p>
      </div>
    </div>
  )
}

function JsonBlock({ data }) {
  const lines = JSON.stringify(data, null, 2).split("\n")
  return (
    <div className="font-mono text-xs leading-5 overflow-auto max-h-80">
      {lines.map((line, i) => {
        const isKey = /"[^"]+":/.test(line)
        const isStr = /:\s*"/.test(line)
        const isNum = /:\s*\d/.test(line)
        const isBool = /:\s*(true|false)/.test(line)
        return (
          <div key={i} className="hover:bg-white/5 px-1 rounded transition-colors">
            <span className="text-zinc-600 select-none mr-3">{String(i+1).padStart(2,"0")}</span>
            {isKey
              ? <span dangerouslySetInnerHTML={{ __html: line
                  .replace(/("([^"]+)"):/, '<span class="text-sky-300">$1</span>:')
                  .replace(/: ("([^"]*)")/, ': <span class="text-emerald-300">$1</span>')
                  .replace(/: (\d+(\.\d+)?)/, ': <span class="text-amber-300">$1</span>')
                  .replace(/: (true|false)/, ': <span class="text-rose-300">$1</span>')
                }} />
              : <span className="text-zinc-400">{line}</span>
            }
          </div>
        )
      })}
    </div>
  )
}

function TryItPanel({ ep, apiKey }) {
  const [paramValues, setParamValues] = useState(() => {
    const init = {}
    ep.params.forEach(p => { init[p.name] = p.default || "" })
    return init
  })
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [latency, setLatency] = useState(null)

  function setValue(name, val) {
    setParamValues(p => ({ ...p, [name]: val }))
  }

  function buildUrl() {
    let base = `https://api.vastraveda.io${ep.path}`
    const pathParams = ep.params.filter(p => p.in === "path")
    pathParams.forEach(p => {
      base = base.replace(`{${p.name}}`, paramValues[p.name] || p.default || p.name)
    })
    const queryParams = ep.params.filter(p => p.in === "query" && paramValues[p.name])
    if (queryParams.length) {
      base += "?" + queryParams.map(p => `${p.name}=${encodeURIComponent(paramValues[p.name])}`).join("&")
    }
    return base
  }

  function execute() {
    if (!apiKey) return
    setLoading(true)
    setResponse(null)
    const t0 = Date.now()
    // Simulate network latency
    setTimeout(() => {
      const params = { ...paramValues }
      ep.params.forEach(p => { if (!params[p.name]) params[p.name] = p.default || "" })
      const result = ep.mockFn(params)
      setLatency(Date.now() - t0)
      setResponse(result)
      setLoading(false)
    }, 350 + Math.random() * 300)
  }

  const curlBody = ep.method === "POST"
    ? ` \\\n  -d '${JSON.stringify(Object.fromEntries(ep.params.filter(p => p.in === "body").map(p => [p.name, paramValues[p.name] || p.default || ""])))}'`
    : ""

  const curlCmd = `curl -X ${ep.method} "${buildUrl()}" \\\n  -H "Authorization: Bearer ${apiKey || "YOUR_API_KEY"}" \\\n  -H "Accept: application/json"${curlBody}`

  return (
    <div className="space-y-4">
      {/* URL display */}
      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5">
        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded shrink-0 ${methodColor(ep.method)}`}>{ep.method}</span>
        <span className="text-xs font-mono text-zinc-300 break-all">{buildUrl()}</span>
      </div>

      {/* Params */}
      {ep.params.length > 0 && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Parameters</p>
          <div>
            {ep.params.map(p => (
              <ParamInput key={p.name} param={p} value={paramValues[p.name] ?? ""} onChange={v => setValue(p.name, v)} />
            ))}
          </div>
        </div>
      )}

      {/* Execute */}
      <button
        onClick={execute}
        disabled={loading || !apiKey}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2
          ${loading ? "bg-cyan-900/40 text-cyan-500 cursor-not-allowed" :
            !apiKey ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" :
            "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/30"
          }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Sending request…
          </>
        ) : !apiKey ? "⚠️ Set an API Key to execute" : "▶ Send Request"}
      </button>

      {/* Response */}
      {response && (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Response</p>
            <StatusBadge code={response.code || 200} />
            {latency && <span className="text-xs text-zinc-600">{latency}ms</span>}
          </div>
          <div className="bg-[#0d1117] border border-zinc-700 rounded-xl p-4">
            <JsonBlock data={response} />
          </div>
        </div>
      )}

      {/* cURL snippet */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-500 uppercase tracking-widest">cURL</p>
        <div className="bg-[#0d1117] border border-zinc-800 rounded-xl p-4 relative group">
          <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap break-all">{curlCmd}</pre>
          <button
            onClick={() => navigator.clipboard.writeText(curlCmd)}
            className="absolute top-2 right-2 text-xs text-zinc-500 hover:text-zinc-200 bg-zinc-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

function ApiKeyManager({ keys, onAdd, onToggle, activeKey, onSelect }) {
  const [label, setLabel] = useState("")
  const [copied, setCopied] = useState(null)

  function copy(key) {
    navigator.clipboard.writeText(key)
    setCopied(key)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <div className="space-y-4">
      {/* Active key display */}
      <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-2xl p-4">
        <p className="text-xs text-cyan-400 uppercase tracking-widest mb-2">Active API Key</p>
        {activeKey ? (
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono text-cyan-300 bg-cyan-950/40 px-2 py-1 rounded-lg flex-1 truncate">{activeKey}</code>
            <button onClick={() => copy(activeKey)} className="text-xs text-zinc-400 hover:text-white transition-colors shrink-0">
              {copied === activeKey ? "✅" : "📋"}
            </button>
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No key selected — generate or select one below</p>
        )}
      </div>

      {/* Key list */}
      <div className="space-y-2">
        {keys.map((k) => (
          <div
            key={k.key}
            className={`bg-zinc-900 border rounded-xl p-3 transition-all
              ${activeKey === k.key ? "border-cyan-700" : "border-zinc-800"}`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${k.active ? "bg-emerald-400" : "bg-zinc-600"}`} />
                <span className="text-xs font-medium text-white truncate">{k.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-zinc-500">{k.requests} req</span>
                <button onClick={() => copy(k.key)} className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
                  {copied === k.key ? "✅" : "📋"}
                </button>
                <button
                  onClick={() => onSelect(k.key)}
                  className={`text-xs px-2 py-0.5 rounded-lg border transition-colors
                    ${activeKey === k.key
                      ? "bg-cyan-800/40 border-cyan-700 text-cyan-300"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                >
                  {activeKey === k.key ? "Active" : "Use"}
                </button>
              </div>
            </div>
            <code className="text-xs font-mono text-zinc-500">{k.key.slice(0,20)}…</code>
            <p className="text-xs text-zinc-600 mt-0.5">Created {k.created}</p>
          </div>
        ))}
      </div>

      {/* Generate new */}
      <div className="flex gap-2">
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Key label (e.g. My App)"
          className="flex-1 bg-zinc-800/70 border border-zinc-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 placeholder-zinc-600"
        />
        <button
          onClick={() => { onAdd(label || "New Key"); setLabel("") }}
          className="shrink-0 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors"
        >
          + Generate
        </button>
      </div>
    </div>
  )
}

// ─── Schema section ───────────────────────────────────────────────────────────
const SCHEMA = {
  ClothingItem: {
    id: "string (c001)",
    name: "string",
    fabric: "string",
    color: "string",
    origin: "string",
    era: "string",
    condition: '"Excellent" | "Good" | "Mint" | "Fair" | "New"',
    tags: "string[]",
  },
  Fabric: {
    id: "string (f001)",
    name: "string",
    origin: "string",
    properties: "string[]",
    count: "integer",
  },
  ApiError: {
    success: "false",
    error: "string",
    code: "integer (HTTP status)",
  },
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function OpenAPI() {
  const nav = useNavigate()
  const [activeTab, setActiveTab] = useState("endpoints") // endpoints | keys | schemas | guide
  const [selectedEp, setSelectedEp] = useState(ENDPOINTS[0])
  const [apiKeys, setApiKeys] = useState(SEED_KEYS)
  const [activeKey, setActiveKey] = useState(SEED_KEYS[0].key)
  const [epTab, setEpTab] = useState("try") // try | docs

  function addKey(label) {
    const newKey = {
      key: generateApiKey(),
      label,
      created: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      requests: 0,
      active: true,
    }
    setApiKeys(k => [...k, newKey])
    setActiveKey(newKey.key)
  }

  const tabs = [
    { key: "endpoints", icon: "🔌", label: "Endpoints" },
    { key: "keys", icon: "🔑", label: "API Keys" },
    { key: "schemas", icon: "📐", label: "Schemas" },
    { key: "guide", icon: "📖", label: "Quick Start" },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col">
      {/* ── Header ── */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center gap-4 shrink-0">
        <button
          onClick={() => nav("/")}
          className="text-sm text-zinc-400 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-xl transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔌</span>
          <div>
            <p className="text-xs text-zinc-500">Feature 15</p>
            <h1 className="text-xl font-bold tracking-tight">VastraVeda Open API</h1>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-rose-900 text-rose-300">Hard</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-900/50 text-emerald-300 border border-emerald-700/40">v1.0 · Live</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-zinc-800 text-zinc-300">{ENDPOINTS.length} endpoints</span>
          {activeKey && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-cyan-900/50 text-cyan-300 border border-cyan-700/40 font-mono">
              🔑 {activeKey.slice(0, 16)}…
            </span>
          )}
        </div>
      </header>

      {/* ── Top nav tabs ── */}
      <div className="border-b border-zinc-800 px-6 flex gap-1 pt-3 shrink-0">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-t-xl border-b-2 transition-all font-medium
              ${activeTab === t.key
                ? "border-cyan-500 text-cyan-300 bg-cyan-950/20"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-hidden">

        {/* ══ ENDPOINTS TAB ═══════════════════════════════ */}
        {activeTab === "endpoints" && (
          <div className="flex h-full overflow-hidden">
            {/* Left sidebar — endpoint list */}
            <aside className="w-80 shrink-0 border-r border-zinc-800 p-4 overflow-y-auto space-y-1.5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-500 uppercase tracking-widest">REST Endpoints</p>
                <span className="text-xs text-zinc-600">
                  Base: <code className="text-zinc-400">api.vastraveda.io</code>
                </span>
              </div>
              {ENDPOINTS.map(ep => (
                <EndpointRow
                  key={ep.id}
                  ep={ep}
                  isSelected={selectedEp.id === ep.id}
                  onClick={() => { setSelectedEp(ep); setEpTab("try") }}
                />
              ))}
              <div className="pt-3 border-t border-zinc-800 mt-3">
                <p className="text-xs text-zinc-600">All endpoints require:</p>
                <code className="text-xs font-mono text-zinc-500">Authorization: Bearer YOUR_KEY</code>
              </div>
            </aside>

            {/* Right — detail panel */}
            <main className="flex-1 overflow-y-auto">
              {/* Endpoint header */}
              <div className="border-b border-zinc-800 px-6 py-4 flex items-start gap-4">
                <span className={`text-sm font-bold font-mono px-3 py-1 rounded-lg shrink-0 ${methodColor(selectedEp.method)}`}>
                  {selectedEp.method}
                </span>
                <div className="min-w-0">
                  <code className="text-lg font-mono text-white">{selectedEp.path}</code>
                  <p className="text-sm text-zinc-400 mt-0.5">{selectedEp.description}</p>
                </div>
              </div>

              {/* Inner tabs */}
              <div className="flex gap-1 px-6 pt-4 shrink-0 border-b border-zinc-800 pb-0">
                {[["try","▶ Try It"],["docs","📄 Docs"]].map(([k,l]) => (
                  <button
                    key={k}
                    onClick={() => setEpTab(k)}
                    className={`text-sm px-4 py-2.5 rounded-t-lg border-b-2 transition-all font-medium
                      ${epTab === k ? "border-cyan-500 text-cyan-300" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {epTab === "try" && (
                  <TryItPanel key={selectedEp.id} ep={selectedEp} apiKey={activeKey} />
                )}
                {epTab === "docs" && (
                  <div className="max-w-xl space-y-4">
                    {/* Summary */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Summary</p>
                      <p className="text-sm text-zinc-300">{selectedEp.description}</p>
                    </div>

                    {/* Parameters */}
                    {selectedEp.params.length > 0 && (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Parameters</p>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-left text-zinc-600 border-b border-zinc-800">
                              <th className="pb-2 pr-3">Name</th>
                              <th className="pb-2 pr-3">In</th>
                              <th className="pb-2 pr-3">Type</th>
                              <th className="pb-2 pr-3">Required</th>
                              <th className="pb-2">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/50">
                            {selectedEp.params.map(p => (
                              <tr key={p.name} className="text-zinc-400">
                                <td className="py-2 pr-3 font-mono text-cyan-300">{p.name}</td>
                                <td className="py-2 pr-3">
                                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium
                                    ${p.in === "path" ? "bg-amber-900/40 text-amber-300" :
                                      p.in === "body" ? "bg-blue-900/40 text-blue-300" :
                                      "bg-zinc-800 text-zinc-400"}`}>
                                    {p.in}
                                  </span>
                                </td>
                                <td className="py-2 pr-3 font-mono text-zinc-500">{p.type}</td>
                                <td className="py-2 pr-3">{p.required ? <span className="text-rose-400">Yes</span> : <span className="text-zinc-600">No</span>}</td>
                                <td className="py-2 text-zinc-500">{p.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Example response */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Example Response <span className="text-emerald-400 ml-2">200 OK</span></p>
                      <div className="bg-[#0d1117] rounded-xl p-3">
                        <JsonBlock data={selectedEp.mockFn(
                          Object.fromEntries(selectedEp.params.map(p => [p.name, p.default || ""]))
                        )} />
                      </div>
                    </div>

                    {/* Auth */}
                    <div className="bg-amber-950/20 border border-amber-800/30 rounded-2xl p-4">
                      <p className="text-xs text-amber-400 uppercase tracking-widest mb-2">Authentication</p>
                      <p className="text-xs text-zinc-400 mb-2">All endpoints require a valid API key passed in the Authorization header:</p>
                      <code className="text-xs font-mono text-amber-300 bg-amber-950/30 px-2 py-1 rounded block">
                        Authorization: Bearer vv_live_sk_xxxxxxxxxxxxxxxx
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        )}

        {/* ══ API KEYS TAB ════════════════════════════════ */}
        {activeTab === "keys" && (
          <div className="p-6 max-w-xl">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">API Key Management</h2>
              <p className="text-xs text-zinc-500 mt-1">Create and manage API keys for accessing VastraVeda Open API endpoints.</p>
            </div>

            <div className="bg-rose-950/20 border border-rose-800/30 rounded-2xl p-4 mb-6">
              <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Security Notice</p>
              <p className="text-xs text-zinc-400">Keep your API keys secret. Do not commit them to version control or share in public channels. Rotate keys regularly.</p>
            </div>

            <ApiKeyManager
              keys={apiKeys}
              onAdd={addKey}
              onToggle={(key) => setApiKeys(ks => ks.map(k => k.key === key ? {...k, active: !k.active} : k))}
              activeKey={activeKey}
              onSelect={setActiveKey}
            />

            <div className="mt-6 border-t border-zinc-800 pt-6 space-y-3">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Rate Limits</p>
              {[
                { plan: "Free", rps: "10 req/min", total: "1,000/day", color: "zinc" },
                { plan: "Pro", rps: "100 req/min", total: "100,000/day", color: "cyan" },
                { plan: "Enterprise", rps: "Unlimited", total: "Unlimited", color: "violet" },
              ].map(r => (
                <div key={r.plan} className={`flex items-center justify-between px-4 py-3 rounded-xl border
                  ${r.color === "cyan" ? "border-cyan-800/40 bg-cyan-950/20" :
                    r.color === "violet" ? "border-violet-800/40 bg-violet-950/20" :
                    "border-zinc-800 bg-zinc-900"}`}
                >
                  <span className="text-sm font-medium text-white">{r.plan}</span>
                  <div className="text-right">
                    <p className="text-xs text-zinc-300">{r.rps}</p>
                    <p className="text-xs text-zinc-500">{r.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ SCHEMAS TAB ═════════════════════════════════ */}
        {activeTab === "schemas" && (
          <div className="p-6 max-w-2xl space-y-4">
            <div className="mb-2">
              <h2 className="text-lg font-semibold">Data Schemas</h2>
              <p className="text-xs text-zinc-500 mt-1">TypeScript-style type definitions for all API response objects.</p>
            </div>
            {Object.entries(SCHEMA).map(([name, fields]) => (
              <div key={name} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-sm font-mono font-bold text-cyan-300">{name}</p>
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">interface</span>
                </div>
                <div className="bg-[#0d1117] rounded-xl p-4 font-mono text-xs space-y-1">
                  <div className="text-zinc-500">{"{"}</div>
                  {Object.entries(fields).map(([k, v]) => (
                    <div key={k} className="pl-4">
                      <span className="text-sky-300">{k}</span>
                      <span className="text-zinc-500">: </span>
                      <span className="text-emerald-300">{v}</span>
                      <span className="text-zinc-600">;</span>
                    </div>
                  ))}
                  <div className="text-zinc-500">{"}"}</div>
                </div>
              </div>
            ))}

            {/* Error codes */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">HTTP Status Codes</p>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-zinc-800/60">
                  {[
                    ["200", "OK", "Request succeeded"],
                    ["201", "Created", "Resource created (POST)"],
                    ["400", "Bad Request", "Missing or invalid parameters"],
                    ["401", "Unauthorized", "Invalid or missing API key"],
                    ["404", "Not Found", "Resource does not exist"],
                    ["429", "Too Many Requests", "Rate limit exceeded"],
                    ["500", "Internal Error", "Server-side error"],
                  ].map(([code, name, desc]) => (
                    <tr key={code} className="text-zinc-400">
                      <td className={`py-2 pr-4 font-mono font-bold ${Number(code) < 300 ? "text-emerald-400" : Number(code) < 500 ? "text-amber-400" : "text-rose-400"}`}>{code}</td>
                      <td className="py-2 pr-4 text-zinc-300">{name}</td>
                      <td className="py-2 text-zinc-500">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ QUICK START TAB ═════════════════════════════ */}
        {activeTab === "guide" && (
          <div className="p-6 max-w-2xl space-y-4 overflow-y-auto">
            <div className="mb-2">
              <h2 className="text-lg font-semibold">Quick Start Guide</h2>
              <p className="text-xs text-zinc-500 mt-1">Get up and running with VastraVeda Open API in under 5 minutes.</p>
            </div>

            {/* Steps */}
            {[
              {
                step: "01",
                title: "Get your API Key",
                color: "cyan",
                content: `Navigate to the API Keys tab and generate your first key. Copy and store it securely — you won't see it in full again.`,
                code: null,
              },
              {
                step: "02",
                title: "Make your first request",
                color: "emerald",
                content: "Use curl or any HTTP client to call the API. Pass your key in the Authorization header:",
                code: `curl -X GET "https://api.vastraveda.io/v1/clothing" \\\n  -H "Authorization: Bearer vv_live_sk_a1b2c3d4e5f6" \\\n  -H "Accept: application/json"`,
              },
              {
                step: "03",
                title: "Filter and search",
                color: "violet",
                content: "Use query parameters to filter results by fabric, tag, or free-text search:",
                code: `# Filter by fabric\ncurl ".../v1/clothing?fabric=silk&limit=5"\n\n# Full-text search\ncurl ".../v1/search?q=banarasi"`,
              },
              {
                step: "04",
                title: "Submit new entries",
                color: "amber",
                content: "POST new clothing items to the catalogue using JSON body:",
                code: `curl -X POST "https://api.vastraveda.io/v1/clothing" \\\n  -H "Authorization: Bearer YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "name": "Mysore Silk Saree",\n    "fabric": "Pure Silk",\n    "origin": "Mysore, Karnataka",\n    "tags": ["silk", "south-indian"]\n  }'`,
              },
              {
                step: "05",
                title: "Handle errors",
                color: "rose",
                content: "All errors return a consistent JSON structure. Always check the success field:",
                code: `// Error response\n{\n  "success": false,\n  "error": "Item not found",\n  "code": 404\n}`,
              },
            ].map(({ step, title, color, content, code }) => {
              const colorMap = {
                cyan: "border-cyan-800/40 bg-cyan-950/20 text-cyan-300",
                emerald: "border-emerald-800/40 bg-emerald-950/20 text-emerald-300",
                violet: "border-violet-800/40 bg-violet-950/20 text-violet-300",
                amber: "border-amber-800/40 bg-amber-950/20 text-amber-300",
                rose: "border-rose-800/40 bg-rose-950/20 text-rose-300",
              }
              return (
                <div key={step} className={`border rounded-2xl p-5 ${colorMap[color]}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl font-black opacity-40">{step}</span>
                    <h3 className="text-sm font-semibold">{title}</h3>
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">{content}</p>
                  {code && (
                    <div className="bg-[#0d1117] rounded-xl p-4 relative group">
                      <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap">{code}</pre>
                      <button
                        onClick={() => navigator.clipboard.writeText(code)}
                        className="absolute top-2 right-2 text-xs text-zinc-500 hover:text-zinc-200 bg-zinc-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              )
            })}

            {/* SDK hint */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">SDK Support (Planned)</p>
              <div className="flex gap-2 flex-wrap">
                {["JavaScript / TypeScript", "Python", "Go", "Java", "Ruby"].map(s => (
                  <span key={s} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-lg">{s}</span>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-2">Official SDKs coming soon. Community wrappers welcome!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
