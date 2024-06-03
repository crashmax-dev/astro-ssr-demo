import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import PostItem from '../components/post-item.vue'

export interface Post {
  id: string
  title: string
  body: string
}

const pagesPath = resolve(dirname(fileURLToPath(import.meta.url)), 'pages')
const dbPath = resolve(dirname(fileURLToPath(import.meta.url)), 'db.json')

export async function writePage(id: string, page: string) {
  const filePath = resolve(pagesPath, `${id}.html`)
  await writeFile(filePath, page, 'utf-8')
}

export async function readPage(id: string) {
  try {
    const filePath = resolve(pagesPath, `${id}.html`)
    const page = await readFile(filePath, 'utf-8')
    return page
  } catch {
    return ''
  }
}

export async function ssrPage(post: Post) {
  const app = createSSRApp({ render: () => h(PostItem, post) })
	const component = await renderToString(app)
	await writePage(post.id, component)
}

export async function getPosts() {
  const dbFile = await readFile(dbPath, 'utf-8')
  const db = JSON.parse(dbFile) as Post[]
  return db
}

export async function getPostById(postId: string) {
  const posts = await getPosts()
  const post = posts.find((post) => post.id === postId)
  if (!post) return null
  const component = await readPage(postId)
  return {
    post,
    component
  }
}

export async function deletePost(postId: string) {
  const posts = await getPosts()
  const postIndex = posts.findIndex((post) => post.id !== postId)
  if (postIndex === -1) {
    throw new Error('Post not found')
  }
  await writeFile('db.json', JSON.stringify(postIndex))
}

export async function createPost(title: string, body: string) {
  const posts = await getPosts()
  const post = {
    id: crypto.randomUUID(),
    title,
    body,
  }
  posts.push(post)
  await ssrPage(post)
  return post
}

export async function updatePost(post: Post) {
  const posts = await getPosts()
  const postIndex = posts.findIndex((post) => post.id === post.id)
  if (postIndex === -1) {
    throw new Error('Post not found')
  }
  posts[postIndex] = post
  await ssrPage(post)
  return post
}
