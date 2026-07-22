import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type ProductSeed = Omit<Prisma.ProductCreateInput, "category"> & {
  variants: Prisma.ProductVariantCreateWithoutProductInput[];
};

type CategorySeed = Omit<Prisma.CategoryCreateInput, "products"> & {
  products: ProductSeed[];
};

const data: CategorySeed[] = [
  {
    name: "Parfums",
    slug: "parfums",
    description: "Eaux de parfum d'exception, signatures boisées et florales.",
    position: 1,
    isFeatured: true,
    products: [
      {
        name: "Signature Absolue",
        slug: "signature-absolue",
        tagline: "Boisé · Ambré · Iris",
        description:
          "Une composition sculpturale où l'iris poudré rencontre un fond ambré profond, sillage tenace et raffiné.",
        family: "Boisé",
        isFeatured: true,
        variants: [
          { name: "Eau de Parfum · 30 ml", sku: "UMY-SA-30", volumeMl: 30, priceCents: 8900, stock: 40 },
          { name: "Eau de Parfum · 50 ml", sku: "UMY-SA-50", volumeMl: 50, priceCents: 12900, stock: 60, isDefault: true },
          { name: "Eau de Parfum · 100 ml", sku: "UMY-SA-100", volumeMl: 100, priceCents: 18900, stock: 25 },
        ],
      },
      {
        name: "Néroli Blanc",
        slug: "neroli-blanc",
        tagline: "Floral · Solaire · Néroli",
        description:
          "Un bouquet lumineux de fleur d'oranger et de néroli, adouci par un musc soyeux.",
        family: "Floral",
        isFeatured: true,
        variants: [
          { name: "Eau de Parfum · 50 ml", sku: "UMY-NB-50", volumeMl: 50, priceCents: 11900, stock: 35, isDefault: true },
          { name: "Eau de Parfum · 100 ml", sku: "UMY-NB-100", volumeMl: 100, priceCents: 17900, stock: 20 },
        ],
      },
      {
        name: "Oud Nocturne",
        slug: "oud-nocturne",
        tagline: "Oriental · Oud · Safran",
        description:
          "Un oud enveloppant relevé de safran et de cuir, pour un sillage nocturne et magnétique.",
        family: "Oriental",
        variants: [
          { name: "Eau de Parfum · 50 ml", sku: "UMY-ON-50", volumeMl: 50, priceCents: 14900, stock: 18, isDefault: true },
          { name: "Eau de Parfum · 100 ml", sku: "UMY-ON-100", volumeMl: 100, priceCents: 21900, stock: 12 },
        ],
      },
    ],
  },
  {
    name: "Soins",
    slug: "soins",
    description: "Rituels botaniques pour le visage et le corps.",
    position: 2,
    products: [
      {
        name: "Sérum Éclat Botanique",
        slug: "serum-eclat-botanique",
        tagline: "Vitamine C · Acide hyaluronique",
        description:
          "Un sérum concentré qui lisse, illumine et repulpe le grain de peau dès les premières applications.",
        family: "Visage",
        isFeatured: true,
        variants: [
          { name: "Flacon · 30 ml", sku: "UMY-SEB-30", volumeMl: 30, priceCents: 6900, stock: 50, isDefault: true },
        ],
      },
      {
        name: "Crème Régénérante Nuit",
        slug: "creme-regenerante-nuit",
        tagline: "Rétinol doux · Beurre de karité",
        description:
          "Une crème riche qui nourrit et régénère la peau pendant le sommeil pour un teint reposé.",
        family: "Visage",
        variants: [
          { name: "Pot · 50 ml", sku: "UMY-CRN-50", volumeMl: 50, priceCents: 7900, stock: 42, isDefault: true },
        ],
      },
      {
        name: "Huile Précieuse Corps",
        slug: "huile-precieuse-corps",
        tagline: "Argan · Fleur de tiaré",
        description:
          "Une huile sèche satinée qui sublime et hydrate durablement la peau du corps.",
        family: "Corps",
        variants: [
          { name: "Flacon · 100 ml", sku: "UMY-HPC-100", volumeMl: 100, priceCents: 5400, stock: 60, isDefault: true },
        ],
      },
    ],
  },
  {
    name: "Beauté",
    slug: "beaute",
    description: "Teint, lèvres et regard — une beauté nue sublimée.",
    position: 3,
    products: [
      {
        name: "Rouge Velours",
        slug: "rouge-velours",
        tagline: "Fini mat · Confort longue tenue",
        description:
          "Un rouge à lèvres au fini velours intense, pigmenté et confortable toute la journée.",
        family: "Lèvres",
        isFeatured: true,
        variants: [
          { name: "Teinte · Bordeaux Profond", sku: "UMY-RV-BOR", priceCents: 3200, stock: 70, isDefault: true },
          { name: "Teinte · Nude Rosé", sku: "UMY-RV-NUD", priceCents: 3200, stock: 65 },
          { name: "Teinte · Terracotta", sku: "UMY-RV-TER", priceCents: 3200, stock: 40 },
        ],
      },
      {
        name: "Poudre Libre Nude",
        slug: "poudre-libre-nude",
        tagline: "Matifiante · Effet flou",
        description:
          "Une poudre libre ultra-fine qui matifie et floute les imperfections sans effet masque.",
        family: "Teint",
        variants: [
          { name: "Universelle · 12 g", sku: "UMY-PLN-12", priceCents: 4200, stock: 55, isDefault: true },
        ],
      },
    ],
  },
  {
    name: "Coffrets",
    slug: "coffrets",
    description: "Compositions à offrir, écrins signés la maison.",
    position: 4,
    products: [
      {
        name: "Coffret Découverte Parfums",
        slug: "coffret-decouverte-parfums",
        tagline: "3 miniatures · 10 ml",
        description:
          "Un trio de nos signatures en format découverte, présenté dans un écrin gravé.",
        family: "Coffret",
        isFeatured: true,
        variants: [
          { name: "Coffret · 3 × 10 ml", sku: "UMY-CDP-3", priceCents: 6900, stock: 30, isDefault: true },
        ],
      },
      {
        name: "Rituel Soin Essentiel",
        slug: "rituel-soin-essentiel",
        tagline: "Sérum + Crème + Huile",
        description:
          "Le rituel complet visage et corps, réuni dans un coffret prêt à offrir.",
        family: "Coffret",
        variants: [
          { name: "Coffret Rituel", sku: "UMY-RSE-1", priceCents: 15900, stock: 22, isDefault: true },
        ],
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seed UMY — Parfums & Beauté");

  // Repartir d'une base propre (cascade DB : catégories → produits → variantes)
  await prisma.category.deleteMany();

  for (const { products, ...category } of data) {
    await prisma.category.create({
      data: {
        ...category,
        products: {
          create: products.map(({ variants, ...product }) => ({
            ...product,
            stockTotal: variants.reduce((s, v) => s + (v.stock ?? 0), 0),
            variants: { create: variants },
          })),
        },
      },
    });
  }

  const [cats, prods, variants] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.productVariant.count(),
  ]);
  console.log(`✅ Seed terminé — ${cats} catégories, ${prods} produits, ${variants} déclinaisons.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
