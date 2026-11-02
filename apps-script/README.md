# ตั้งค่าซิงก์ Google Calendar → calendar.html

1. เปิด https://script.google.com แล้วสร้าง **โปรเจกต์ใหม่** (แยกจากโปรเจกต์ฟอร์มลงทะเบียน เพื่อไม่ให้ไปทับ `doPost` ตัวเดิม)
2. คัดลอกโค้ดจาก `calendar-sync.gs` ไปวาง แล้วแก้ `CONFIG` (เลือกปฏิทิน, จำนวนวันที่จะแสดง, ช่องที่จะโชว์)
3. เลือกฟังก์ชัน `setup` แล้วกด **Run** 1 ครั้ง จากนั้นอนุญาตสิทธิ์ Calendar (ขั้นนี้จะสร้าง trigger "onEventUpdated")
4. กด **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. คัดลอก URL ที่ลงท้ายด้วย `/exec` ไปใส่ใน `CALENDAR_API_URL` ใน `calendar.html`
6. ทดสอบ: สร้างนัดใหม่ใน Google Calendar แล้วรอดูหน้าเว็บ นัดควรขึ้นภายในประมาณ 20–60 วินาที

> ถ้าแก้โค้ด .gs ภายหลัง ให้ Deploy → Manage deployments → Edit → Version: New version (URL เดิมจะใช้ต่อได้)
