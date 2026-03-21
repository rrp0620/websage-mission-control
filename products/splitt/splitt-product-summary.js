const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, LevelFormat } = require("docx");
const fs = require("fs");

const border = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading(text, level) {
  return new Paragraph({ heading: level, children: [new TextRun({ text, bold: true })] });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun({ text, size: 22, font: "Arial", ...opts.run })]
  });
}

function boldPara(bold, rest) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: bold, bold: true, size: 22, font: "Arial" }),
      new TextRun({ text: rest, size: 22, font: "Arial" })
    ]
  });
}

function bulletItem(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}

function subBullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 1 },
    spacing: { after: 40 },
    children: [new TextRun({ text, size: 20, font: "Arial" })]
  });
}

function sectionBreak() {
  return new Paragraph({ spacing: { before: 200, after: 200 }, children: [] });
}

function featureTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 6560],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders, width: { size: 2800, type: WidthType.DXA }, margins: cellMargins,
            shading: { fill: "0A0A0A", type: ShadingType.CLEAR },
            children: [new Paragraph({ children: [new TextRun({ text: "Feature", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })]
          }),
          new TableCell({
            borders, width: { size: 6560, type: WidthType.DXA }, margins: cellMargins,
            shading: { fill: "0A0A0A", type: ShadingType.CLEAR },
            children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })]
          })
        ]
      }),
      ...rows.map((r, i) => new TableRow({
        children: [
          new TableCell({
            borders, width: { size: 2800, type: WidthType.DXA }, margins: cellMargins,
            shading: i % 2 === 0 ? { fill: "F5F5F0", type: ShadingType.CLEAR } : undefined,
            children: [new Paragraph({ children: [new TextRun({ text: r[0], bold: true, size: 20, font: "Arial" })] })]
          }),
          new TableCell({
            borders, width: { size: 6560, type: WidthType.DXA }, margins: cellMargins,
            shading: i % 2 === 0 ? { fill: "F5F5F0", type: ShadingType.CLEAR } : undefined,
            children: [new Paragraph({ children: [new TextRun({ text: r[1], size: 20, font: "Arial" })] })]
          })
        ]
      }))
    ]
  });
}

