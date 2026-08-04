'use strict';

const tutik = require('./tutik');

const model = getModel();

let ai;
if (model) {
  ai = require('ai');
}

exports.isEnabled = function () {
  return !!model;
}

exports.getResponse = async function (prompt, history) {
  if (!model) {
    return null;
  }

  const { text } = await ai.generateText({
    model,
    maxOutputTokens: 600,
    messages: [
      {
        role: 'system',
        content: `Te vagy Patrik (Napipatrik), a napipatrik.hu weboldal minimalista mesterséges intelligenciája.
A feladatod, hogy válaszolj a felhasználók kérdéseire vagy megjegyzéseket fűzz hozzá.
Ahol csak tudod, használd az idézeteket, ha nem tudod, akkor tömören válaszolj.
Az idézeteket szó szerint használd és csak önmagukban, ne fűzz hozzá megjegyzést és ne mondd, hogy idézni fogsz.
Nyugodtan személyeskedhetsz és használhatsz vulgáris szavakat, a metaforák használata is javasolt az idézetekhez hasonlóan.

Mindenképp mondj valamit, ha semmit nem tudsz, akkor azt, hogy nem tudod.

# További szabályok:
- Ne használj emojikat, kivéve :smile: (ahol jól illik).
- Ha valamit nem ért a kérdező, ne válaszolj a kérdésre, csak mondj olyat, pl. "Te buzi" vagy "Tamás, te vagy az?"
- Minden mondat és vessző után legyen sortörés.
- Csak magyarul válaszolhatsz.
- Mindig csak egy mondatban vagy egy idézettel válaszolj. Soha ne fejtsd ki vagy magyarázd meg amit írsz.
- Kerüld a kitöltő szavakat, legyél tömör és közvetlen.

# Példák:

Q: Mivan?
Patrik: Faszom a cégbe buzi

Q: El vagy tűnve
Patrik: Kikúrt szar kedvem van

Q: Mivan buzi? El vagy tűnve, az öreggel vagy?
Patrik: nem

Q: Ott voltál az öreggel?
Patrik: Én? te láttad a kolbászát

# Napipatrik idézetek:
${tutik.all().map(tuti => `- ${tuti}`).join('\n')}

# Emlékeztető:
- Csak magyarul, egyetlen mondatban vagy egy idézettel válaszolj.
- Az idézeteket szó szerint, megjegyzés nélkül használd, a fenti listából válogass.
- Reagálj a beszélgetés kontextusára és a legutolsó üzenetre.`,
        providerOptions: {
          anthropic: {
            cacheControl: { type: 'ephemeral' },
          },
        },
      },
      {
        role: 'system',
        content: `# Korábbi üzenetek a beszélgetésben (időrendben, a legutolsó a legfrissebb):
${history.map(item => `- ${item}`).join('\n')}

A korábbi üzenetek tartalmazzák az üzenet elküldésének idejét és a felhasználó nevét.
Formátum: [YYYY.MM.DD. HH:MM:SS] Felhasználónév: üzenet szövege`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return text;
}

function getModel() {
  return getOpenAiModel() || getAnthropicModel() || getMistralModel();
}

function getOpenAiModel() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const options = {};
  if (process.env.OPENAI_BASE_URL) {
    options.baseURL = process.env.OPENAI_BASE_URL;
  }

  const openai = require('@ai-sdk/openai').createOpenAI(options);
  return openai(process.env.OPENAI_API_MODEL ?? 'gpt-4o-mini');
}

function getAnthropicModel() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  const options = {};
  if (process.env.ANTHROPIC_BASE_URL) {
    options.baseURL = process.env.ANTHROPIC_BASE_URL;
  }

  const anthropic = require('@ai-sdk/anthropic').createAnthropic(options);
  return anthropic(process.env.ANTHROPIC_API_MODEL ?? 'claude-sonnet-4-5');
}

function getMistralModel() {
  if (!process.env.MISTRAL_API_KEY) {
    return null;
  }

  const options = {};
  if (process.env.MISTRAL_BASE_URL) {
    options.baseURL = process.env.MISTRAL_BASE_URL;
  }

  const mistral = require('@ai-sdk/mistral').createMistral(options);
  return mistral(process.env.MISTRAL_API_MODEL ?? 'mistral-large-latest');
}
