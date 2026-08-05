import nodemailer from "nodemailer";
import fetch from "node-fetch";

// ---- YOUR DETAILS ----
const YOUR_EMAIL = "vs7977722@gmail.com"; // Your Gmail
const YOUR_APP_PASSWORD = ""; // 16-digit App Password
const GROQ_API_KEY = "Enter_Your_Groq_API_Key_Here"; // From console.groq.com
const recipients = [


];

// ---- CONTACT SIGNATURE ----
const CONTACT_SIGNATURE = `

📞 +91 7506427646
🔗 LinkedIn: https://www.linkedin.com/in/vaibhav-sharma-996aa8249/`;

// ---- SET UP NODEMAILER ----
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: YOUR_EMAIL,
    pass: YOUR_APP_PASSWORD,
  },
});

// ---- FUNCTION TO BUILD PERSONALIZED PROMPT BY ROLE ----
// ---- FUNCTION TO BUILD PERSONALIZED PROMPT BY ROLE AND ALUMNI ----
function buildPrompt(person) {
  const role = (person.role || "").toLowerCase();
  const PORTFOLIO_LINK = "https://vaibhav7506portfolio.vercel.app/";

  // 1. PRIORITIZE ALUMNI LOGIC (Highest conversion hook)
  if (person.isAlumni) {
    return `Write a highly respectful email to ${person.name}. 
  CONTEXT: They are my college senior from MMMUT (Batch of ${person.batch}). I am their junior from the Batch of 2026.
  
  Goal: Connect as a fellow alumnus and ask for guidance or a referral at ${person.company}.
  
  About me:
  - Vaibhav Sharma, Full Stack Developer (MERN)
  - Recently graduated from MMMUT
  - 380+ LeetCode problems (Java)
  - Some hands-on experience building AI-integrated projects
  
  Tone: Humble, respectful, and focused on the "Senior-Junior" bond. DO NOT sound like a batchmate. Mention I am reaching out to a senior for advice.
  End with a brief, warm line sharing my portfolio: ${PORTFOLIO_LINK} — ask them to take a look whenever they get a chance and share any feedback, and mention it also shows some of my AI work.
  Keep it under 140 words. Return only the email body.`;
  }

  // 2. PARSE STANDARD CATEGORIES
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
    role.includes("onboarding");

  const isSeniorDev =
    role.includes("senior") ||
    role.includes("staff") ||
    role.includes("sde-3") ||
    role.includes("se-3") ||
    role.includes("engineer 3") ||
    role.includes("lead") ||
    role.includes("principal") ||
    role.includes("manager") ||
    role.includes("architect");

  const isDev =
    role.includes("engineer") ||
    role.includes("developer") ||
    role.includes("sde") ||
    role.includes("analyst") ||
    role.includes("se ") ||
    role.includes("ml");

  // 3. GENERATE TARGETED PROMPTS
  if (isHR) {
    return `Write a short, professional, and genuinely intriguing email to ${person.name} who is a ${person.role} at ${person.company}.
I am writing to express my interest in Full Stack Developer openings and request to be considered or referred.

About me:
- My name is Vaibhav Sharma
- Full Stack Developer (MERN Stack)
- 380+ LeetCode problems solved in Java
- Skills: React, Node.js, MongoDB, MySQL, PostgreSQL, Git
- Also have hands-on AI-related experience, visible on my portfolio
- Actively looking for a Full Stack Developer role at ${person.company}

Tone: professional, respectful, concise, but with a hook that makes the HR curious enough to open my portfolio — e.g. reference that it demonstrates real, applied AI work, not just a resume line item.
End the email with a friendly closing line inviting them to check out my portfolio if they have a moment: ${PORTFOLIO_LINK} — mention it showcases my projects including the AI-related work, and politely ask if they could spare any feedback on it.
Keep it under 140 words. Return only the email body, no subject line.`;
  }

  if (isSeniorDev) {
    return `Write a short warm email to ${person.name} who is a ${person.role} at ${person.company}.
I am a Full Stack Developer looking for opportunities at ${person.company} and hoping they can guide or refer me.

About me:
- My name is Vaibhav Sharma
- Full Stack Developer (MERN Stack)
- 380+ LeetCode problems solved in Java
- Skills: React, Node.js, MongoDB, MySQL, PostgreSQL, Git
- Also have some hands-on AI-related project experience
- Looking for a Full Stack Developer role at ${person.company}

Tone: respectful and genuine since they are senior. Mention I would love their guidance or a referral.
End with a brief line sharing my portfolio: ${PORTFOLIO_LINK} — ask them to check it out if they have time (it also shows my AI-related work), and would appreciate any feedback.
Keep it under 140 words. Return only the email body, no subject line.`;
  }

  if (isDev) {
    return `Write a short friendly peer-to-peer email to ${person.name} who is a ${person.role} at ${person.company}.
I am also a developer reaching out to ask if they can refer me for a Full Stack role at ${person.company}.

About me:
- My name is Vaibhav Sharma
- Full Stack Developer (MERN Stack)
- 380+ LeetCode problems solved in Java
- Skills: React, Node.js, MongoDB, MySQL, PostgreSQL, Git
- Also been building some AI-related projects
- Looking for a Full Stack Developer role at ${person.company}

Tone: casual, friendly, developer-to-developer vibe.
End with a casual line dropping my portfolio: ${PORTFOLIO_LINK} — ask them to take a look whenever they get a chance (it's got some AI work on there too), and let me know what they think.
Keep it under 140 words. Return only the email body, no subject line.`;
  }

  // Default Fallback
  return `Write a short warm email to ${person.name} who works at ${person.company} as ${person.role}, asking for a job referral or lead for a Full Stack Developer role.

About me:
- My name is Vaibhav Sharma
- Full Stack Developer (MERN Stack)
- 380+ LeetCode problems solved in Java
- Skills: React, Node.js, MongoDB, MySQL, PostgreSQL, Git
- Also have some hands-on AI-related experience

Tone: friendly and genuine.
End with a line sharing my portfolio: ${PORTFOLIO_LINK} — ask them to check it out if they have a moment (it also shows my AI-related work), and mention I'd welcome any feedback.
Keep it under 140 words. Return only the email body, no subject line.`;
}

// module.exports = buildPrompt;
// ---- FUNCTION TO GENERATE EMAIL WITH GROQ ----
async function generateEmail(person) {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 300,
        messages: [{ role: "user", content: buildPrompt(person) }],
      }),
    },
  );

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error("Groq API error: " + JSON.stringify(data));
  }

  return data.choices[0].message.content + CONTACT_SIGNATURE;
}

// ---- FUNCTION TO SEND EMAIL ----
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
async function main() {
  console.log("🚀 Starting personalized email automation with Groq API...\n");
  console.log(`📋 Total recipients: ${recipients.length}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const person of recipients) {
    try {
      console.log(
        `📝 [${person.role}] Generating email for ${person.name} at ${person.company}...`,
      );
      const emailBody = await generateEmail(person);
      console.log(`✅ Email generated for ${person.name}`);
      await sendEmail(person, emailBody);
      successCount++;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`❌ Failed for ${person.name}:`, error.message);
      failCount++;
    }
  }

  console.log("\n----------------------------------------");
  console.log(
    `🎉 Done! ${successCount} / ${recipients.length} emails sent successfully!`,
  );
  if (failCount > 0) {
    console.log(`⚠️  ${failCount} emails failed. Check errors above.`);
  }
  console.log("----------------------------------------");
}

// ---- RUN IT ----
main();
