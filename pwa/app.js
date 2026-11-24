// چک‌لیست پایه
const checklistData = [
  { id: 1, category: "SAFETY", title: "حضور مجری ذی‌صلاح در محل ساختمان", priority: "CRITICAL", regulation: "مبحث ۲ مقررات ملی ساختمان (نظامات اداری)", status: "NOT_COMPLETED", notes: "" },
  { id: 2, category: "SAFETY", title: "استفاده از کلاه ایمنی توسط کارگران و ناظر", priority: "CRITICAL", regulation: "مبحث ۱۲ مقررات ملی ساختمان (ایمنی و حفاظت کار)", status: "NOT_COMPLETED", notes: "" },
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
    checklist: JSON.parse(JSON.stringify(checklistData))
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
}

function saveCurrentProject() {
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;
  project.name = document.getElementById("projectName").value;
  project.address = document.getElementById("projectAddress").value;
  project.inspector = document.getElementById("inspectorName").value;
  project.date = document.getElementById("visitDate").value;
  project.checklist = items;
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

  // گزارش
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
document.getElementById("printBtn").addEventListener("click", () => window.print());

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(console.error);
}

// شروع
if (projects.length === 0) createNewProject();
else {
  renderProjectSelect();
  loadCurrentProject();
  render();
}
