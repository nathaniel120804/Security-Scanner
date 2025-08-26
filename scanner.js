const REQUIRED_HEADERS = {
  "content-security-policy": "Protects against XSS and injections",
  "strict-transport-security": "Forces HTTPS",
  "x-frame-options": "Prevents clickjacking",
  "x-content-type-options": "Stops MIME sniffing",
  "referrer-policy": "Controls referrer info",
  "permissions-policy": "Restricts browser features",
  "cross-origin-embedder-policy": "Isolates resources",
  "cross-origin-opener-policy": "Isolates browsing context",
  "cross-origin-resource-policy": "Restricts resource sharing"
};

async function scanSite() {
  const url = document.getElementById("urlInput").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>🔎 Scanning...</p>";

  try {
    const response = await fetch(url, { method: "GET", mode: "cors" });
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    let score = 100;
    let report = `<h2>Results for: ${url}</h2>`;
    report += `<p>Status: ${response.status}</p><ul>`;

    for (const [header, desc] of Object.entries(REQUIRED_HEADERS)) {
      if (headers[header]) {
        report += `<li class="pass">✅ ${header}: ${headers[header]}</li>`;
      } else {
        report += `<li class="fail">❌ ${header} → Missing (${desc})</li>`;
        score -= 10;
      }
    }

    const grade =
      score >= 90 ? "A" :
      score >= 80 ? "B" :
      score >= 70 ? "C" :
      score >= 60 ? "D" : "F";

    report += `</ul><h3>Score: ${score}/100 → Grade: ${grade}</h3>`;
    resultsDiv.innerHTML = report;

  } catch (error) {
    resultsDiv.innerHTML = `<p class="fail">❌ Error: ${error.message}</p>`;
  }
}
