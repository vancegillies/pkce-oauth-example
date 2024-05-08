import { generateCodeChallenge } from "pkce";

export default eventHandler(async (event) => {
  const query = await readBody(event);
  const code = query.code as string;
  const verifier = query.code_verifier as string;

  const storage = useStorage();
  const challenge = await storage.getItem(code);

  if (challenge === (await generateCodeChallenge(verifier))) {
    return {
      token: "1234567890",
    };
  }

  return new Response("Invalid code", { status: 401 });
});
