import {
  convertDatasetToCsv,
  convertDatasetToJson,
  culturalDatasetMetadata,
  culturalDatasetRecords,
} from "../data/culturalDataset"

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function DatasetExportPanel() {
  const previewRecord = culturalDatasetRecords[0]

  return (
    <section className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-2">Open Dataset Export</p>
          <h2 className="text-2xl font-semibold text-white">{culturalDatasetMetadata.title}</h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">{culturalDatasetMetadata.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              downloadFile(convertDatasetToJson(), "vastraveda-cultural-dataset.json", "application/json")
            }
            className="px-4 py-2 rounded-xl bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 transition-colors"
          >
            Download JSON
          </button>
          <button
            type="button"
            onClick={() =>
              downloadFile(convertDatasetToCsv(), "vastraveda-cultural-dataset.csv", "text/csv;charset=utf-8")
            }
            className="px-4 py-2 rounded-xl border border-zinc-700 text-sm font-semibold text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800 transition-colors"
          >
            Download CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Records</p>
          <p className="text-xl font-semibold text-white mt-2">{culturalDatasetMetadata.recordCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Fields</p>
          <p className="text-xl font-semibold text-white mt-2">{culturalDatasetMetadata.fieldCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Version</p>
          <p className="text-xl font-semibold text-white mt-2">{culturalDatasetMetadata.version}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Last Updated</p>
          <p className="text-xl font-semibold text-white mt-2">{culturalDatasetMetadata.lastUpdated}</p>
        </div>
      </div>

      <div className="grid gap-4 mt-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/50">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Metadata</p>
          <div className="space-y-2 text-sm text-zinc-300">
            <p><span className="text-zinc-500">License:</span> {culturalDatasetMetadata.license}</p>
            <p><span className="text-zinc-500">Exporter:</span> {culturalDatasetMetadata.exportedBy}</p>
            <p><span className="text-zinc-500">Included fields:</span> {culturalDatasetMetadata.fields.join(", ")}</p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950/50">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Sample Record</p>
          <div className="space-y-2 text-sm text-zinc-300">
            <p><span className="text-zinc-500">Garment:</span> {previewRecord.garment}</p>
            <p><span className="text-zinc-500">Region:</span> {previewRecord.region}</p>
            <p><span className="text-zinc-500">Technique:</span> {previewRecord.technique}</p>
            <p><span className="text-zinc-500">Status:</span> {previewRecord.status}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
