// چک‌لیست پایه
const checklistData = [
  { id: 1, category: "SAFETY", title: "حضور مجری ذی‌صلاح در محل ساختمان", priority: "CRITICAL", regulation: "مبحث ۲ مقررات ملی ساختمان", status: "NOT_COMPLETED", notes: "" },
  { id: 2, category: "SAFETY", title: "استفاده از کلاه ایمنی", priority: "CRITICAL", regulation: "مبحث ۱۲", status: "NOT_COMPLETED", notes: "" },
  { id: 3, category: "SAFETY", title: "استفاده از دستکش ایمنی", priority: "CRITICAL", regulation: "مبحث ۱۲", status: "NOT_COMPLETED", notes: "" },
  { id: 4, category: "SAFETY", title: "استفاده از کفش ایمنی", priority: "HIGH", regulation: "مبحث ۱۲", status: "NOT_COMPLETED", notes: "" },
  { id: 5, category: "BEFORE_CONSTRUCTION", title: "بررسی تطابق نقشه‌های مکانیکی مصوب", priority: "HIGH", regulation: "مبحث ۲ و ۱۴", status: "NOT_COMPLETED", notes: "" },
  { id: 6, category: "BEFORE_CONSTRUCTION", title: "بررسی فضای موتورخانه", priority: "CRITICAL", regulation: "مبحث ۱۴", status: "NOT_COMPLETED", notes: "" },
  { id: 7, category: "DURING_CONSTRUCTION", title: "کنترل لوله‌کشی فاضلاب و آب باران", priority: "HIGH", regulation: "مبحث ۱۶", status: "NOT_COMPLETED", notes: "" },
  { id: 8, category: "DURING_CONSTRUCTION", title: "کنترل عدم تداخل گاز با برق", priority: "CRITICAL", regulation: "مبحث ۱۷", status: "NOT_COMPLETED", notes: "" },
  { id: 9, category: "BEFORE_FINAL_APPROVAL", title: "تست آب‌بندی فاضلاب", priority: "HIGH", regulation: "مبحث ۱۶", status: "NOT_COMPLETED", notes: "" },
  { id: 10, category: "BEFORE_FINAL_APPROVAL", title: "تست نشت دودکش", priority: "CRITICAL", regulation: "مبحث ۱۷", status: "NOT_COMPLETED", notes: "" }
];

let projects = JSON.parse(localStorage.getItem("hamyarProjects") || "[]");
let currentProjectId = localStorage.getItem("hamyarCurrentProject") || null;
let items = [];

function saveAll() {
  localStorage.setItem("hamyarProjects", JSON.stringify(projects));
  localStorage.setItem("hamyarCurrentProject", currentProjectId);
}

function createNewProject() {
  const id = Date.now().toString();
  projects.push({
    id,
    name: "پروژه جدید",
    address: "",
    inspector: "",
    date: "",
    checklist: JSON.parse(JSON.stringify(checklistData)),
    isoData: null,
    planData: null
  });
  currentProjectId = id;
  saveAll();
  loadCurrentProject();
  renderProjectSelect();
  render();
}

function deleteCurrentProject() {
  if (projects.length <= 1) { alert("حداقل یک پروژه باید باقی بماند"); return; }
  if (!confirm("حذف پروژه؟")) return;
  projects = projects.filter(p => p.id !== currentProjectId);
  currentProjectId = projects[0].id;
  saveAll();
  loadCurrentProject();
  renderProjectSelect();
  render();
}

function loadCurrentProject() {
  const p = projects.find(x => x.id === currentProjectId);
  if (!p) { if (!projects.length) createNewProject(); return; }
  items = p.checklist || JSON.parse(JSON.stringify(checklistData));
  document.getElementById("projectName").value = p.name || "";
  document.getElementById("projectAddress").value = p.address || "";
  document.getElementById("inspectorName").value = p.inspector || "";
  document.getElementById("visitDate").value = p.date || "";
  if (p.isoData) loadImageToCanvas(isoCanvas, p.isoData); else initIso();
  if (p.planData) loadImageToCanvas(planCanvas, p.planData); else initPlan();
}