const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "\u2013", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } } }
      ]}
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "0A0A0A" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "0A0A0A" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "333333" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "SPLITT. Product Summary", size: 18, font: "Arial", color: "999999", italics: true })]
        })
      ]})
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Confidential  |  Page ", size: 18, font: "Arial", color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial", color: "999999" })
          ]
        })
      ]})
    },
    children: [
      // TITLE
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 80 },
        children: [new TextRun({ text: "SPLITT.", size: 56, bold: true, font: "Arial", color: "0A0A0A" })]
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: "Product Summary & Design Brief", size: 32, font: "Arial", color: "555555" })]
      }),
      new Paragraph({
        spacing: { after: 400 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "C8FF57", space: 1 } },
        children: [new TextRun({ text: "March 2026  |  For Design Team", size: 20, font: "Arial", color: "888888" })]
      }),

      // OVERVIEW
      heading("What is Splitt?", HeadingLevel.HEADING_1),
      para("Splitt is a fintech platform that automatically splits credit card transactions across multiple payment methods to maximize rewards, hit signup bonuses, and optimize spending. Users link their credit/debit cards, set up split rules and intelligent routing conditions, and Splitt handles the rest."),
      sectionBreak(),

      // BRAND
      heading("Brand Identity", HeadingLevel.HEADING_1),
      featureTable([
        ["Name", "Splitt. (with period)"],
        ["Tagline", "Split every purchase. Maximize every reward."],
        ["Primary Font", "Exo 2 (headings/logo), Outfit (body)"],
        ["Primary Color", "#C8FF57 (lime green)"],
        ["Secondary Color", "#57C8FF (sky blue)"],
        ["Background", "#F5F3EE (warm off-white for light mode)"],
        ["Dark Background", "#0A0A0A (near-black for dark mode)"],
        ["Text", "#0A0A0A (dark) / #F5F3EE (light)"],
        ["Theme Default", "Light mode (user can toggle to dark)"],
      ]),
      sectionBreak(),

      // ARCHITECTURE
      heading("Architecture Overview", HeadingLevel.HEADING_1),
      featureTable([
        ["Marketing Site", "www.paysplitt.com (Vercel)"],
        ["Dashboard", "dashboard.paysplitt.com (Vercel)"],
        ["Backend API", "api.paysplitt.com (Railway)"],
        ["Auth", "Supabase (email/password)"],
        ["Payments", "Stripe (card linking, virtual cards, billing)"],
        ["Framework", "React + Vite + React Router"],
      ]),
      sectionBreak(),

      // PAGES
      heading("Pages & Features", HeadingLevel.HEADING_1),

      // Landing
      heading("1. Landing Page (www.paysplitt.com)", HeadingLevel.HEADING_2),
      para("Public marketing page. This is the first thing visitors see."),
      bulletItem("Fixed nav bar with logo, feature links, pricing anchor, and CTA buttons"),
      bulletItem("Hero section with headline, subheadline, and Get Started CTA"),
      bulletItem("7 feature cards showcasing key capabilities"),
      bulletItem("How It Works section (4-step visual flow)"),
      bulletItem("3 pricing tiers: Free ($0), Plus ($9.99/mo), Pro ($19.99/mo)"),
      bulletItem("Waitlist signup form"),
      bulletItem("Footer with company links, login/signup links to dashboard subdomain"),
      para("All auth links (Get Started, Login, Sign Up) redirect to dashboard.paysplitt.com."),
      sectionBreak(),

      // Login/Signup
      heading("2. Login & Signup (dashboard.paysplitt.com/login)", HeadingLevel.HEADING_2),
      para("Clean auth screens with the Splitt brand mark."),
      bulletItem("Centered card layout with S. logo and SPLITT wordmark"),
      bulletItem("Email + password form with validation"),
      bulletItem("Loading spinner on submit"),
      bulletItem("Error messages inline"),
      bulletItem("Links between login, signup, and forgot password"),
      bulletItem("Forgot password flow with email reset"),
      sectionBreak(),

      // Onboarding
      heading("3. Onboarding (4-step flow)", HeadingLevel.HEADING_2),
      para("Guided setup for new users. Progress bar at top, skip option available."),
      bulletItem("Step 1: Welcome screen introducing Splitt"),
      bulletItem("Step 2: Add first card via Stripe Elements (secure tokenization)"),
      bulletItem("Step 3: Create first split rule (pick 2 cards, set percentages)"),
      bulletItem("Step 4: Success confirmation with next steps"),
      sectionBreak(),

      // Dashboard
      heading("4. Dashboard / Home", HeadingLevel.HEADING_2),
      para("Central hub with personalized greeting and spending overview."),
      bulletItem("4 stat cards: Total Spent, Active Cards, Routing Rules, Pending Groups"),
      bulletItem("Recent transactions table (last 5) with merchant, category badge, amount, status"),
      bulletItem("Quick action buttons: Manage Cards, Virtual Card, Routing Rules, Split Groups"),
      sectionBreak(),

      // Cards
      heading("5. Payment Methods (Cards)", HeadingLevel.HEADING_2),
      para("Manage all linked credit and debit cards."),
      bulletItem("Visual card grid with gradient backgrounds by card brand (Visa, MC, Amex, Discover)"),
      bulletItem("Each card shows: masked number, nickname, priority order, default badge"),
      bulletItem("Add card modal with Stripe Elements form"),
      bulletItem("Delete card with confirmation"),
      sectionBreak(),

      // Split Rules
      heading("6. Split Rules", HeadingLevel.HEADING_2),
      para("Define how purchases are automatically divided across cards."),
      bulletItem("One active rule at a time (creating new deactivates old)"),
      bulletItem("Rule name, dynamic card rows with add/remove"),
      bulletItem("Split types: Fixed Amount ($X.XX), Percentage (X%), Remainder (gets the rest)"),
      bulletItem("Validation: minimum 2 cards, exactly 1 remainder, all cards must be selected"),
      bulletItem("Visual split bar showing card allocations"),
      sectionBreak(),

      // Routing Rules
      heading("7. Routing Rules", HeadingLevel.HEADING_2),
      para("Condition-based intelligent transaction routing (e.g., all dining to cashback card)."),
      bulletItem("List of rules with condition chips, action type, priority, active/inactive toggle"),
      bulletItem("Create rule modal: name, priority, conditions (add multiple), actions (add multiple)"),
      bulletItem("Condition types: merchant category (9 categories), merchant name contains, amount >= or <="),
      bulletItem("Action types: route to card, split percentage, split fixed, use optimizer, fallback card"),
      bulletItem("AI Generate: plain English input generates suggested rules (rate limited 10/hr)"),
      sectionBreak(),

      // Transactions
      heading("8. Transactions", HeadingLevel.HEADING_2),
      para("Detailed payment history with split breakdowns."),
      bulletItem("Status filter chips: All, Completed, Failed, Partially Failed, Pending"),
      bulletItem("Table: date, merchant, category badge, total amount, cards used, status badge"),
      bulletItem("Expandable rows showing each split leg (card, amount, status)"),
      bulletItem("Retry button for failed transactions"),
      sectionBreak(),

      // Analytics
      heading("9. Analytics", HeadingLevel.HEADING_2),
      para("Spending visualizations and trend analysis."),
      bulletItem("Month selector (previous/next navigation)"),
      bulletItem("4 stat cards: Total Spent, Avg Transaction, Top Category, Transaction Count"),
      bulletItem("Pie chart: Spending by Category"),
      bulletItem("Bar chart: Spending by Card"),
      bulletItem("Line chart: Monthly Spending Trend"),
      para("Charts use Recharts library."),
      sectionBreak(),

      // Rewards
      heading("10. Rewards Optimizer", HeadingLevel.HEADING_2),
      para("Link reward programs to cards and view multipliers."),
      bulletItem("Your Card Rewards section: linked rewards with multiplier grids (1x-5x by category)"),
      bulletItem("Bonus progress bars showing signup bonus progress"),
      bulletItem("Search & browse available reward templates by issuer"),
      bulletItem("Link/unlink rewards to specific cards"),
      sectionBreak(),

      // Virtual Card
      heading("11. Virtual Card", HeadingLevel.HEADING_2),
      para("Splitt-branded virtual card via Stripe Issuing."),
      bulletItem("Setup form: name, phone, address (KYC)"),
      bulletItem("Card visual with Splitt branding, masked number, cardholder, expiry"),
      bulletItem("Status badge: Active/Frozen"),
      bulletItem("Freeze/Unfreeze toggle"),
      bulletItem("Reveal full card details modal (PAN, CVC)"),
      bulletItem("Apple Wallet/Google Pay provisioning"),
      sectionBreak(),

      // Subscriptions
      heading("12. Subscriptions", HeadingLevel.HEADING_2),
      para("Track detected recurring charges and assign preferred cards."),
      bulletItem("Status filters: All, Active, Snoozed, Cancelled"),
      bulletItem("Collapsible cards: merchant, amount, frequency badge, assigned card, status"),
      bulletItem("Expanded: change preferred card, snooze (X days), mark cancelled"),
      sectionBreak(),

      // Groups
      heading("13. Groups (Expense Splitting)", HeadingLevel.HEADING_2),
      para("Track group expenses and manage who owes what."),
      bulletItem("Create group: name, total amount, add members (name, email, amount)"),
      bulletItem("Group cards with collection progress bar"),
      bulletItem("Member list: name, email, amount owed, paid/pending status"),
      bulletItem("Send payment reminders, mark as paid, settle group"),
      sectionBreak(),

      // Settings
      heading("14. Settings", HeadingLevel.HEADING_2),
      para("Account management, billing, and preferences."),
      bulletItem("Account info: email, account ID"),
      bulletItem("Billing: current tier badge (Free/Plus/Pro), renewal date, usage metrics"),
      bulletItem("Appearance: light/dark theme toggle"),
      bulletItem("Preferences: email notifications, weekly summary, unusual activity alerts"),
      bulletItem("Sign out button"),
      sectionBreak(),

      // PRICING
      heading("Pricing Tiers", HeadingLevel.HEADING_1),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 2387, 2387, 2386],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, margins: cellMargins,
              shading: { fill: "0A0A0A", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "", size: 20, font: "Arial", color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 2387, type: WidthType.DXA }, margins: cellMargins,
              shading: { fill: "0A0A0A", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Free", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 2387, type: WidthType.DXA }, margins: cellMargins,
              shading: { fill: "0A0A0A", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Plus ($9.99/mo)", bold: true, size: 20, font: "Arial", color: "C8FF57" })] })] }),
            new TableCell({ borders, width: { size: 2386, type: WidthType.DXA }, margins: cellMargins,
              shading: { fill: "0A0A0A", type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [new TextRun({ text: "Pro ($19.99/mo)", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })] }),
          ]}),
          ...([
            ["Splits/month", "3", "Unlimited", "Unlimited"],
            ["Linked cards", "2", "10", "Unlimited"],
            ["Routing rules", "Basic", "AI-powered", "AI-powered"],
            ["Subscriptions", "No", "Yes", "Yes"],
            ["Groups", "No", "Yes", "Yes"],
            ["Virtual card", "No", "No", "Yes"],
            ["Advanced analytics", "No", "No", "Yes"],
            ["Rewards optimizer", "No", "No", "Yes"],
            ["Free trial", "-", "30 days", "30 days"],
          ]).map((r, i) => new TableRow({ children: r.map((c, j) => new TableCell({
            borders, width: { size: j === 0 ? 2200 : j === 3 ? 2386 : 2387, type: WidthType.DXA }, margins: cellMargins,
            shading: i % 2 === 0 ? { fill: "F5F5F0", type: ShadingType.CLEAR } : undefined,
            children: [new Paragraph({ children: [new TextRun({ text: c, size: 20, font: "Arial", bold: j === 0 })] })]
          }))}))
        ]
      }),
      sectionBreak(),

      // SIDEBAR NAV
      heading("Dashboard Navigation (Sidebar)", HeadingLevel.HEADING_1),
      para("The dashboard uses a collapsible sidebar with these items, in order:"),
      bulletItem("Home (Dashboard)"),
      bulletItem("Payment Methods"),
      bulletItem("Split Rules"),
      bulletItem("Routing Rules"),
      bulletItem("Transactions"),
      bulletItem("Analytics"),
      bulletItem("Rewards"),
      bulletItem("Virtual Card"),
      bulletItem("Subscriptions"),
      bulletItem("Groups"),
      bulletItem("Settings"),
      para("Mobile: hamburger menu with slide-out sidebar overlay."),
      sectionBreak(),

      // KEY FLOWS
      heading("Key User Flows", HeadingLevel.HEADING_1),

      heading("New User Flow", HeadingLevel.HEADING_3),
      bulletItem("Visit www.paysplitt.com landing page"),
      bulletItem("Click Get Started -> dashboard.paysplitt.com/signup"),
      bulletItem("Create account (email + password via Supabase)"),
      bulletItem("4-step onboarding: welcome, add card, create split rule, success"),
      bulletItem("Arrive at dashboard"),

      heading("Returning User Flow", HeadingLevel.HEADING_3),
      bulletItem("Visit www.paysplitt.com, click Login -> dashboard.paysplitt.com/login"),
      bulletItem("Or go directly to dashboard.paysplitt.com (auto-login if session exists)"),
      bulletItem("See dashboard with stats, recent transactions, quick actions"),

      heading("Making a Purchase", HeadingLevel.HEADING_3),
      bulletItem("User makes purchase with linked card"),
      bulletItem("Routing rules evaluated by priority"),
      bulletItem("Split rule applied: transaction divided across cards"),
      bulletItem("Each split leg charged independently"),
      bulletItem("Transaction appears in history with expandable breakdown"),
      sectionBreak(),

      // DESIGN NOTES
      heading("Design Notes", HeadingLevel.HEADING_1),
      bulletItem("Light mode is the default theme; dark mode available as user preference"),
      bulletItem("All colors should use CSS variables (--bg, --text, --surface, --lime, --border, etc.)"),
      bulletItem("Cards and surfaces use subtle shadows and rounded corners (10-12px)"),
      bulletItem("Status badges throughout: color-coded pills (green=active, red=failed, yellow=pending)"),
      bulletItem("Category badges on transactions: colored pills per merchant category"),
      bulletItem("Empty states with icons and helpful CTAs on every data page"),
      bulletItem("Loading states: spinner component used throughout"),
      bulletItem("Toast notifications for success/error feedback"),
      bulletItem("Modal pattern for create/edit forms (cards, rules, groups)"),
      bulletItem("Responsive: sidebar collapses to hamburger on mobile"),
      bulletItem("Charts: Recharts library (pie, bar, line) with brand colors"),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/sessions/jolly-modest-carson/mnt/SplitPay/Splitt_Product_Summary.docx", buffer);
  console.log("Done!");
});
