# LINE Flex Flow · Workshop LINE AI (ToGreater)

ชุดข้อความ Flex 4 ขั้น ต่อจากหน้าลงทะเบียน `index.html` ดีไซน์ตาม CI ToGreater (navy · น้ำเงิน · ส้มเน้น · น้องแมว)

| ขั้น | ไฟล์ | ส่งเมื่อ | เป้าหมาย |
|---|---|---|---|
| 1 | `01-registered.json` | ทันทีหลังกดลงทะเบียน | ยืนยัน + ย้ำข้อมูลที่กรอก |
| 2 | `02-reminder-d1.json` | ก่อนวันเรียน 1 วัน | ลดคนลงทะเบียนแล้วไม่มา |
| 3 | `03-class-day.json` | ก่อนเริ่มเรียน ~1 ชม. | พาเข้าห้องเรียน |
| 4 | `04-offer.json` (carousel 5 ใบ) | หลังเรียนจบ | ปิดการขาย 4 บริการ + โทรหาโค้ชเกรท |

ตัวแปร `{{...}}` ถูกเติมโดย `sendFlex.gs` (ดู Script Properties ในหัวไฟล์)
ดูตัวอย่างหน้าตาคร่าวๆ ได้ที่ `preview.png` และทดสอบของจริงได้ที่ LINE Flex Message Simulator (วาง `contents` ของไฟล์)

> รูปใน `img/` ต้องเปิดได้ผ่าน HTTPS สาธารณะ (เช่น GitHub Pages) และตั้ง `FLEX_BASE_URL` ให้ชี้ไปที่นั่น
