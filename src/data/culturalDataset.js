export const culturalDatasetRecords = [
  {
    id: "VV-001",
    garment: "Patola Saree",
    region: "Gujarat",
    community: "Salvi weaving tradition",
    primaryFabric: "Silk",
    technique: "Double ikat",
    occasion: "Wedding",
    language: "Gujarati",
    status: "approved",
  },
  {
    id: "VV-002",
    garment: "Mekhela Chador",
    region: "Assam",
    community: "Assamese",
    primaryFabric: "Muga silk",
    technique: "Supplementary weft motifs",
    occasion: "Festival",
    language: "Assamese",
    status: "approved",
  },
  {
    id: "VV-003",
    garment: "Pheran",
    region: "Kashmir",
    community: "Kashmiri",
    primaryFabric: "Wool",
    technique: "Sozni embroidery",
    occasion: "Winter daily wear",
    language: "Kashmiri",
    status: "approved",
  },
  {
    id: "VV-004",
    garment: "Kasavu Set Mundu",
    region: "Kerala",
    community: "Malayali",
    primaryFabric: "Cotton",
    technique: "Zari border weaving",
    occasion: "Festival",
    language: "Malayalam",
    status: "approved",
  },
  {
    id: "VV-005",
    garment: "Bandhgala",
    region: "Rajasthan",
    community: "Rajput courtwear tradition",
    primaryFabric: "Silk blend",
    technique: "Tailored structured jacket",
    occasion: "Ceremonial",
    language: "Hindi",
    status: "approved",
  },
]

const datasetFields = Object.keys(culturalDatasetRecords[0])

export const culturalDatasetMetadata = {
  title: "VastraVeda Cultural Clothing Dataset",
  version: "1.0.0",
  description: "Curated records of regional garments, fabric traditions, and approved cultural annotations.",
  license: "Open cultural reference sample",
  recordCount: culturalDatasetRecords.length,
  fieldCount: datasetFields.length,
  fields: datasetFields,
  lastUpdated: "2026-04-10",
  exportedBy: "VastraVeda",
}

export function buildDatasetExportPayload() {
  return {
    metadata: culturalDatasetMetadata,
    records: culturalDatasetRecords,
  }
}

export function convertDatasetToJson() {
  return JSON.stringify(buildDatasetExportPayload(), null, 2)
}

function escapeCsvValue(value) {
  const normalized = String(value ?? "")
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`
  }
  return normalized
}

export function convertDatasetToCsv() {
  const header = datasetFields.join(",")
  const rows = culturalDatasetRecords.map((record) =>
    datasetFields.map((field) => escapeCsvValue(record[field])).join(","),
  )

  return [header, ...rows].join("\n")
}
