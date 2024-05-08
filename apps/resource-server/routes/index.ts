export default eventHandler((event) => {
  // read auth header
  const auth = getHeader(event, "Authorization");

  if (auth !== "1234567890") {
    return new Response("Unauthorized", { status: 401 });
  }

  return "Super Secret Data";
});
