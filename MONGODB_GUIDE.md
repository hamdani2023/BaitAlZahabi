# 🍃 دليل MongoDB الكامل — مطعم النخبة

---

## 🔷 الفرق بين PostgreSQL و MongoDB

```
PostgreSQL (جداول SQL)          MongoDB (وثائق JSON)
─────────────────────          ─────────────────────
Table        →                 Collection
Row          →                 Document
Column       →                 Field
Primary Key (Int) →            _id (ObjectId)
Foreign Key  →                 Reference (ObjectId)
JOIN         →                 $lookup أو embed
SELECT * FROM orders →         db.orders.find({})
```

---

## 🏗️ بنية Collections في مشروعنا

```
📦 restaurant_db  ← اسم قاعدة البيانات
│
├── 📂 tables          ← الطاولات
├── 📂 menu_items      ← قائمة الطعام
├── 📂 orders          ← الطلبات
├── 📂 order_items     ← عناصر الطلبات
├── 📂 calls           ← نداءات النادل
├── 📂 bills           ← الفواتير
├── 📂 bill_items      ← عناصر الفواتير
└── 📂 reviews         ← التقييمات
```

---

## 📄 شكل كل Document

### tables — الطاولات
```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c0d",
  "number": 5,
  "capacity": 4,
  "status": "OCCUPIED",
  "createdAt": "2025-06-01T10:00:00.000Z",
  "updatedAt": "2025-06-01T12:30:00.000Z"
}
```
**القيم الممكنة لـ status:** `FREE` | `OCCUPIED` | `RESERVED` | `CALLING`

---

### menu_items — قائمة الطعام
```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c1a",
  "name": "كباب مشوي",
  "description": "كباب لحم مفروم مشوي على الفحم",
  "price": 65.0,
  "emoji": "🥩",
  "category": "GRILLS",
  "badge": "hot",
  "isAvailable": true,
  "sortOrder": 5,
  "createdAt": "2025-06-01T10:00:00.000Z",
  "updatedAt": "2025-06-01T10:00:00.000Z"
}
```
**القيم الممكنة لـ category:** `APPETIZERS` | `GRILLS` | `CHICKEN` | `SEAFOOD` | `SALADS` | `DRINKS` | `DESSERTS`

**القيم الممكنة لـ badge:** `"new"` | `"hot"` | `"veg"` | `null`

---

### orders — الطلبات
```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c2b",
  "tableId": "665f1a2b3c4d5e6f7a8b9c0d",
  "status": "PREPARING",
  "totalAmount": 158.0,
  "notes": null,
  "createdAt": "2025-06-01T12:00:00.000Z",
  "updatedAt": "2025-06-01T12:05:00.000Z"
}
```
**القيم الممكنة لـ status:** `PENDING` | `PREPARING` | `READY` | `DELIVERED` | `CANCELLED`

---

### order_items — عناصر الطلب
```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c3c",
  "orderId":    "665f1a2b3c4d5e6f7a8b9c2b",
  "menuItemId": "665f1a2b3c4d5e6f7a8b9c1a",
  "quantity":   2,
  "unitPrice":  65.0
}
```

---

### calls — نداءات النادل
```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c4d",
  "tableId": "665f1a2b3c4d5e6f7a8b9c0d",
  "type": "URGENT",
  "status": "PENDING",
  "message": "نداء عاجل",
  "createdAt": "2025-06-01T12:10:00.000Z",
  "updatedAt": "2025-06-01T12:10:00.000Z"
}
```
**type:** `URGENT` | `NORMAL` | `LOW`
**status:** `PENDING` | `ACCEPTED` | `DISMISSED`

---

### bills — الفواتير
```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c5e",
  "tableId":       "665f1a2b3c4d5e6f7a8b9c0d",
  "orderId":       "665f1a2b3c4d5e6f7a8b9c2b",
  "subtotal":      158.0,
  "vatAmount":     23.7,
  "totalAmount":   181.7,
  "paymentMethod": "CASH",
  "status":        "PENDING",
  "paidAt":        null,
  "createdAt":     "2025-06-01T13:00:00.000Z"
}
```
**paymentMethod:** `CASH` | `CARD` | `APPLE_PAY` | `STC_PAY`
**status:** `PENDING` | `PAID`

---

### reviews — التقييمات
```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c6f",
  "tableId":       "665f1a2b3c4d5e6f7a8b9c0d",
  "overallRating": 5,
  "foodRating":    5,
  "serviceRating": 4,
  "speedRating":   4,
  "cleanRating":   5,
  "comment":       "ممتاز جداً!",
  "createdAt":     "2025-06-01T14:00:00.000Z"
}
```

