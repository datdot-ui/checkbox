const protocol_maker = require('protocol-maker')

var id = 0
const sheet = new CSSStyleSheet()
const default_opts = { 
	name: 'checkbox',
	status: {
		current: false, 
		disabled: false,
	},
	theme: get_theme()
}
sheet.replaceSync(default_opts.theme)

module.exports = checkbox

checkbox.help = () => { return { opts: default_opts } }

function checkbox (opts, parent_wire) {
    const {
      name = default_opts.name,
      status: {
        checked = default_opts.status.checked,
        disabled = default_opts.status.disabled,
      } = {},
      theme = ``
    } = opts
    const current_state = { opts: { status: { checked, disabled }, sheets: [default_opts.theme, theme] } }

    //protocol
    const initial_contacts = { 'parent': parent_wire }
    const contacts = protocol_maker('checkbox', listen, initial_contacts)

    function listen (msg) {
        const { head, refs, type, data, meta } = msg // listen to msg
        const [from, to, msg_id] = head
        const $from = contacts.by_address[from]
        if (type === 'help') {
          $from.notify($from.make({ to: $from.address, type: 'help', data: { state: get_current_state() }, refs: { cause: head }}))
       }
        if (type === 'update') handle_update(data)
    }

    // make checkbox
    const el = document.createElement('i-checkbox')
    const shadow = el.attachShadow({mode: 'closed'})
    const input = document.createElement('input')

    input.type = 'checkbox'
    input.checked = checked
    input.setAttribute('aria-myaddress', 'checkbox')
    if (disabled) input.disabled = true

    const custom_theme = new CSSStyleSheet()
    custom_theme.replaceSync(theme)
    shadow.adoptedStyleSheets = [sheet, custom_theme]
  
    shadow.append(input)

    // add event listeners
    input.onwheel = (e) => e.preventDefault()
    input.onblur = (e) => handle_blur(e, input) // when element loses focus
    // Safari doesn't support onfocus @TODO use select()
    input.onclick = (e) => handle_click(e, input)
    input.onfocus = (e) => handle_focus(e, input)

    return el

    // event handlers
    function handle_blur (e, input) {}
    function handle_focus (e, input) {}
    function handle_click (e) {
        current_state.opts.status.checked = e.target.checked
        const $parent = contacts.by_name['parent']
        $parent.notify($parent.make({ to: $parent.address, type: 'click', data: { checked: current_state.opts.status.checked }}))
    }
    function handle_update (data) {
      const { status, sheets } = data
      if (status) {
        current_state.opts.status.checked = data.status.checked
        input.checked = current_state.opts.status.checked
      }
      if (sheets) {
        const new_sheets = sheets.map(sheet => {
          if (typeof sheet === 'string') {
            current_state.opts.sheets.push(sheet)
            const new_sheet = new CSSStyleSheet()
            new_sheet.replaceSync(sheet)
            return new_sheet
            } 
            if (typeof sheet === 'number') return shadow.adoptedStyleSheets[sheet]
        })
        shadow.adoptedStyleSheets = new_sheets
      }
    }
    
    // get current state
	function get_current_state () {
		return  {
			opts: current_state.opts,
			contacts
		}
	}
}

function get_theme () {
    return `
    :host(i-checkbox) {
        --b: 0, 0%;
        --r: 100%, 50%;
        --color-white: var(--b); 100%;
        --color-black: var(--b); 0%;
        --color-blue: 214, var(--r);
        --size14: 1.4rem;
        --size16: 1.6rem;
        --weight200: 200;
        --weight800: 800;
        --primary-color: var(--color-black);
        --size: var(--size14);
        --size-hover: var(--size);
        --current-size: var(--size);
        --bold: normal;
        --color: var(--primary-color);
        --bg-color: var(--color-white);
        --width: unset;
        --height: 32px;
        --opacity: 1;
        --padding: 8px 12px;
        --border-width: 0px;
        --border-style: solid;
        --border-color: var(--primary-color);
        --border-opacity: 1;
        --primary-button-radius: 8px;
        --border: var(--border-width) var(--border-style) hsla( var(--border-color), var(--border-opacity));
        --border-radius: var(--primary-button-radius);
        --fill: var(--primary-color);
        --fill-hover: var(--color-white);
        --icon-size: 16px;
        --shadow-xy: 0 0;
        --shadow-blur: 8px;
        --shadow-color: var(--primary-color);
        --shadow-opacity: 0.25;
        height: var(--height);
        max-width: 100%;
        display: grid;
    }
    :focus {
        --shadow-opacity: .3;
        font-size: var(--current-size);
    }
    `
}
