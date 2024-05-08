import { generatePKCE } from "pkce";
import "./style.css";

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
  }).then((res) => res.json());

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

const app = document.querySelector<HTMLDivElement>("#app")!;

if (window.location.search.includes("code")) {
  const code = new URLSearchParams(window.location.search).get("code")!;
  const codeVerifier = localStorage.getItem("codeVerifier")!;

  if (code && codeVerifier) {
    getToken(code, codeVerifier)
      .then((token) => {
        const p = makePTag(`Your token is: ${token}`);
        app.appendChild(p);
        return getSecret(token);
      })
      .then((secret) => {
        const p = makePTag(`Your secret is: ${secret}`);
        app.appendChild(p);
      })
      .catch((err) => {
        const p = makePTag(`Error: ${err}`);
        app.appendChild(p);
      });
  }
}

const link = setupLink(async (href) => {
  const code = await generatePKCE();
  localStorage.setItem("codeVerifier", code.codeVerifier);
  window.open(`${href}?code_challenge=${code.codeChallenge}`, "_self");
});

app.appendChild(link);

function setupLink(onClick: (href: string) => void) {
  const link = document.createElement("a");
  link.href = "http://localhost:3001/oauth";
  link.textContent = "Login with OAuth";
  link.onclick = (e) => {
    e.preventDefault();
    onClick(link.href);
  };

  return link;
}
