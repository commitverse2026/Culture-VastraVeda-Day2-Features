import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_ITEMS = [
  {
    id: "c001",
    name: "Banarasi Silk Saree",
    fabric: "Pure Silk",
    color: "Deep Crimson",
    origin: "Varanasi, UP",
    era: "19th Century",
    condition: "Excellent",
    description: "Hand-woven with gold zari work. Traditional bridal attire.",
    tags: "silk, bridal, zari, traditional",
  },
  {
    id: "c002",
    name: "Phulkari Dupatta",
    fabric: "Cotton",
    color: "Saffron Orange",
    origin: "Punjab",
    era: "Early 20th Century",
    condition: "Good",
    description: "Vibrant floral embroidery using silk floss on cotton base.",
    tags: "embroidery, phulkari, punjab, cotton",
  },
  {
    id: "c003",
    name: "Kanjeevaram Pattu",
    fabric: "Silk",
    color: "Royal Blue with Gold",
    origin: "Kanchipuram, TN",
    era: "Modern (2010s)",
    condition: "Mint",
    description: "Temple border design with contrast pallu. Wedding staple.",
    tags: "silk, south-indian, temple-border, kanjeevaram",
  },
]

// ─── Utilities ────────────────────────────────────────────────────────────────
function generateId() {
  return "v" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function nowLabel() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function buildVersion(data, label = "Manual edit") {
  return {
    versionId: generateId(),
    timestamp: nowLabel(),
    label,
    snapshot: { ...data },
  }
}

function initVersionedItem(item) {
  return {
    ...item,
    versions: [buildVersion(item, "Initial entry")],
  }
}

// ─── Diff engine (field-level) ─────────────────────────────────────────────
const FIELDS = [
  { key: "name", label: "Name" },
  { key: "fabric", label: "Fabric" },
  { key: "color", label: "Color" },
  { key: "origin", label: "Origin" },
  { key: "era", label: "Era" },
  { key: "condition", label: "Condition" },
  { key: "description", label: "Description" },
  { key: "tags", label: "Tags" },
]

function computeDiff(oldSnap, newSnap) {
  return FIELDS.map((f) => ({
    ...f,
    old: oldSnap[f.key] ?? "—",
    new: newSnap[f.key] ?? "—",
    changed: (oldSnap[f.key] ?? "") !== (newSnap[f.key] ?? ""),
  }))
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ text, color = "zinc" }) {
  const colorMap = {
    zinc: "bg-zinc-800 text-zinc-300",
    amber: "bg-amber-900/50 text-amber-300 border border-amber-700/40",
    emerald: "bg-emerald-900/50 text-emerald-300 border border-emerald-700/40",
    rose: "bg-rose-900/50 text-rose-300 border border-rose-700/40",
    indigo: "bg-indigo-900/50 text-indigo-300 border border-indigo-700/40",
    sky: "bg-sky-900/50 text-sky-300 border border-sky-700/40",
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorMap[color]}`}>
      {text}
    </span>
  )
}

function ClothingCard({ item, isSelected, onSelect }) {
  const latest = item.versions[item.versions.length - 1].snapshot
  const vcount = item.versions.length

  return (
    <button
      onClick={() => onSelect(item.id)}
      className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 group
        ${isSelected
          ? "border-violet-500 bg-violet-950/30 shadow-lg shadow-violet-900/20"
          : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
        }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-base font-semibold text-white leading-tight">{latest.name}</span>
        <span className="flex items-center gap-1 text-xs text-zinc-500 shrink-0 mt-0.5">
          <span className="text-violet-400">🕓</span>
          <span className="text-violet-300 font-medium">{vcount}</span> rev{vcount !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <Badge text={latest.fabric} color="sky" />
        <Badge text={latest.condition} color={latest.condition === "Excellent" || latest.condition === "Mint" ? "emerald" : "amber"} />
        <Badge text={latest.origin.split(",")[0]} />
      </div>
      <p className="text-xs text-zinc-500 mt-2 line-clamp-1">{latest.description}</p>
    </button>
  )
}

function EditForm({ data, onChange, onSave, onCancel }) {
  const [form, setForm] = useState({ ...data })

  function handle(key, val) {
    setForm((p) => ({ ...p, [key]: val }))
    onChange({ ...form, [key]: val })
  }

  const inputCls =
    "w-full bg-zinc-800/70 border border-zinc-700 text-sm text-white rounded-xl px-3 py-2 " +
    "focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition placeholder-zinc-600"

  const labelCls = "text-xs text-zinc-400 mb-1 block font-medium"

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "name", label: "Name", span: 2 },
          { key: "fabric", label: "Fabric" },
          { key: "color", label: "Color" },
          { key: "origin", label: "Origin" },
          { key: "era", label: "Era" },
          { key: "condition", label: "Condition" },
          { key: "tags", label: "Tags" },
        ].map(({ key, label, span }) => (
          <div key={key} className={span === 2 ? "col-span-2" : ""}>
            <label className={labelCls}>{label}</label>
            <input
              className={inputCls}
              value={form[key]}
              onChange={(e) => handle(key, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        ))}
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          className={inputCls + " resize-none h-20"}
          value={form.description}
          onChange={(e) => handle("description", e.target.value)}
          placeholder="Describe the clothing item..."
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave(form)}
          className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium py-2 rounded-xl transition-colors"
        >
          💾 Save Version
        </button>
        <button
          onClick={onCancel}
          className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function VersionTimeline({ versions, selectedIdx, onSelect }) {
  return (
    <div className="space-y-1.5">
      {[...versions].reverse().map((v, revIdx) => {
        const origIdx = versions.length - 1 - revIdx
        const isLatest = origIdx === versions.length - 1
        const isSelected = origIdx === selectedIdx
        return (
          <button
            key={v.versionId}
            onClick={() => onSelect(origIdx)}
            className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-150
              ${isSelected
                ? "border-violet-500 bg-violet-950/40"
                : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
              }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${isLatest ? "bg-emerald-400" : "bg-zinc-600"}`} />
                <span className="text-xs font-medium text-white truncate">{v.label}</span>
              </div>
              {isLatest && <Badge text="Latest" color="emerald" />}
            </div>
            <p className="text-xs text-zinc-500 mt-1 ml-4">{v.timestamp}</p>
          </button>
        )
      })}
    </div>
  )
}

