import { randomUUID } from "crypto";

const USERNAME = "admin";
const PASSWORD = "admin";

export default eventHandler(async (event) => {
  // read form data
  const body = await readBody(event);

  if (body.username !== USERNAME || body.password !== PASSWORD) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const code = randomUUID();

  return sendRedirect(event, "http://localhost:3000/callback?code=" + code);
});
