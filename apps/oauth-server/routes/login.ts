import { randomUUID } from "crypto";

const USERNAME = "admin";
const PASSWORD = "admin";

export default eventHandler(async (event) => {
  // read form data
  const body = await readBody(event);

  console.log(body);

  if (body.username !== USERNAME || body.password !== PASSWORD) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const challenge = body.code_challenge as string;
  const code = randomUUID();

  const storage = useStorage();
  console.log({ code, challenge });
  await storage.setItem(code, challenge);

  return sendRedirect(event, "http://localhost:3000/callback?code=" + code);
});
