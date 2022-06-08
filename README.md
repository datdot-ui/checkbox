# datdot-ui-checkbox
DatDot UI component

Opts
---

`{ status: { checked = false, disabled = false } theme = default_theme }`

Incoming message types
---

`help` requests info on current state
`update`

Outgoing message types
---

**parent**

`help` sends info on current state
`click` updates the parent every time the checkbox is clicked
