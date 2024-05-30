import Configure from "@adonisjs/core/commands/configure"
import { stubsRoot } from "../../stubs/main.js"

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  await codemods.makeUsingStub(stubsRoot, 'config/queue.stub', {})
}
