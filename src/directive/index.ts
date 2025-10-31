import { App } from 'vue'

type DirectiveModule = { default?: any }

const modules = import.meta.glob<DirectiveModule>('../directive/**/*.ts', {
  eager: true
})

let mapDirective = new Map<string, any>()

Object.keys(modules).forEach((key) => {
  const mod = modules[key]
  if (mod && mod.default) {
    const newKey = key.replace(/^\.\/|\.ts|\.js/g, '')
    mapDirective.set(newKey, mod.default)
  }
})

export default (app: App) => {
  mapDirective.forEach((value, key) => {
    app.directive(key, value)
  })
}
