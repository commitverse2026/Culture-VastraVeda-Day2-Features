import { useState } from "react"

const VALID_KEY = "vv_live_demo1234"

const MOCK_DB = {
  outfits: [
    { id: 1, name: "Royal Kanjivaram Silk Saree", fabric: "Silk", occasion: "Wedding", region: "South India", style: "Traditional", tags: ["saree","silk","wedding"] },
    { id: 2, name: "Banarasi Brocade Lehenga", fabric: "Brocade", occasion: "Wedding", region: "North India", style: "Traditional", tags: ["lehenga","brocade","wedding"] },
    { id: 3, name: "Chanderi Cotton Kurta Set", fabric: "Cotton", occasion: "Casual", region: "Madhya Pradesh", style: "Fusion", tags: ["kurta","cotton","casual"] },
    { id: 4, name: "Bandhani Dupatta with Ghagra", fabric: "Cotton", occasion: "Festival", region: "Rajasthan", style: "Traditional", tags: ["ghagra","bandhani","festival"] },
    { id: 5, name: "Kerala Kasavu Saree", fabric: "Cotton", occasion: "Festival", region: "South India", style: "Traditional", tags: ["saree","cotton","festival"] },
  ],
  fabrics: [
    { id: 1, name: "Silk", origin: "Karnataka", properties: ["lustrous","smooth","durable"], care: "Dry clean only" },
    { id: 2, name: "Cotton", origin: "Pan India", properties: ["breathable","soft","versatile"], care: "Machine wash cold" },
    { id: 3, name: "Brocade", origin: "Varanasi", properties: ["heavy","decorative","stiff"], care: "Dry clean only" },
    { id: 4, name: "Khadi", origin: "Pan India", properties: ["handspun","eco-friendly","textured"], care: "Hand wash only" },
  ],
}

function mockFetch(endpoint, apiKey, params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!apiKey || apiKey !== VALID_KEY) {
        resolve({ status: 401, body: { error: "Unauthorized", message: "Invalid or missing API key." } })
        return
      }
      if (endpoint === "GET /outfits") {
        let data = [...MOCK_DB.outfits]
        if (params.occasion) data = data.filter(o => o.occasion.toLowerCase() === params.occasion.toLowerCase())
        if (params.fabric) data = data.filter(o => o.fabric.toLowerCase() === params.fabric.toLowerCase())
        resolve({ status: 200, body: { success: true, count: data.length, data } })
        return
      }
      const outfitMatch = endpoint.match(/^GET \/outfits\/(\d+)$/)
      if (outfitMatch) {
        const item = MOCK_DB.outfits.find(o => o.id === Number(outfitMatch[1]))
        if (!item) resolve({ status: 404, body: { error: "Not Found", message: "Outfit not found." } })
        else resolve({ status: 200, body: { success: true, data: item } })
        return
      }
      if (endpoint === "GET /fabrics") {
        resolve({ status: 200, body: { success: true, count: MOCK_DB.fabrics.length, data: MOCK_DB.fabrics } })
        return
      }
      const fabricMatch = endpoint.match(/^GET \/fabrics\/(\d+)$/)
      if (fabricMatch) {
        const item = MOCK_DB.fabrics.find(f => f.id === Number(fabricMatch[1]))
        if (!item) resolve({ status: 404, body: { error: "Not Found", message: "Fabric not found." } })
        else resolve({ status: 200, body: { success: true, data: item } })
        return
      }
      resolve({ status: 404, body: { error: "Not Found", message: "Endpoint does not exist." } })
    }, 600)
  })
}

