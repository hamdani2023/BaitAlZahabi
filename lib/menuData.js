// lib/menuData.js — بيانات القائمة مع دعم 3 لغات وصور Unsplash

export const MENU_ITEMS = [
  // ─── مقبلات ───
  {
    id:1, cat:'APPETIZERS', catAr:'المقبلات', catFr:'Entrées', catEn:'Appetizers',
    name:'شوربة فريك', nameFr:'Soupe de Freek', nameEn:'Freek Soup',
    desc:'حساء غني بالفريك واللحم والخضر، يقدم ساخناً بنكهات جزائرية أصيلة.',
    descFr:'Soupe riche au freek, viande et légumes, servie chaude aux saveurs algériennes authentiques.',
    descEn:'Rich soup with freek grain, meat and vegetables, served hot with authentic Algerian flavors.',
    price:250, badge:'hot',
    img:'/images/menu/shorba-freek.jpg',
  },
  {
    id:2, cat:'APPETIZERS', catAr:'المقبلات', catFr:'Entrées', catEn:'Appetizers',
    name:'بوراك جزائري', nameFr:'Bourak Algérien', nameEn:'Algerian Bourak',
    desc:'رقائق محشوة باللحم المفروم والجبن أو الدجاج، مقلية حتى تصبح ذهبية ومقرمشة.',
    descFr:'Feuilles farcies à la viande hachée, fromage ou poulet, frites jusqu\'à être dorées et croustillantes.',
    descEn:'Stuffed pastry sheets with minced meat, cheese or chicken, fried until golden and crispy.',
    price:100, badge:'new',
    img:'/images/menu/bourak.jpg',
  },
  {
    id:4, cat:'APPETIZERS', catAr:'المقبلات', catFr:'Entrées', catEn:'Appetizers',
    name:'حمص بالطحينة', nameFr:'Houmous au Tahini', nameEn:'Hummus with Tahini',
    desc:'حمص كريمي يزين بزيت الزيتون ويقدم مع الخبز الساخن.',
    descFr:'Houmous crémeux garni d\'huile d\'olive, servi avec du pain chaud.',
    descEn:'Creamy hummus drizzled with olive oil, served with warm bread.',
    price:250, badge:'veg',
    img:'/images/menu/hummus.jpg',
  },
  // ─── مشويات ───
  {
    id:5, cat:'GRILLS', catAr:'المشويات', catFr:'Grillades', catEn:'Grills',
    name:'مشاوي مشكلة', nameFr:'Grillades Mixtes', nameEn:'Mixed Grill',
    desc:'تشكيلة من الكباب والكفتة وقطع اللحم المتبلة والمشوية على الفحم.',
    descFr:'Assortiment de kebab, kefta et morceaux de viande marinés, grillés au charbon.',
    descEn:'Assortment of kebab, kefta and marinated meat pieces grilled over charcoal.',
    price:600, badge:'hot',
    img:'/images/menu/mixed-grill.jpg',
  },
  {
    id:6, cat:'GRILLS', catAr:'المشويات', catFr:'Grillades', catEn:'Grills',
    name:'كباب لحم', nameFr:'Kebab de Viande', nameEn:'Meat Kebab',
    desc:'قطع لحم طرية متبلة بالأعشاب والتوابل ومشوية بإتقان.',
    descFr:'Morceaux de viande tendres marinés aux herbes et épices, grillés avec soin.',
    descEn:'Tender meat pieces marinated with herbs and spices, expertly grilled.',
    price:400, badge:null,
    img:'/images/menu/kabab.jpg',
  },
  {
    id:7, cat:'GRILLS', catAr:'المشويات', catFr:'Grillades', catEn:'Grills',
    name:'كفتة مشوية', nameFr:'Kefta Grillée', nameEn:'Grilled Kefta',
    desc:'لحم مفروم متبل يقدم مع الأرز أو البطاطا.',
    descFr:'Viande hachée épicée servie avec du riz ou des pommes de terre.',
    descEn:'Spiced minced meat served with rice or potatoes.',
    price:450, badge:null,
    img:'/images/menu/kefta.jpg',
  },
  {
    id:8, cat:'GRILLS', catAr:'المشويات', catFr:'Grillades', catEn:'Grills',
    name:'ستيك لحم مشوي', nameFr:'Steak de Bœuf', nameEn:'Grilled Steak',
    desc:'قطعة لحم طرية مشوية حسب درجة النضج المطلوبة.',
    descFr:'Pièce de viande tendre grillée selon la cuisson désirée.',
    descEn:'Tender cut of meat grilled to your preferred doneness.',
    price:950, badge:'new',
    img:'/images/menu/steak.jpg',
  },
  // ─── دجاج ───
  {
    id:9, cat:'CHICKEN', catAr:'الدجاج', catFr:'Poulet', catEn:'Chicken',
    name:'دجاج محمر', nameFr:'Poulet Rôti', nameEn:'Roasted Chicken',
    desc:'دجاج متبل بالأعشاب والزعفران يطهى حتى يكتسب لوناً ذهبياً شهياً.',
    descFr:'Poulet mariné aux herbes et safran, cuit jusqu\'à obtenir une belle couleur dorée appétissante.',
    descEn:'Chicken marinated with herbs and saffron, cooked until it achieves a gorgeous golden color.',
    price:1200, badge:'hot',
    img:'/images/menu/djaj-mhammar.jpg',
  },
  {
    id:10, cat:'CHICKEN', catAr:'الدجاج', catFr:'Poulet', catEn:'Chicken',
    name:'طاجين دجاج بالزيتون', nameFr:'Tajine de Poulet aux Olives', nameEn:'Chicken Tagine with Olives',
    desc:'دجاج مطهو بصلصة بيضاء مع الزيتون والليمون المصبر.',
    descFr:'Poulet mijoté en sauce blanche avec olives et citron confit.',
    descEn:'Chicken braised in white sauce with olives and preserved lemon.',
    price:800, badge:'new',
    img:'/images/menu/tajine-zeitoun.jpg',
  },
  {
    id:11, cat:'CHICKEN', catAr:'الدجاج', catFr:'Poulet', catEn:'Chicken',
    name:'شاورما دجاج', nameFr:'Shawarma de Poulet', nameEn:'Chicken Shawarma',
    desc:'شرائح دجاج متبلة تقدم مع صوص الثوم والبطاطا.',
    descFr:'Tranches de poulet marinées servies avec sauce à l\'ail et pommes de terre.',
    descEn:'Marinated chicken slices served with garlic sauce and potatoes.',
    price:500, badge:'hot',
    img:'/images/menu/shawarma.jpg',
  },
  // ─── بحري ───
  {
    id:12, cat:'SEAFOOD', catAr:'البحريات', catFr:'Fruits de Mer', catEn:'Seafood',
    name:'جمبري مشوي', nameFr:'Crevettes Grillées', nameEn:'Grilled Shrimp',
    desc:'روبيان متبل بالأعشاب والثوم، مشوي بطريقة فاخرة.',
    descFr:'Crevettes marinées aux herbes et à l\'ail, grillées de façon raffinée.',
    descEn:'Shrimp marinated with herbs and garlic, grilled in a luxurious style.',
    price:1500, badge:'hot',
    img:'/images/menu/gambri.jpg',
  },
  {
    id:13, cat:'SEAFOOD', catAr:'البحريات', catFr:'Fruits de Mer', catEn:'Seafood',
    name:'سمك دوراد مشوي', nameFr:'Daurade Grillée', nameEn:'Grilled Sea Bream',
    desc:'سمك طازج مشوي يقدم مع الخضر وصلصة الليمون.',
    descFr:'Poisson frais grillé servi avec légumes et sauce au citron.',
    descEn:'Fresh fish grilled and served with vegetables and lemon sauce.',
    price:1650, badge:'new',
    img:'/images/menu/dorade.jpg',
  },
  // ─── سلطات ───
  {
    id:14, cat:'SALADS', catAr:'السلطات', catFr:'Salades', catEn:'Salads',
    name:'سلطة سيزار بالدجاج', nameFr:'Salade César au Poulet', nameEn:'Chicken Caesar Salad',
    desc:'خس طازج مع قطع الدجاج المشوي، جبن البارميزان وصوص السيزار الكريمي.',
    descFr:'Laitue fraîche avec morceaux de poulet grillé, parmesan et sauce César crémeuse.',
    descEn:'Fresh lettuce with grilled chicken pieces, parmesan cheese and creamy Caesar dressing.',
    price:750, badge:null,
    img:'/images/menu/caesar.jpg',
  },
  {
    id:15, cat:'SALADS', catAr:'السلطات', catFr:'Salades', catEn:'Salads',
    name:'سلطة مشوية جزائرية', nameFr:'Salade Grillée Algérienne', nameEn:'Algerian Grilled Salad',
    desc:'فلفل وطماطم مشوية مع الثوم وزيت الزيتون والتوابل.',
    descFr:'Poivrons et tomates grillés avec ail, huile d\'olive et épices.',
    descEn:'Grilled peppers and tomatoes with garlic, olive oil and spices.',
    price:500, badge:'veg',
    img:'/images/menu/salata-mashwiya.jpg',
  },
  {
    id:16, cat:'SALADS', catAr:'السلطات', catFr:'Salades', catEn:'Salads',
    name:'سلطة فواكه', nameFr:'Salade de Fruits', nameEn:'Fruit Salad',
    desc:'تشكيلة من الفواكه الموسمية الطازجة تقدم بلمسة أنيقة.',
    descFr:'Assortiment de fruits frais de saison présenté avec une touche élégante.',
    descEn:'Assortment of fresh seasonal fruits presented with an elegant touch.',
    price:650, badge:'veg',
    img:'/images/menu/salata-fawakeh.jpg',
  },
  // ─── مشروبات ───
  {
    id:17, cat:'DRINKS', catAr:'المشروبات', catFr:'Boissons', catEn:'Drinks',
    name:'عصير ليمون بالنعناع', nameFr:'Citronnade à la Menthe', nameEn:'Lemon Mint Juice',
    desc:'عصير طبيعي بارد ومنعش بطعم الليمون والنعناع.',
    descFr:'Jus naturel frais et rafraîchissant au citron et à la menthe.',
    descEn:'Natural cold refreshing juice with lemon and mint flavor.',
    price:200, badge:null,
    img:'/images/menu/assir-limon.jpg',
  },
  {
    id:18, cat:'DRINKS', catAr:'المشروبات', catFr:'Boissons', catEn:'Drinks',
    name:'موهيتو فواكه', nameFr:'Mojito aux Fruits', nameEn:'Fruit Mojito',
    desc:'مشروب منعش بالفواكه الطازجة والنعناع.',
    descFr:'Boisson rafraîchissante aux fruits frais et à la menthe.',
    descEn:'Refreshing drink with fresh fruits and mint.',
    price:200, badge:'new',
    img:'/images/menu/mojito.jpg',
  },
  {
    id:19, cat:'DRINKS', catAr:'المشروبات', catFr:'Boissons', catEn:'Drinks',
    name:'قهوة جزائرية', nameFr:'Café Algérien', nameEn:'Algerian Coffee',
    desc:'قهوة قوية وعطرية تقدم بطريقة تقليدية أنيقة.',
    descFr:'Café fort et aromatique servi de façon traditionnelle et élégante.',
    descEn:'Strong and aromatic coffee served in an elegant traditional style.',
    price:150, badge:null,
    img:'/images/menu/kahwa.jpg',
  },
  {
    id:20, cat:'DRINKS', catAr:'المشروبات', catFr:'Boissons', catEn:'Drinks',
    name:'شاي بالنعناع', nameFr:'Thé à la Menthe', nameEn:'Mint Tea',
    desc:'شاي أخضر منعش محضر بأوراق النعناع الطازجة ويقدم بطريقة جزائرية أنيقة.',
    descFr:'Thé vert rafraîchissant préparé avec des feuilles de menthe fraîches, servi à la façon algérienne.',
    descEn:'Refreshing green tea prepared with fresh mint leaves, served in an elegant Algerian style.',
    price:100, badge:null,
    img:'/images/menu/atay.jpg',
  },
  // ─── حلويات ───
  {
    id:21, cat:'DESSERTS', catAr:'الحلويات', catFr:'Desserts', catEn:'Desserts',
    name:'قلب اللوز', nameFr:'Kalb el Louz', nameEn:'Kalb el Louz',
    desc:'حلوى سميد محشوة ومعطرة بماء الزهر ومغطاة بالقطر.',
    descFr:'Gâteau de semoule farci, parfumé à l\'eau de fleur d\'oranger et nappé de sirop.',
    descEn:'Semolina cake stuffed and perfumed with orange blossom water, coated in syrup.',
    price:80, badge:'hot',
    img:'/images/menu/kalb-louz.jpg',
  },
  {
    id:22, cat:'DESSERTS', catAr:'الحلويات', catFr:'Desserts', catEn:'Desserts',
    name:'تحلية كراميل', nameFr:'Crème Caramel', nameEn:'Caramel Cream',
    desc:'كريمة ناعمة بصلصة الكراميل تقدم بلمسة عصرية.',
    descFr:'Crème soyeuse à la sauce caramel, servie avec une touche moderne.',
    descEn:'Silky cream with caramel sauce presented with a modern touch.',
    price:150, badge:'new',
    img:'/images/menu/caramel.jpg',
  },
  {
    id:23, cat:'DESSERTS', catAr:'الحلويات', catFr:'Desserts', catEn:'Desserts',
    name:'تشيز كيك بالفستق', nameFr:'Cheesecake à la Pistache', nameEn:'Pistachio Cheesecake',
    desc:'حلوى كريمية فاخرة بنكهة الفستق والمكسرات.',
    descFr:'Dessert crémeux raffiné aux saveurs de pistache et noix.',
    descEn:'Luxurious creamy dessert with pistachio and nut flavors.',
    price:400, badge:'new',
    img:'/images/menu/cheesecake.jpg',
  },
]