function saveCurrentProject() {
  const p = projects.find(x => x.id === currentProjectId);
  if (!p) return;
  p.name = document.getElementById("projectName").value;
  p.address = document.getElementById("projectAddress").value;
  p.inspector = document.getElementById("inspectorName").value;
  p.date = document.getElementById("visitDate").value;
  p.checklist = items;
  p.isoData = isoCanvas.toDataURL("image/png");
  p.planData = planCanvas.toDataURL("image/png");
  saveAll();
}

function renderProjectSelect() {
  const sel = document.getElementById("projectSelect");
  sel.innerHTML = projects.map(p => `<option value="${p.id}" ${p.id===currentProjectId?"selected":""}>${p.name||"پروژه"}</option>`).join("");
}

function render() {
  const search = (document.getElementById("search").value || "").toLowerCase();
  const cat = document.getElementById("categoryFilter").value;
  const stat = document.getElementById("statusFilter").value;
  const filtered = items.filter(it => {
    const s = (it.title+it.regulation).toLowerCase().includes(search);
    const c = cat==="all" || it.category===cat;
    const st = stat==="all" || it.status===stat;
    return s && c && st;
  });
  document.getElementById("checklist").innerHTML = filtered.map(it => `
    <div class="item ${it.priority}">
      <h3>${it.title}</h3>
      <div class="meta">مرجع: ${it.regulation} | اولویت: ${it.priority}</div>
      <div class="status-buttons">
        <button class="btn-not" onclick="setStatus(${it.id},'NOT_COMPLETED')">بررسی‌نشده</button>
        <button class="btn-ok" onclick="setStatus(${it.id},'COMPLETED')">تأیید</button>
        <button class="btn-fix" onclick="setStatus(${it.id},'REQUIRES_CORRECTION')">نیاز به اصلاح</button>
      </div>
      <textarea class="notes" onchange="setNotes(${it.id},this.value)">${it.notes||""}</textarea>
    </div>
  `).join("");

  const proj = projects.find(x=>x.id===currentProjectId) || {};
  document.getElementById("reportHeader").innerHTML = `
    <p><strong>نام پروژه:</strong> ${proj.name||"—"}</p>
    <p><strong>آدرس:</strong> ${proj.address||"—"}</p>
    <p><strong>ناظر:</strong> ${proj.inspector||"—"} | <strong>تاریخ:</strong> ${proj.date||"—"}</p>
    <p>پیرو بازدید به عمل آمده در تاریخ ${proj.date||"—"} از پروژه مذکور، گزارش نظارت به شرح ذیل ارائه می‌گردد.</p>
  `;
  document.getElementById("reportContent").innerHTML = filtered.map(it => `
    <div class="item"><strong>${it.title}</strong><br>وضعیت: ${statusName(it.status)} | ${it.regulation}<br>${it.notes?"یادداشت: "+it.notes:""}</div>
  `).join("");
  const tot=items.length, ok=items.filter(i=>i.status==="COMPLETED").length;
  const fix=items.filter(i=>i.status==="REQUIRES_CORRECTION").length;
  document.getElementById("reportSummary").innerHTML = `<h3>خلاصه</h3><p>کل: ${tot} | تأیید: ${ok} | اصلاح: ${fix} | باقی: ${tot-ok-fix}</p>`;
}

function statusName(s){ return {NOT_COMPLETED:"بررسی‌نشده",COMPLETED:"تأیید",REQUIRES_CORRECTION:"نیاز به اصلاح"}[s]||s; }
function setStatus(id,st){ const it=items.find(i=>i.id===id); if(it) it.status=st; saveCurrentProject(); render(); }
function setNotes(id,n){ const it=items.find(i=>i.id===id); if(it) it.notes=n; saveCurrentProject(); }

// ========== ابزار ایزومتریک + پلان ==========
const isoCanvas = document.getElementById("isoCanvas");
const isoCtx = isoCanvas.getContext("2d");
const planCanvas = document.getElementById("planCanvas");
const planCtx = planCanvas.getContext("2d");

let currentDir = "east";
let lastIso = {x: 350, y: 240};

function getColor() {
  const s = document.getElementById("pipeSize").value;
  return {"1/2":"#3B82F6","3/4":"#10B981","1":"#F59E0B","1.5":"#EF4444","2":"#8B5CF6"}[s] || "#3B82F6";
}

