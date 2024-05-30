import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { stubsRoot } from '../stubs/main.js'
import fs from 'node:fs'

export default class MakeOpenapi extends BaseCommand {
  static commandName = 'make:openapi'
  static description = ''

  static options: CommandOptions = {}

  @args.string({ description: 'Name of the controller' })
  declare name: string

  @args.string({ description: 'Action', required: false, default: '' })
  declare action: string

  async run() {
    const codemods = await this.createCodemods()

    const fullname = [this.name, this.action].filter(Boolean).join('_')
    const entity = this.app.generators.createEntity(fullname)
    const modelFileName = this.app.generators.modelFileName(fullname)
    const modelName = this.app.generators.modelName(entity.name)
    const controllerEntity = this.app.generators.createEntity(this.name)
    const controllerName = this.app.generators.modelName(controllerEntity.name)

    await codemods.makeUsingStub(stubsRoot, 'make/openapi/main.stub', {
      flags: this.flags,
      entity,
      modelFileName,
      modelName,
      controllerName,
      controllerEntity,
    })

    const tag = {
      name: controllerName,
      tags: [controllerName],
    }

    this.uploadTsoaJson(tag)
  }

  private uploadTsoaJson(tag: { name: string }) {
    const tsoaJson = JSON.parse(fs.readFileSync(this.app.makePath('tsoa.json')).toString())
    if (tsoaJson.spec.spec['x-tagGroups'].find((t: any) => t.name === tag.name)) {
      return
    }

    tsoaJson.spec.spec['x-tagGroups'].push(tag)
    fs.writeFileSync(this.app.makePath('tsoa.json'), JSON.stringify(tsoaJson, null, 2))
  }
}
