// generate menu
const cutAt = (str, sep) => {
  const pos = str.lastIndexOf(sep)
  return [str.slice(0, pos), str.slice(pos + 1)]
}
const menu = [
  ...index
    .reduce((acc, item) => {
      const [_path, _name] = cutAt(item.file, '/')
      const path = _path
        .split('/')
        .filter(Boolean)
        .join(' ')
      acc.has(path) || acc.set(path, [])
      const cat = acc.get(path)
      const [name, ext] = cutAt(_name, '.')
      const [uri] = cutAt(item.file, '.')
      cat.push({ ...item, name, ext, cat: path, uri })
      return acc
    }, new Map())
    .entries(),
]

const category = ([cat, items]) => `<li>
  <span class="category">${cat}</span>
  <ul>
    ${items
      .map(item => `<li><a href="#${item.uri}">${item.name}</a></li>`)
      .join('')}
  </ul>
</li>
`

const _id = document.getElementById.bind(document)
_id('nav').innerHTML = menu.map(category).join('')

const articleEl = _id('article')
articleEl.innerHTML = snarkdown(_id('main-content').innerHTML)

const loadHash = async hash => {
  if (hash === '#') {
    articleEl.innerHTML = snarkdown(_id('main-content').innerHTML)
    return (document.title = 'Lutherie')
  }

  if (!hash || hash.length < 3) return (location.hash = '#')
  const res = await fetch(`${hash.slice(1)}.md`)
  if (res.status !== 200) return (location.hash = '#')
  articleEl.innerHTML = snarkdown(await res.text())
  document.title = hash
    .slice(1)
    .split('/')
    .filter(Boolean)
    .join(' ')
}

addEventListener('hashchange', e => loadHash(new URL(e.newURL).hash))
loadHash(window.location.hash)
