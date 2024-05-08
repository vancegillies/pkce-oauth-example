import { randomUUID } from "crypto";

const USERNAME = "admin";
const PASSWORD = "admin";

export default eventHandler(async (event) => {
  // read form data
  const body = await readBody(event);

  // check if the username and password are correct
  if (body.username !== USERNAME || body.password !== PASSWORD) {
    // TODO: redirect back to the login page with an error message
    return new Response("Invalid credentials", { status: 401 });
  }
  // get the code_challenge and store it against a random code
  const challenge = body.code_challenge as string;
  const code = randomUUID();
  const storage = useStorage();
  await storage.setItem(code, challenge);

  // redirect to the callback page with the code that the client can use to get a token
  return sendRedirect(event, "http://localhost:3000/callback?code=" + code);
});
