// چک‌لیست پایه (همان کد قبلی)
const checklistData = [
  { id: 1, category: "SAFETY", title: "حضور مجری ذی‌صلاح در محل ساختمان", priority: "CRITICAL", regulation: "مبحث ۲ مقررات ملی ساختمان (نظامات اداری)", status: "NOT_COMPLETED", notes: "" },
  { id: 2, category: "SAFETY", title: "استفاده از کلاه ایمنی بتوسط کارگران و ناظر", priority: "CRITICAL", regulation: "مبحث ۱۲ مقررات ملی ساختمان (ایمنی و حفاظت کار)", status: "NOT_COMPLETED", notes: "" },
  { id: 3, category: "SAFETY", title: "استفاده از دستکش ایمنی مناسب با نوع کار", priority: "CRITICAL", regulation: "مبحث ۱۲ مقررات ملی ساختمان", status: "NOT_COMPLETED", notes: "" },
  { id: 4, category: "SAFETY", title: "استفاده از کفش ایمنی مناسب", priority: "HIGH", regulation: "مبحث ۱۲ مقررات ملی ساختمان", status: "NOT_COMPLETED", notes: "" },
  { id: 5, category: "SAFETY", title: "وجود سایر وسایل حفاظت فردی مورد نیاز (جلیقه، ماسک، کمربند ایمنی)", priority: "MEDIUM", regulation: "مبحث ۱۲ مقررات ملی ساختمان", status: "NOT_COMPLETED", notes: "" },
  { id: 6, category: "BEFORE_CONSTRUCTION", title: "بررسی تطابق نقشه‌های مکانیکی مصوب با معماری و سازه ساختمان", priority: "HIGH", regulation: "مبحث ۲ و مبحث ۱۴", status: "NOT_COMPLETED", notes: "" },
  { id: 7, category: "BEFORE_CONSTRUCTION", title: "بررسی مساحت، ارتفاع و تهویه مناسب فضای موتورخانه بر اساس ظرفیت تجهیزات", priority: "CRITICAL", regulation: "مبحث ۱۴ (تاسیسات مکانیکی)", status: "NOT_COMPLETED", notes: "" },
  { id: 8, category: "BEFORE_CONSTRUCTION", title: "تطبیق ظرفیت دیگ، مشعل و مخازن ذخیره با مندرجات نقشه‌های مصوب", priority: "MEDIUM", regulation: "مبحث ۱۴", status: "NOT_COMPLETED", notes: "" },
  { id: 9, category: "BEFORE_CONSTRUCTION", title: "بررسی مسیر، ابعاد و استانداردهای مصالح دودکش‌ها", priority: "CRITICAL", regulation: "مبحث ۱۷ و مبحث ۱۴", status: "NOT_COMPLETED", notes: "" },
  { id: 10, category: "DURING_CONSTRUCTION", title: "کنترل شیب‌بندی صحیح، سایزینگ و تراز لوله‌کشی‌های فاضلاب و آب باران", priority: "HIGH", regulation: "مبحث ۱۶ (تاسیسات بهداشتی)", status: "NOT_COMPLETED", notes: "" },
  { id: 11, category: "DURING_CONSTRUCTION", title: "بررسی نصب صحیح ساپورت‌ها و بست‌های مهار لوله‌کشی", priority: "MEDIUM", regulation: "مبحث ۱۶ و ۱۴", status: "NOT_COMPLETED", notes: "" },
  { id: 12, category: "DURING_CONSTRUCTION", title: "کنترل عایق‌کاری حرارتی لوله‌های آب گرم و کانال‌ها", priority: "MEDIUM", regulation: "مبحث ۱۹ و مبحث ۱۴", status: "NOT_COMPLETED", notes: "" },
  { id: 13, category: "DURING_CONSTRUCTION", title: "کنترل عدم تداخل لوله‌کشی گاز با کابل‌های برق و داکت‌های هواکش", priority: "CRITICAL", regulation: "مبحث ۱۷", status: "NOT_COMPLETED", notes: "" },
  { id: 14, category: "BEFORE_FINAL_APPROVAL", title: "نظارت بر تست آب‌بندی فاضلاب", priority: "HIGH", regulation: "مبحث ۱۶", status: "NOT_COMPLETED", notes: "" },
  { id: 15, category: "BEFORE_FINAL_APPROVAL", title: "نظارت بر تست فشار هیدرواستاتیک لوله‌کشی آب", priority: "HIGH", regulation: "مبحث ۱۶", status: "NOT_COMPLETED", notes: "" },
  { id: 16, category: "BEFORE_FINAL_APPROVAL", title: "نظارت بر تست نشت دودکش‌ها", priority: "CRITICAL", regulation: "مبحث ۱۷", status: "NOT_COMPLETED", notes: "" },
  { id: 17, category: "BEFORE_FINAL_APPROVAL", title: "تست عملکرد تجهیزات موتورخانه (دیگ، مشعل، پمپ)", priority: "MEDIUM", regulation: "مبحث ۱۴", status: "NOT_COMPLETED", notes: "" }
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
  const newProject = {
    id,
    name: "پروژه جدید",
    address: "",
    inspector: "",
    date: "",
    checklist: JSON.parse(JSON.stringify(checklistData)),
    isoData: null,
    planData: null
  };
  projects.push(newProject);
  currentProjectId = id;
  saveAll();
  loadCurrentProject();
  renderProjectSelect();
  render();
}

