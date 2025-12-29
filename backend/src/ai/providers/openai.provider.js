const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✍️ REFINE EXISTING TEXT
async function refineText(prompt) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You refine existing user-written text. Do not add new ideas. Do not expand. Improve clarity only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  return completion.choices[0].message.content;
}

// 🤖 GENERATE NEW POST FROM TOPIC
async function draftPost(topic) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You write thoughtful, human social media posts. Use natural paragraphs. Sound reflective and genuine. Do not mention AI.",
      },
      { role: "user", content: topic },
    ],
    temperature: 0.8,
  });

  return completion.choices[0].message.content;
}

module.exports = {
  refineText,
  draftPost,
};
