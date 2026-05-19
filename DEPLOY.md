# Deploy Guide — Pulselab

ลาก zip ทีเดียวจบ ไม่ต้องตั้งค่าอะไร

---

## วิธีง่ายสุด (60 วินาที)

### Option A — Netlify Drop (ไม่ต้อง login ก่อน)

1. เปิด https://app.netlify.com/drop
2. ลาก `pulselab-deploy.zip` ลงในกล่อง
3. รอ 30 วินาที — ได้ URL ฟรีทันที (เช่น `random-name-abc123.netlify.app`)
4. (Optional) **Claim site** → login → site เป็นของคุณ + ตั้งชื่อ + เชื่อม domain

### Option B — Cloudflare Pages (ดีกว่าสำหรับลูกค้าไทย)

1. https://dash.cloudflare.com → login (account เดียวกับ Capresso)
2. Sidebar ซ้าย → **Workers & Pages** → **Create application** → tab **Pages** → **Upload assets**
3. Project name: `pulselab`
4. ลาก `pulselab-deploy.zip` → **Deploy site**
5. รอ 30 วินาที → ได้ `pulselab.pages.dev`

---

## Contact Form — ทำงานทันทีไม่ต้อง setup

ฟอร์มใช้ **mailto:** — เมื่อคนกดส่ง:
1. เปิด email app ของเขา (Outlook, Gmail web, Mail.app)
2. มี subject + body พร้อมข้อมูลฟอร์มทั้งหมด ส่งไปที่ `hello@pulselab.work`
3. เขากด Send

**ถ้าอยากเปลี่ยน email รับฟอร์ม:** แก้ `assets/js/main.js` บรรทัด ~217 บริเวณ `CONTACT_EMAIL = 'hello@pulselab.work';` เป็น email ของคุณ

ข้อมูลฟอร์มยังถูกเก็บใน admin/leads (localStorage) เป็นสำรอง

---

## Connect custom domain (หลัง register `.com`)

### Netlify
1. Site settings → Domain management → Add custom domain → กรอก `pulselab.work`
2. Netlify บอก DNS records ที่ต้องเพิ่มใน registrar → เพิ่มแล้วรอ ~10 นาที

### Cloudflare Pages
1. ใน Project → **Custom domains** → **Set up a custom domain** → `pulselab.work`
2. ถ้า domain อยู่ใน Cloudflare แล้ว → เสร็จเลย
3. ถ้าไม่ใช่ → Cloudflare แจ้ง nameservers ให้เปลี่ยนที่ registrar

SSL ติดตั้งอัตโนมัติทั้งคู่

---

## Pre-deploy checklist (อันที่เหลือต้องแก้)

- [ ] **Email:** แก้ `CONTACT_EMAIL` ใน `main.js` ถ้าไม่ใช่ hello@pulselab.work
- [ ] **Admin password:** `admin/login.html` — เปลี่ยน `DEMO_CREDENTIALS` ถ้าจะใช้จริง (หรือป้องกัน /admin ด้วย Cloudflare Access)
- [ ] **Company info:** privacy/terms/pdpa pages — แทน "Bangkok, Thailand" + phone ด้วยข้อมูลจริง
- [ ] **Social URLs:** search `facebook.com/pulselab` ใน HTML แทนด้วย URL จริง
- [ ] **Portfolio data:** แก้ `assets/js/data.js` ใส่ผลงานจริง
- [ ] **Analytics:** เพิ่ม Google Analytics 4 ใน `<head>` ทุก HTML (หรือใช้ Cloudflare Web Analytics ฟรี)

---

## Test after deploy

- เปิด homepage → ตรวจ neon theme, animation
- กรอก contact form → กด Send → ต้องเปิด email app
- เข้า /admin/login.html → email: `admin@pulselab.work` / password: `pulselab2026` (เปลี่ยนตอน production!)
- ทดสอบ TH/EN toggle + Light/Dark toggle
- ทดสอบเปิด URL มั่ว เช่น /xyz123 → ต้องไป 404.html
- ทดสอบบนมือถือ