function deleteCurrentProject() {
  if (!currentProjectId || projects.length <= 1) {
    alert("حداقل یک پروژه باید باقی بماند.");
    return;
  }
  if (!confirm("آیا مطمئنید می‌خواهید این پروژه را حذف کنید؟")) return;
  projects = projects.filter(p => p.id !== currentProjectId);
  currentProjectId = projects[0]?.id || null;
  saveAll();
  loadCurrentProject();
  renderProjectSelect();
  render();
}

function loadCurrentProject() {
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) {
    if (projects.length === 0) createNewProject();
    return;
  }
  items = project.checklist;
  document.getElementById("projectName").value = project.name || "";
  document.getElementById("projectAddress").value = project.address || "";
  document.getElementById("inspectorName").value = project.inspector || "";
  document.getElementById("visitDate").value = project.date || "";
  if (project.isoData) {
    loadIsoFromData(project.isoData);
  } else {
    clearCanvas();
    drawIsoGrid();
  }
  if (project.planData) {
    loadPlanFromData(project.planData);
  } else {
    clearPlan();
  }
}

function saveCurrentProject() {
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;
  project.name = document.getElementById("projectName").value;
  project.address = document.getElementById("projectAddress").value;
  project.inspector = document.getElementById("inspectorName").value;
  project.date = document.getElementById("visitDate").value;
  project.checklist = items;
  project.isoData = canvas.toDataURL("image/png");
  project.planData = planCanvas.toDataURL("image/png");
  saveAll();
}

function renderProjectSelect() {
  const select = document.getElementById("projectSelect");
  select.innerHTML = projects.map(p => 
    `<option value="${p.id}" ${p.id === currentProjectId ? "selected" : ""}>${p.name || "پروژه بدون نام"}</option>`
  ).join("");
}