const ENDPOINTS = [
  {
    method: "GET", path: "/outfits", tag: "Outfits",
    description: "Returns all outfits. Filter by occasion or fabric using query params.",
    params: [
      { name: "occasion", type: "string", required: false, description: "e.g. Wedding, Festival, Casual" },
      { name: "fabric", type: "string", required: false, description: "e.g. Silk, Cotton" },
    ],
    example: { success: true, count: 1, data: [{ id: 1, name: "Royal Kanjivaram Silk Saree", fabric: "Silk", occasion: "Wedding" }] },
    inputs: [
      { key: "occasion", placeholder: "e.g. Wedding" },
      { key: "fabric", placeholder: "e.g. Silk" },
    ],
    getEndpoint: (p) => "GET /outfits",
    getParams: (p) => ({ occasion: p.occasion || "", fabric: p.fabric || "" }),
  },
  {
    method: "GET", path: "/outfits/:id", tag: "Outfits",
    description: "Returns a single outfit by ID (1–5).",
    params: [{ name: "id", type: "integer", required: true, description: "Outfit ID" }],
    example: { success: true, data: { id: 1, name: "Royal Kanjivaram Silk Saree", fabric: "Silk", occasion: "Wedding" } },
    inputs: [{ key: "id", placeholder: "e.g. 1" }],
    getEndpoint: (p) => "GET /outfits/" + (p.id || "1"),
    getParams: () => ({}),
  },
  {
    method: "GET", path: "/fabrics", tag: "Fabrics",
    description: "Returns all fabric types with properties and care instructions.",
    params: [],
    example: { success: true, count: 2, data: [{ id: 1, name: "Silk", origin: "Karnataka" }] },
    inputs: [],
    getEndpoint: () => "GET /fabrics",
    getParams: () => ({}),
  },
  {
    method: "GET", path: "/fabrics/:id", tag: "Fabrics",
    description: "Returns a single fabric by ID (1–4).",
    params: [{ name: "id", type: "integer", required: true, description: "Fabric ID" }],
    example: { success: true, data: { id: 1, name: "Silk", origin: "Karnataka", care: "Dry clean only" } },
    inputs: [{ key: "id", placeholder: "e.g. 2" }],
    getEndpoint: (p) => "GET /fabrics/" + (p.id || "1"),
    getParams: () => ({}),
  },
]