function initIso() {
  isoCtx.fillStyle = "#0F172A";
  isoCtx.fillRect(0,0,isoCanvas.width,isoCanvas.height);
  drawGrid();
  lastIso = {x: isoCanvas.width/2, y: isoCanvas.height/2};
}

function initPlan() {
  planCtx.fillStyle = "#0F172A";
  planCtx.fillRect(0,0,planCanvas.width,planCanvas.height);
}

function drawGrid() {
  isoCtx.strokeStyle = "#1E293B";
  isoCtx.lineWidth = 1;
  const step = 40;
  const a = Math.PI/6;
  for(let y=0; y<isoCanvas.height; y+=step){
    isoCtx.beginPath(); isoCtx.moveTo(0,y); isoCtx.lineTo(isoCanvas.width,y); isoCtx.stroke();
  }
  for(let x=-100; x<isoCanvas.width+100; x+=step){
    isoCtx.beginPath();
    isoCtx.moveTo(x, isoCanvas.height);
    isoCtx.lineTo(x + isoCanvas.height*Math.tan(a), 0);
    isoCtx.stroke();
    isoCtx.beginPath();
    isoCtx.moveTo(x, isoCanvas.height);
    isoCtx.lineTo(x - isoCanvas.height*Math.tan(a), 0);
    isoCtx.stroke();
  }
}

function drawPipe(dir, len=90) {
  const angles = {
    north: -Math.PI/6,
    east: Math.PI/6,
    south: Math.PI*5/6,
    west: -Math.PI*5/6,
    up: -Math.PI/2,
    down: Math.PI/2
  };
  const ang = angles[dir] || 0;
  const nx = lastIso.x + Math.cos(ang)*len;
  const ny = lastIso.y + Math.sin(ang)*len;

  isoCtx.strokeStyle = getColor();
  isoCtx.lineWidth = 6;
  isoCtx.lineCap = "round";
  isoCtx.beginPath();
  isoCtx.moveTo(lastIso.x, lastIso.y);
  isoCtx.lineTo(nx, ny);
  isoCtx.stroke();

  isoCtx.fillStyle = "#fff";
  isoCtx.beginPath();
  isoCtx.arc(nx, ny, 5, 0, Math.PI*2);
  isoCtx.fill();

  lastIso = {x: nx, y: ny};
}

function addSymbol(type) {
  const x = lastIso.x, y = lastIso.y;
  isoCtx.strokeStyle = getColor();
  isoCtx.lineWidth = 3;
  if (type === "elbow") {
    isoCtx.beginPath();
    isoCtx.arc(x, y, 28, Math.PI, Math.PI*1.5);
    isoCtx.stroke();
  } else if (type === "valve") {
    isoCtx.strokeRect(x-16, y-10, 32, 20);
    isoCtx.beginPath(); isoCtx.moveTo(x-16,y); isoCtx.lineTo(x+16,y); isoCtx.stroke();
  } else if (type === "meter") {
    isoCtx.beginPath(); isoCtx.arc(x, y, 20, 0, Math.PI*2); isoCtx.stroke();
    isoCtx.fillStyle = getColor();
    isoCtx.font = "bold 14px Tahoma";
    isoCtx.fillText("M", x-5, y+5);
  }
}

function addRiser(x, y) {
  planCtx.strokeStyle = "#F59E0B";
  planCtx.lineWidth = 3;
  planCtx.beginPath();
  planCtx.arc(x, y, 14, 0, Math.PI*2);
  planCtx.stroke();
  planCtx.fillStyle = "#F59E0B";
  planCtx.font = "bold 13px Tahoma";
  planCtx.fillText("R", x-4, y+4);
}

function getPoint(canvas, e) {
  const r = canvas.getBoundingClientRect();
  const sx = canvas.width / r.width;
  const sy = canvas.height / r.height;
  let cx, cy;
  if (e.touches && e.touches[0]) {
    cx = e.touches[0].clientX;
    cy = e.touches[0].clientY;
  } else {
    cx = e.clientX;
    cy = e.clientY;
  }
  return { x: (cx - r.left)*sx, y: (cy - r.top)*sy };
}

function loadImageToCanvas(cvs, dataUrl) {
  const img = new Image();
  img.onload = () => {
    const ctx = cvs.getContext("2d");
    ctx.clearRect(0,0,cvs.width,cvs.height);
    ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
  };
  img.src = dataUrl;
}