function render() {
  const search = document.getElementById("search").value.toLowerCase();
  const cat = document.getElementById("categoryFilter").value;
  const stat = document.getElementById("statusFilter").value;

  const filtered = items.filter(item => {
    const matchSearch = item.title.includes(search) || item.regulation.includes(search);
    const matchCat = cat === "all" || item.category === cat;
    const matchStat = stat === "all" || item.status === stat;
    return matchSearch && matchCat && matchStat;
  });

  const container = document.getElementById("checklist");
  container.innerHTML = filtered.map(item => `
    <div class="item ${item.priority}">
      <h3>${item.title}</h3>
      <div class="meta">
        دسته: ${categoryName(item.category)} | اولویت: ${item.priority} | مرجع: ${item.regulation}
      </div>
      <div class="status-buttons">
        <button class="btn-not" onclick="setStatus(${item.id}, 'NOT_COMPLETED')">بررسی‌نشده</button>
        <button class="btn-ok" onclick="setStatus(${item.id}, 'COMPLETED')">تأیید</button>
        <button class="btn-fix" onclick="setStatus(${item.id}, 'REQUIRES_CORRECTION')">نیاز به اصلاح</button>
      </div>
      <textarea class="notes" placeholder="یادداشت ناظر..." onchange="setNotes(${item.id}, this.value)">${item.notes || ""}</textarea>
    </div>
  `).join("");

  const project = projects.find(p => p.id === currentProjectId) || {};
  document.getElementById("reportHeader").innerHTML = `
    <p><strong>نام پروژه:</strong> ${project.name || "پروژه نامشخص‌نشده"}</p>
    <p><strong>آدرس:</strong> ${project.address || "—"}</p>
    <p><strong>ناظر:</strong> ${project.inspector || "—"} | <strong>تاریخ بازدید:</strong> ${project.date || "—"}</p>
    <p>پیرو بازدید به عمل آمده در تاریخ ${project.date || "—"} از پروژه ساختمانی مذکور، گزارش نظارت به شرح ذیل ارائه می‌گردد.</p>
  `;

  document.getElementById("reportContent").innerHTML = filtered.map(item => `
    <div class="item">
      <strong>${item.title}</strong><br>
      وضعیت: ${statusName(item.status)} | مرجع: ${item.regulation}<br>
      ${item.notes ? "یادداشت: " + item.notes : ""}
    </div>
  `).join("");

  const total = items.length;
  const completed = items.filter(i => i.status === "COMPLETED").length;
  const needsFix = items.filter(i => i.status === "REQUIRES_CORRECTION").length;
  const notDone = items.filter(i => i.status === "NOT_COMPLETED").length;

  document.getElementById("reportSummary").innerHTML = `
    <h3>خلاصه وضعیت</h3>
    <p>کل بندها: ${total} | تأیید شده: ${completed} | نیاز به اصلاح: ${needsFix} | بررسی‌نشده: ${notDone}</p>
  `;
}

function categoryName(c) {
  const map = {
    SAFETY: "ایمنی",
    BEFORE_CONSTRUCTION: "قبل از ساخت",
    DURING_CONSTRUCTION: "حین ساخت",
    BEFORE_FINAL_APPROVAL: "قبل از تأیید نهایی"
  };
  return map[c] || c;
}

function statusName(s) {
  const map = {
    NOT_COMPLETED: "بررسی‌نشده",
    COMPLETED: "تأیید شده",
    REQUIRES_CORRECTION: "نیاز به اصلاح"
  };
  return map[s] || s;
}

function setStatus(id, status) {
  const item = items.find(i => i.id === id);
  if (item) item.status = status;
  saveCurrentProject();
  render();
}

function setNotes(id, notes) {
  const item = items.find(i => i.id === id);
  if (item) item.notes = notes;
  saveCurrentProject();
}

// تب‌های ابزارها

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tool-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
  });
});

// ابزار ایزومتریک + پلان ۲بعدی
const canvas = document.getElementById("isoCanvas");
const ctx = canvas.getContext("2d");
const planCanvas = document.getElementById("planCanvas");
const planCtx = planCanvas.getContext("2d");
let currentDirection = "north";
let lastPoint = { x: 350, y: 250 };
let planRisers = [];

// فعال‌سازی بهبود کیفیت تصویر
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";
planCtx.imageSmoothingEnabled = true;
planCtx.imageSmoothingQuality = "high";

function updateScaleDisplay() {
  const scale = document.getElementById("scaleSelect").value;
  const scaleText = scale === "50" ? "۱:۵۰" : "۱:۱۰۰";
  const el = document.getElementById("currentScale");
  if (el) el.textContent = scaleText;
}

