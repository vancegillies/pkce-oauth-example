import { generatePKCE } from "./pkce";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

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
