import { readFile } from "fs/promises";

export default eventHandler(async (event) => {
  const query = getQuery(event);

  const challenge = query.code_challenge as string;

  const storage = useStorage();

  storage.setItem("code_challenge", challenge);

  const template = await readFile("templates/oauth.html", "utf8");

  return template;
});
