// prisma/seed.js — ملء قاعدة بيانات البيت الذهبي
// الأكلات متزامنة 100% مع lib/menuData.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء ملء قاعدة بيانات البيت الذهبي...\n')

  // ── حذف البيانات القديمة بالترتيب الصحيح ──
  await prisma.billItem.deleteMany()
  await prisma.bill.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.call.deleteMany()
  await prisma.review.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.table.deleteMany()
  try { await prisma.waiter.deleteMany() } catch(e) {}
  console.log('🗑️  تم حذف البيانات القديمة')

  // ── الطاولات — 20 طاولة في 4 أقسام ──
  const STATUSES    = ['FREE','OCCUPIED','OCCUPIED','FREE','OCCUPIED','FREE','CALLING','RESERVED','OCCUPIED','FREE','OCCUPIED','CALLING','FREE','OCCUPIED','FREE','RESERVED','OCCUPIED','FREE','OCCUPIED','OCCUPIED']
  const SECTION_MAP = { 1:'A',2:'A',3:'A',4:'A',5:'A', 6:'B',7:'B',8:'B',9:'B',10:'B', 11:'C',12:'C',13:'C',14:'C',15:'C', 16:'D',17:'D',18:'D',19:'D',20:'D' }

  const tables = []
  for (let i = 0; i < 20; i++) {
    const t = await prisma.table.create({
      data: {
        number:   i + 1,
        capacity: [4,9,16].includes(i) ? 6 : 4,
        status:   STATUSES[i],
        section:  SECTION_MAP[i + 1],
      }
    })
    tables.push(t)
  }
  console.log('✅ 20 طاولة — أقسام A/B/C/D')

  // ── النُدُل ──
  const waitersData = [
    { name:'أحمد بن علي',  section:'A', status:'ACTIVE' },
    { name:'فاطمة زهراء', section:'B', status:'ACTIVE' },
    { name:'كريم مسعود',  section:'C', status:'ACTIVE' },
    { name:'سارة بوزيد',  section:'D', status:'BREAK'  },
  ]
  for (const w of waitersData) {
    try { await prisma.waiter.create({ data: w }) } catch(e) {}
  }
  console.log('✅ 4 نادل')

  // ── القائمة — متزامنة مع menuData.js ──
  // (نفس الأسماء والأوصاف والأسعار والفئات والـ badges)
  const menuData = [
    // ─── مقبلات ───
    { name:'شوربة فريك',      description:'حساء غني بالفريك واللحم والخضر، يقدم ساخناً بنكهات جزائرية أصيلة.',                              emoji:'🍲', category:'APPETIZERS', badge:'hot', price:250,  sortOrder:1  },
    { name:'بوراك جزائري',    description:'رقائق محشوة باللحم المفروم والجبن أو الدجاج، مقلية حتى تصبح ذهبية ومقرمشة.',                     emoji:'🥟', category:'APPETIZERS', badge:'new', price:100,  sortOrder:2  },
    { name:'سلطة مشوية',      description:'خليط من الفلفل والطماطم المشوية مع زيت الزيتون والثوم.',                                          emoji:'🥗', category:'APPETIZERS', badge:'veg', price:300,  sortOrder:3  },
    { name:'حمص بالطحينة',    description:'حمص كريمي يزين بزيت الزيتون ويقدم مع الخبز الساخن.',                                              emoji:'🥙', category:'APPETIZERS', badge:'veg', price:250,  sortOrder:4  },
    // ─── مشويات ───
    { name:'مشاوي مشكلة',     description:'تشكيلة من الكباب والكفتة وقطع اللحم المتبلة والمشوية على الفحم.',                                  emoji:'🍖', category:'GRILLS',     badge:'hot', price:600,  sortOrder:5  },
    { name:'كباب لحم',         description:'قطع لحم طرية متبلة بالأعشاب والتوابل ومشوية بإتقان.',                                             emoji:'🥩', category:'GRILLS',     badge:null,  price:400,  sortOrder:6  },
    { name:'كفتة مشوية',      description:'لحم مفروم متبل يقدم مع الأرز أو البطاطا.',                                                         emoji:'🥩', category:'GRILLS',     badge:null,  price:450,  sortOrder:7  },
    { name:'ستيك لحم مشوي',   description:'قطعة لحم طرية مشوية حسب درجة النضج المطلوبة.',                                                     emoji:'🥩', category:'GRILLS',     badge:'new', price:950,  sortOrder:8  },
    // ─── دجاج ───
    { name:'دجاج محمر',        description:'دجاج متبل بالأعشاب والزعفران يطهى حتى يكتسب لوناً ذهبياً شهياً.',                                 emoji:'🍗', category:'CHICKEN',    badge:'hot', price:1200, sortOrder:9  },
    { name:'طاجين دجاج بالزيتون', description:'دجاج مطهو بصلصة بيضاء مع الزيتون والليمون المصبر.',                                           emoji:'🍗', category:'CHICKEN',    badge:'new', price:800,  sortOrder:10 },
    { name:'شاورما دجاج',      description:'شرائح دجاج متبلة تقدم مع صوص الثوم والبطاطا.',                                                    emoji:'🍗', category:'CHICKEN',    badge:'hot', price:500,  sortOrder:11 },
    // ─── بحريات ───
    { name:'جمبري مشوي',       description:'روبيان متبل بالأعشاب والثوم، مشوي بطريقة فاخرة.',                                                 emoji:'🦐', category:'SEAFOOD',    badge:'hot', price:1500, sortOrder:12 },
    { name:'سمك دوراد مشوي',   description:'سمك طازج مشوي يقدم مع الخضر وصلصة الليمون.',                                                      emoji:'🐟', category:'SEAFOOD',    badge:'new', price:1650, sortOrder:13 },
    // ─── سلطات ───
    { name:'سلطة سيزار بالدجاج',    description:'خس طازج مع قطع الدجاج المشوي، جبن البارميزان وصوص السيزار الكريمي.',                        emoji:'🥗', category:'SALADS',     badge:null,  price:750,  sortOrder:14 },
    { name:'سلطة مشوية جزائرية',    description:'فلفل وطماطم مشوية مع الثوم وزيت الزيتون والتوابل.',                                         emoji:'🥗', category:'SALADS',     badge:'veg', price:500,  sortOrder:15 },
    { name:'سلطة فواكه',             description:'تشكيلة من الفواكه الموسمية الطازجة تقدم بلمسة أنيقة.',                                     emoji:'🍓', category:'SALADS',     badge:'veg', price:650,  sortOrder:16 },
    // ─── مشروبات ───
    { name:'عصير ليمون بالنعناع', description:'عصير طبيعي بارد ومنعش بطعم الليمون والنعناع.',                                                emoji:'🍋', category:'DRINKS',     badge:null,  price:200,  sortOrder:17 },
    { name:'موهيتو فواكه',         description:'مشروب منعش بالفواكه الطازجة والنعناع.',                                                       emoji:'🥤', category:'DRINKS',     badge:'new', price:200,  sortOrder:18 },
    { name:'قهوة جزائرية',         description:'قهوة قوية وعطرية تقدم بطريقة تقليدية أنيقة.',                                                emoji:'☕', category:'DRINKS',     badge:null,  price:150,  sortOrder:19 },
    { name:'شاي بالنعناع',         description:'شاي أخضر منعش محضر بأوراق النعناع الطازجة ويقدم بطريقة جزائرية أنيقة.',                     emoji:'🫖', category:'DRINKS',     badge:null,  price:100,  sortOrder:20 },
    // ─── حلويات ───
    { name:'قلب اللوز',            description:'حلوى سميد محشوة ومعطرة بماء الزهر ومغطاة بالقطر.',                                           emoji:'🍯', category:'DESSERTS',   badge:'hot', price:80,   sortOrder:21 },
    { name:'تحلية كراميل',         description:'كريمة ناعمة بصلصة الكراميل تقدم بلمسة عصرية.',                                               emoji:'🍮', category:'DESSERTS',   badge:'new', price:150,  sortOrder:22 },
    { name:'تشيز كيك بالفستق',     description:'حلوى كريمية فاخرة بنكهة الفستق والمكسرات.',                                                  emoji:'🍰', category:'DESSERTS',   badge:'new', price:400,  sortOrder:23 },
  ]

  const menuItems = []
  for (const item of menuData) {
    const m = await prisma.menuItem.create({ data: item })
    menuItems.push(m)
  }
  console.log(`✅ ${menuItems.length} صنف في القائمة`)

  // ── نداءات تجريبية ──
  await prisma.call.createMany({ data:[
    { tableId:tables[6].id,  type:'URGENT', status:'PENDING', message:'نداء عاجل' },
    { tableId:tables[11].id, type:'NORMAL', status:'PENDING', message:'تعبئة الماء' },
    { tableId:tables[2].id,  type:'LOW',    status:'PENDING', message:'طلب الفاتورة' },
  ]})
  console.log('✅ 3 نداءات تجريبية')

  // ── طلب تجريبي ──
  const kabab = menuItems.find(m => m.name.includes('كباب'))
  const salad = menuItems.find(m => m.name.includes('سيزار'))
  const order = await prisma.order.create({ data:{
    tableId:     tables[4].id,
    status:      'PREPARING',
    totalAmount: kabab.price * 2 + salad.price,
    items: { create:[
      { menuItemId:kabab.id, quantity:2, unitPrice:kabab.price },
      { menuItemId:salad.id, quantity:1, unitPrice:salad.price },
    ]}
  }})
  console.log('✅ طلب تجريبي قيد التحضير')

  // ── تقييمات تجريبية ──
  await prisma.review.createMany({ data:[
    { tableId:tables[0].id, overallRating:5, foodRating:5, serviceRating:5, speedRating:4, cleanRating:5, comment:'طعام رائع وخدمة ممتازة' },
    { tableId:tables[2].id, overallRating:4, foodRating:4, serviceRating:5, speedRating:4, cleanRating:4, comment:'تجربة جميلة سنعود' },
    { tableId:tables[7].id, overallRating:5, foodRating:5, serviceRating:5, speedRating:5, cleanRating:5, comment:'أفضل مطعم في المدينة' },
  ]})
  console.log('✅ 3 تقييمات تجريبية')

  console.log('\n🎉 قاعدة بيانات البيت الذهبي جاهزة!\n')
  console.log('الأوامر المتاحة:')
  console.log('  npm run dev        — تشغيل المشروع')
  console.log('  npm run db:seed    — إعادة ملء البيانات')
  console.log('  npm run db:reset   — إعادة تعيين كاملة')
  console.log('  npm run db:studio  — واجهة قاعدة البيانات\n')
}

main()
  .catch(e => { console.error('❌ خطأ:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
