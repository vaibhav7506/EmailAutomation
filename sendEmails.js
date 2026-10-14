import nodemailer from "nodemailer";
import fetch from "node-fetch";

// ---- YOUR DETAILS ----
const YOUR_EMAIL = ""; // Your Gmail
const YOUR_APP_PASSWORD = ""; // 16-digit App Password
const GROQ_API_KEY = "" // From console.groq.com
const recipients = [


// 
 
]
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES modules have no built-in __dirname (that's a CommonJS-only global) —
// this derives the equivalent from import.meta.url instead.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- CHECKPOINT FILE ----
// Tracks who's already been emailed so a run stopped by the daily rate/token
// cap resumes tomorrow instead of re-sending or losing progress. With 8,754
// contacts and a ~150-250/day realistic ceiling on the free Groq tier, this
// is not optional — you will hit the daily cap most runs, by design.
const CHECKPOINT_FILE = path.join(__dirname, "sent_log.json");

function loadSentEmails() {
  if (!fs.existsSync(CHECKPOINT_FILE)) return new Set();
  try {
    return new Set(JSON.parse(fs.readFileSync(CHECKPOINT_FILE, "utf-8")));
  } catch {
    return new Set();
  }
}

function saveSentEmails(sentSet) {
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify([...sentSet], null, 2));
}

// ---- CONTACT SIGNATURE ---- (unchanged)
const CONTACT_SIGNATURE = `

📞 +91 7506427646
🔗 LinkedIn: https://www.linkedin.com/in/vaibhav-sharma-996aa8249/`;

