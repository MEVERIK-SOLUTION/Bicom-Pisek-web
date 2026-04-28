const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function createBookingId() {
  return `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

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
  const { env } = context;
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

  const name = toTrimmedString(payload?.name);
  const email = toTrimmedString(payload?.email);
  const phone = toTrimmedString(payload?.phone);
  const topic = toTrimmedString(payload?.topic);
  const preferredDate = toTrimmedString(payload?.preferredDate);
  const preferredTime = toTrimmedString(payload?.preferredTime);
  const message = toTrimmedString(payload?.message);
  const consent = Boolean(payload?.consent);

  if (!name || !email || !topic || !consent) {
    return jsonResponse(
      {
        ok: false,
        message: "Missing required fields: name, email, topic, consent.",
      },
      400
    );
  }

  const booking = {
    bookingId: createBookingId(),
    createdAt: new Date().toISOString(),
    source: "web-form",
    name,
    email,
    phone,
    topic,
    preferredDate,
    preferredTime,
    message,
  };

  const integrationMode = toTrimmedString(env.BOOKING_INTEGRATION_MODE || "stub").toLowerCase();

  if (integrationMode === "google_webhook") {
    const webhookUrl = toTrimmedString(env.GOOGLE_BOOKING_WEBHOOK_URL);
    const webhookToken = toTrimmedString(env.GOOGLE_BOOKING_WEBHOOK_TOKEN);

    if (!webhookUrl) {
      return jsonResponse(
        {
          ok: false,
          message: "GOOGLE_BOOKING_WEBHOOK_URL is not configured.",
        },
        500
      );
    }

    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(webhookToken ? { authorization: `Bearer ${webhookToken}` } : {}),
      },
      body: JSON.stringify(booking),
    });

    if (!upstream.ok) {
      const detail = (await upstream.text()).slice(0, 500);
      return jsonResponse(
        {
          ok: false,
          message: "Booking integration failed.",
          status: upstream.status,
          detail,
        },
        502
      );
    }

    return jsonResponse({
      ok: true,
      bookingId: booking.bookingId,
      mode: integrationMode,
      message: "Rezervace byla prijata a odeslana do Google workflow.",
    });
  }

  return jsonResponse({
    ok: true,
    bookingId: booking.bookingId,
    mode: "stub",
    message: "Rezervace byla prijata. Integrace je zatim ve stub rezimu.",
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
