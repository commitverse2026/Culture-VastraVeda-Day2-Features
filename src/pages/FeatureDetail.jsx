import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { features, featureMap } from "../data/features"

export default function FeatureDetail() {
  const { id } = useParams()
  const nav = useNavigate()

  const meta = features.find(f => f.id === Number(id))
  const detail = featureMap[Number(id)]

  const [showModal, setShowModal] = useState(false)
  const [newFabric, setNewFabric] = useState("")
  const [reason, setReason] = useState("")
  const [pending, setPending] = useState([])

  // Sample dataset
  const fabricMap = {
    Cotton: [
      { name: "Linen", reason: "Breathable for summer" },
      { name: "Rayon", reason: "Affordable alternative" }
    ],
    Silk: [
      { name: "Satin", reason: "Smooth and cheaper" },
      { name: "Chiffon", reason: "Lightweight and flowy" }
    ],
    Wool: [
      { name: "Acrylic", reason: "Warm and budget-friendly" },
      { name: "Fleece", reason: "Soft and insulating" }
    ]
  }

  const handleSubmit = () => {
    if (!newFabric || !reason) return

    const suggestion = {
      fabric: "Cotton",
      name: newFabric,
      reason: reason,
      status: "pending"
    }

    setPending([...pending, suggestion])
    setNewFabric("")
    setReason("")
    alert("Suggestion submitted for review!")
  }

  if (!meta || !detail) return (
    <div className="min-h-screen bg-black p-6">
      <p className="text-zinc-400">Feature not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-black p-6 max-w-2xl mx-auto">

      {/* Back Button */}
      <button
        onClick={() => nav("/")}
        className="text-sm text-zinc-400 mb-6 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-lg"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">{meta.icon}</span>
        <div>
          <p className="text-xs text-zinc-500">Feature {meta.id}</p>
          <h1 className="text-xl font-medium">{meta.title}</h1>
        </div>
        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
          meta.difficulty === "Easy" ? "bg-green-900 text-green-300" :
          meta.difficulty === "Hard" ? "bg-red-900 text-red-300" :
          "bg-yellow-900 text-yellow-300"
        }`}>
          {meta.difficulty}
        </span>
      </div>

      {/* Sections */}
      {[
        ["Goal", detail.goal],
        ["Requirements", detail.requirements],
        ["Steps", detail.steps],
        ["Output", detail.output]
      ].map(([label, val]) => (
        <div key={label} className="bg-zinc-900 rounded-xl p-4 mb-4 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">{label}</p>
          {Array.isArray(val)
            ? <ul className="space-y-1">
                {val.map((v, i) => (
                  <li key={i} className="text-sm text-zinc-300">• {v}</li>
                ))}
              </ul>
            : <p className="text-sm text-zinc-300">{val}</p>
          }
        </div>
      ))}

      {/* ✅ Feature 3 Button */}
      {id === "3" && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
        >
          Find Similar Fabric
        </button>
      )}

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl w-[400px] border border-zinc-700">

            <h2 className="text-lg mb-4">Fabric Alternatives</h2>

            {/* Suggestions List */}
            <ul className="space-y-2">
              {(fabricMap["Cotton"] || []).map((f, i) => (
                <li key={i} className="text-sm text-zinc-300">
                  <b>{f.name}</b> — {f.reason}
                </li>
              ))}
            </ul>

            {/* Form */}
            <div className="mt-4">
              <input
                value={newFabric}
                onChange={(e) => setNewFabric(e.target.value)}
                placeholder="New fabric"
                className="w-full mb-2 p-2 rounded bg-black border border-zinc-700"
              />
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason"
                className="w-full mb-2 p-2 rounded bg-black border border-zinc-700"
              />

              <button
                onClick={handleSubmit}
                className="bg-green-600 px-3 py-1 rounded text-white"
              >
                Submit
              </button>
            </div>

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-zinc-400"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  )
}