function DiffRow({ field, old: oldVal, new: newVal, changed }) {
  return (
    <div className={`grid grid-cols-[120px_1fr_1fr] gap-2 py-2.5 px-3 rounded-xl text-xs transition-all
      ${changed ? "bg-amber-950/20 border border-amber-800/30" : "bg-zinc-900/40"}`}
    >
      <span className={`font-semibold ${changed ? "text-amber-300" : "text-zinc-400"}`}>
        {changed && "⚡"} {field}
      </span>
      <span className={`${changed ? "text-rose-300 line-through opacity-70" : "text-zinc-300"} break-words`}>
        {oldVal}
      </span>
      <span className={`${changed ? "text-emerald-300 font-medium" : "text-zinc-300"} break-words`}>
        {newVal}
      </span>
    </div>
  )
}

function DiffPanel({ versionA, versionB, labelA, labelB }) {
  if (!versionA || !versionB) return null
  const rows = computeDiff(versionA.snapshot, versionB.snapshot)
  const changedCount = rows.filter((r) => r.changed).length

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-[120px_1fr_1fr] gap-2 px-3 py-2">
        <span className="text-xxs text-zinc-500 text-xs">Field</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
          <span className="text-xs text-zinc-400 truncate">{labelA}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span className="text-xs text-zinc-400 truncate">{labelB}</span>
        </div>
      </div>
      <div className="space-y-1">
        {rows.map((r) => (
          <DiffRow key={r.key} field={r.label} old={r.old} new={r.new} changed={r.changed} />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800">
        <span className="text-xs text-zinc-500">Summary:</span>
        {changedCount === 0 ? (
          <Badge text="No changes" color="zinc" />
        ) : (
          <Badge text={`${changedCount} field${changedCount > 1 ? "s" : ""} changed`} color="amber" />
        )}
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ClothingVersionControl() {
  const nav = useNavigate()

  // State
  const [items, setItems] = useState(() => SEED_ITEMS.map(initVersionedItem))
  const [selectedId, setSelectedId] = useState(SEED_ITEMS[0].id)
  const [activeTab, setActiveTab] = useState("view") // view | edit | history | diff
  const [draftForm, setDraftForm] = useState(null)

  // Diff state — pick two versions to compare
  const [diffA, setDiffA] = useState(0)
  const [diffB, setDiffB] = useState(null)

  // Notification
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }, [])

  const selectedItem = items.find((i) => i.id === selectedId)
  const latestSnapshot = selectedItem.versions[selectedItem.versions.length - 1].snapshot

  function handleSelect(id) {
    setSelectedId(id)
    setActiveTab("view")
    setDiffA(items.find((i) => i.id === id).versions.length - 1)
    setDiffB(null)
  }

  function handleSave(form) {
    const newVersion = buildVersion(form, `Edited on ${nowLabel()}`)
    setItems((prev) =>
      prev.map((item) =>
        item.id === selectedId
          ? { ...item, ...form, versions: [...item.versions, newVersion] }
          : item
      )
    )
    setActiveTab("history")
    showToast("✅ New version saved successfully!")
  }

  function handleRollback(versionIdx) {
    const targetVersion = selectedItem.versions[versionIdx]
    const rollbackVersion = buildVersion(
      targetVersion.snapshot,
      `Rollback to: ${targetVersion.label}`
    )
    setItems((prev) =>
      prev.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              ...targetVersion.snapshot,
              versions: [...item.versions, rollbackVersion],
            }
          : item
      )
    )
    showToast("🔄 Rolled back to selected version!")
    setActiveTab("history")
  }

  const tabs = [
    { key: "view", label: "View", icon: "👁️" },
    { key: "edit", label: "Edit", icon: "✏️" },
    { key: "history", label: `History (${selectedItem.versions.length})`, icon: "🕓" },
    { key: "diff", label: "Diff", icon: "⚡" },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl text-sm font-medium shadow-2xl
            transition-all duration-300 animate-pulse
            ${toast.type === "success" ? "bg-emerald-900 border border-emerald-600 text-emerald-200" : "bg-rose-900 border border-rose-600 text-rose-200"}`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => nav("/")}
          className="text-sm text-zinc-400 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-xl transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🕓</span>
          <div>
            <p className="text-xs text-zinc-500">Feature 12</p>
            <h1 className="text-xl font-bold tracking-tight">Clothing Version Control</h1>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge text="Hard" color="rose" />
          <Badge text={`${items.reduce((s, i) => s + i.versions.length, 0)} total revisions`} color="indigo" />
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex h-[calc(100vh-73px)] overflow-hidden">

        {/* ── Left: Clothing List ── */}
        <aside className="w-72 shrink-0 border-r border-zinc-800 p-4 overflow-y-auto space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3 flex items-center justify-between">
            <span>Clothing Entries</span>
            <span className="text-zinc-600">{items.length} items</span>
          </p>
          {items.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onSelect={handleSelect}
            />
          ))}
          {/* Add new placeholder */}
          <button
            onClick={() => showToast("Use the Edit tab to create entries in a real implementation.", "info")}
            className="w-full text-left rounded-2xl border border-dashed border-zinc-700 p-4 text-zinc-600 text-sm hover:border-zinc-500 hover:text-zinc-400 transition-all"
          >
            + Add new entry…
          </button>
        </aside>

        {/* ── Right: Detail pane ── */}
        <main className="flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-zinc-800 px-6 pt-4 pb-0">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-t-xl border-b-2 transition-all duration-150 font-medium
                  ${activeTab === t.key
                    ? "border-violet-500 text-violet-300 bg-violet-950/20"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* ══ VIEW TAB ══════════════════════════════════ */}
            {activeTab === "view" && (
              <div className="max-w-2xl space-y-4">
                <div className="flex items-start gap-4">
                  {/* Icon block */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-800 to-indigo-900 flex items-center justify-center text-3xl shrink-0">
                    👘
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{latestSnapshot.name}</h2>
                    <p className="text-zinc-500 text-sm mt-1">{latestSnapshot.origin} · {latestSnapshot.era}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {latestSnapshot.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                        <Badge key={tag} text={tag} color="indigo" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detail grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Fabric", value: latestSnapshot.fabric },
                    { label: "Color", value: latestSnapshot.color },
                    { label: "Condition", value: latestSnapshot.condition },
                    { label: "Revisions", value: `${selectedItem.versions.length} saved` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-sm font-medium text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Description</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{latestSnapshot.description}</p>
                </div>

                <div className="bg-violet-950/20 border border-violet-800/30 rounded-2xl p-4">
                  <p className="text-xs text-violet-400 uppercase tracking-widest mb-2">Last revision</p>
                  <p className="text-sm text-zinc-300">
                    <span className="text-violet-300 font-medium">
                      {selectedItem.versions[selectedItem.versions.length - 1].label}
                    </span>
                    {" "}— {selectedItem.versions[selectedItem.versions.length - 1].timestamp}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("edit")}
                  className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  ✏️ Edit this entry
                </button>
              </div>
            )}

            {/* ══ EDIT TAB ══════════════════════════════════ */}
            {activeTab === "edit" && (
              <div className="max-w-xl">
                <div className="bg-amber-950/20 border border-amber-800/30 rounded-2xl p-3 mb-5 flex items-center gap-2">
                  <span>⚡</span>
                  <p className="text-xs text-amber-300">
                    Saving will create a <strong>new revision</strong>. The current version is preserved.
                  </p>
                </div>
                <EditForm
                  data={latestSnapshot}
                  onChange={setDraftForm}
                  onSave={handleSave}
                  onCancel={() => setActiveTab("view")}
                />
              </div>
            )}

            {/* ══ HISTORY TAB ═══════════════════════════════ */}
            {activeTab === "history" && (
              <div className="max-w-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Revision History</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {selectedItem.versions.length} revision{selectedItem.versions.length > 1 ? "s" : ""} for <span className="text-zinc-300">{latestSnapshot.name}</span>
                    </p>
                  </div>
                </div>

                <VersionTimeline
                  versions={selectedItem.versions}
                  selectedIdx={diffA}
                  onSelect={(idx) => {
                    setDiffA(idx)
                    // navigate to diff tab to show rollback button context
                  }}
                />

                {/* Rollback */}
                <div className="border-t border-zinc-800 pt-4">
                  <p className="text-xs text-zinc-500 mb-3">Selected revision — click to preview or rollback</p>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {selectedItem.versions[diffA]?.label}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {selectedItem.versions[diffA]?.timestamp}
                        </p>
                      </div>
                      {diffA !== selectedItem.versions.length - 1 && (
                        <button
                          onClick={() => handleRollback(diffA)}
                          className="flex items-center gap-1.5 text-xs font-medium bg-amber-800/40 hover:bg-amber-700/50 border border-amber-700/50 text-amber-300 px-3 py-1.5 rounded-xl transition-colors"
                        >
                          🔄 Rollback to this
                        </button>
                      )}
                      {diffA === selectedItem.versions.length - 1 && (
                        <Badge text="Current" color="emerald" />
                      )}
                    </div>

                    {/* Quick snapshot preview */}
                    <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                      {FIELDS.slice(0, 4).map((f) => (
                        <div key={f.key} className="flex gap-3 text-xs">
                          <span className="text-zinc-500 w-20 shrink-0">{f.label}</span>
                          <span className="text-zinc-300">{selectedItem.versions[diffA]?.snapshot[f.key]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => { setDiffB(diffA === selectedItem.versions.length - 1 ? Math.max(0, diffA - 1) : selectedItem.versions.length - 1); setActiveTab("diff") }}
                  className="text-sm text-violet-300 hover:text-violet-200 underline underline-offset-2"
                >
                  ⚡ Compare with another version →
                </button>
              </div>
            )}

            {/* ══ DIFF TAB ══════════════════════════════════ */}
            {activeTab === "diff" && (
              <div className="max-w-2xl space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Diff Viewer</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Compare any two revisions side-by-side</p>
                </div>

                {/* Version selectors */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Base", stateVal: diffA, setter: setDiffA, color: "rose" },
                    { label: "Compare", stateVal: diffB ?? selectedItem.versions.length - 1, setter: setDiffB, color: "emerald" },
                  ].map(({ label, stateVal, setter, color }) => (
                    <div key={label}>
                      <p className={`text-xs mb-1.5 font-medium ${color === "rose" ? "text-rose-400" : "text-emerald-400"}`}>
                        {color === "rose" ? "🔴" : "🟢"} {label} version
                      </p>
                      <select
                        value={stateVal}
                        onChange={(e) => setter(Number(e.target.value))}
                        className="w-full bg-zinc-800 border border-zinc-700 text-sm text-white rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500"
                      >
                        {selectedItem.versions.map((v, idx) => (
                          <option key={v.versionId} value={idx}>
                            v{idx + 1} — {v.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Diff result */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
                  <DiffPanel
                    versionA={selectedItem.versions[diffA]}
                    versionB={selectedItem.versions[diffB ?? selectedItem.versions.length - 1]}
                    labelA={`v${diffA + 1}: ${selectedItem.versions[diffA]?.label}`}
                    labelB={`v${(diffB ?? selectedItem.versions.length - 1) + 1}: ${selectedItem.versions[diffB ?? selectedItem.versions.length - 1]?.label}`}
                  />
                </div>

                {/* Rollback from diff */}
                {diffA !== selectedItem.versions.length - 1 && (
                  <div className="bg-amber-950/20 border border-amber-800/30 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-amber-300">Rollback to base version?</p>
                      <p className="text-xs text-zinc-500 mt-0.5">This will create a new revision restoring v{diffA + 1}</p>
                    </div>
                    <button
                      onClick={() => handleRollback(diffA)}
                      className="shrink-0 text-xs font-medium bg-amber-700/50 hover:bg-amber-600/60 border border-amber-600 text-amber-200 px-4 py-2 rounded-xl transition-colors"
                    >
                      🔄 Rollback
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
