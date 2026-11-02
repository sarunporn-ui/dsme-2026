/**
 * DSME 2026 — Google Calendar → หน้าเว็บ (ซิงก์แบบ near-realtime)
 *
 * วิธีทำงาน
 *  1) Trigger "onEventUpdated" จะทำงานทุกครั้งที่ปฏิทินมีการสร้าง/แก้ไข/ลบนัด
 *     แล้วเปลี่ยนเลขเวอร์ชัน (CAL_VERSION)
 *  2) หน้าเว็บจะถาม ?since=<version> ทุก ๆ 20 วินาที
 *     - ถ้าเวอร์ชันยังเท่าเดิม → ตอบกลับสั้น ๆ { changed:false } (เบามาก)
 *     - ถ้าเวอร์ชันเปลี่ยน   → ส่งรายการนัดชุดใหม่ไปให้
 *
 * ติดตั้ง: ดูขั้นตอนใน apps-script/README.md
 */

const CONFIG = {
  CALENDAR_ID: 'primary',   // 'primary' = ปฏิทินหลักของบัญชีนี้ หรือใส่ Calendar ID ของปฏิทินแยก
  DAYS_BEHIND: 0,           // ย้อนหลังกี่วัน
  DAYS_AHEAD: 30,           // ล่วงหน้ากี่วัน
  SHOW_LOCATION: true,
  SHOW_DESCRIPTION: false,  // ถ้าคนนอกดูได้ แนะนำให้ปิดไว้ (false)
  ACCESS_KEY: ''            // ถ้าใส่ หน้าเว็บต้องส่ง ?key=... มาด้วยถึงจะดูได้
};

/* ---------- Web App ---------- */

function doGet(e) {
  const p = (e && e.parameter) || {};

  if (CONFIG.ACCESS_KEY && p.key !== CONFIG.ACCESS_KEY) {
    return json_({ ok: false, error: 'unauthorized' });
  }

  const version = getVersion_();

  if (p.since && p.since === version) {
    return json_({ ok: true, version: version, changed: false });
  }

  return json_({
    ok: true,
    version: version,
    changed: true,
    generatedAt: new Date().toISOString(),
    events: getEventsCached_(version)
  });
}

/* ---------- Trigger ---------- */

/** รันฟังก์ชันนี้ 1 ครั้งตอนติดตั้ง (และทุกครั้งที่เปลี่ยน CALENDAR_ID) */
function setup() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'onCalendarChange'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });

  ScriptApp.newTrigger('onCalendarChange')
    .forUserCalendar(resolveCalendarId_())
    .onEventUpdated()
    .create();

  bumpVersion_();
  Logger.log('ติดตั้งเรียบร้อย: ' + resolveCalendarId_() + ' | พบนัด ' + fetchEvents_().length + ' รายการ');
}

/** ถูกเรียกอัตโนมัติเมื่อปฏิทินมีการเปลี่ยนแปลง */
function onCalendarChange() {
  bumpVersion_();
}

/* ---------- Internal ---------- */

function resolveCalendarId_() {
  return CONFIG.CALENDAR_ID === 'primary'
    ? Session.getEffectiveUser().getEmail()
    : CONFIG.CALENDAR_ID;
}

function getVersion_() {
  const props = PropertiesService.getScriptProperties();
  let v = props.getProperty('CAL_VERSION');
  if (!v) { v = bumpVersion_(); }
  return v;
}

function bumpVersion_() {
  const v = String(Date.now());
  PropertiesService.getScriptProperties().setProperty('CAL_VERSION', v);
  return v;
}

function getEventsCached_(version) {
  const cache = CacheService.getScriptCache();
  const key = 'events_' + version;
  const hit = cache.get(key);
  if (hit) return JSON.parse(hit);

  const events = fetchEvents_();
  try { cache.put(key, JSON.stringify(events), 300); } catch (err) { /* ข้อมูลใหญ่เกิน 100KB ก็ข้ามแคชไป */ }
  return events;
}

function fetchEvents_() {
  const cal = CONFIG.CALENDAR_ID === 'primary'
    ? CalendarApp.getDefaultCalendar()
    : CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
  if (!cal) throw new Error('ไม่พบปฏิทิน: ' + CONFIG.CALENDAR_ID);

  const now = new Date();
  const start = new Date(now); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - CONFIG.DAYS_BEHIND);
  const end = new Date(now); end.setHours(23, 59, 59, 999); end.setDate(end.getDate() + CONFIG.DAYS_AHEAD);

  return cal.getEvents(start, end).map(function (ev) {
    const allDay = ev.isAllDayEvent();
    return {
      id: ev.getId() + '_' + ev.getStartTime().getTime(),
      title: ev.getTitle() || '(ไม่มีหัวข้อ)',
      start: (allDay ? ev.getAllDayStartDate() : ev.getStartTime()).toISOString(),
      end: (allDay ? ev.getAllDayEndDate() : ev.getEndTime()).toISOString(),
      allDay: allDay,
      location: CONFIG.SHOW_LOCATION ? (ev.getLocation() || '') : '',
      description: CONFIG.SHOW_DESCRIPTION ? (ev.getDescription() || '') : '',
      updated: ev.getLastUpdated().toISOString()
    };
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
