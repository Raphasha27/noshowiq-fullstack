import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthBridge AI - Rural Healthcare Resource Allocation",
  description: "AI-powered platform for optimizing healthcare resources in rural South African clinics. Predicts patient volume, manages medicine stock, and allocates staff efficiently.",
  keywords: ["healthcare", "AI", "South Africa", "rural clinics", "resource allocation", "medicine management", "patient volume prediction"],
  authors: [{ name: "Raphasha27" }],
  openGraph: {
    title: "HealthBridge AI - Rural Healthcare Resource Allocation",
    description: "AI-powered platform for South African rural healthcare",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">{children}
    
      <script dangerouslySetInnerHTML={{ __html: `<!--KDT_WIDGET_INJECTED-->
(function () {
  if (window.__KDT_BRAND__) return;
  window.__KDT_BRAND__ = true;

  var APP_NAME = window.KDT_APP_NAME || document.title || "This application";
  var UPGRADE_EMAIL = "raphashakoketso69@gmail.com";
  var TRIAL_DAYS = 7;
  var STORAGE_KEY = "kdt_trial_start";

  var start = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  if (!start || isNaN(start)) { start = Date.now(); try { localStorage.setItem(STORAGE_KEY, String(start)); } catch (e) {} }

  var daysUsed = Math.floor((Date.now() - start) / 86400000);
  var trialOver = daysUsed >= TRIAL_DAYS;

  var css = [
    "#kdt-widget{position:fixed;bottom:10px;right:10px;z-index:2147483646;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;text-align:left;direction:ltr}",
    "#kdt-badge{display:flex;align-items:center;gap:6px;background:rgba(10,10,20,.85);color:#fff;border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:6px 12px;font-size:12px;font-weight:600;letter-spacing:.4px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35);transition:transform .15s ease;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}",
    "#kdt-badge:hover{transform:scale(1.04)}",
    "#kdt-badge .kdt-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;flex:0 0 auto}",
    "#kdt-modal{display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.55);align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}",
    "#kdt-modal.kdt-open{display:flex}",
    "#kdt-card{background:#fff;color:#111;max-width:420px;width:100%;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.4);overflow:hidden;max-height:92vh;overflow-y:auto}",
    "#kdt-card .kdt-head{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;padding:20px 22px;display:flex;align-items:center;gap:12px}",
    "#kdt-card .kdt-logo{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#22c55e,#0ea5e9);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff;flex:0 0 auto}",
    "#kdt-card .kdt-title{font-size:16px;font-weight:800;line-height:1.2}",
    "#kdt-card .kdt-sub{font-size:12px;opacity:.85;margin-top:2px}",
    "#kdt-card .kdt-body{padding:20px 22px 6px;font-size:14px;line-height:1.55;color:#1f2937}",
    "#kdt-card .kdt-body p{margin:0 0 10px}",
    "#kdt-card .kdt-license{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;font-size:12.5px;color:#334155;margin:0 0 14px}",
    "#kdt-card .kdt-plans{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 14px}",
    "#kdt-card .kdt-plan{border:2px solid #e2e8f0;border-radius:12px;padding:14px 12px;text-align:center;cursor:pointer;transition:border-color .15s ease;position:relative}",
    "#kdt-card .kdt-plan.kdt-sel{border-color:#16a34a;background:#f0fdf4}",
    "#kdt-card .kdt-plan .kdt-price{font-size:20px;font-weight:800;color:#0f172a}",
    "#kdt-card .kdt-plan .kdt-per{font-size:11px;color:#64748b;margin-top:2px}",
    "#kdt-card .kdt-plan .kdt-save{position:absolute;top:-9px;right:8px;background:#16a34a;color:#fff;font-size:10px;font-weight:700;border-radius:999px;padding:2px 8px}",
    "#kdt-card .kdt-btn{display:block;width:100%;border:0;border-radius:12px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;color:#fff;background:linear-gradient(135deg,#16a34a,#15803d);margin:0 0 10px;transition:filter .15s ease}",
    "#kdt-card .kdt-btn:hover{filter:brightness(1.08)}",
    "#kdt-card .kdt-note{font-size:11.5px;color:#64748b;text-align:center;padding:0 6px 16px}",
    "#kdt-card .kdt-x{position:absolute;top:14px;right:14px;background:rgba(255,255,255,.15);border:0;color:#fff;font-size:16px;width:28px;height:28px;border-radius:50%;cursor:pointer;line-height:1}",
    "@media (max-width:480px){#kdt-card .kdt-plans{grid-template-columns:1fr}#kdt-badge{font-size:11px;padding:5px 10px}#kdt-card .kdt-title{font-size:15px}}",
    "@media (prefers-reduced-motion:reduce){#kdt-badge{transition:none}}"
  ].join("");

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var el = document.createElement("div");
  el.id = "kdt-widget";
  el.innerHTML = [
    '<div id="kdt-badge" role="button" aria-label="Kirov Dynamics Technology information">',
    '<span class="kdt-dot"></span><span>KDT &middot; Kirov Dynamics Technology</span>',
    "</div>",
    '<div id="kdt-modal" role="dialog" aria-modal="true">',
    '<div id="kdt-card">',
    '<button class="kdt-x" aria-label="Close">&times;</button>',
    '<div class="kdt-head"><div class="kdt-logo">KDT</div><div><div class="kdt-title">Kirov Dynamics Technology</div><div class="kdt-sub">Proudly South African &middot; Built in SA</div></div></div>',
    '<div class="kdt-body">',
    '<p><strong>KDT License Notice</strong></p>',
    '<div class="kdt-license">This application is the property of <strong>Kirov Dynamics Technology (KDT)</strong>. Unauthorised use, copying or redistribution is prohibited. By using this app you agree to the KDT terms of service.</div>',
    '<p id="kdt-trial-text" style="display:none"><strong>Free trial complete!</strong> Your free trial of this app has ended. Upgrade to Pro to continue enjoying all features.</p>',
    '<p><strong>Upgrade to KDT Pro</strong></p>',
    '<div class="kdt-plans">',
    '<div class="kdt-plan kdt-sel" data-plan="monthly"><div class="kdt-price">R49</div><div class="kdt-per">per month</div></div>',
    '<div class="kdt-plan" data-plan="yearly"><div class="kdt-save">Save 16%</div><div class="kdt-price">R490</div><div class="kdt-per">per year</div></div>',
    "</div>",
    '<button class="kdt-btn" id="kdt-upgrade">Upgrade to Pro &rarr;</button>',
    '<div class="kdt-note">On upgrade, an email request is sent to KDT. Once approved, your Pro access will be activated.</div>',
    "</div>",
    "</div>",
    "</div>",
  ].join("");

  document.body.appendChild(el);

  var modal = el.querySelector("#kdt-modal");
  var badge = el.querySelector("#kdt-badge");
  var xBtn = el.querySelector(".kdt-x");
  var upgradeBtn = el.querySelector("#kdt-upgrade");
  var plans = Array.prototype.slice.call(el.querySelectorAll(".kdt-plan"));
  var selectedPlan = "monthly";
  var trialText = el.querySelector("#kdt-trial-text");

  if (trialOver) { trialText.style.display = ""; badge.style.background = "rgba(220,38,38,.9)"; badge.style.borderColor = "rgba(255,255,255,.35)"; }

  function close() { modal.classList.remove("kdt-open"); }
  badge.addEventListener("click", function () { modal.classList.add("kdt-open"); });
  xBtn.addEventListener("click", close);
  modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  plans.forEach(function (p) {
    p.addEventListener("click", function () {
      plans.forEach(function (q) { q.classList.remove("kdt-sel"); });
      p.classList.add("kdt-sel");
      selectedPlan = p.getAttribute("data-plan");
    });
  });

  upgradeBtn.addEventListener("click", function () {
    var planLabel = selectedPlan === "monthly" ? "Monthly (R49/month)" : "Yearly (R490/year)";
    var subject = encodeURIComponent("[KDT PRO UPGRADE] " + APP_NAME + " - " + planLabel);
    var body = encodeURIComponent(
      "Hello Kirov Dynamics Technology,\n\n" +
      "I would like to upgrade to KDT Pro for the following application:\n\n" +
      "Application: " + APP_NAME + "\n" +
      "Plan: " + planLabel + "\n" +
      "Date: " + new Date().toISOString() + "\n\n" +
      "Please activate my Pro access. Thank you!"
    );
    window.location.href = "mailto:" + UPGRADE_EMAIL + "?subject=" + subject + "&body=" + body;
  });
})();
` }} />
    </html>
  );
}
