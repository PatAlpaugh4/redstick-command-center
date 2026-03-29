import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@redstick.vc" },
    update: {},
    create: {
      email: "admin@redstick.vc",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Created admin user:", admin.email);

  // Create partner user
  const partnerPassword = await bcrypt.hash("partner123", 10);
  const partner = await prisma.user.upsert({
    where: { email: "partner@redstick.vc" },
    update: {},
    create: {
      email: "partner@redstick.vc",
      name: "Alex Chen",
      password: partnerPassword,
      role: "PARTNER",
    },
  });
  console.log("Created partner user:", partner.email);

  // Create analyst user
  const analystPassword = await bcrypt.hash("analyst123", 10);
  const analyst = await prisma.user.upsert({
    where: { email: "analyst@redstick.vc" },
    update: {},
    create: {
      email: "analyst@redstick.vc",
      name: "Sarah Kim",
      password: analystPassword,
      role: "ANALYST",
    },
  });
  console.log("Created analyst user:", analyst.email);

  // Create sample agents
  const agents = await Promise.all([
    prisma.agent.upsert({
      where: { id: "agent_001" },
      update: {},
      create: {
        id: "agent_001",
        name: "Deal Screener",
        description: "Automatically screens inbound deals against investment criteria",
        type: "SCREENING",
        status: "ACTIVE",
        tools: ["web_search", "document_parser", "crm_api"],
        config: { autoRun: true, threshold: 0.7 },
        totalRuns: 1247,
        successRate: 94.5,
        tokenUsage: 456000,
      },
    }),
    prisma.agent.upsert({
      where: { id: "agent_002" },
      update: {},
      create: {
        id: "agent_002",
        name: "Market Intel",
        description: "Monitors market trends, competitor movements, and industry news",
        type: "RESEARCH",
        status: "ACTIVE",
        tools: ["web_search", "news_api", "data_source"],
        config: { frequency: "hourly", sectors: ["agtech", "food"] },
        totalRuns: 3420,
        successRate: 98.2,
        tokenUsage: 890000,
      },
    }),
    prisma.agent.upsert({
      where: { id: "agent_003" },
      update: {},
      create: {
        id: "agent_003",
        name: "Portfolio Monitor",
        description: "Tracks portfolio company metrics and alerts on anomalies",
        type: "PORTFOLIO",
        status: "ACTIVE",
        tools: ["database_query", "alert_system", "reporting"],
        config: { checkInterval: 30, metrics: ["arr", "burn", "growth"] },
        totalRuns: 876,
        successRate: 99.1,
        tokenUsage: 234000,
      },
    }),
  ]);
  console.log(`Created ${agents.length} agents`);

  // Create sample companies
  const companies = await Promise.all([
    prisma.company.upsert({
      where: { slug: "grainchain" },
      update: {},
      create: {
        name: "GrainChain",
        slug: "grainchain",
        description: "Blockchain-based grain traceability and commodity trading platform",
        website: "https://grainchain.com",
        sector: "Supply Chain",
        stage: "SERIES_B",
        location: "Austin, TX",
        foundedYear: 2018,
        teamSize: 65,
        arr: 12000000,
        growthRate: 180,
        investmentDate: new Date("2022-03-15"),
        investmentAmount: 5000000,
        currentValuation: 45000000,
        ownershipStake: 11.1,
        status: "ACTIVE",
        healthScore: 92,
      },
    }),
    prisma.company.upsert({
      where: { slug: "verticalharvest" },
      update: {},
      create: {
        name: "VerticalHarvest",
        slug: "verticalharvest",
        description: "Modular vertical farming systems for urban environments",
        website: "https://verticalharvest.com",
        sector: "Vertical Farming",
        stage: "SERIES_B",
        location: "Jackson, WY",
        foundedYear: 2016,
        teamSize: 89,
        arr: 18000000,
        growthRate: 95,
        investmentDate: new Date("2021-08-20"),
        investmentAmount: 8000000,
        currentValuation: 65000000,
        ownershipStake: 12.3,
        status: "ACTIVE",
        healthScore: 88,
      },
    }),
    prisma.company.upsert({
      where: { slug: "farmrobotics" },
      update: {},
      create: {
        name: "FarmRobotics",
        slug: "farmrobotics",
        description: "Autonomous weeding robots reducing herbicide use by 90%",
        website: "https://farmrobotics.com",
        sector: "AgTech",
        stage: "SERIES_A",
        location: "Davis, CA",
        foundedYear: 2020,
        teamSize: 42,
        arr: 6500000,
        growthRate: 220,
        investmentDate: new Date("2023-01-10"),
        investmentAmount: 3000000,
        currentValuation: 18000000,
        ownershipStake: 16.7,
        status: "ACTIVE",
        healthScore: 85,
      },
    }),
  ]);
  console.log(`Created ${companies.length} companies`);

  // Create sample deals
  const deals = await Promise.all([
    prisma.deal.upsert({
      where: { id: "deal_001" },
      update: {},
      create: {
        id: "deal_001",
        companyName: "AquaCulture Labs",
        description: "AI-powered shrimp farming systems with 40% higher yields",
        website: "https://aquaculturelabs.com",
        status: "DILIGENCE",
        stage: "SERIES_A",
        sector: "Aquaculture",
        location: "San Diego, CA",
        valuation: 18000000,
        investmentAmount: 3000000,
        ownershipStake: 16.7,
        priority: "HIGH",
        assigneeId: partner.id,
        pitchDate: new Date("2024-01-10"),
      },
    }),
    prisma.deal.upsert({
      where: { id: "deal_002" },
      update: {},
      create: {
        id: "deal_002",
        companyName: "NovoProtein",
        description: "Precision fermentation platform for alternative protein ingredients",
        website: "https://novoprotein.com",
        status: "TERM_SHEET",
        stage: "SEED",
        sector: "Alternative Protein",
        location: "Boston, MA",
        valuation: 5000000,
        investmentAmount: 1200000,
        ownershipStake: 24,
        priority: "URGENT",
        assigneeId: analyst.id,
        pitchDate: new Date("2024-01-08"),
      },
    }),
    prisma.deal.upsert({
      where: { id: "deal_003" },
      update: {},
      create: {
        id: "deal_003",
        companyName: "BioSense",
        description: "Real-time pathogen detection for food processing facilities",
        website: "https://biosense.com",
        status: "IC_PREP",
        stage: "SERIES_A",
        sector: "Food Safety",
        location: "Austin, TX",
        valuation: 12000000,
        investmentAmount: 2500000,
        ownershipStake: 20.8,
        priority: "HIGH",
        assigneeId: partner.id,
        pitchDate: new Date("2024-01-12"),
      },
    }),
  ]);
  console.log(`Created ${deals.length} deals`);

  console.log("\n✅ Database seed completed successfully!");
  console.log("\nDemo login credentials:");
  console.log("  Admin: admin@redstick.vc / admin123");
  console.log("  Partner: partner@redstick.vc / partner123");
  console.log("  Analyst: analyst@redstick.vc / analyst123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
