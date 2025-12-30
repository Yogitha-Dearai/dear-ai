const persona = require("./persona.generator");
const provider = require("./providers/openai.provider");

async function generatePersona(answers) {
  return persona.generatePersona(answers);
}

async function refineText(text) {
  return provider.refineText(text);
}

async function draftPost(prompt) {
  return provider.draftPost(prompt);
}

module.exports = {
  generatePersona,
  refineText,
  draftPost,
};