function getPipeColor() {
  const size = document.getElementById("pipeSize").value;
  const colors = {
    "1/2": "#3B82F6",
    "3/4": "#10B981",
    "1": "#F59E0B",
    "1.5": "#EF4444",
    "2": "#8B5CF6"
  };
  return colors[size] || "#3B82F6";
}

function clearCanvas() {
  ctx.fillStyle = "#1E293B";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function clearPlan() {
  planCtx.fillStyle = "#1E293B";
  planCtx.fillRect(0, 0, planCanvas.width, planCanvas.height);
  planRisers = [];
}

function drawIsoGrid() {
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 0.8;
  const step = 40;
  const angle = Math.PI / 6;

  for (let y = 50; y < canvas.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  for (let x = -200; x < canvas.width + 200; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, canvas.height);
    ctx.lineTo(x + canvas.height * Math.tan(angle), 0);
    ctx.stroke();
  }

  for (let x = -200; x < canvas.width + 200; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, canvas.height);
    ctx.lineTo(x - canvas.height * Math.tan(angle), 0);
    ctx.stroke();
  }
}

function drawPipeInDirection(dir, length = 80) {
  const angleMap = {
    north: -Math.PI / 6,
    east: Math.PI / 6,
    south: Math.PI * 5 / 6,
    west: -Math.PI * 5 / 6,
    up: -Math.PI / 2,
    down: Math.PI / 2
  };

  const angle = angleMap[dir] || 0;
  const endX = lastPoint.x + Math.cos(angle) * length;
  const endY = lastPoint.y + Math.sin(angle) * length;

  ctx.strokeStyle = getPipeColor();
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  ctx.fillStyle = "#F1F5F9";
  ctx.beginPath();
  ctx.arc(endX, endY, 4, 0, Math.PI * 2);
  ctx.fill();

  lastPoint = { x: endX, y: endY };
}

function loadIsoFromData(dataUrl) {
  const img = new Image();
  img.onload = () => {
    clearCanvas();
    ctx.drawImage(img, 0, 0);
  };
  img.src = dataUrl;
}

function loadPlanFromData(dataUrl) {
  const img = new Image();
  img.onload = () => {
    clearPlan();
    planCtx.drawImage(img, 0, 0);
  };
  img.src = dataUrl;
}

function drawRiserOnPlan(x, y) {
  planCtx.strokeStyle = "#F59E0B";
  planCtx.lineWidth = 3;
  planCtx.beginPath();
  planCtx.arc(x, y, 12, 0, Math.PI * 2);
  planCtx.stroke();
  planCtx.fillStyle = "#F59E0B";
  planCtx.font = "bold 12px Tahoma";
  planCtx.fillText("R", x - 4, y + 4);
  planRisers.push({x, y});
}

function getHighQualityDataURL(sourceCanvas) {
  return sourceCanvas.toDataURL("image/png");
}

function preparePrint() {
  const mapsDiv = document.getElementById("reportMaps");
  const planImg = getHighQualityDataURL(planCanvas);
  const isoImg = getHighQualityDataURL(canvas);

  mapsDiv.innerHTML = `
    <div style="text-align:center; margin:1.5rem 0; page-break-inside:avoid;">
      <h3>پلان ۲بعدی</h3>
      <img src="${planImg}" style="max-width:90%; height:auto; border:1px solid #999; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />
    </div>
    <div style="text-align:center; margin:1.5rem 0; page-break-inside:avoid;">
      <h3>نمای ایزومتریک</h3>
      <img src="${isoImg}" style="max-width:90%; height:auto; border:1px solid #999; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />
    </div>
  `;
}

