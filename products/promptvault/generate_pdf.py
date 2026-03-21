"""
Generate a polished PDF for The Cold Email Vault from the markdown source.
"""
import sys
sys.path.insert(0, '/Users/mint/Library/Python/3.14/lib/python/site-packages')

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, PageBreak, Table, TableStyle, Preformatted
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
import re

OUTPUT_PATH = "/Users/mint/.openclaw/workspace/products/promptvault/the-cold-email-vault.pdf"

# Color palette
NAVY = HexColor("#1a1a2e")
ACCENT = HexColor("#0f7be6")
LIGHT_GRAY = HexColor("#f5f5f7")
MID_GRAY = HexColor("#888888")
WHITE = HexColor("#ffffff")
CODE_BG = HexColor("#f0f4f8")
CODE_BORDER = HexColor("#d0d8e4")

def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        rightMargin=0.85*inch,
        leftMargin=0.85*inch,
        topMargin=0.85*inch,
        bottomMargin=0.85*inch,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle('Title', parent=styles['Normal'],
        fontSize=28, textColor=WHITE, fontName='Helvetica-Bold',
        spaceAfter=6, alignment=TA_CENTER)
    subtitle_style = ParagraphStyle('Subtitle', parent=styles['Normal'],
        fontSize=13, textColor=HexColor("#aaccff"), fontName='Helvetica',
        spaceAfter=4, alignment=TA_CENTER)
    byline_style = ParagraphStyle('Byline', parent=styles['Normal'],
        fontSize=10, textColor=HexColor("#7799cc"), fontName='Helvetica',
        alignment=TA_CENTER)
    h1_style = ParagraphStyle('H1', parent=styles['Normal'],
        fontSize=18, textColor=NAVY, fontName='Helvetica-Bold',
        spaceBefore=18, spaceAfter=6)
    h2_style = ParagraphStyle('H2', parent=styles['Normal'],
        fontSize=14, textColor=ACCENT, fontName='Helvetica-Bold',
        spaceBefore=14, spaceAfter=4)
    h3_style = ParagraphStyle('H3', parent=styles['Normal'],
        fontSize=11, textColor=NAVY, fontName='Helvetica-Bold',
        spaceBefore=10, spaceAfter=3)
    body_style = ParagraphStyle('Body', parent=styles['Normal'],
        fontSize=10, textColor=HexColor("#333333"), fontName='Helvetica',
        leading=15, spaceAfter=6, alignment=TA_JUSTIFY)
    bullet_style = ParagraphStyle('Bullet', parent=styles['Normal'],
        fontSize=10, textColor=HexColor("#333333"), fontName='Helvetica',
        leading=14, spaceAfter=3, leftIndent=16, bulletIndent=0)
    code_style = ParagraphStyle('Code', parent=styles['Normal'],
        fontSize=9, textColor=HexColor("#1a1a2e"), fontName='Courier',
        leading=13, spaceAfter=2, leftIndent=0)
    label_style = ParagraphStyle('Label', parent=styles['Normal'],
        fontSize=9, textColor=MID_GRAY, fontName='Helvetica-BoldOblique',
        spaceAfter=2)
    note_style = ParagraphStyle('Note', parent=styles['Normal'],
        fontSize=9, textColor=HexColor("#555555"), fontName='Helvetica-Oblique',
        leading=13, spaceAfter=6)

    story = []

    # ── COVER PAGE ──
    story.append(Spacer(1, 0.4*inch))
    # Title block as a colored table
    cover_data = [
        [Paragraph("THE COLD EMAIL VAULT", title_style)],
        [Paragraph("50 Battle-Tested Cold Email Prompts<br/>That Actually Get Replies", subtitle_style)],
        [Spacer(1, 0.1*inch)],
        [Paragraph("PromptVault &nbsp;·&nbsp; v1.0 &nbsp;·&nbsp; 2026", byline_style)],
    ]
    cover_table = Table(cover_data, colWidths=[6.3*inch])
    cover_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NAVY),
        ('TOPPADDING', (0,0), (-1,0), 32),
        ('BOTTOMPADDING', (0,-1), (-1,-1), 32),
        ('LEFTPADDING', (0,0), (-1,-1), 24),
        ('RIGHTPADDING', (0,0), (-1,-1), 24),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [NAVY]),
    ]))
    story.append(cover_table)
    story.append(Spacer(1, 0.3*inch))

    # Intro blurb on cover
    story.append(Paragraph(
        "Stop writing cold emails from scratch. These 50 precision-engineered prompts turn Claude, "
        "ChatGPT, or any capable AI into your personal cold email copywriter — generating openers, "
        "full emails, follow-ups, subject lines, and more in under 5 minutes each.",
        ParagraphStyle('CoverBody', parent=body_style, fontSize=11, leading=17, alignment=TA_CENTER)
    ))
    story.append(Spacer(1, 0.15*inch))

    # What's inside summary
    inside_items = [
        ("📬", "10 First-Line Openers", "Personalized openers that make people keep reading"),
        ("📧", "10 Full Email Frameworks", "Complete structures for every scenario"),
        ("🔄", "10 Follow-Up Sequences", "What to send after silence"),
        ("🎯", "10 Subject Line Generators", "A/B testing + personalization formulas"),
        ("⚡", "10 Special Scenarios", "High-ticket, executives, gatekeepers & more"),
        ("🔬", "5 Optimization Prompts", "Critique & improve emails you've already written"),
    ]
    for emoji, title, desc in inside_items:
        story.append(Paragraph(
            f"<b>{emoji} {title}</b> — {desc}",
            ParagraphStyle('InsideItem', parent=bullet_style, fontSize=10, leading=14, spaceAfter=4)
        ))

    story.append(PageBreak())

    # ── HOW TO USE ──
    story.append(Paragraph("HOW TO USE THIS", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=ACCENT, spaceAfter=8))
    story.append(Paragraph(
        "<b>The formula:</b> Replace anything in [brackets] with your specifics. "
        "The more specific you are, the better the output.",
        body_style))
    story.append(Paragraph(
        "<b>Best practice:</b> Don't run each prompt just once. Run it 3 times, pick the best version, "
        "then edit the opening line manually — that's the line that wins or loses the open.",
        body_style))
    story.append(Paragraph(
        "<b>Works with:</b> Claude, ChatGPT, Gemini, or any capable LLM.",
        body_style))
    story.append(Spacer(1, 0.1*inch))

    # ── QUICK CHEAT SHEET TABLE ──
    story.append(Paragraph("QUICK-USE CHEAT SHEET", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=ACCENT, spaceAfter=8))

    cheat_data = [
        ["Goal", "Use Prompt #"],
        ["Write a personalized opener", "1–10"],
        ["Write a complete first email", "11–20"],
        ["Write follow-up #1 (no response)", "21, 24, 25"],
        ["Write follow-up #2 (still no response)", "22, 26, 28"],
        ["Final breakup email", "23"],
        ["Generate subject lines", "31–35"],
        ["High-ticket deal ($5k+)", "37"],
        ["Re-engage a ghost", "17, 34"],
        ["Critique an existing email", "46, 47"],
        ["Personalize a generic email", "48"],
    ]
    cheat_table = Table(cheat_data, colWidths=[3.8*inch, 2.5*inch])
    cheat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0,0), (-1,-1), 0.5, HexColor("#dddddd")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(cheat_table)
    story.append(PageBreak())

    # ── THE PROMPTS ──
    sections = [
        ("SECTION 1: FIRST-LINE OPENERS", "The first line determines if the email gets read. These prompts generate personalized, non-generic openers.", [
            ("Prompt 1 — The LinkedIn Trigger",
             "Write a cold email opening line (1-2 sentences only) for [First Name] who works as [Job Title] at [Company]. Reference that I noticed they recently [specific LinkedIn activity — posted about X / commented on Y / shared an article about Z]. Make it feel like genuine observation, not surveillance. Keep it conversational and don't compliment their content."),
            ("Prompt 2 — The Company Milestone",
             "Write a cold email opening line using a recent company milestone as the hook. The company is [Company Name], a [brief description]. They recently [hired rapidly / launched a new product / expanded to new markets / raised funding / won an award]. I sell [your product/service]. The line should congratulate without being sycophantic, and bridge naturally to why I'm reaching out."),
            ("Prompt 3 — The Shared Pain Point",
             "Write a cold email opener for a [Job Title] at a [industry] company with [X employees]. They likely struggle with [specific pain point]. Open with a provocative question or observation that immediately signals I understand their world. Do not start with \"I\" or reference my company in the opening line."),
            ("Prompt 4 — The Competitor Reference (Use Carefully)",
             "Write a subtle cold email opener that references the fact that [Competitor Company] is one of [Prospect Company]'s main competitors. Imply that their competitor is doing something interesting with [topic/category] without being disparaging. The goal is to trigger competitive curiosity. Keep it to 1-2 sentences."),
            ("Prompt 5 — The News Hook",
             "Write a cold email opening line that references recent news about [Prospect's Industry/Company]. The news angle is: [insert relevant news item or industry trend]. Connect it naturally to why I'm reaching out as a [your role] who helps [type of company] with [problem you solve]. Do not be generic — make the connection feel direct and relevant."),
            ("Prompt 6 — The Compliment-Free Opener",
             "Write a cold email first line for [First Name], [Title] at [Company]. Most cold emails open with flattery. Write one that skips all of that and gets to the point in a way that still feels human. My value prop is [one sentence]. The opener should create curiosity without being cryptic."),
            ("Prompt 7 — The Referral Drop",
             "Write a natural-sounding cold email opener that references a mutual connection. Mutual connection is [Name], who suggested I reach out to [First Name] at [Company]. Make it feel warm but professional. Don't oversell the mutual connection. Keep it to 1-2 sentences before transitioning to the reason for reaching out."),
            ("Prompt 8 — The 'I Did My Research' Opener",
             "Write a cold email opening line that demonstrates I researched [Prospect Company] specifically. Details I know about them: [insert 2-3 specific facts — their tech stack, a blog post they wrote, their team size, a product feature, a customer they serve]. The line should feel specific enough that they know I didn't blast this to 1,000 people."),
            ("Prompt 9 — The Provocative Statement",
             "Write a bold, provocative opening line for a cold email to [Job Title] at a [industry] company. The statement should challenge a common assumption in their industry about [topic]. It should be slightly uncomfortable — enough to make them keep reading. I can follow up with data or a counter-perspective. Keep it to 1 sentence."),
            ("Prompt 10 — The Direct Opener",
             "Write a direct, no-fluff opening line for a cold email. No compliments, no \"I hope this finds you well,\" no \"I came across your profile.\" Just state exactly why I'm reaching out in one clear sentence. Context: I help [type of company] solve [specific problem]. I'm reaching out to [First Name] because [specific reason they're a fit]."),
        ]),
        ("SECTION 2: FULL EMAIL FRAMEWORKS", "Complete cold email structures for different scenarios.", [
            ("Prompt 11 — The Classic Problem-Solution",
             "Write a cold email using the problem-agitate-solution framework.\n\nDetails:\n- Recipient: [Title] at [Company Type]\n- Their likely problem: [specific pain point]\n- What makes it worse: [what's at stake / what they're losing]\n- My solution: [product/service in 1 sentence]\n- Social proof: [one brief proof point — customer, metric, or result]\n- CTA: [specific ask — 15-min call, reply with a question, etc.]\n\nKeep the total email under 150 words. Make it feel like a human wrote it, not a marketing department."),
            ("Prompt 12 — The Before/After",
             "Write a cold email structured around a transformation story.\n\nBefore: [What a customer's situation looked like before using my product/service]\nAfter: [What it looks like now — ideally with a specific metric]\nBridge: [How we did it]\nRelevance: [Why this matters to THIS prospect specifically — their company/role/situation]\nCTA: [specific and low-friction]\n\nKeep it under 175 words. Don't use the words \"game-changer,\" \"revolutionary,\" or \"innovative.\""),
            ("Prompt 13 — The Insight Email",
             "Write a \"give value first\" cold email that leads with a genuinely useful insight rather than a pitch.\n\nRecipient: [Title] at [Industry] company\nInsight: [share one non-obvious finding, trend, or data point relevant to their role/industry]\nBridge: [connect insight to why my product/service is relevant]\nSoft CTA: [non-pushy ask — \"thought you'd find this interesting\" / \"happy to share the full data if useful\"]\n\nGoal: make them feel like this was worth reading even if they never reply. Keep under 150 words."),
            ("Prompt 14 — The Case Study Email",
             "Write a cold email built around a brief customer case study.\n\nCustomer profile: [anonymized description of a similar company — same size, industry, or problem]\nTheir problem: [what they struggled with before]\nResult: [specific outcome we delivered — numbers preferred]\nRelevance statement: [one sentence connecting this to the prospect's situation]\nCTA: [low-commitment ask]\n\nKeep it scannable. Use short paragraphs. Under 175 words."),
            ("Prompt 15 — The 'Quick Question' Email",
             "Write a minimalist cold email structured as a single genuine question.\n\nContext: I'm reaching out to [Title] at [Company Type] who likely deals with [problem].\nMy product/service: [one sentence]\nThe question should be: genuinely curious (not rhetorical), specific enough to show research, answerable in 1-2 sentences, and naturally lead to a conversation about what I do.\n\nTotal email should be under 75 words including signature."),
            ("Prompt 16 — The Competitor Switch",
             "Write a cold email for a prospect who likely uses [Competitor]. Don't bash the competitor. Instead, focus on what we do differently.\n\nKey differentiators: [list 2-3 concrete differences — not vague]\nTransition line: natural way to raise the idea of evaluating alternatives without being pushy\nCTA: low-friction comparison offer (demo, trial, side-by-side breakdown)\n\nKeep tone professional and confident, not desperate. Under 150 words."),
            ("Prompt 17 — The Re-engagement Email",
             "Write a cold email to a prospect who went dark after [X touchpoints / previous conversation / demo].\n\nTone: light, not passive-aggressive, slightly self-aware that they went quiet\nInclude: brief callback to previous conversation\nAdd: a new reason to re-engage (new feature, case study, relevant news)\nCTA: easy yes or no — give them permission to say no if timing isn't right\n\nUnder 125 words. End with something that makes them smile slightly."),
            ("Prompt 18 — The Executive Email",
             "Write a cold email for a C-level executive (CEO, CFO, COO) at a [company size] company in [industry].\n\nExecutives get pitched constantly. This email must:\n- Get to the point in sentence 1\n- Speak in business outcomes (revenue, cost, risk), not features\n- Reference a relevant business challenge at their scale\n- Have a clear, specific CTA with low time commitment\n- Be under 100 words\n\nNo buzzwords. No fluff. Write it like you're talking to someone who has 8 minutes between meetings."),
            ("Prompt 19 — The LinkedIn → Email Bridge",
             "Write a cold email to someone I previously connected with on LinkedIn but haven't had a real conversation with.\n\nContext: We connected [X weeks/months ago]. They [accepted / never responded to my LinkedIn message / liked my post / commented on something].\n\nThis email should:\n- Reference the LinkedIn connection naturally (not awkwardly)\n- Not make them feel stalked\n- Feel like a natural progression to a real conversation\n- Include a specific reason for reaching out now (timing hook)\n\nUnder 125 words."),
            ("Prompt 20 — The Partnership Pitch",
             "Write a cold email proposing a partnership or referral relationship (not a sale).\n\nI'm reaching out to [Title] at [Company] because: [reason they'd be a good partner — shared audience, complementary services, mutual benefit].\n\nThe email should:\n- Lead with what's in it for them\n- Be specific about what the partnership would look like\n- Avoid making it feel like a sales pitch disguised as a partnership pitch\n- Include a clear, simple first step\n\nUnder 150 words."),
        ]),
        ("SECTION 3: FOLLOW-UP SEQUENCES", "What to send after the first email when they don't reply.", [
            ("Prompt 21 — Follow-up #1 (3 days later): The Value Add",
             "Write a follow-up email to send 3 days after my initial cold email got no response. Don't just say \"bumping this up.\" Add a new piece of value: [relevant resource / stat / case study / article]. Keep the original ask alive but frame this as a standalone helpful message. Under 75 words."),
            ("Prompt 22 — Follow-up #2 (7 days later): The New Angle",
             "Write a second follow-up email (they haven't responded to 2 previous emails). Take a completely different angle than the first email. If email 1 was about [angle A], this one should approach from [angle B — a different pain point, use case, or proof point]. Under 100 words. Don't reference that this is your third attempt."),
            ("Prompt 23 — Follow-up #3 (14 days later): The Break-up",
             "Write a \"break-up\" email — the final email in a cold outreach sequence. It should: feel human and not passive-aggressive, give them a graceful out, leave the door open for future contact, and sometimes trigger a response from people who felt guilty for ignoring you. Under 75 words. Slightly self-aware and warm in tone."),
            ("Prompt 24 — The 'I Found Something You'd Like' Follow-up",
             "Write a follow-up email framed around a piece of content, news, or resource that's genuinely relevant to [Prospect's Industry/Role]. I'm not referencing my previous email. Just: here's something you might find interesting, and by the way, I still think [value prop] could help. Under 100 words."),
            ("Prompt 25 — The Reply-to-Their-Activity Follow-up",
             "Write a follow-up triggered by a prospect's activity since my first email: they [liked a LinkedIn post / published an article / their company made an announcement / they got promoted]. Use this as a natural, non-creepy reason to resurface the conversation. Under 100 words."),
            ("Prompt 26 — The 'Is the Timing Off?' Follow-up",
             "Write a follow-up email that addresses the possibility that my timing was wrong. Offer to reconnect in [30/60/90 days] if now isn't right. Make it easy to respond with a simple \"not now, try me in Q3\" answer. Under 75 words."),
            ("Prompt 27 — The Video Follow-up Script",
             "Write a short script (under 60 seconds) for a personalized follow-up video to send to [Prospect Name] at [Company]. They haven't responded to my previous email. The video should: start with their name and a personal observation, briefly recap the value prop, and end with a specific ask. Script format: write it as I would say it naturally, not as a formal pitch."),
            ("Prompt 28 — The Social Proof Follow-up",
             "Write a follow-up email leading with a fresh piece of social proof that wasn't in my first email. New proof: [customer quote / new case study / press mention / review]. Connect it to the prospect's situation. Keep under 100 words."),
            ("Prompt 29 — The Objection Pre-empt Follow-up",
             "Write a follow-up that addresses the most likely reason [Job Title] at [Industry company] hasn't responded. Most likely objection: [price / timing / already have a solution / not the decision maker]. Acknowledge it directly and offer a response that removes the objection. Under 125 words."),
            ("Prompt 30 — The Team Expansion Follow-up",
             "Write a follow-up email that escalates by copying in or referencing another stakeholder at the company. Prospect hasn't responded after [X] emails. I want to try reaching out to [their manager / a peer / a different department head]. Write the email to the NEW contact that references my original conversation (naturally, not accusatorially) and makes a fresh pitch. Under 150 words."),
        ]),
        ("SECTION 4: SUBJECT LINES", "Subject lines are 50% of your open rate. These generate and test options.", [
            ("Prompt 31 — The Personalized Subject Line",
             "Generate 10 cold email subject lines for [First Name] at [Company]. They're a [Title] in the [Industry] space. My email is about [topic/value prop].\n\nInclude a mix of:\n- Question-based\n- Curiosity-gap\n- Direct/blunt\n- Reference to their company\n- Reference to a pain point\n\nNo emojis. No clickbait. Rate each one 1-10 for likely open rate and explain why."),
            ("Prompt 32 — The A/B Test Generator",
             "I'm sending a cold email about [topic] to [audience]. Generate 5 pairs of subject lines for A/B testing. Each pair should test one variable (e.g., question vs. statement, short vs. long, personal vs. generic). Format: Pair 1A vs. 1B, Pair 2A vs. 2B, etc. Explain what each pair is testing."),
            ("Prompt 33 — Short vs. Long Test",
             "Generate 5 subject lines under 5 words and 5 subject lines between 8-12 words for a cold email about [topic] to [audience]. Indicate which length you think will perform better for this specific audience and why."),
            ("Prompt 34 — The Re-engagement Subject Line",
             "Generate 8 subject lines for a re-engagement email to a cold prospect who went dark. They know who I am. The goal is to get them to open without feeling pestered. Include at least 2 that are self-aware/slightly humorous."),
            ("Prompt 35 — The No-BS Subject Line",
             "Write 10 subject lines for a cold email that are completely literal — no tricks, no clickbait, no mystery. Just exactly what the email is about. The audience is [Title] at [Company Type]. Sometimes the most direct subject lines win because everyone else is trying to be clever. Rate each by expected open rate."),
        ]),
        ("SECTION 5: SPECIAL SCENARIOS", "Edge cases, niche situations, and advanced tactics.", [
            ("Prompt 36 — Selling to a Non-Technical Buyer on a Technical Product",
             "Write a cold email selling [technical product/service] to a [non-technical title — CEO, Marketing Director, Operations Manager] who won't care about how it works, only what it does for their business. Translate all technical benefits into business outcomes. Avoid jargon. Under 150 words."),
            ("Prompt 37 — High-Ticket Offer ($5k+)",
             "Write a cold email for a high-ticket offer priced at [$X]. At this price point, the email should NOT close the deal — it should only open a conversation. Focus on credibility signals, outcomes, and getting a call. Under 150 words. No discounts, no urgency tactics."),
            ("Prompt 38 — The 'We Just Launched' Email",
             "Write a cold email announcing a new product/feature launch and using it as the hook for outreach. The launch is: [brief description]. The recipient is [Title] at [Company Type]. Frame the launch as relevant to their specific situation, not just as a general announcement. Under 125 words."),
            ("Prompt 39 — Outreach to a Warm Lead",
             "Write a cold email to someone who [downloaded our content / attended our webinar / visited our pricing page]. They haven't bought yet. Reference their action naturally without being creepy. Make it feel like a natural follow-up from a company that noticed them. Under 125 words."),
            ("Prompt 40 — The 'I Heard You're Hiring' Email",
             "Write a cold email using a prospect's job listings as the hook. They're hiring for [role], which signals [business need/problem]. My product/service addresses that need. The email should make the connection feel obvious and natural, not like a stretch. Under 125 words."),
            ("Prompt 41 — Multilingual Cold Email",
             "Write a cold email in [language] for a prospect at [Company] based in [Country]. Adapt the tone and formality for business culture in [Country]. My product/service is [description]. CTA: [specific ask]. Keep under 150 words."),
            ("Prompt 42 — Cold Email to Recruit a Partner/Affiliate",
             "Write a cold email recruiting [Name/Title] as an affiliate or referral partner for [product/service]. They have an audience of [description]. Structure: lead with what they earn, explain the fit for their audience, make it stupidly easy to say yes. Under 150 words. Don't make it feel like an MLM pitch."),
            ("Prompt 43 — The Apology/Recovery Email",
             "Write a cold email following up after a bad first impression — a previous email that was too salesy, poorly timed, or irrelevant. Acknowledge the misstep lightly without over-apologizing. Reset the conversation. Make a fresh, relevant pitch. Under 125 words."),
            ("Prompt 44 — The Post-Conference Email",
             "Write a cold email to someone I met briefly at [Conference/Event]. We [talked for a few minutes / were in the same session / connected on the app but didn't speak]. Reference the event naturally and continue the relationship without being presumptuous. Under 100 words."),
            ("Prompt 45 — Cold Email to a Gatekeeper (EA/Receptionist)",
             "Write a cold email to an Executive Assistant whose boss is my target. The goal is to get a warm introduction, not bypass them. Treat them as a professional, not an obstacle. Be respectful of their role. Under 100 words."),
        ]),
        ("SECTION 6: ANALYSIS & OPTIMIZATION", "Use these to improve emails you've already written.", [
            ("Prompt 46 — The Critique",
             "Critique this cold email as a seasoned B2B sales expert. Be brutally honest. Identify: what's working, what's killing the open/reply rate, and rewrite the weakest sections. Focus especially on: the subject line, opening line, value proposition clarity, and CTA.\n\n[PASTE YOUR EMAIL HERE]"),
            ("Prompt 47 — The Simplification Pass",
             "Rewrite this cold email at a 6th-grade reading level without losing the core message. Remove all jargon, passive voice, and sentences over 15 words. The goal: if someone reads this in 10 seconds while distracted, they should still understand exactly what I'm offering and what I want them to do.\n\n[PASTE YOUR EMAIL HERE]"),
            ("Prompt 48 — The Personalization Upgrade",
             "Take this generic cold email and rewrite it for a specific prospect. Prospect details: [Name, Title, Company, Industry, anything specific you know about them]. Make it feel like it was written only for them. Modify the opening, any examples, and the relevance statement. Keep the same CTA.\n\n[PASTE YOUR EMAIL HERE]"),
            ("Prompt 49 — The Tone Shift",
             "Rewrite this cold email in [formal/casual/confident/empathetic/direct] tone. Keep the same structure and core message but adjust language, sentence structure, and opening/closing to match the target tone. Explain 3 specific changes you made and why they affect tone.\n\n[PASTE YOUR EMAIL HERE]"),
            ("Prompt 50 — The Sequence Audit",
             "I'll share my 3-email cold outreach sequence. Audit it as a whole:\n1. Does each email add new value or just repeat?\n2. Is the tone consistent across all 3?\n3. Do the subject lines form a coherent arc?\n4. Is the CTA progression right?\n5. What's the most likely drop-off point and why?\n\n[PASTE EMAIL 1]\n[PASTE EMAIL 2]\n[PASTE EMAIL 3]"),
        ]),
    ]

    for section_title, section_intro, prompts in sections:
        story.append(Paragraph(section_title, h1_style))
        story.append(HRFlowable(width="100%", thickness=1, color=ACCENT, spaceAfter=6))
        story.append(Paragraph(section_intro, note_style))
        story.append(Spacer(1, 0.05*inch))

        for prompt_title, prompt_text in prompts:
            story.append(Paragraph(prompt_title, h3_style))

            # Render prompt in a styled box
            lines = prompt_text.split('\n')
            code_lines = []
            for line in lines:
                # escape XML
                line = line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                code_lines.append(line)
            code_content = '<br/>'.join(code_lines)

            code_para = Paragraph(code_content,
                ParagraphStyle('CodeBox', parent=body_style,
                    fontSize=9, fontName='Courier', leading=13,
                    backColor=CODE_BG, borderColor=CODE_BORDER,
                    borderWidth=1, borderPadding=8,
                    spaceAfter=10))
            story.append(code_para)

        story.append(PageBreak())

    # ── ABOUT PAGE ──
    story.append(Paragraph("ABOUT PROMPTVAULT", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=ACCENT, spaceAfter=8))
    story.append(Paragraph(
        "PromptVault makes prompt packs engineered for results — not bloated libraries of mediocre prompts. "
        "Every pack is built around a specific high-value use case.",
        body_style))
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("<b>More packs coming:</b>", body_style))
    for item in ["LinkedIn Content OS — 30 days of founder posts, generated in one afternoon",
                 "AI Research Toolkit — Deep competitor and market research, systematized",
                 "Sales Page Accelerator — Landing page copy that converts"]:
        story.append(Paragraph(f"• {item}", bullet_style))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Questions or feedback: hello@promptvault.co", note_style))

    doc.build(story)
    print(f"PDF generated: {OUTPUT_PATH}")

if __name__ == "__main__":
    build_pdf()
