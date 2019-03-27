const dbp = new Promise((resolve, reject) => {
  const openreq = window.indexedDB.open('page-cache', 1)
  openreq.onerror = () => reject(openreq.error)
  openreq.onsuccess = () => resolve(openreq.result)
  openreq.onupgradeneeded = () => openreq.result.createObjectStore('idb')
})

const call = async (type, method, ...args) => {
  const db = await dbp
  const transaction = db.transaction('idb', type)
  const store = transaction.objectStore('idb')

  return new Promise((resolve, reject) => {
    const req = store[method](...args)
    transaction.oncomplete = () => resolve(req)
    transaction.onabort = transaction.onerror = () => reject(transaction.error)
  })
}

const get = async key => (await call('readonly', 'get', key)).result
const set = (key, value) =>
  value === undefined
    ? call('readwrite', 'delete', key)
    : call('readwrite', 'put', value, key)

const getContent = async name => {
  const path = `/pages/${encodeURIComponent(name)}`
  const res = await fetch(path)
  const text = await res.text()
  const dom = new DOMParser().parseFromString(text, 'text/html')
  const elem = dom.body.firstElementChild
  if (!elem) return ''
  elem.firstElementChild && elem.firstElementChild.remove()
  return elem.innerHTML.trim()
}

const parseName = src => {
  const [, index, locale, title] = src.split(/([0-9]{2})-([a-z]{2})/)
  const name = src.slice(0, -3)
  return {
    index: Number(index),
    locale,
    title: title.trim().slice(0, -3),
    name,
    search: `?${new URLSearchParams({ page: name })}`,
  }
}

const displayPage = innerHTML => {
  if (!innerHTML) return
  document.getElementById('article').innerHTML = innerHTML
}

const queryPages = fetch(
  'https://api.github.com/repos/lutherie/lutherie.github.io/contents/pages',
)

const generateMenu = pages => {
  console.log(pages)
  document.getElementById('nav').innerHTML = pages
    .sort((a, b) => a.index - b.index)
    .map(p =>
      `<li><a data-page=${p.name} href="${location.pathname}${p.search}">${p.title}</a></li>`
    )
    .join('\n')

}

window.addEventListener('click', e => {
  if (e.target.dataset.page) {
    e.preventDefault()
    console.log('load page', e.target.dataset.page)
  }

  // history.pushState('')
})

const loadContent = async ([cachedPages = {}, locale = 'fr']) => {
  // init pages from cache
  const { searchParams } = new URL(window.location)
  const selectedPage = searchParams.get('page')

  generateMenu(Object.values(cachedPages))
  if (selectedPage) {
    const page = cachedPages[selectedPage]
    displayPage(await (page ? get(page.sha) : getContent(selectedPage)))
  }

  const res = await queryPages
  const pages = (await res.json())
    .filter(p => p.type === 'file' && p.name.endsWith('.md'))
    .map(({ sha, name }) => ({ ...parseName(name), sha }))

  const work = []
  const cache = pages.reduce((a, { name, ...p }) => ({ ...a, [name]: p }), {})
  work.push(set('pages', cache))

  for (const page of pages) {
    const cachedPage = cachedPages[page.name]
    const cachedSha = cachedPage && cachedPage.sha
    if (page.sha !== cachedSha) {
      const content = (await getContent(page.name)) || page.name
      if (page.name === selectedPage) {
        displayPage(content)
      }
      work.push(set(page.sha, content))
      cachedSha && work.push(set(cachedSha, undefined))
    }
  }

  generateMenu(pages)

  return Promise.all(work)
}

Promise.all([get('pages'), get('locale')])
  .then(loadContent)
  .then(console.log)
  .catch(console.error)
