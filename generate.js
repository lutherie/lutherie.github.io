const fs = require('fs')
const cp = require('child_process')
const { promisify } = require('util')
const { resolve } = require('path')
const { readdir, stat, writeFile, readFile } = fs.promises
const exec = promisify(cp.exec)

const getFiles = async dir => {
  const items = await readdir(dir)
  const files = await Promise.all(
    items.map(async item => {
      const path = resolve(dir, item)
      return (await stat(path)).isDirectory() ? getFiles(path) : path
    }),
  )
  return files.flat()
}

const cwd = resolve('.')
const getGitData = async (file, type) => {
  const log = await exec(
    `git log --pretty=format:"%at -- %an" --diff-filter=${type} -- ${file}`,
  )
  return log.stdout
    .split('\n')
    .filter(s => s.trim())
    .map(line => {
      const [at, name] = line.split(' -- ')
      return { at: Number(at), name }
    })
}

const layoutTemplate = readFile('layout.html', 'utf8')
getFiles(cwd).then(async files => {
  const mdFiles = await Promise.all(
    files
      .filter(file => !file.includes('/README.md') && file.endsWith('.md'))
      .map(async file => {
        console.log({ file })
        const [added, updates] = await Promise.all([
          getGitData(file, 'A'),
          getGitData(file, 'M'),
        ])
        return { file: file.slice(cwd.length), updates, ...added[0] }
      }),
  )
  const parts = (await layoutTemplate).split(/{{(.+?)}}/)
  const fileParts = await Promise.all(
    parts
      .filter((_, i) => i % 2)
      .map(
        file =>
          file === 'index.json'
            ? JSON.stringify(mdFiles)
            : readFile(file, 'utf8'),
      ),
  )
  const indexContent = parts
    .filter((_, i) => i % 2 === 0)
    .map((part, i) => `${part}${fileParts[i] || ''}`)
    .join('')

  writeFile('beta.html', indexContent, 'utf8')
})
