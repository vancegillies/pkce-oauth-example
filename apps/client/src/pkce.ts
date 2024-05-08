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
  return window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(plain),
  );
}

async function generateCodeVerifier() {
  // Generate a random code verifier of 128 characters
  return generateRandomString(128);
}

async function generateCodeChallenge(verifier: string) {
  // Generate the SHA-256 hash of the code verifier
  var hashedVerifier = await sha256(verifier);
  // Encode the hash as base64 and replace characters to make it URL-safe
  var base64encoded = btoa(
    String.fromCharCode.apply(null, new Uint8Array(hashedVerifier)),
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  return base64encoded;
}

// Example usage
export async function generatePKCE() {
  var codeVerifier = await generateCodeVerifier();
  var codeChallenge = await generateCodeChallenge(codeVerifier);

  return { codeVerifier, codeChallenge };
}
