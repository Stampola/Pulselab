# GitHub + Cloudflare Pages — Step by Step

ทำตามนี้ครั้งเดียว ครั้งหน้าแค่ `git push` เว็บก็ update เอง

---

## Prerequisites (เช็คก่อน)

- [ ] มี Git ติดตั้งบน Windows — เปิด PowerShell แล้วพิมพ์ `git --version` ถ้าไม่มีโหลด: https://git-scm.com/download/win
- [ ] มี GitHub account — สมัครฟรีที่ https://github.com/signup ถ้ายังไม่มี
- [ ] Login Cloudflare แล้วใน https://dash.cloudflare.com

---

## Step 1 — เคลียร์ git lock (ถ้ามี)

เปิด PowerShell ที่ `C:\Users\Sethakorn\WEB-Create` (Shift + คลิกขวาในโฟลเดอร์ → "Open PowerShell window here")

```powershell
# ลบ lock file ที่ค้างอยู่ (ถ้ามี)
Remove-Item .git\index.lock -ErrorAction SilentlyContinue
```

---

## Step 2 — สร้าง repo ใหม่บน GitHub

1. เปิด https://github.com/new
2. **Repository name:** `pulselab`
3. **Visibility:** Private (แนะนำ — code ไม่เผยแพร่)
4. **อย่าติ๊ก** "Add a README" หรือ ".gitignore" หรือ "license" — เรามีอยู่แล้ว
5. กด **Create repository**
6. คัดลอก URL ที่ขึ้นมา เช่น `https://github.com/YOUR_USERNAME/pulselab.git`

---

## Step 3 — Commit + push code

ใน PowerShell (ที่ `C:\Users\Sethakorn\WEB-Create`):

```powershell
# ตั้งชื่อ + email ของคุณ (ใช้ครั้งแรกครั้งเดียว)
git config user.name "Your Name"
git config user.email "your-email@example.com"

# Stage + commit ทุกอย่าง
git add -A
git commit -m "Rebrand to Pulselab + futuristic neon design"

# เพิ่ม GitHub remote (แทน YOUR_USERNAME ด้วยของจริง)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pulselab.git
git push -u origin main
```

ตอน push จะถาม login GitHub — กรอก username + Personal Access Token (ไม่ใช่ password ปกติ)

**ถ้ายังไม่มี Personal Access Token:**
1. https://github.com/settings/tokens/new
2. **Note:** "Pulselab deploy"
3. **Expiration:** 90 days (หรือนานกว่า)
4. **Scopes:** ติ๊ก `repo` (อันใหญ่)
5. **Generate token** → คัดลอก token ขึ้นต้น `ghp_...`
6. ใช้ token เป็น password ตอนที่ git ถาม

หรือใช้ **GitHub CLI** ง่ายกว่า:
```powershell
# โหลด GitHub CLI ที่ https://cli.github.com แล้ว
gh auth login
# ตอบคำถามตามที่ขึ้น (เลือก HTTPS + login via browser)
```

---

## Step 4 — Connect Cloudflare Pages กับ GitHub

1. https://dash.cloudflare.com → **Workers & Pages**
2. **Create application** → tab **Pages** → **Connect to Git**
3. **Connect GitHub** → authorize Cloudflare (ครั้งแรกครั้งเดียว)
4. เลือก repo **pulselab** → **Begin setup**
5. **Build settings:**
   - Framework preset: **None**
   - Build command: (เว้นว่าง)
   - Build output directory: `/`
6. **Save and Deploy**
7. รอ ~30 วินาที — ได้ URL `pulselab-XXX.pages.dev`

---

## Step 5 — Workflow หลังจากนี้

ทุกครั้งที่อยากแก้เว็บ:

```powershell
# แก้ไฟล์อะไรก็ได้ใน WEB-Create
# ...

# Push update
git add -A
git commit -m "อธิบายว่าแก้อะไร"
git push
```

Cloudflare เห็น push → auto-build + deploy ภายใน 30 วินาที

---

## Custom domain `pulselab.work` (เมื่อ register แล้ว)

1. Cloudflare Pages project → **Custom domains** → **Set up a custom domain**
2. กรอก `pulselab.work` → **Continue**
3. ถ้า domain อยู่ใน Cloudflare account คุณแล้ว → เสร็จเลย (SSL อัตโนมัติ)
4. ถ้าซื้อจาก registrar อื่น (Namecheap, GoDaddy ฯลฯ) → Cloudflare แจ้ง nameservers → ไปเปลี่ยนที่ registrar → รอ DNS 5–15 นาที

---

## Rollback (ถ้า update แล้วเว็บพัง)

ใน Cloudflare Pages → Deployments → คลิก commit ก่อนหน้า → **Rollback to this deployment**

หรือใน git:
```powershell
git revert HEAD
git push
```

---

## Troubleshooting

**`git push` reject "fetch first":**
```powershell
git pull origin main --rebase
git push
```

**"Permission denied (publickey)":**  ใช้ HTTPS URL แทน SSH:
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/pulselab.git
```

**Cloudflare deploy fail:** ดู build log — ส่วนใหญ่เป็นเพราะ build command ไม่ว่าง (ต้องเว้นว่าง) หรือ output dir ผิด (ต้องเป็น `/`)
