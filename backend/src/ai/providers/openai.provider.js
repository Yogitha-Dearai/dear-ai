const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generic text generation (rephrase, refine, summarize, etc.)
 */
async function generateText(prompt) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You help rewrite user text clearly and naturally without changing meaning.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.4,
  });

  return completion.choices[0].message.content;
}

module.exports = {
  generateText,
};

