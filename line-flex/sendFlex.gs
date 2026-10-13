/**
 * ToGreater · LINE Flex Flow (Google Apps Script)
 * วางไฟล์นี้ในโปรเจกต์ GAS เดียวกับที่รับฟอร์มลงทะเบียน (GAS_WEB_APP_URL ใน index.html)
 *
 * ตั้งค่าใน Project Settings → Script Properties:
 *   LINE_CHANNEL_ACCESS_TOKEN  = Channel access token ของ LINE OA (Messaging API)
 *   FLEX_BASE_URL              = URL ที่โฮสต์ repo นี้ เช่น https://<user>.github.io/dsme-2026
 *   WORKSHOP_URL, CALENDAR_URL, JOIN_URL, WORKSHOP_DATE, WORKSHOP_TIME, WORKSHOP_LOCATION
 */

const FLEX_STEPS = {
  registered: '01-registered.json',   // ส่งทันทีหลังกดลงทะเบียน
  reminder:   '02-reminder-d1.json',  // ส่งก่อนวันเรียน 1 วัน
  classDay:   '03-class-day.json',    // ส่งก่อนเริ่มเรียน ~1 ชม.
  offer:      '04-offer.json'         // ส่งหลังเรียนจบ (ปิดการขาย)
};

const LINE_OA_URL = 'https://line.me/R/ti/p/@togreater';

function props_() {
  return PropertiesService.getScriptProperties().getProperties();
}

/** ส่ง Flex ขั้น `step` ให้ userId โดยเติมค่าจาก `data` (ข้อมูลจากฟอร์ม) */
function sendFlexStep(userId, step, data) {
  const p = props_();
  const file = FLEX_STEPS[step];
  if (!userId || !file) throw new Error('missing userId or unknown step: ' + step);

  const vars = {
    imgBase:      p.FLEX_BASE_URL,
    fullName:     data.fullName || data.displayName,
    businessName: data.businessName,
    service:      data.services,
    aiGoal:       data.aiGoal,
    date:         p.WORKSHOP_DATE,
    time:         p.WORKSHOP_TIME,
    location:     p.WORKSHOP_LOCATION,
    workshopUrl:  p.WORKSHOP_URL || LINE_OA_URL,
    calendarUrl:  p.CALENDAR_URL || LINE_OA_URL,
    joinUrl:      p.JOIN_URL || LINE_OA_URL
  };

  const tpl = UrlFetchApp.fetch(p.FLEX_BASE_URL + '/line-flex/' + file).getContentText();
  // LINE ไม่รับ text ว่าง จึงใส่ "-" แทนค่าที่ไม่มี และ escape ให้ JSON ไม่พัง
  const filled = tpl.replace(/\{\{(\w+)\}\}/g, (_, k) =>
    JSON.stringify(String(vars[k] || '-')).slice(1, -1));

  const res = UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + p.LINE_CHANNEL_ACCESS_TOKEN },
    payload: JSON.stringify({ to: userId, messages: [JSON.parse(filled)] }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) console.error('LINE push failed', res.getContentText());
  return res.getResponseCode();
}

/** ตัวอย่าง: เรียกใน doPost หลังบันทึกลงชีต */
// sendFlexStep(formData.userId, 'registered', formData);
