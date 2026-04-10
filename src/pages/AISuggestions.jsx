import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CLOTHING = [
  { id: "c001", name: "Banarasi Silk Saree", category: "Saree", fabric: "Pure Silk", color: "Deep Crimson", origin: "Varanasi, UP", era: "19th Century", condition: "Excellent", tags: ["silk", "bridal", "zari", "traditional"] },
  { id: "c002", name: "Phulkari Dupatta", category: "Scarf/Dupatta", fabric: "Cotton", color: "Saffron Orange", origin: "Punjab", era: "Early 20th Century", condition: "Good", tags: ["embroidery", "phulkari", "punjab", "cotton"] },
  { id: "c003", name: "Kanjeevaram Pattu", category: "Saree", fabric: "Pure Silk", color: "Royal Blue with Gold", origin: "Kanchipuram, TN", era: "Modern (2010s)", condition: "Mint", tags: ["silk", "south-indian", "temple-border", "kanjeevaram"] },
  { id: "c004", name: "Chanderi Suit", category: "Salwar Suit", fabric: "Chanderi Cotton", color: "Ivory White", origin: "Chanderi, MP", era: "Contemporary", condition: "Excellent", tags: ["chanderi", "fusion", "lightweight", "cotton"] },
  { id: "c005", name: "Bandhani Ghagra", category: "Skirt/Ghagra", fabric: "Georgette", color: "Multi-color Tie-dye", origin: "Rajasthan", era: "Traditional", condition: "Good", tags: ["bandhani", "rajasthani", "tie-dye", "festive"] },
  { id: "c006", name: "Mysore Silk Saree", category: "Saree", fabric: "Pure Silk", color: "Emerald Green", origin: "Mysore, Karnataka", era: "Mid 20th Century", condition: "Excellent", tags: ["silk", "south-indian", "minimalist", "traditional"] },
  { id: "c007", name: "Kalamkari Lehenga", category: "Skirt/Ghagra", fabric: "Cotton", color: "Earthy Red/Brown", origin: "Andhra Pradesh", era: "Contemporary", condition: "New", tags: ["kalamkari", "hand-painted", "cotton", "festive", "south-indian"] },
  { id: "c008", name: "Patan Patola Saree", category: "Saree", fabric: "Pure Silk", color: "Crimson & Yellow", origin: "Gujarat", era: "19th Century", condition: "Good", tags: ["silk", "double-ikat", "traditional", "rare", "bridal"] },
]

// ─── Similarity Engine ────────────────────────────────────────────────────────
function computeSimilarity(itemA, itemB) {
  let score = 0
  const reasons = []

  // Feature weights
  const WEIGHT_TAG = 2
  const WEIGHT_FABRIC = 3
  const WEIGHT_CATEGORY = 4
  const WEIGHT_ORIGIN = 2

  // 1. Tags Match
  const sharedTags = itemA.tags.filter(t => itemB.tags.includes(t))
  if (sharedTags.length > 0) {
    score += sharedTags.length * WEIGHT_TAG
    reasons.push(`${sharedTags.length} shared tag${sharedTags.length > 1 ? "s" : ""} (${sharedTags.join(", ")})`)
  }

  // 2. Fabric Match
  if (itemA.fabric === itemB.fabric) {
    score += WEIGHT_FABRIC
    reasons.push(`Matching fabric (${itemA.fabric})`)
  }

  // 3. Category Match
  if (itemA.category === itemB.category) {
    score += WEIGHT_CATEGORY
    reasons.push(`Same category (${itemA.category})`)
  }

  // 4. Origin Match
  // Simple check for shared broad origin (e.g. state matching conceptually, or exact string match)
  if (itemA.origin === itemB.origin) {
    score += WEIGHT_ORIGIN
    reasons.push(`Same origin (${itemA.origin})`)
  }

  return { score, reasons }
}

function getRecommendations(targetItem, allItems) {
  const maxPossibleScore = (targetItem.tags.length * 2) + 3 + 4 + 2

  const scored = allItems
    .filter(item => item.id !== targetItem.id)
    .map(item => {
      const { score, reasons } = computeSimilarity(targetItem, item)
      const matchPercentage = Math.min(100, Math.round((score / maxPossibleScore) * 100))
      return { item, score, matchPercentage, reasons }
    })

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score)
  
  // Return top 3 meaningful suggestions
  return scored.slice(0, 3)
}

