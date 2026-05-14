import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { CODE_CRAFT_PROMPT, PROCESS_PROMPT, TOOLS_PROMPT } from "./prompts";

export default function (pi: ExtensionAPI) {
    pi.on("before_agent_start", async (event, ctx) => {
        return {
            systemPrompt: event.systemPrompt + "\n\n" + CODE_CRAFT_PROMPT + "\n\n" + PROCESS_PROMPT + "\n\n" + TOOLS_PROMPT
        }
    });
}