function getCanvasPoint(canvasEl, event) {
  const rect = canvasEl.getBoundingClientRect();
  const scaleX = canvasEl.width / rect.width;
  const scaleY = canvasEl.height / rect.height;
  let clientX, clientY;
  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

// دکمه‌های جهت
["dirNorth", "dirEast", "dirSouth", "dirWest", "dirUp", "dirDown"].forEach(id => {
  document.getElementById(id).addEventListener("click", () => {
    const dir = id.replace("dir", "").toLowerCase();
    currentDirection = dir;
    drawPipeInDirection(dir);
    saveCurrentProject();
  });
});

function handleCanvasInteraction(e) {
  e.preventDefault();
  const point = getCanvasPoint(canvas, e);
  lastPoint.x = point.x;
  lastPoint.y = point.y;
  drawPipeInDirection(currentDirection);
  saveCurrentProject();
}

canvas.addEventListener("click", handleCanvasInteraction);
canvas.addEventListener("touchend", handleCanvasInteraction, { passive: false });

function handlePlanInteraction(e) {
  e.preventDefault();
  const point = getCanvasPoint(planCanvas, e);
  drawRiserOnPlan(point.x, point.y);
  saveCurrentProject();
}

planCanvas.addEventListener("click", handlePlanInteraction);
planCanvas.addEventListener("touchend", handlePlanInteraction, { passive: false });

document.getElementById("addElbowBtn").addEventListener("click", () => {
  ctx.strokeStyle = getPipeColor();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(lastPoint.x, lastPoint.y, 30, Math.PI, Math.PI * 1.5);
  ctx.stroke();
  saveCurrentProject();
});

document.getElementById("addValveBtn").addEventListener("click", () => {
  ctx.strokeStyle = "#EF4444";
  ctx.lineWidth = 3;
  ctx.strokeRect(lastPoint.x - 18, lastPoint.y - 12, 36, 24);
  ctx.beginPath();
  ctx.moveTo(lastPoint.x - 18, lastPoint.y);
  ctx.lineTo(lastPoint.x + 18, lastPoint.y);
  ctx.stroke();
  saveCurrentProject();
});

document.getElementById("addMeterBtn").addEventListener("click", () => {
  ctx.strokeStyle = "#10B981";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(lastPoint.x, lastPoint.y, 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 14px Tahoma";
  ctx.fillText("M", lastPoint.x - 6, lastPoint.y + 5);
  saveCurrentProject();
});

document.getElementById("addRiserBtn").addEventListener("click", () => {
  drawRiserOnPlan(planCanvas.width / 2, planCanvas.height / 2);
  saveCurrentProject();
});

document.getElementById("drawGridBtn").addEventListener("click", () => {
  drawIsoGrid();
});

document.getElementById("clearCanvasBtn").addEventListener("click", () => {
  clearCanvas();
  drawIsoGrid();
  clearPlan();
  lastPoint = { x: 350, y: 250 };
  saveCurrentProject();
});

document.getElementById("saveIsoBtn").addEventListener("click", () => {
  saveCurrentProject();
  alert("نقشه ایزومتریک و پلان در پروژه ذخیره شد.");
});

document.getElementById("scaleSelect").addEventListener("change", updateScaleDisplay);

// رویدادها

document.getElementById("projectSelect").addEventListener("change", (e) => {
  currentProjectId = e.target.value;
  saveAll();
  loadCurrentProject();
  render();
});

document.getElementById("newProjectBtn").addEventListener("click", createNewProject);
document.getElementById("deleteProjectBtn").addEventListener("click", deleteCurrentProject);

["projectName", "projectAddress", "inspectorName", "visitDate"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => { saveCurrentProject(); render(); });
});

document.getElementById("search").addEventListener("input", render);
document.getElementById("categoryFilter").addEventListener("change", render);
document.getElementById("statusFilter").addEventListener("change", render);

document.getElementById("printBtn").addEventListener("click", () => {
  preparePrint();
  setTimeout(() => window.print(), 400);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(console.error);
}

// شروع
clearCanvas();
drawIsoGrid();
clearPlan();
updateScaleDisplay();
if (projects.length === 0) createNewProject();
else {
  renderProjectSelect();
  loadCurrentProject();
  render();
}
