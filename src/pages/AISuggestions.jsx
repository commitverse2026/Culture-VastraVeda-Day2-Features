import { useState } from "react"

const OUTFITS = [
  { id: 1, name: "Royal Kanjivaram Silk Saree", tags: ["saree","silk","wedding","south-india","formal"], fabric: "Silk", occasion: "Wedding", region: "South India", color: "Red", style: "Traditional", emoji: "🥻" },
  { id: 2, name: "Banarasi Brocade Lehenga", tags: ["lehenga","brocade","wedding","north-india","formal"], fabric: "Brocade", occasion: "Wedding", region: "North India", color: "Maroon", style: "Traditional", emoji: "👘" },
  { id: 3, name: "Chanderi Cotton Kurta Set", tags: ["kurta","cotton","casual","madhya-pradesh","daily"], fabric: "Cotton", occasion: "Casual", region: "Madhya Pradesh", color: "White", style: "Fusion", emoji: "👕" },
  { id: 4, name: "Bandhani Dupatta with Ghagra", tags: ["ghagra","bandhani","festival","rajasthan","festive"], fabric: "Cotton", occasion: "Festival", region: "Rajasthan", color: "Yellow", style: "Traditional", emoji: "🎨" },
  { id: 5, name: "Kerala Kasavu Saree", tags: ["saree","cotton","festival","south-india","formal"], fabric: "Cotton", occasion: "Festival", region: "South India", color: "White", style: "Traditional", emoji: "🥻" },
  { id: 6, name: "Phulkari Embroidered Salwar Suit", tags: ["salwar","embroidery","festival","punjab","festive"], fabric: "Silk", occasion: "Festival", region: "Punjab", color: "Multicolor", style: "Traditional", emoji: "🌸" },
  { id: 7, name: "Ikat Woven Kurta", tags: ["kurta","ikat","casual","odisha","daily"], fabric: "Cotton", occasion: "Casual", region: "Odisha", color: "Blue", style: "Fusion", emoji: "👔" },
  { id: 8, name: "Patola Silk Saree", tags: ["saree","silk","wedding","gujarat","formal"], fabric: "Silk", occasion: "Wedding", region: "Gujarat", color: "Red", style: "Traditional", emoji: "🥻" },
  { id: 9, name: "Khadi Nehru Jacket Set", tags: ["jacket","khadi","formal","national","office"], fabric: "Khadi", occasion: "Formal", region: "Pan India", color: "Beige", style: "Heritage", emoji: "🧥" },
  { id: 10, name: "Pochampally Cotton Dress", tags: ["dress","cotton","casual","telangana","daily"], fabric: "Cotton", occasion: "Casual", region: "Telangana", color: "Green", style: "Fusion", emoji: "👗" },
]

function computeSimilarity(a, b) {
  if (a.id === b.id) return 0
  const setA = new Set(a.tags)
  const setB = new Set(b.tags)
  const intersection = [...setA].filter(t => setB.has(t)).length
  const union = new Set([...setA, ...setB]).size
  const tagScore = union > 0 ? intersection / union : 0
  const occasionScore = a.occasion === b.occasion ? 1 : 0
  const fabricScore = a.fabric === b.fabric ? 1 : 0
  const styleScore = a.style === b.style ? 1 : 0
  const regionScore = a.region === b.region ? 1 : 0
  const score = tagScore * 0.40 + occasionScore * 0.25 + fabricScore * 0.20 + styleScore * 0.10 + regionScore * 0.05
  return Math.round(score * 100)
}

function getRankedSuggestions(selected) {
  return OUTFITS
    .filter(o => o.id !== selected.id)
    .map(o => ({ ...o, score: computeSimilarity(selected, o) }))
    .sort((a, b) => b.score - a.score)
}

