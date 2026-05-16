import { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { CODE_PROMPT, THINK_PROMPT, TOOLS_PROMPT, SystemStatePrompt, SECURITY_PROMPT, IDENTITY_PROMOT, CAVEMAN_PROMPT, SPLIT_TASKS_PROMPT, WORKWLOW_PROMPT } from "./prompts";
import { combine } from "./prompt-builder";

export default function (pi: ExtensionAPI) {
    pi.on("before_agent_start", async (event, ctx) => {
        const prompt = await combine(
            [IDENTITY_PROMOT, CAVEMAN_PROMPT, SECURITY_PROMPT, THINK_PROMPT, CODE_PROMPT, TOOLS_PROMPT, SPLIT_TASKS_PROMPT, WORKWLOW_PROMPT, new SystemStatePrompt]
        ).resolve(undefined);
        return {
            systemPrompt: prompt
        }
    });
}