export const CATEGORIES = [
  { id:'ALL',        nameAr:'الكل',       nameFr:'Tout',          nameEn:'All',       icon:'✦',   img:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80' },
  { id:'APPETIZERS', nameAr:'المقبلات',   nameFr:'Entrées',       nameEn:'Starters',  icon:'🥗',  img:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&q=80' },
  { id:'GRILLS',     nameAr:'المشويات',   nameFr:'Grillades',     nameEn:'Grills',    icon:'🔥',  img:'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&q=80' },
  { id:'CHICKEN',    nameAr:'الدجاج',     nameFr:'Poulet',        nameEn:'Chicken',   icon:'🍗',  img:'https://images.unsplash.com/photo-1598103442097-8b74394b95c4?w=300&q=80' },
  { id:'SEAFOOD',    nameAr:'البحريات',   nameFr:'Fruits de Mer', nameEn:'Seafood',   icon:'🦐',  img:'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=300&q=80' },
  { id:'SALADS',     nameAr:'السلطات',    nameFr:'Salades',       nameEn:'Salads',    icon:'🥗',  img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80' },
  { id:'DRINKS',     nameAr:'المشروبات',  nameFr:'Boissons',      nameEn:'Drinks',    icon:'🥤',  img:'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300&q=80' },
  { id:'DESSERTS',   nameAr:'الحلويات',   nameFr:'Desserts',      nameEn:'Desserts',  icon:'🍰',  img:'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300&q=80' },
]

export const BADGE_CONFIG = {
  hot: { label:{ ar:'الأكثر طلباً', fr:'Populaire', en:'Popular' }, bg:'rgba(192,57,43,0.9)',  color:'#fff' },
  new: { label:{ ar:'جديد',          fr:'Nouveau',   en:'New'     }, bg:'rgba(201,168,76,0.9)', color:'#0A0805' },
  veg: { label:{ ar:'نباتي',         fr:'Végétarien', en:'Veg'    }, bg:'rgba(45,90,39,0.9)',   color:'#fff' },
}

export const formatPrice = (p) =>
  new Intl.NumberFormat('ar-DZ').format(p) + ' دج'

// دالة مساعدة لجلب اسم الأكلة حسب اللغة
export const getItemName = (item, lang) => {
  if (lang === 'fr') return item.nameFr || item.name
  if (lang === 'en') return item.nameEn || item.name
  return item.name
}

// دالة مساعدة لجلب وصف الأكلة حسب اللغة
export const getItemDesc = (item, lang) => {
  if (lang === 'fr') return item.descFr || item.desc || item.description
  if (lang === 'en') return item.descEn || item.desc || item.description
  return item.desc || item.description
}

// دالة مساعدة لجلب اسم الفئة حسب اللغة
export const getCatName = (cat, lang) => {
  if (lang === 'fr') return cat.nameFr || cat.nameAr
  if (lang === 'en') return cat.nameEn || cat.nameAr
  return cat.nameAr
}
