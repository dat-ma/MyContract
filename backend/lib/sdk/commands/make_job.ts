import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { stubsRoot } from '../stubs/main.js'
import path from 'node:path'

export default class QueueClear extends BaseCommand {
  static commandName = 'make:job'

  static description = 'Clear the queues'

  static options: CommandOptions = {}

  @args.string()
  declare name: string

  async run() {
    const codemods = await this.createCodemods()

    const fullname = `${this.name}Job`
    const filename = this.app.generators.modelFileName(fullname)
    const entity = this.app.generators.createEntity(fullname)

    await codemods.makeUsingStub(stubsRoot, 'make/job/main.stub', {
      args: this.parsed.args,
      flags: this.parsed.flags,
      filename,
      name: this.name,
      basename: path.basename(filename, '.ts'),
      entity,
    })

    const suite = this.app.rcFile.tests.suites.find((suite) => {
      return suite.name === 'functional'
    })!

    await codemods.makeUsingStub(stubsRoot, 'make/job/functional.stub', {
      args: this.parsed.args,
      flags: this.parsed.flags,
      filename,
      name: this.name,
      entity,
      suite,
      basename: path.basename(filename, '.ts'),
      directory: suite.directories[0],
    })
  }
}
