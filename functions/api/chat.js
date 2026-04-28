import { BICOM_KNOWLEDGE } from "./bicom-knowledge.js";

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
  const { env, request } = context;
  let payload = null;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "Invalid JSON payload.",
      },
      400
    );
  }

  const userMessage = typeof payload?.message === "string" ? payload.message.trim() : "";
  if (!userMessage) {
    return jsonResponse(
      {
        ok: false,
        message: "Field 'message' is required.",
      },
      400
    );
  }

  const apiKey = env.GITHUB_MODELS_API_KEY;
  const model = env.GITHUB_MODEL || "gpt-4o-mini";
  const endpoint = env.GITHUB_MODELS_ENDPOINT || "https://models.github.ai/inference";

  if (!apiKey) {
    return jsonResponse(
      {
        ok: false,
        message: "GITHUB_MODELS_API_KEY is not configured.",
      },
      500
    );
  }

  const groundedContext = JSON.stringify(BICOM_KNOWLEDGE);

  const prompt = [
    {
      role: "system",
      content: [
        "Jsi specializovany AI asistent znacky Bicom Pisek.",
        "Tve hlavni cile jsou: presnost, lidskost, bezpecnost a obchodni relevance.",
        "Musis dodrzovat interni protokoly, komunikacni styl a pravidla bezpecnosti.",
        "Nikdy nevymyslej fakta, ktera nemas v kontextu.",
        "Pokud je dotaz mimo kontext nebo medicinsky rizikovy, udelej bezpecny fallback.",
        "Kdyz nevis konkretni detail (cena, termin, ord. hodiny), transparentne to rekni a nabidni rezervaci/dotaz.",
        "Kontext znacky a pravidel:",
        groundedContext,
      ].join("\n"),
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  const upstream = await fetch(`${endpoint}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: prompt,
      temperature: 0.25,
      max_tokens: 420,
    }),
  });

  if (!upstream.ok) {
    const errorText = await upstream.text();
    return jsonResponse(
      {
        ok: false,
        message: "GitHub Models request failed.",
        status: upstream.status,
        detail: errorText.slice(0, 500),
      },
      502
    );
  }

  const data = await upstream.json();
  const reply = data?.choices?.[0]?.message?.content;

  return jsonResponse({
    ok: true,
    model,
    reply: reply || "Prominte, ted se mi nepodarilo ziskat odpoved.",
  });
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
