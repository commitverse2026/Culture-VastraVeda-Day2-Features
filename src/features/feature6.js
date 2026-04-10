export const feature6 = {
  goal: "Motivate users through rewards and recognition by automatically awarding badges when contribution milestones are reached.",
  requirements: [
    "Badge system with named tiers",
    "Contribution tracking (submissions, photos, tags, etc.)",
    "Milestone trigger on each submission event",
    "Profile badge shelf display",
  ],
  steps: [
    "Track user contribution stats (submissions, photos, tags, languages, etc.)",
    "Define badge rules as threshold conditions in a central config",
    "Evaluate rules on every contribution event via the badge engine",
    "Assign newly earned badges and persist them to the user record",
    "Render earned badges and progress bars on the profile page",
  ],
  output: [
    "Users earn badges automatically when milestones are hit",
    "Badge shelf displays earned and locked badges with hover tooltips",
    "Progress bars show how close the user is to each locked badge",
    "Newly earned badges highlighted with a 'NEW' indicator",
  ],
}

// 🧩 Feature 6 — Clothing Heritage Badges & Gamification
// 🎯 GOAL
// Motivate users through rewards and recognition.
// 📌 REQUIREMENTS
// Badge system
// Contribution tracking
// Milestone triggers
// Profile badge display
// ⚙️ IMPLEMENTATION STEPS
// Track user contributions
// Define badge rules
// Check conditions on submission
// Assign badge
// Render badges on profile
// ✅ EXPECTED OUTPUT
// ✔ Users earn badges
//  ✔ Badges visible on profile
//  ✔ Milestones trigger correctly