function updateScale() {
  const v = document.getElementById("scaleSelect").value;
  document.getElementById("currentScale").textContent = v==="50" ? "۱:۵۰" : "۱:۱۰۰";
}

function preparePrint() {
  const maps = document.getElementById("reportMaps");
  maps.innerHTML = `
    <div style="text-align:center;margin:1rem 0;page-break-inside:avoid">
      <h3>پلان ۲بعدی</h3>
      <img src="${planCanvas.toDataURL()}" style="max-width:90%;border:1px solid #999">
    </div>
    <div style="text-align:center;margin:1rem 0;page-break-inside:avoid">
      <h3>ایزومتریک</h3>
      <img src="${isoCanvas.toDataURL()}" style="max-width:90%;border:1px solid #999">
    </div>
  `;
}

// رویدادهای ایزومتریک
["dirNorth","dirEast","dirSouth","dirWest","dirUp","dirDown"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.onclick = () => {
    currentDir = id.replace("dir","").toLowerCase();
    drawPipe(currentDir);
    saveCurrentProject();
  };
});

function onIsoClick(e) {
  e.preventDefault();
  const p = getPoint(isoCanvas, e);
  lastIso = p;
  drawPipe(currentDir);
  saveCurrentProject();
}
if (isoCanvas) {
  isoCanvas.addEventListener("click", onIsoClick);
  isoCanvas.addEventListener("touchend", onIsoClick, {passive:false});
}

function onPlanClick(e) {
  e.preventDefault();
  const p = getPoint(planCanvas, e);
  addRiser(p.x, p.y);
  saveCurrentProject();
}
if (planCanvas) {
  planCanvas.addEventListener("click", onPlanClick);
  planCanvas.addEventListener("touchend", onPlanClick, {passive:false});
}

const addElbow = document.getElementById("addElbowBtn");
if (addElbow) addElbow.onclick = () => { addSymbol("elbow"); saveCurrentProject(); };
const addValve = document.getElementById("addValveBtn");
if (addValve) addValve.onclick = () => { addSymbol("valve"); saveCurrentProject(); };
const addMeter = document.getElementById("addMeterBtn");
if (addMeter) addMeter.onclick = () => { addSymbol("meter"); saveCurrentProject(); };
const addRiserBtn = document.getElementById("addRiserBtn");
if (addRiserBtn) addRiserBtn.onclick = () => {
  addRiser(planCanvas.width/2, planCanvas.height/2);
  saveCurrentProject();
};
const drawGridBtn = document.getElementById("drawGridBtn");
if (drawGridBtn) drawGridBtn.onclick = () => { drawGrid(); };
const clearBtn = document.getElementById("clearCanvasBtn");
if (clearBtn) clearBtn.onclick = () => {
  initIso();
  initPlan();
  saveCurrentProject();
};
const saveBtn = document.getElementById("saveIsoBtn");
if (saveBtn) saveBtn.onclick = () => {
  saveCurrentProject();
  alert("ذخیره شد");
};
const scaleSel = document.getElementById("scaleSelect");
if (scaleSel) scaleSel.onchange = updateScale;

// سایر رویدادها
const projSel = document.getElementById("projectSelect");
if (projSel) projSel.onchange = e => {
  currentProjectId = e.target.value;
  saveAll();
  loadCurrentProject();
  render();
};
const newBtn = document.getElementById("newProjectBtn");
if (newBtn) newBtn.onclick = createNewProject;
const delBtn = document.getElementById("deleteProjectBtn");
if (delBtn) delBtn.onclick = deleteCurrentProject;
["projectName","projectAddress","inspectorName","visitDate"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.oninput = () => { saveCurrentProject(); render(); };
});
const searchEl = document.getElementById("search");
if (searchEl) searchEl.oninput = render;
const catEl = document.getElementById("categoryFilter");
if (catEl) catEl.onchange = render;
const statEl = document.getElementById("statusFilter");
if (statEl) statEl.onchange = render;
const printBtn = document.getElementById("printBtn");
if (printBtn) printBtn.onclick = () => {
  preparePrint();
  setTimeout(() => window.print(), 300);
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(()=>{});
}

// شروع
initIso();
initPlan();
updateScale();
if (!projects.length) createNewProject();
else {
  renderProjectSelect();
  loadCurrentProject();
  render();
}