function EndpointCard({ ep, apiKey }) {
  const [open, setOpen] = useState(false)
  const [inputs, setInputs] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function send() {
    setLoading(true)
    setResult(null)
    const res = await mockFetch(ep.getEndpoint(inputs), apiKey, ep.getParams(inputs))
    setResult(res)
    setLoading(false)
  }

  const statusColor = result
    ? result.status === 200 ? "#86efac" : result.status === 401 ? "#fcd34d" : "#fca5a5"
    : "#fff"

  const statusBg = result
    ? result.status === 200 ? "rgba(20,83,45,0.8)" : result.status === 401 ? "rgba(113,63,18,0.8)" : "rgba(127,29,29,0.8)"
    : "#27272a"

  return (
    <div style={{ border: open ? "1px solid #d97706" : "1px solid #27272a", borderRadius: "12px", marginBottom: "10px", backgroundColor: "#0a0a0a", overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", cursor: "pointer", userSelect: "none" }}>
        <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, backgroundColor: "#1e3a5f", color: "#60a5fa", border: "1px solid #2563eb" }}>
          {ep.method}
        </span>
        <span style={{ fontSize: "13px", color: "#e4e4e7", flex: 1, fontFamily: "monospace" }}>{ep.path}</span>
        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "9999px", backgroundColor: ep.tag === "Outfits" ? "rgba(30,58,95,0.6)" : "rgba(20,83,45,0.5)", color: ep.tag === "Outfits" ? "#93c5fd" : "#86efac", border: ep.tag === "Outfits" ? "1px solid #1e40af" : "1px solid #166534" }}>
          {ep.tag}
        </span>
        <span style={{ color: "#52525b", fontSize: "11px", marginLeft: "6px" }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #27272a" }}>
          <p style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "12px" }}>{ep.description}</p>

          {ep.params.length > 0 && (
            <div style={{ marginTop: "14px" }}>
              <p style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Parameters</p>
              <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Name","Type","Required","Description"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "4px 8px", borderBottom: "1px solid #27272a", color: "#52525b", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ep.params.map(p => (
                    <tr key={p.name}>
                      <td style={{ padding: "6px 8px", color: "#fbbf24", fontFamily: "monospace" }}>{p.name}</td>
                      <td style={{ padding: "6px 8px", color: "#818cf8" }}>{p.type}</td>
                      <td style={{ padding: "6px 8px", color: p.required ? "#f87171" : "#52525b" }}>{p.required ? "Yes" : "No"}</td>
                      <td style={{ padding: "6px 8px", color: "#d4d4d8" }}>{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: "14px" }}>
            <p style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Example Response</p>
            <pre style={{ backgroundColor: "#111", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", fontSize: "11px", color: "#86efac", overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 }}>
              {JSON.stringify(ep.example, null, 2)}
            </pre>
          </div>

          <div style={{ marginTop: "14px" }}>
            <p style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Try It</p>
            {ep.inputs.map(inp => (
              <div key={inp.key} style={{ marginBottom: "8px" }}>
                <label style={{ fontSize: "11px", color: "#71717a", display: "block", marginBottom: "4px" }}>{inp.key}</label>
                <input
                  placeholder={inp.placeholder}
                  value={inputs[inp.key] || ""}
                  onChange={e => setInputs(prev => ({ ...prev, [inp.key]: e.target.value }))}
                  style={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "6px", color: "#fff", fontSize: "12px", padding: "6px 10px", width: "100%", boxSizing: "border-box", outline: "none", fontFamily: "monospace" }}
                />
              </div>
            ))}
            <button
              onClick={send}
              disabled={loading}
              style={{ backgroundColor: "#d97706", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 18px", fontSize: "13px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: "6px", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Sending..." : "▶ Send Request"}
            </button>

            {result && (
              <div style={{ marginTop: "14px" }}>
                <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, marginBottom: "8px", backgroundColor: statusBg, color: statusColor, border: "1px solid " + statusColor }}>
                  {result.status} {result.status === 200 ? "OK" : result.status === 401 ? "Unauthorized" : "Not Found"}
                </span>
                <pre style={{ backgroundColor: "#111", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", fontSize: "11px", color: statusColor, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 }}>
                  {JSON.stringify(result.body, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OpenAPI() {
  const [apiKey, setApiKey] = useState("")
  const [keyVisible, setKeyVisible] = useState(false)
  const [activeTag, setActiveTag] = useState("All")

  const tags = ["All", "Outfits", "Fabrics"]
  const filtered = activeTag === "All" ? ENDPOINTS : ENDPOINTS.filter(e => e.tag === activeTag)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", padding: "16px 16px 80px", fontFamily: "monospace" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        <div style={{ marginBottom: "28px" }}>
          <p style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Feature 15</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            <span style={{ fontSize: "28px" }}>🔌</span>
            <h1 style={{ fontSize: "22px", fontWeight: 600, margin: 0 }}>VastraVeda Open API</h1>
            <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "9999px", backgroundColor: "rgba(20,83,45,0.6)", color: "#86efac", border: "1px solid #166534", marginLeft: "4px" }}>v1.0</span>
          </div>
          <p style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "8px" }}>Public REST API for VastraVeda clothing and fabric data. All requests require an API key.</p>
          <p style={{ fontSize: "12px", color: "#52525b", margin: "4px 0 0" }}>Base URL: <span style={{ color: "#fbbf24" }}>https://api.vastraveda.in/v1</span></p>
        </div>

        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #27272a", borderRadius: "10px", padding: "14px", marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>x-api-key</p>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type={keyVisible ? "text" : "password"}
              placeholder="Enter your API key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              style={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "6px", color: "#fff", fontSize: "12px", padding: "6px 10px", flex: 1, outline: "none", fontFamily: "monospace", letterSpacing: keyVisible ? "normal" : "3px" }}
            />
            <button onClick={() => setKeyVisible(v => !v)} style={{ backgroundColor: "#27272a", border: "1px solid #3f3f46", borderRadius: "6px", color: "#a1a1aa", padding: "6px 10px", cursor: "pointer", fontSize: "12px" }}>
              {keyVisible ? "Hide" : "Show"}
            </button>
            <button onClick={() => setApiKey(VALID_KEY)} style={{ backgroundColor: "#1e3a5f", border: "1px solid #2563eb", borderRadius: "6px", color: "#93c5fd", padding: "6px 10px", cursor: "pointer", fontSize: "12px", whiteSpace: "nowrap" }}>
              Use Demo Key
            </button>
          </div>
          {apiKey === VALID_KEY && <p style={{ fontSize: "11px", color: "#86efac", margin: "6px 0 0" }}>✓ Valid demo key applied — all endpoints unlocked</p>}
          {apiKey && apiKey !== VALID_KEY && <p style={{ fontSize: "11px", color: "#f87171", margin: "6px 0 0" }}>✗ Invalid key — requests will return 401</p>}
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {tags.map(t => (
            <button key={t} onClick={() => setActiveTag(t)} style={{ fontSize: "12px", padding: "4px 14px", borderRadius: "9999px", cursor: "pointer", border: activeTag === t ? "1px solid #d97706" : "1px solid #3f3f46", backgroundColor: activeTag === t ? "rgba(120,53,15,0.4)" : "transparent", color: activeTag === t ? "#fcd34d" : "#a1a1aa" }}>
              {t}
            </button>
          ))}
        </div>

        {filtered.map((ep, i) => (
          <EndpointCard key={i} ep={ep} apiKey={apiKey} />
        ))}

        <div style={{ marginTop: "24px", padding: "14px", backgroundColor: "#0a0a0a", border: "1px solid #27272a", borderRadius: "10px", fontSize: "12px", color: "#71717a" }}>
          <p style={{ margin: "0 0 6px", color: "#a1a1aa", fontWeight: 600 }}>🔐 Authentication</p>
          <p style={{ margin: 0 }}>All endpoints require the <span style={{ color: "#fbbf24" }}>x-api-key</span> header. Demo key: <span style={{ color: "#86efac" }}>{VALID_KEY}</span></p>
        </div>

      </div>
    </div>
  )
}