// ---- SET UP NODEMAILER ---- (unchanged)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: YOUR_EMAIL,
    pass: YOUR_APP_PASSWORD,
  },
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---- FUNCTION TO BUILD PERSONALIZED PROMPT BY ROLE AND ALUMNI ----
// Covers every role shape actually present in the contact list, including
// blank roles/companies (common in the recruitment-agency-sourced contacts)
// and founder/executive titles, which the previous version had no branch for.
function buildPrompt(person) {
  const role = (person.role || "").toLowerCase().trim();
  const company = (person.company || "").trim();
  const hasRole = role.length > 0;
  const hasCompany = company.length > 0;
  const PORTFOLIO_LINK = "https://vaibhav7506portfolio.vercel.app/";

  const whoClause = hasRole && hasCompany
    ? `who is a ${person.role} at ${person.company}`
    : hasCompany
    ? `who works at ${person.company}`
    : hasRole
    ? `who works as a ${person.role}`
    : `at your organization`;

const aboutMe = `About me:
- My name is Vaibhav Sharma
- Full Stack Developer (MERN Stack)
- Junior Software Engineer Intern at Sigmoid Frogs since May 2026
- 380+ LeetCode problems solved in Java
- Skills: React, Node.js, MongoDB, MySQL, PostgreSQL, Git
- Also have hands-on AI-related project experience, visible on my portfolio`;

  if (person.isAlumni) {
    return `Write a highly respectful email to ${person.name}.
CONTEXT: They are my college senior from MMMUT (Batch of ${person.batch}). I am their junior from the Batch of 2026.

Goal: Connect as a fellow alumnus and ask for guidance or a referral at ${person.company}.

${aboutMe}

Tone: Humble, respectful, and focused on the "Senior-Junior" bond. DO NOT sound like a batchmate. Mention I am reaching out to a senior for advice.
End with a brief, warm line sharing my portfolio: ${PORTFOLIO_LINK} — ask them to take a look whenever they get a chance and share any feedback, and mention it also shows some of my AI work.
Keep it under 140 words. Return only the email body.`;
  }

  const isHR =
    role.includes("hr") ||
    role.includes("recruiter") ||
    role.includes("talent") ||
    role.includes("people ops") ||
    role.includes("hrbp") ||
    role.includes("human resource") ||
    role.includes("recruitment") ||
    role.includes("hiring") ||
    role.includes("acquisition") ||
    role.includes("onboarding") ||
    role.includes("people & culture");

  const isFounderOrExec =
    role.includes("ceo") ||
    role.includes("chief executive") ||
    role.includes("founder") ||
    role.includes("cofounder") ||
    role.includes("co-founder") ||
    role.includes("cto") ||
    role.includes("chief technology") ||
    role.includes("cfo") ||
    role.includes("chief financial") ||
    role.includes("coo") ||
    role.includes("chief operating") ||
    role.includes("president") ||
    role.includes("chairman") ||
    role.includes("managing director") ||
    role.includes("owner") ||
    role.includes("vp") ||
    role.includes("vice president");

  const isSeniorDev =
    role.includes("senior") ||
    role.includes("staff") ||
    role.includes("sde-3") ||
    role.includes("sde3") ||
    role.includes("se-3") ||
    role.includes("engineer 3") ||
    role.includes("lead") ||
    role.includes("principal") ||
    role.includes("manager") ||
    role.includes("architect") ||
    role.includes("director");

  const isDev =
    role.includes("engineer") ||
    role.includes("developer") ||
    role.includes("sde") ||
    role.includes("swe") ||
    role.includes("analyst") ||
    role.includes("se ") ||
    role.includes("ml") ||
    role.includes("programmer");

  if (isHR) {
    return `Write a short, professional, and genuinely intriguing email to ${person.name} ${whoClause}.
I am writing to express my interest in Full Stack Developer openings and request to be considered or referred.

${aboutMe}
${hasCompany ? `- Actively looking for a Full Stack Developer role at ${person.company}` : `- Actively looking for a Full Stack Developer role`}

Tone: professional, respectful, concise, but with a hook that makes the HR curious enough to open my portfolio — e.g. reference that it demonstrates real, applied AI work, not just a resume line item.
End the email with a friendly closing line inviting them to check out my portfolio if they have a moment: ${PORTFOLIO_LINK} — mention it showcases my projects including the AI-related work, and politely ask if they could spare any feedback on it.
Keep it under 140 words. Return only the email body, no subject line.`;
  }

  if (isFounderOrExec) {
    return `Write a short, highly respectful email to ${person.name} ${whoClause}.
I am a Full Stack Developer reaching out because a direct referral rarely comes from someone this senior — I'm hoping they might point me to the right person on their team, or pass my details along, for a Full Stack Developer opening${hasCompany ? ` at ${person.company}` : ""}.

${aboutMe}

Tone: respectful of their time and seniority — brief, no overselling, acknowledge that a personal ask of a leader is a big one. Do not assume they personally handle hiring; ask them to redirect me if that's easier.
End with a brief line sharing my portfolio: ${PORTFOLIO_LINK} — mention it if they have a spare moment, since it shows applied AI work as well as full-stack projects.
Keep it under 130 words. Return only the email body, no subject line.`;
  }

  if (isSeniorDev) {
    return `Write a short warm email to ${person.name} ${whoClause}.
I am a Full Stack Developer looking for opportunities${hasCompany ? ` at ${person.company}` : ""} and hoping they can guide or refer me.

${aboutMe}

Tone: respectful and genuine since they are senior. Mention I would love their guidance or a referral.
End with a brief line sharing my portfolio: ${PORTFOLIO_LINK} — ask them to check it out if they have time (it also shows my AI-related work), and would appreciate any feedback.
Keep it under 140 words. Return only the email body, no subject line.`;
  }

  if (isDev) {
    return `Write a short friendly peer-to-peer email to ${person.name} ${whoClause}.
I am also a developer reaching out to ask if they can refer me for a Full Stack role${hasCompany ? ` at ${person.company}` : ""}.

${aboutMe}

Tone: casual, friendly, developer-to-developer vibe.
End with a casual line dropping my portfolio: ${PORTFOLIO_LINK} — ask them to take a look whenever they get a chance (it's got some AI work on there too), and let me know what they think.
Keep it under 140 words. Return only the email body, no subject line.`;
  }

  return `Write a short warm email to ${person.name}, ${whoClause}, asking for a job referral or lead for a Full Stack Developer role${hasCompany ? ` at ${person.company}` : ""}.

${aboutMe}

Tone: friendly and genuine. If their exact department is unclear, keep the ask general — a referral or a pointer to whoever handles engineering hiring there.
End with a line sharing my portfolio: ${PORTFOLIO_LINK} — ask them to check it out if they have a moment (it also shows my AI-related work), and mention I'd welcome any feedback.
Keep it under 140 words. Return only the email body, no subject line.`;
}

// Thrown specifically when the DAILY cap (not the per-minute one) is hit, so
// main() can stop the whole run cleanly instead of retrying uselessly.
class DailyLimitReached extends Error {}

// ---- PROACTIVE RATE LIMITER ----
// A flat delay between people (e.g. 3s) only controls the *average* request
// rate — a cluster of empty-content retries or near-simultaneous calls can
// still burst past Groq's 30 RPM cap within a single minute even if the
// long-run average looks fine, which is exactly what the dashboard screenshot
// showed (a spike to ~45 requests against a 30 limit line). This tracks real
// request timestamps in a trailing 60-second window and pauses *before*
// firing if about to exceed 25/min — 5 under Groq's hard cap, as a buffer.
class RateLimiter {
  constructor(maxPerMinute) {
    this.maxPerMinute = maxPerMinute;
    this.timestamps = [];
  }
  async throttle() {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < 60000);
    if (this.timestamps.length >= this.maxPerMinute) {
      const waitMs = 60000 - (now - this.timestamps[0]) + 200;
      console.log(`⏸  Pacing: at ${this.maxPerMinute}/min cap, waiting ${(waitMs / 1000).toFixed(1)}s...`);
      await sleep(waitMs);
      return this.throttle(); // re-check the window after waiting
    }
    this.timestamps.push(Date.now());
  }
}

