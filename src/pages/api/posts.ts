import type { APIRoute } from 'astro';
import { createPost, getPostById, updatePost } from '../../api/posts';

function badRequest() {
  return new Response(null, {
    status: 400,
    statusText: "Bad Request",
  });
}

export const GET: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id") as string;

  try {
    const post = getPostById(id);
    return new Response(JSON.stringify(post));
  } catch (err) {
    if (err instanceof Error) {
      return new Response(null, {
        status: 400,
        statusText: err.message,
      });
    }

    return badRequest()
  }
}

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const title = data.get("title") as string;
  const body = data.get("body") as string;

  if (!title || !body) {
    return badRequest()
  }

  const newPost = createPost(title, body);
  return new Response(JSON.stringify(newPost));
}

export const PATCH: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id") as string;
  const title = data.get("title") as string;
  const body = data.get("body") as string;

  if (!title || !body) {
    return badRequest()
  }

  const updatedPost = await updatePost({ id, title, body });
  return new Response(JSON.stringify(updatedPost));
}
