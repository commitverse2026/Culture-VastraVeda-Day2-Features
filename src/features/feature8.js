export const feature8 = {
  goal: "Enable threaded community discussions on controversial cultural clothing origins.",
  requirements: [
    "Threaded discussions linked to clothing items",
    "Nested replies up to 3 levels",
    "Moderator login with password",
    "Moderator can resolve, reopen, delete threads",
    "Filter by All / Open / Resolved",
    "Resolution note on closed threads"
  ],
  steps: [
    "Define thread data structure",
    "Build recursive ReplyThread component",
    "Add moderator login check",
    "Add resolve / reopen / delete controls",
    "Add filter buttons",
    "Show resolution banner on closed threads"
  ],
  output: [
    "Threaded debate board with nested replies",
    "Moderator tools working",
    "Filter by status working",
    "Resolution note displayed"
  ]
}