export default function AISuggestions() {
  const [selected, setSelected] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [filterOccasion, setFilterOccasion] = useState("All")

  const suggestions = selected ? getRankedSuggestions(selected) : []
  const occasions = ["All", ...new Set(OUTFITS.map(o => o.occasion))]
  const filteredOutfits = filterOccasion === "All" ? OUTFITS : OUTFITS.filter(o => o.occasion === filterOccasion)
  const topSuggestions = showAll ? suggestions : suggestions.slice(0, 3)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", padding: "16px 16px 80px" }}>
      <div style={{ maxWidth: "672px", margin: "0 auto" }}>

        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em" }}>Feature 13</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            <span style={{ fontSize: "28px" }}>✨</span>
            <h1 style={{ fontSize: "22px", fontWeight: 600, margin: 0 }}>AI Outfit Suggestions</h1>
          </div>
          <p style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "8px" }}>
            Select an outfit to get ranked recommendations based on fabric, occasion, region, and style.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
          {occasions.map(occ => (
            <button
              key={occ}
              onClick={() => setFilterOccasion(occ)}
              style={{
                fontSize: "12px", padding: "4px 12px", borderRadius: "9999px", cursor: "pointer",
                border: filterOccasion === occ ? "1px solid #d97706" : "1px solid #3f3f46",
                backgroundColor: filterOccasion === occ ? "rgba(120,53,15,0.4)" : "transparent",
                color: filterOccasion === occ ? "#fcd34d" : "#a1a1aa",
              }}
            >
              {occ}
            </button>
          ))}
        </div>

        <section style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
            Choose an outfit
          </p>
          <div style={{ display: "grid", gap: "8px" }}>
            {filteredOutfits.map(outfit => (
              <button
                key={outfit.id}
                onClick={() => { setSelected(outfit); setShowAll(false) }}
                style={{
                  width: "100%", textAlign: "left", borderRadius: "12px", padding: "16px",
                  border: selected && selected.id === outfit.id ? "1px solid #d97706" : "1px solid #27272a",
                  backgroundColor: selected && selected.id === outfit.id ? "rgba(120,53,15,0.2)" : "#18181b",
                  cursor: "pointer", transition: "border-color 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ fontSize: "28px" }}>{outfit.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#fff", margin: "0 0 2px" }}>{outfit.name}</p>
                    <p style={{ fontSize: "12px", color: "#71717a", margin: "0 0 6px" }}>{outfit.region} · {outfit.fabric}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {outfit.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#27272a", color: "#a1a1aa" }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selected && selected.id === outfit.id && (
                    <span style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 700, whiteSpace: "nowrap" }}>Selected</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {selected && (
          <section>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <p style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Similar Outfits</p>
                <p style={{ fontSize: "13px", color: "#d4d4d8", marginTop: "4px" }}>
                  Ranked by similarity to <span style={{ color: "#fbbf24", fontWeight: 600 }}>{selected.name}</span>
                </p>
              </div>
              <span style={{ fontSize: "12px", color: "#71717a" }}>{suggestions.length} results</span>
            </div>

            <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#71717a", marginBottom: "16px", flexWrap: "wrap" }}>
              <span>🟢 ≥70% High match</span>
              <span>🟡 40–69% Medium</span>
              <span>⚫ &lt;40% Low</span>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              {topSuggestions.map((outfit, i) => {
                const barColor = outfit.score >= 70 ? "#22c55e" : outfit.score >= 40 ? "#eab308" : "#52525b"
                const badgeColor = outfit.score >= 70 ? { bg: "rgba(20,83,45,0.8)", text: "#86efac", border: "#166534" }
                  : outfit.score >= 40 ? { bg: "rgba(113,63,18,0.8)", text: "#fde68a", border: "#92400e" }
                  : { bg: "#27272a", text: "#a1a1aa", border: "#3f3f46" }
                return (
                  <div key={outfit.id} style={{ borderRadius: "12px", border: "1px solid #27272a", backgroundColor: "#18181b", padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <span style={{ fontSize: "28px" }}>{outfit.emoji}</span>
                        <span style={{
                          position: "absolute", top: "-4px", left: "-4px", width: "16px", height: "16px",
                          borderRadius: "9999px", backgroundColor: "#d97706", fontSize: "9px", fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff"
                        }}>{i + 1}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                          <p style={{ fontSize: "14px", fontWeight: 500, color: "#fff", margin: 0 }}>{outfit.name}</p>
                          <span style={{
                            fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px",
                            border: `1px solid ${badgeColor.border}`, backgroundColor: badgeColor.bg, color: badgeColor.text,
                            whiteSpace: "nowrap"
                          }}>{outfit.score}% match</span>
                        </div>
                        <p style={{ fontSize: "12px", color: "#71717a", margin: "4px 0 0" }}>{outfit.region} · {outfit.fabric} · {outfit.occasion}</p>
                        <div style={{ width: "100%", backgroundColor: "#27272a", borderRadius: "9999px", height: "4px", marginTop: "8px" }}>
                          <div style={{ height: "4px", borderRadius: "9999px", backgroundColor: barColor, width: `${outfit.score}%`, transition: "width 0.7s" }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "10px", paddingLeft: "40px" }}>
                      {outfit.tags.map(tag => (
                        <span key={tag} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#27272a", color: "#a1a1aa" }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {suggestions.length > 3 && (
              <button
                onClick={() => setShowAll(v => !v)}
                style={{
                  width: "100%", marginTop: "16px", padding: "10px", fontSize: "13px", color: "#a1a1aa",
                  border: "1px solid #27272a", borderRadius: "12px", backgroundColor: "transparent",
                  cursor: "pointer",
                }}
              >
                {showAll ? "Show less" : `Show all ${suggestions.length} results`}
              </button>
            )}
          </section>
        )}

        {!selected && (
          <div style={{
            textAlign: "center", color: "#52525b", fontSize: "14px", padding: "48px 16px",
            border: "1px dashed #27272a", borderRadius: "12px"
          }}>
            ✨ Select an outfit above to see AI-powered suggestions
          </div>
        )}
      </div>
    </div>
  )
}