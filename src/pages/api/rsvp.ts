import type { APIRoute } from "astro";

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  const scriptUrl = import.meta.env.PUBLIC_GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    return json({ error: "PUBLIC_GOOGLE_SCRIPT_URL not configured" }, 500);
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json",
  };

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "Proxy request failed" },
      502
    );
  }
};

export const GET: APIRoute = async ({ request }) => {
  const scriptUrl = import.meta.env.PUBLIC_GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    return json({ error: "PUBLIC_GOOGLE_SCRIPT_URL not configured" }, 500);
  }
  const url = new URL(request.url);
  const q = url.searchParams.toString();
  const target = q ? `${scriptUrl}?${q}` : scriptUrl;
  try {
    const res = await fetch(target, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "Proxy request failed" },
      502
    );
  }
};
