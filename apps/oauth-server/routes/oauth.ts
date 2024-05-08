import { readFile } from "fs/promises";

export default eventHandler(async (event) => {
  const query = getQuery(event);

  const challenge = query.code_challenge as string;

  let template = await readFile("templates/oauth.html", "utf8");
  template = template.replace("{{code_challange}}", challenge);

  return template;
});