const groqLimiter = new RateLimiter(25);

// ---- FUNCTION TO CALL GROQ, WITH REAL 429 HANDLING ----
async function callGroq(person, { reasoningEffort, maxTokens }, attempt = 1) {
  // Every path through this function — first attempt, empty-content retry,
  // and the 429 recursive retry below — passes through the same gate, so
  // none of them can cluster into a burst that trips the 30 RPM limit.
  await groqLimiter.throttle();

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        max_tokens: maxTokens,
        reasoning_effort: reasoningEffort,
        messages: [{ role: "user", content: buildPrompt(person) }],
      }),
    },
  );

  if (response.status === 429) {
    const data = await response.json().catch(() => ({}));
    const errMsg = data?.error?.message || "";
    const retryAfterHeader = Number(response.headers.get("retry-after"));
    const retryAfterSec = Number.isFinite(retryAfterHeader) ? retryAfterHeader : 20;

    // A long wait (minutes) or a message mentioning "per day" / TPD / RPD
    // means the DAILY cap is exhausted — waiting it out mid-script isn't
    // practical (could be hours), so stop the run cleanly instead.
    const isDailyCap = retryAfterSec > 120 || /per day|TPD|RPD/i.test(errMsg);
    if (isDailyCap) {
      throw new DailyLimitReached(
        `Groq daily limit reached (retry in ~${Math.ceil(retryAfterSec / 60)} min). ${errMsg}`
      );
    }

    // Per-minute limit — worth waiting for, but cap retries so a genuinely
    // stuck account doesn't loop forever.
    if (attempt > 4) {
      throw new Error(`Groq still rate-limited after ${attempt} attempts for ${person.name}.`);
    }
    console.warn(`⏳ Rate limited (per-minute). Waiting ${retryAfterSec}s before retrying ${person.name}...`);
    await sleep((retryAfterSec + 1) * 1000);
    return callGroq(person, { reasoningEffort, maxTokens }, attempt + 1);
  }

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error("Groq API error: " + JSON.stringify(data));
  }

  return data.choices[0]?.message?.content?.trim() || "";
}

async function generateEmail(person) {
  let content = await callGroq(person, { reasoningEffort: "low", maxTokens: 500 });

  if (!content) {
    console.warn(`⚠️  Empty content for ${person.name}, retrying with more tokens...`);
    content = await callGroq(person, { reasoningEffort: "low", maxTokens: 800 });
  }

  if (!content) {
    throw new Error(`Groq returned empty content twice for ${person.name} — skipping rather than sending a signature-only email.`);
  }

  return content + CONTACT_SIGNATURE;
}

// ---- FUNCTION TO SEND EMAIL ---- (unchanged)
async function sendEmail(person, emailBody) {
  const mailOptions = {
    from: `Vaibhav Sharma <${YOUR_EMAIL}>`,
    to: person.email,
    subject: `Full Stack Developer Opportunity — Vaibhav Sharma | MERN Stack`,
    text: emailBody,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${person.name} (${person.email})`);
}

// ---- MAIN FUNCTION ----
// Now skips anyone already in the checkpoint file, and stops the whole run
// (saving progress first) the moment the daily Groq cap is hit, instead of
// burning through the remaining contacts as instant failures.
async function main() {
  const sentEmails = loadSentEmails();
  const remaining = recipients.filter((p) => !sentEmails.has(p.email.toLowerCase()));

  console.log("🚀 Starting personalized email automation with Groq API...\n");
  console.log(`📋 Total recipients: ${recipients.length}  |  Already sent: ${sentEmails.size}  |  Remaining: ${remaining.length}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const person of remaining) {
    try {
      console.log(
        `📝 [${person.role}] Generating email for ${person.name} at ${person.company}...`,
      );
      const emailBody = await generateEmail(person);
      console.log(`✅ Email generated for ${person.name}`);
      await sendEmail(person, emailBody);
      successCount++;
      sentEmails.add(person.email.toLowerCase());
      saveSentEmails(sentEmails); // persist after every send, not just at the end
      await sleep(3000);
    } catch (error) {
      if (error instanceof DailyLimitReached) {
        console.log(`\n🛑 ${error.message}`);
        console.log(`Stopping for today. Progress saved — re-run this script tomorrow to continue.`);
        break;
      }
      console.error(`❌ Failed for ${person.name}:`, error.message);
      failCount++;
    }
  }

  console.log("\n----------------------------------------");
  console.log(`🎉 This run: ${successCount} sent, ${failCount} failed.`);
  console.log(`📈 Total sent overall (all runs): ${sentEmails.size} / ${recipients.length}`);
  console.log("----------------------------------------");
}

// ---- RUN IT ---- (unchanged)
main();