const style_sheet = require('support-style-sheet')
const protocol_maker = require('protocol-maker')

var id = 0

module.exports = checkbox

function checkbox (opts, parent_wire) {
    const { checked = false, theme } = opts
    var status = checked ? 'checked' : 'unchecked'

/* ------------------------------------------------
                    <protocol>
------------------------------------------------ */

    const initial_contacts = { 'parent': parent_wire }
    const contacts = protocol_maker('input-number', listen, initial_contacts)

    function listen (msg) {
        const { head, refs, type, data, meta } = msg // listen to msg
        const [from, to, msg_id] = head
        // todo: what happens when we receive the message
    }
/* ------------------------------------------------
                    </protocol>
------------------------------------------------ */

    const make_element = () => {
        const el = document.createElement('i-checkbox')
        const shadow = el.attachShadow({mode: 'closed'})
        const input = document.createElement('input')
        set_attributes(el, input)
        style_sheet(shadow, style)
        shadow.append(input)
        // handle events go here
        input.onwheel = (e) => e.preventDefault()
        input.onblur = (e) => handle_blur(e, input) // when element loses focus
        // Safari doesn't support onfocus @TODO use select()
        input.onclick = (e) => handle_click(e, input)
        input.onfocus = (e) => handle_focus(e, input)
        return el
    }
// ---------------------------------------------------------------
    // all set attributes go here
    function set_attributes (el, input) {
        input.type = 'checkbox'
        input.checked = checked
        // properties
        input.setAttribute('aria-myaddress', 'checkbox')
    }
    
    // input blur event
    function handle_blur (e, input) {}
    // input focus event
    function handle_focus (e, input) {}
    // input click event
    function handle_click (e) {
        const new_status = e.target.checked ? 'checked' : 'unchecked'
        set_status(new_status)
        const $parent = contacts.by_name['parent']
        $parent.notify($parent.make({ to: $parent.address, type: 'click', data: { status }}))
    }
    
    const set_status = new_status => {
        const state_machine = {
            'checked': ['unchecked'],
            'unchecked': ['checked']
        }
        if (!state_machine[status].includes(new_status)) throw new Error('invalid state transition')
        status = new_status
    }

   // insert CSS style
   const custom_style = theme ? theme.style : ''
   // set CSS variables
   if (theme && theme.props) {
       var {size, size_hover, current_size,
           weight, weight_hover, current_weight,
           color, color_hover, current_color, current_bg_color, 
           bg_color, bg_color_hover, border_color_hover,
           border_width, border_style, border_opacity, border_color, border_radius, 
           padding, width, height, opacity,
           fill, fill_hover, icon_size, current_fill,
           shadow_color, shadow_offset_xy, shadow_blur, shadow_opacity,
           shadow_color_hover, shadow_offset_xy_hover, blur_hover, shadow_opacity_hover
       } = theme.props
   }

// ---------------------------------------------------------------
    const style = `
    :host(i-checkbox) {
        --size: ${size ? size : 'var(--size14)'};
        --size-hover: ${size_hover ? size_hover : 'var(--size)'};
        --current-size: ${current_size ? current_size : 'var(--size)'};
        --bold: ${weight ? weight : 'normal'};
        --color: ${color ? color : 'var(--primary-color)'};
        --bg-color: ${bg_color ? bg_color : 'var(--color-white)'};
        --width: ${width ? width : 'unset'};
        --height: ${height ? height : '32px'};
        --opacity: ${opacity ? opacity : '1'};
        --padding: ${padding ? padding : '8px 12px'};
        --border-width: ${border_width ? border_width : '0px'};
        --border-style: ${border_style ? border_style : 'solid'};
        --border-color: ${border_color ? border_color : 'var(--primary-color)'};
        --border-opacity: ${border_opacity ? border_opacity : '1'};
        --border: var(--border-width) var(--border-style) hsla( var(--border-color), var(--border-opacity) );
        --border-radius: ${border_radius ? border_radius : 'var(--primary-button-radius)'};
        --fill: ${fill ? fill : 'var(--primary-color)'};
        --fill-hover: ${fill_hover ? fill_hover : 'var(--color-white)'};
        --icon-size: ${icon_size ? icon_size : '16px'};
        --shadow-xy: ${shadow_offset_xy ? shadow_offset_xy : '0 0'};
        --shadow-blur: ${shadow_blur ? shadow_blur : '8px'};
        --shadow-color: ${shadow_color ? shadow_color : 'var(--color-black)'};
        --shadow-opacity: ${shadow_opacity ? shadow_opacity : '0.25'};
        ${width && 'width: var(--width)'};
        height: var(--height);
        max-width: 100%;
        display: grid;
    }
    :focus {
        --shadow-opacity: ${shadow_opacity ? shadow_opacity : '.3'};
        font-size: var(--current-size);
    }
    ${custom_style}
    `
    const element = make_element()
// ---------------------------------------------------------------
    return element
// ---------------------------------------------------------------
}
