#!/usr/bin/env node

import { parse, join } from 'path'
import { readdir, mkdir, readFile, writeFile } from 'fs/promises'
import { marked } from 'marked'
import { parse as parseHTML } from 'node-html-parser'
import CleanCSS from 'clean-css'

marked.setOptions({ gfm: true })

const pageFiles = await readdir('docs')
const meta = JSON.parse(await readFile('manifest.webmanifest', 'utf8'))
const style = await readFile('holiday.css', 'utf8')
meta.holiday = new CleanCSS({}).minify(style).styles
const head = (await readFile('head.html', 'utf8'))
  .replace(/(@[^"@<]+)/g, a => eval(`meta.${a.slice(1)}`))

const normalize = str => str
  .toLowerCase()
  .normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replaceAll(' ', '-')

const buildPage = async filename => {
  const path = join('docs', filename)
  const { name, ext } = parse(path)
  if (name === 'README' || ext !== '.md') return []
  const file = await readFile(path, 'utf8')
  const html = marked(file)
  const dom = parseHTML(html)
  const titles = dom.querySelectorAll('h2')
  for (const title of titles) {
    title.setAttribute('id', normalize(title.id))
  }
  if (name !== titles[0]?.id) {
    console.warn('Expected file name to match title', name)
  }
  const description = titles[0]?.rawText
  return [{ html: dom.toString(), name, description }]
}

const pages = (await Promise.all(pageFiles.map(buildPage))).flat()


await mkdir('public', { recursive: true })
await writeFile('public/index.html', [
  '<!DOCTYPE html>',
  '<html>',
  head,
  '<body>',

  // nav
  '<ul>',
  ...pages.map(page => `<li><a href="#${page.name}">${page.description}</a>`),
  '</ul>',

  // Pages
  ...pages.map(page => page.html),
  '</body>',
  '<html/>',
].join('\n'), 'utf8')
