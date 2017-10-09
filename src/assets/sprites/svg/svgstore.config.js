/* eslint no-undef: off */

const RootPath = typeof publicPath === 'undefined' ? '/' : publicPath
const SvgNamespace = 'http://www.w3.org/1999/xlink'
const SvgStorePluginNestID = 'webpack-svgstore-plugin'
const __svg__ = {
  path: './src/assets/sprites/svg/**/*.svg',
  name: 'assets/svgsprite.[hash].svg'
}

window.__SVG_SPRITE__ = SVGSpritesRequest(__svg__) || ''

export function SVGSpritesRequest (options) {
  if (!options.filename) {
    return
  }

  let conflit = document.getElementById(SvgStorePluginNestID)
  conflit && conflit.parentNode.removeChild(conflit)

  let xhr = new XMLHttpRequest()
  if (typeof XDomainRequest !== 'undefined') {
    xhr = new XDomainRequest()
  }

  xhr.open('GET', options.filename, true)
  xhr.onload = function () {
    if (!xhr.responseText || xhr.responseText.substr(0, 4) !== '<svg') {
      throw new Error('Invalid SVG Response')
    }

    if (xhr.status < 200 || xhr.status >= 300) {
      return
    }

    let x = document.createElement('x')
    x.id = SvgStorePluginNestID
    x.innerHTML = xhr.responseText

    let body = document.body
    let svg = x.getElementsByTagName('svg')[0]

    if (svg) {
      svg.setAttribute('aria-hidden', 'true')

      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'

      let uses = svg.getElementsByTagName('use')
      Array.prototype.forEach.call(uses, function (use) {
        let id = use.getAttributeNS(SvgNamespace, 'href');
        /^#/.exec(id) && use.setAttributeNS(SvgNamespace, 'href', '//' + RootPath + options.filename + id)
      })

      body.insertBefore(svg, body.firstChild)
    }
  }

  xhr.send()

  return options.filename
}
