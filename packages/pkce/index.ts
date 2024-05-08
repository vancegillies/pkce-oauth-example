function getCrypto() {
  return crypto.subtle;
}

function generateRandomString(length: number) {
  var charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  var result = "";
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}

function sha256(plain: string) {
  // Returns the SHA-256 hash of the input string
  return getCrypto().digest("SHA-256", new TextEncoder().encode(plain));
}

export async function generateCodeVerifier() {
  // Generate a random code verifier of 128 characters
  return generateRandomString(128);
}

export async function generateCodeChallenge(verifier: string) {
  // Generate the SHA-256 hash of the code verifier
  const hashedVerifier = await sha256(verifier);

  let str = "";
  const bytes = new Uint8Array(hashedVerifier);
  const len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function generatePKCE() {
  var codeVerifier = await generateCodeVerifier();
  var codeChallenge = await generateCodeChallenge(codeVerifier);

  return { codeVerifier, codeChallenge };
}
