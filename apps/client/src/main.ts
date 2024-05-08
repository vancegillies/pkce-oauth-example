import { generatePKCE } from "pkce";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

(async () => {
  setupLink();

  maybeCompletePKCEFlow().catch((err) => {
    app.appendChild(makePTag(`Error: ${err.message}`));
  });
})();

async function maybeCompletePKCEFlow() {
  if (!window.location.search.includes("code")) return;
  const code = new URLSearchParams(window.location.search).get("code")!;
  const codeVerifier = localStorage.getItem("codeVerifier")!;

  if (code && codeVerifier) {
    // send the code and codeVerifier to the /token endpoint to get a token
    const token = await getToken(code, codeVerifier);
    app.appendChild(makePTag(`Your token is: ${token}`));
    // use the token to get the secret from the resource server
    const secret = await getSecret(token);
    app.appendChild(makePTag(`Your secret is: ${secret}`));
    // clean up the URL and the codeVerifier
    window.history.replaceState({}, document.title, "/");
    localStorage.removeItem("codeVerifier");
  }
}

function setupLink() {
  const link = document.createElement("a");
  link.href = "http://localhost:3001/oauth";
  link.textContent = "Login with OAuth";
  link.onclick = async (e) => {
    e.preventDefault();
    // generate a codeVerifier and store it in localStorage
    const code = await generatePKCE();
    localStorage.setItem("codeVerifier", code.codeVerifier);
    // open the login page with the codeChallenge
    window.open(`${link.href}?code_challenge=${code.codeChallenge}`, "_self");
  };

  app.appendChild(link);
}

async function getToken(code: string, codeVerifier: string): Promise<string> {
  const res = await fetch("http://localhost:3001/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      code_verifier: codeVerifier,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to get token");
    }
    return res.json();
  });

  return res.token;
}

async function getSecret(token: string): Promise<string> {
  return fetch("http://localhost:3002/", {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then((res) => res.text());
}

function makePTag(text: string) {
  const p = document.createElement("p");
  p.textContent = text;
  return p;
}
