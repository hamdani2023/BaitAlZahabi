# 🗄️ دليل قاعدة البيانات — مطعم النخبة

---

## 🔷 خريطة العلاقات بين الجداول

```
Table (الطاولات)
  ├──► Order[]       (طلبات)
  │      └──► OrderItem[]  (عناصر الطلب)
  │             └──► MenuItem  (الصنف)
  │
  ├──► Call[]        (نداءات النادل)
  │
  ├──► Bill[]        (الفواتير)
  │      └──► BillItem[]   (عناصر الفاتورة)
  │             └──► MenuItem  (الصنف)
  │
  └──► Review[]      (التقييمات)

MenuItem (أصناف القائمة)
  ├──► OrderItem[]   (مُستخدم في طلبات)
  └──► BillItem[]    (مُستخدم في فواتير)
```

---

## 📊 الجداول التفصيلية

### 1. جدول `tables` — الطاولات
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | INT PK | معرّف فريد تلقائي |
| number | INT UNIQUE | رقم الطاولة (1-20) |
| capacity | INT | عدد الكراسي |
| status | ENUM | FREE / OCCUPIED / RESERVED / CALLING |
| createdAt | DATETIME | وقت الإنشاء |
| updatedAt | DATETIME | آخر تحديث |

### 2. جدول `menu_items` — قائمة الطعام
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | INT PK | معرّف فريد |
| name | TEXT | اسم الصنف |
| description | TEXT? | الوصف (اختياري) |
| price | DECIMAL(10,2) | السعر بدقة عشرية |
| emoji | TEXT | الإيموجي |
| category | ENUM | APPETIZERS / GRILLS / CHICKEN ... |
| badge | TEXT? | new / hot / veg / null |
| isAvailable | BOOL | هل متاح؟ |
| sortOrder | INT | ترتيب الظهور |

### 3. جدول `orders` — الطلبات
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | INT PK | معرّف فريد |
| tableId | INT FK | ← tables.id |
| status | ENUM | PENDING / PREPARING / READY / DELIVERED / CANCELLED |
| totalAmount | DECIMAL | المجموع الكلي |
| notes | TEXT? | ملاحظات |
| createdAt | DATETIME | وقت الطلب |

### 4. جدول `order_items` — عناصر الطلب
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | INT PK | معرّف فريد |
| orderId | INT FK | ← orders.id |
| menuItemId | INT FK | ← menu_items.id |
| quantity | INT | الكمية |
| unitPrice | DECIMAL | السعر وقت الطلب |

### 5. جدول `calls` — نداءات النادل
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | INT PK | معرّف فريد |
| tableId | INT FK | ← tables.id |
| type | ENUM | URGENT / NORMAL / LOW |
| status | ENUM | PENDING / ACCEPTED / DISMISSED |
| message | TEXT? | رسالة مخصصة |
| createdAt | DATETIME | وقت النداء |

### 6. جدول `bills` — الفواتير
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | INT PK | معرّف فريد |
| tableId | INT FK | ← tables.id |
| orderId | INT? FK | ← orders.id |
| subtotal | DECIMAL | المجموع قبل الضريبة |
| vatAmount | DECIMAL | قيمة الضريبة 15% |
| totalAmount | DECIMAL | الإجمالي النهائي |
| paymentMethod | ENUM | CASH / CARD / APPLE_PAY / STC_PAY |
| status | ENUM | PENDING / PAID |
| paidAt | DATETIME? | وقت الدفع |

### 7. جدول `bill_items` — عناصر الفاتورة
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | INT PK | - |
| billId | INT FK | ← bills.id |
| menuItemId | INT FK | ← menu_items.id |
| quantity | INT | الكمية |
| unitPrice | DECIMAL | السعر |
| lineTotal | DECIMAL | quantity × unitPrice |

### 8. جدول `reviews` — التقييمات
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | INT PK | - |
| tableId | INT FK | ← tables.id |
| overallRating | INT | 1-5 |
| foodRating | INT? | تقييم الطعام |
| serviceRating | INT? | تقييم الخدمة |
| speedRating | INT? | تقييم السرعة |
| cleanRating | INT? | تقييم النظافة |
| comment | TEXT? | تعليق |

---

## 🚀 خطوات تشغيل قاعدة البيانات

### الخيار 1: SQLite (أسهل للبدء)
```bash
# 1. عدّل prisma/schema.prisma
# غيّر: provider = "postgresql"
# إلى:  provider = "sqlite"

# 2. عدّل .env
# DATABASE_URL="file:./prisma/dev.db"

# 3. نفّذ هذه الأوامر
npm install
npx prisma db push
npm run db:seed
npm run dev
```

### الخيار 2: PostgreSQL محلي
```bash
# 1. ثبّت PostgreSQL على جهازك
# Windows: postgresql.org/download
# Mac: brew install postgresql

# 2. أنشئ قاعدة بيانات
psql -U postgres -c "CREATE DATABASE restaurant_db;"

# 3. عدّل .env
# DATABASE_URL="postgresql://postgres:كلمة_المرور@localhost:5432/restaurant_db"

# 4. نفّذ
npm install
npx prisma db push
npm run db:seed
npm run dev
```

### الخيار 3: Supabase مجاني على الإنترنت
```bash
# 1. افتح supabase.com وأنشئ حساباً مجانياً
# 2. New Project → اختر اسماً وكلمة مرور
# 3. Settings → Database → Connection String (URI)
# 4. انسخ الرابط في .env كـ DATABASE_URL
# 5. نفّذ
npm install
npx prisma db push
npm run db:seed
npm run dev
```

---

## 🔄 الربط بين الواجهة وقاعدة البيانات

```
المتصفح (React)
      │
      │  useQuery / useMutation
      ↓
lib/api.js  ← axios.get('/api/menu')
      │
      │  HTTP Request
      ↓
Next.js API Routes  (app/api/*)
      │
      │  prisma.menuItem.findMany()
      ↓
lib/prisma.js  ← PrismaClient
      │
      │  SQL Query
      ↓
PostgreSQL / SQLite
```

---

## 🛠️ أوامر مفيدة

```bash
npm run db:push     # تطبيق schema على قاعدة البيانات
npm run db:seed     # ملء البيانات الأولية
npm run db:studio   # فتح واجهة بصرية لقاعدة البيانات
npm run db:reset    # حذف كل شيء وإعادة البدء
npx prisma generate # تحديث Prisma Client بعد تغيير schema
```