---

## 🔗 العلاقات (كيف ترتبط Collections)

```
tables._id  ←──────────────────┐
                                │ tableId
               orders.tableId ──┘
               calls.tableId  ──┘
               bills.tableId  ──┘
               reviews.tableId─┘

orders._id  ←──────────────────┐
                                │ orderId
               order_items.orderId ──┘
               bills.orderId ───────┘

menu_items._id ←───────────────┐
                                │ menuItemId
               order_items.menuItemId ──┘
               bill_items.menuItemId ───┘
```

---

## 🚀 طريقة الإعداد خطوة بخطوة

### الخيار 1: MongoDB Atlas (مجاني — موصى به للمبتدئين)

```
الخطوة 1: إنشاء حساب
  ↓
  اذهب لـ: mongodb.com/cloud/atlas
  اضغط: Try Free
  سجّل بالإيميل أو Google

الخطوة 2: إنشاء Cluster مجاني
  ↓
  اضغط: Build a Database
  اختر: M0 Free (مجاني للأبد)
  اختر: AWS أو Google Cloud
  اختر المنطقة الأقرب لك
  اضغط: Create

الخطوة 3: إعداد المستخدم
  ↓
  Database Access → Add New Database User
  Username: restaurant_user
  Password: اختر كلمة مرور قوية (احفظها!)
  Role: Atlas Admin
  اضغط: Add User

الخطوة 4: السماح بالاتصال
  ↓
  Network Access → Add IP Address
  اضغط: Allow Access from Anywhere
  (0.0.0.0/0)
  اضغط: Confirm

الخطوة 5: نسخ رابط الاتصال
  ↓
  Clusters → Connect
  Connect your application
  Driver: Node.js
  انسخ الرابط الذي يبدو هكذا:
  mongodb+srv://restaurant_user:<password>@cluster0.xxxxx.mongodb.net/

الخطوة 6: ضعه في .env
  ↓
  DATABASE_URL="mongodb+srv://restaurant_user:كلمة_مرورك@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority"
```

### الخيار 2: MongoDB محلي

```bash
# Windows: حمّل من mongodb.com/try/download/community
# Mac:
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# في .env:
DATABASE_URL="mongodb://localhost:27017/restaurant_db"
```

---

## 💻 تشغيل المشروع كاملاً

```bash
# 1. فك الضغط وادخل للمجلد
cd restaurant-nextjs

# 2. ثبّت المكتبات (تشمل Prisma + MongoDB driver)
npm install

# 3. ولّد Prisma Client
npx prisma generate

# 4. أنشئ Collections في MongoDB
npx prisma db push

# 5. أضف البيانات الأولية (20 طاولة + 19 صنف)
npm run db:seed

# 6. شغّل المشروع
npm run dev
```

ثم افتح:
- الزبون: http://localhost:3000
- الأدمن: http://localhost:3000/admin
- Prisma Studio (واجهة بصرية لـ MongoDB):
  npm run db:studio → http://localhost:5555

---

## 🔄 رحلة البيانات الكاملة

```
المتصفح (Next.js)
       │
       │ useQuery/useMutation
       ▼
lib/api.js (axios)
       │
       │ HTTP Request
       ▼
app/api/*/route.js
       │
       │ prisma.model.operation()
       ▼
lib/prisma.js (PrismaClient)
       │
       │ MongoDB Protocol
       ▼
MongoDB Atlas / محلي
       │
       ▼
📦 restaurant_db
   ├── tables
   ├── menu_items
   ├── orders
   ├── order_items
   ├── calls
   ├── bills
   ├── bill_items
   └── reviews
```

---

## ❓ أسئلة شائعة

**س: لماذا id نصي في MongoDB وليس رقماً؟**
ج: MongoDB يُولّد ObjectId تلقائياً وهو string مثل `"665f1a2b3c4d5e6f7a8b9c0d"` وليس رقماً متسلسلاً. هذا يسمح لـ MongoDB بالتوزيع على عدة سيرفرات بدون تعارض.

**س: لماذا لا توجد ENUMs في MongoDB schema؟**
ج: MongoDB لا يدعم ENUMs — نستخدم String ونتحقق من القيم في الكود.

**س: هل يمكن رؤية البيانات بصرياً؟**
ج: نعم، ثلاث طرق:
1. `npm run db:studio` → Prisma Studio (أسهل)
2. MongoDB Compass (تطبيق مجاني من MongoDB)
3. Atlas UI على الموقع مباشرة
