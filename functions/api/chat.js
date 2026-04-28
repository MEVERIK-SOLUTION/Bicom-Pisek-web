const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  let payload = null;

  try {
    payload = await context.request.json();
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "Invalid JSON payload.",
      },
      400
    );
  }

  return jsonResponse(
    {
      ok: false,
      message: "Chat endpoint is not implemented yet.",
      received: payload,
    },
    501
  );
}

export function onRequest() {
  return jsonResponse(
    {
      ok: false,
      message: "Method not allowed. Use POST.",
    },
    405
  );
}
