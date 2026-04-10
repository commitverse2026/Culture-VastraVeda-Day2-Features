import React, { useState, useMemo } from 'react';
import './styles.css';

const CLOTHING_DATABASE = [
  { id: 1, name: "Kanjeevaram Saree", fabric: "Silk", region: "Tamil Nadu", occasion: "Wedding", color: "Red & Gold", style: "Drape" },
  { id: 2, name: "Banarasi Saree", fabric: "Silk", region: "Uttar Pradesh", occasion: "Wedding", color: "Maroon & Gold", style: "Drape" },
  { id: 3, name: "Phulkari Dupatta", fabric: "Cotton", region: "Punjab", occasion: "Festival", color: "Multi-color", style: "Wrap" },
  { id: 4, name: "Bandhani Saree", fabric: "Silk", region: "Gujarat", occasion: "Festival", color: "Red & Yellow", style: "Drape" },
  { id: 5, name: "Pashmina Shawl", fabric: "Wool", region: "Kashmir", occasion: "Winter Wear", color: "Earthy Tones", style: "Wrap" },
  { id: 6, name: "Pochampally Ikat Saree", fabric: "Cotton", region: "Telangana", occasion: "Daily Wear", color: "Blue & White", style: "Drape" },
  { id: 7, name: "Muga Silk Mekhela", fabric: "Silk", region: "Assam", occasion: "Festival", color: "Golden", style: "Two-piece" },
  { id: 8, name: "Khadi Kurta", fabric: "Cotton", region: "Pan-India", occasion: "Daily Wear", color: "White", style: "Tunic" },
];

const COMPARE_FIELDS = [
  { key: 'fabric', label: 'Fabric' },
  { key: 'region', label: 'Region' },
  { key: 'occasion', label: 'Occasion' },
  { key: 'color', label: 'Color' },
  { key: 'style', label: 'Style Type' },
];

export default function ClothingComparisonFeature() {
  const [leftId, setLeftId] = useState(1);
  const [rightId, setRightId] = useState(2);

  const leftItem = useMemo(() => CLOTHING_DATABASE.find(c => c.id === leftId), [leftId]);
  const rightItem = useMemo(() => CLOTHING_DATABASE.find(c => c.id === rightId), [rightId]);

  const comparison = useMemo(() => {
    if (!leftItem || !rightItem) return [];
    return COMPARE_FIELDS.map(field => ({
      label: field.label,
      leftVal: leftItem[field.key],
      rightVal: rightItem[field.key],
      isMatch: leftItem[field.key] === rightItem[field.key]
    }));
  }, [leftItem, rightItem]);

  const matchCount = comparison.filter(c => c.isMatch).length;
  const diffCount = comparison.filter(c => !c.isMatch).length;

  return (
    <div className="cc-container">
      <div className="cc-header">
        <h2 className="cc-title">Cross-Culture Clothing Comparison</h2>
        <p className="cc-subtitle">Select two traditional garments to compare their cultural attributes.</p>
      </div>

      {/* Selection Row */}
      <div className="cc-selectors">
        <div className="cc-selector-card">
          <span className="cc-selector-label">Item A</span>
          <select className="cc-select" value={leftId} onChange={e => setLeftId(Number(e.target.value))}>
            {CLOTHING_DATABASE.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="cc-vs-badge">VS</div>

        <div className="cc-selector-card">
          <span className="cc-selector-label">Item B</span>
          <select className="cc-select" value={rightId} onChange={e => setRightId(Number(e.target.value))}>
            {CLOTHING_DATABASE.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="cc-compare-card">
        {/* Header Row */}
        <div className="cc-compare-row cc-row-header">
          <div className="cc-compare-cell cc-cell-left">{leftItem?.name}</div>
          <div className="cc-compare-cell cc-cell-center">Attribute</div>
          <div className="cc-compare-cell cc-cell-right">{rightItem?.name}</div>
        </div>

        {/* Data Rows */}
        {comparison.map(row => (
          <div key={row.label} className="cc-compare-row">
            <div className={`cc-compare-cell cc-cell-left ${row.isMatch ? 'cc-match' : 'cc-mismatch'}`}>
              <span className={row.isMatch ? 'cc-match-icon' : 'cc-mismatch-icon'}></span>
              {row.leftVal}
            </div>
            <div className="cc-compare-cell cc-cell-center">{row.label}</div>
            <div className={`cc-compare-cell cc-cell-right ${row.isMatch ? 'cc-match' : 'cc-mismatch'}`}>
              <span className={row.isMatch ? 'cc-match-icon' : 'cc-mismatch-icon'}></span>
              {row.rightVal}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="cc-summary">
        <span className="cc-summary-badge cc-summary-match">✔ {matchCount} Matching</span>
        <span className="cc-summary-badge cc-summary-diff">✘ {diffCount} Different</span>
      </div>
    </div>
  );
}
