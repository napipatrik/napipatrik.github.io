# Napipatrik discord bot

Now with AI!

## Envvars

General runtime vars:
* `DISCORD_BOT_TOKEN` — Discord token for the bot to use. This is required for the bot to work.
* `REDIS_URL` — Redis URL for the bot to use (if the project uses Redis for caching or state, recommended for AI).
* `DB_KEEP_MESSAGES` — Number of messages stored in DB and used as context for AI. Default: `20`.

AI provider configuration (at least one provider API key must be set to enable AI):
- OpenAI
  * `OPENAI_API_KEY` — API key to use OpenAI. If set, OpenAI client will be used.
  * `OPENAI_BASE_URL` — Optional. Custom base URL for OpenAI-compatible deployments (e.g. proxy). If set, used as client baseURL.
  * `OPENAI_API_MODEL` — Optional. Model name to use. Default: `gpt-4o-mini`.

- Anthropic
  * `ANTHROPIC_API_KEY` — API key to use Anthropic (Claude). If set and OpenAI key is not present, Anthropic client will be used.
  * `ANTHROPIC_BASE_URL` — Optional. Custom base URL for Anthropic-compatible deployments.
  * `ANTHROPIC_API_MODEL` — Optional. Model name to use. Default: `claude-sonnet-4-5`.

> Note:
> Base URL variables are optional and only required for custom/proxy endpoints.
