import { useState } from "react"
import { useNavigate } from "react-router-dom"

const fabricData = {
  "Silk": [
    { name: "Satin", reason: "Similar sheen and smoothness, more affordable" },
    { name: "Charmeuse", reason: "Lightweight alternative with a soft drape" },
    { name: "Bamboo Fabric", reason: "Eco-friendly with similar softness" },
  ],
  "Cotton": [
    { name: "Linen", reason: "Breathable and lightweight, great for summer" },
    { name: "Modal", reason: "Softer feel, more moisture-wicking" },
    { name: "Bamboo Cotton", reason: "Sustainable and hypoallergenic" },
  ],
  "Wool": [
    { name: "Fleece", reason: "Lighter and more affordable warmth" },
    { name: "Cashmere Blend", reason: "Softer texture, premium feel" },
    { name: "Alpaca", reason: "Warmer than wool, less itchy" },
  ],
  "Velvet": [
    { name: "Velveteen", reason: "Cotton-based, easier to care for" },
    { name: "Crushed Velvet", reason: "Similar look with more texture variation" },
    { name: "Microfiber Suede", reason: "More durable, budget-friendly" },
  ],
  "Chiffon": [
    { name: "Georgette", reason: "Slightly heavier but same flowing quality" },
    { name: "Organza", reason: "Crisper feel with similar transparency" },
    { name: "Voile", reason: "Softer and more affordable sheer option" },
  ],
}

const fabrics = Object.keys(fabricData)

export default function Feature3Page() {
  const nav = useNavigate()
  const [selectedFabric, setSelectedFabric] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ original: "", substitute: "", reason: "" })
  const [suggestions, setSuggestions] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const openModal = (fabric) => {
    setSelectedFabric(fabric)
    setShowModal(true)
    setSubmitted(false)
    setForm({ original: fabric, substitute: "", reason: "" })
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedFabric(null)
  }

  const handleSubmit = () => {
    if (!form.substitute.trim() || !form.reason.trim()) return
    setSuggestions((prev) => [...prev, { ...form, status: "pending", id: Date.now() }])
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-3xl mx-auto">
      {/* Header */}
      <button
        onClick={() => nav("/")}
        className="text-sm text-zinc-400 mb-6 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-lg"
      >
        ← Back
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">🪡</span>
        <div>
          <p className="text-xs text-zinc-500">Feature 3</p>
          <h1 className="text-xl font-medium">Fabric Substitution Guide</h1>
        </div>
      </div>
      <p className="text-sm text-zinc-400 mb-8">
        Find alternative fabrics based on weather, occasion, or affordability.
      </p>

      {/* Fabric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {fabrics.map((fabric) => (
          <div
            key={fabric}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3"
          >
            <span className="text-white font-medium">{fabric}</span>
            <button
              onClick={() => openModal(fabric)}
              className="text-xs bg-orange-700 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg w-fit"
            >
              Find Similar Fabric
            </button>
          </div>
        ))}
      </div>

      {/* Pending Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
            User Suggestions (Pending Review)
          </p>
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div key={s.id} className="bg-zinc-800 rounded-lg p-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium">
                    {s.original} → {s.substitute}
                  </span>
                  <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded-full">
                    {s.status}
                  </span>
                </div>
                <p className="text-zinc-400">{s.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedFabric && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 className="text-lg font-semibold">
                Alternatives for{" "}
                <span className="text-orange-400">{selectedFabric}</span>
              </h2>
              <button
                onClick={closeModal}
                className="text-zinc-400 hover:text-white text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Alternatives List */}
            <div className="p-5 space-y-3">
              {fabricData[selectedFabric].map((alt, i) => (
                <div
                  key={i}
                  className="bg-zinc-800 rounded-xl p-4 border border-zinc-700"
                >
                  <p className="text-white font-medium mb-1">{alt.name}</p>
                  <p className="text-zinc-400 text-sm">{alt.reason}</p>
                </div>
              ))}
            </div>

            {/* Suggest New Substitution Form */}
            <div className="p-5 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
                Suggest a New Substitution
              </p>

              {submitted ? (
                <div className="bg-green-900/40 border border-green-700 rounded-xl p-4 text-center">
                  <p className="text-green-400 text-sm font-medium">
                    ✅ Suggestion submitted for review!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    value={form.substitute}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, substitute: e.target.value }))
                    }
                    placeholder="Alternative fabric name"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                  <textarea
                    value={form.reason}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, reason: e.target.value }))
                    }
                    placeholder="Why is this a good substitute? (weather, cost, availability...)"
                    rows={3}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 resize-none"
                  />
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-orange-700 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    Submit Suggestion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}