const Z = {
  cfg: {
    serverName: "Zombarrio Roleplay",
    tagline: "FiveM Zombie Roleplay Server",
    discord: "https://discord.gg/yourinvite",
    cfxConnect: "https://cfx.re/join/xxxxx", // replace
    serverIP: "connect your.server.ip:30120" // replace
  },
  storageKeys: {
    tickets: "zbrp_tickets",
    donations: "zbrp_donations"
  }
};

function $(sel){ return document.querySelector(sel); }
function $all(sel){ return [...document.querySelectorAll(sel)]; }

function setActiveNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  $all(".nav a").forEach(a=>{
    const href = a.getAttribute("href");
    if(href === path) a.classList.add("active");
  });
}

function fillBrand(){
  const nameEls = $all("[data-server-name]");
  const tagEls = $all("[data-server-tagline]");
  nameEls.forEach(el=> el.textContent = Z.cfg.serverName);
  tagEls.forEach(el=> el.textContent = Z.cfg.tagline);
  const d = $("[data-discord]"); if(d) d.href = Z.cfg.discord;
  const c = $("[data-connect]"); if(c) c.href = Z.cfg.cfxConnect;
  const ip = $("[data-server-ip]"); if(ip) ip.textContent = Z.cfg.serverIP;
}

function toast(msg){
  const t = document.createElement("div");
  t.className = "notice";
  t.style.position="fixed";
  t.style.right="14px";
  t.style.bottom="14px";
  t.style.maxWidth="360px";
  t.style.zIndex=999;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 3200);
}

function copyText(text){
  navigator.clipboard.writeText(text).then(()=> toast("Copied!"));
}

function loadTickets(){
  return JSON.parse(localStorage.getItem(Z.storageKeys.tickets) || "[]");
}
function saveTickets(arr){
  localStorage.setItem(Z.storageKeys.tickets, JSON.stringify(arr));
}
function loadDonations(){
  return JSON.parse(localStorage.getItem(Z.storageKeys.donations) || "[]");
}
function saveDonations(arr){
  localStorage.setItem(Z.storageKeys.donations, JSON.stringify(arr));
}

function initSupportPage(){
  const form = $("#ticketForm");
  const list = $("#ticketList");
  if(!form || !list) return;

  const render = ()=>{
    const tickets = loadTickets().sort((a,b)=> b.createdAt - a.createdAt);
    if(tickets.length === 0){
      list.innerHTML = `<div class="small">No tickets yet. Create one above.</div>`;
      return;
    }
    list.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>When</th>
            <th>Category</th>
            <th>Player</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${tickets.map(t=>`
            <tr>
              <td>${new Date(t.createdAt).toLocaleString()}</td>
              <td>${t.category}</td>
              <td>${t.playerName}</td>
              <td>${t.status}</td>
            </tr>
            <tr>
              <td colspan="4" class="small">${escapeHtml(t.message)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  };

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const playerName = $("#playerName").value.trim();
    const discordTag = $("#discordTag").value.trim();
    const category = $("#category").value;
    const message = $("#message").value.trim();

    if(!playerName || !message){
      toast("Please fill required fields.");
      return;
    }

    const tickets = loadTickets();
    tickets.push({
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      playerName,
      discordTag,
      category,
      message,
      status: "Open"
    });
    saveTickets(tickets);
    form.reset();
    toast("Ticket submitted!");
    render();
  });

  $("#clearTickets")?.addEventListener("click", ()=>{
    localStorage.removeItem(Z.storageKeys.tickets);
    toast("Tickets cleared (local only).");
    render();
  });

  render();
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

document.addEventListener("DOMContentLoaded", ()=>{
  setActiveNav();
  fillBrand();
  initSupportPage();

  // Copy buttons
  $all("[data-copy-ip]").forEach(btn=>{
    btn.addEventListener("click", ()=> copyText(Z.cfg.serverIP));
  });
});
