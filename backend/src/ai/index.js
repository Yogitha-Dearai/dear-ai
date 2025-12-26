const persona = require("./persona.generator");
const openaiProvider = require("./providers/openai.provider");

// Persona generation (already used)
async function generatePersona(answers) {
  return persona.generatePersona(answers);
}

// 🔥 Text refinement (NEW, required for Day 19)
async function generateText(prompt) {
  return openaiProvider.generateText(prompt);
}

module.exports = {
  generatePersona,
  generateText,
};

