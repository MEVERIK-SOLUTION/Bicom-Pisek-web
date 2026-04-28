export default {
  async fetch(request) {
    return new Response(JSON.stringify({
      ok: false,
      message: "Chat endpoint is not implemented yet."
    }), {
      status: 501,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
};
