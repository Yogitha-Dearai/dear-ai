const provider = require("./providers/openai.provider");

exports.generatePersona = async (answers) => {
  const prompt = `
You are an AI assistant that creates a concise personality profile.

Based on the following user answers, generate:
1. A short persona summary (3–4 lines)
2. 5 key personality traits (as a JSON array)

User answers:
${JSON.stringify(answers, null, 2)}

Respond strictly in JSON:
{
  "summary": "text",
  "traits": ["trait1", "trait2", "trait3", "trait4", "trait5"]
}
`;

  const raw = await provider.generate(prompt);
  return JSON.parse(raw);
};