// ─── UI Components ────────────────────────────────────────────────────────────
function Badge({ text, color = "zinc" }) {
  const colorMap = {
    zinc: "bg-zinc-800 text-zinc-300",
    amber: "bg-amber-900/50 text-amber-300 border border-amber-700/40",
    emerald: "bg-emerald-900/50 text-emerald-300 border border-emerald-700/40",
    rose: "bg-rose-900/50 text-rose-300 border border-rose-700/40",
    indigo: "bg-indigo-900/50 text-indigo-300 border border-indigo-700/40",
    cyan: "bg-cyan-900/50 text-cyan-300 border border-cyan-700/40",
    violet: "bg-violet-900/50 text-violet-300 border border-violet-700/40",
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorMap[color]}`}>
      {text}
    </span>
  )
}

function ItemCard({ item, onClick, isSelected, compact = false }) {
  return (
    <div
      onClick={() => onClick && onClick(item.id)}
      className={`rounded-2xl border p-4 transition-all duration-200 
        ${onClick ? "cursor-pointer" : ""}
        ${isSelected 
          ? "border-amber-500 bg-amber-950/20 shadow-lg shadow-amber-900/10" 
          : onClick 
            ? "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-800/80" 
            : "border-zinc-800 bg-zinc-900/60"}`}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className={`${compact ? "text-sm" : "text-base"} font-bold text-zinc-100 line-clamp-1`}>{item.name}</h3>
        {!compact && <Badge text={item.category} color="violet" />}
      </div>
      
      <div className="flex flex-wrap gap-1.5 mb-2">
        {compact && <Badge text={item.category} color="violet" />}
        <Badge text={item.fabric} color="cyan" />
        <Badge text={item.origin} color="zinc" />
      </div>

      {!compact && (
        <div className="flex gap-1.5 flex-wrap mt-3">
          {item.tags.map(t => (
            <Badge key={t} text={`#${t}`} color="zinc" />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AISuggestions() {
  const nav = useNavigate()
  const [selectedId, setSelectedId] = useState(MOCK_CLOTHING[0].id)
  
  const targetItem = useMemo(() => MOCK_CLOTHING.find(i => i.id === selectedId), [selectedId])
  const recommendations = useMemo(() => getRecommendations(targetItem, MOCK_CLOTHING), [targetItem])

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
          <span className="text-2xl">✨</span>
          <div>
            <p className="text-xs text-zinc-500">Feature 13</p>
            <h1 className="text-xl font-bold tracking-tight">AI Outfit Suggestions</h1>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-rose-900 text-rose-300">Hard</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-900/50 text-amber-300 border border-amber-700/40">✨ AI Powered</span>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex h-[calc(100vh-73px)] overflow-hidden">
        
        {/* Left Sidebar - Item Inventory */}
        <aside className="w-80 shrink-0 border-r border-zinc-800 p-4 overflow-y-auto space-y-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Catalogue Inventory</p>
            <p className="text-xs text-zinc-400">Select an item to see AI suggestions</p>
          </div>
          
          <div className="space-y-3">
            {MOCK_CLOTHING.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                isSelected={selectedId === item.id} 
                onClick={setSelectedId} 
                compact={true}
              />
            ))}
          </div>
        </aside>

        {/* Main Content - Target & Suggestions */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Target Display */}
            <section className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-amber-500/20 text-amber-500 rounded-xl">🎯</span>
                <h2 className="text-lg font-bold">Target Outfit</h2>
              </div>
              <div className="bg-zinc-900/40 border-2 border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <h3 className="text-2xl font-bold mb-4">{targetItem.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Category", val: targetItem.category },
                    { label: "Fabric", val: targetItem.fabric },
                    { label: "Origin", val: targetItem.origin },
                    { label: "Era", val: targetItem.era },
                  ].map(f => (
                    <div key={f.label} className="bg-[#09090b] border border-zinc-800 rounded-xl p-3">
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{f.label}</p>
                      <p className="text-sm font-medium text-amber-50">{f.val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {targetItem.tags.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium bg-zinc-800 text-zinc-300">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* AI Network visualization connector line (decorative) */}
            <div className="hidden md:flex justify-center -my-6 relative z-0">
              <div className="h-12 border-l-2 border-dashed border-amber-900/60"></div>
            </div>

            {/* Recommendations Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-emerald-500/20 text-emerald-500 rounded-xl animate-pulse">✨</span>
                <div>
                  <h2 className="text-lg font-bold">AI Recommended Matches</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Ranked by deep attribute similarity scoring</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {recommendations.map((rec, index) => {
                  const medalColors = ["bg-amber-400 text-amber-950", "bg-zinc-300 text-zinc-900", "bg-orange-400 text-orange-950"]
                  const borderColors = ["border-amber-500/40", "border-zinc-500/40", "border-orange-500/40"]
                  
                  return (
                    <div key={rec.item.id} className={`bg-zinc-900 border ${borderColors[index]} rounded-3xl p-5 flex flex-col hover:-translate-y-1 transition-transform duration-300`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${medalColors[index]} shadow-lg`}>
                          #{index + 1}
                        </span>
                        <div className="flex items-center gap-1.5 bg-[#09090b] px-2 py-1 rounded-lg border border-zinc-800">
                          <span className="text-xs font-bold text-emerald-400">{rec.matchPercentage}%</span>
                          <span className="text-[10px] text-zinc-500 uppercase">Match</span>
                        </div>
                      </div>

                      <h4 className="text-lg font-bold border-b border-zinc-800 pb-3 mb-3">{rec.item.name}</h4>
                      
                      {/* Reason badges */}
                      <div className="flex-1 space-y-2 mb-4">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Similarity Factors</p>
                        <div className="flex flex-col gap-1.5">
                          {rec.reasons.length > 0 ? rec.reasons.map((reason, i) => (
                            <div key={i} className="flex items-start gap-2 bg-[#09090b] border border-emerald-900/30 rounded-lg p-2">
                              <span className="text-emerald-500 text-xs mt-0.5">✓</span>
                              <span className="text-xs text-zinc-300 leading-tight">{reason}</span>
                            </div>
                          )) : (
                            <div className="flex items-center gap-2 bg-[#09090b] border border-zinc-800 rounded-lg p-2">
                              <span className="text-zinc-500 text-xs">−</span>
                              <span className="text-xs text-zinc-500">Low attribute overlap</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedId(rec.item.id)}
                        className="w-full py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold transition-colors"
                      >
                        Inspect Outfit
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
            
          </div>
        </main>
      </div>
    </div>
  )
}
