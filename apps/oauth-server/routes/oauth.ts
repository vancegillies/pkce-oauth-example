import { readFile } from "fs/promises";

export default eventHandler(async (event) => {
  // Read the template to render a login page
  const template = await readFile("templates/oauth.html", "utf8");
  // Get the code_challenge from the query string
  const code_challenge = getQuery(event).code_challenge;
  if (!code_challenge) {
    return new Response("Missing code_challenge", { status: 400 });
  }
  // Render the template with the code_challenge adn return it
  return template.replace("{{code_challange}}", code_challenge as string);
});
