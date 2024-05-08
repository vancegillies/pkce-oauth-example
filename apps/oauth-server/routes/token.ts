import { generateCodeChallenge } from "pkce";

export default eventHandler(async (event) => {
  // read the code and code_verifier from the request
  const query = await readBody(event);
  const code = query.code as string;
  const verifier = query.code_verifier as string;

  // get the code_challenge from the storage using code
  const storage = useStorage();
  const challenge = await storage.getItem(code);

  // use the verifier to generate a challenge and compare it with the stored challenge
  if (challenge === (await generateCodeChallenge(verifier))) {
    // return a token if the challenge matches
    return {
      token: "1234567890",
    };
  }

  return new Response("Invalid code", { status: 401 });
});
