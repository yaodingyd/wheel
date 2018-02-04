import Dep from './dep'

export default class Observer {
  value: any
  dep: Dep

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()

    this.walk(value)
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}

function defineReactive (obj: Object, key: string, val: any) {
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && !property.configurable) {
    return 
  }

  const getter = property && property.get
  const setter = property && property.set

  let childOb = observe(val)
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGet () {
      const value = getter ? getter.call(obj) : val
      console.log('depends trigger')
      if (Dep.target) {
        // each property needs one dep
        // ob.dep is used for childOb
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
      }
      return value
    },
    set: function reactiveSet (newVal: any) {
      const value = getter? getter.call(obj) : val
      // Vue has one more condition to check for NaN !== NaN
      // (newVal !== newVal && value !== value)
      // omit this corner case for now
      if (newVal === value) {
        return
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = observe(newVal)
      dep.notify()
    } 
  })
}

export function observe (val: any): Observer | void {
  if (val === null || typeof val !== 'object') {
    return
  }

  let ob: Observer | void
  ob = new Observer(val)
  return ob
}