import Dep from './dep'

export default class Watcher {
  vm
  value: any
  cb: Function
  deps: Array<Dep>
  depIds: Array<number>
  getter: Function
  
  constructor (vm, expOrFn: string | Function, cb: Function) {
    this.vm = vm
    this.cb = cb
    this.deps = []
    this.depIds = []
    
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parseGetter(expOrFn);
    }


    this.value = this.get()
  }

  addDep (dep: Dep) {
    const id = dep.id
    if (this.depIds.indexOf(id) === -1) {
      this.depIds.push(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }

  update () {
    this.run()
  }

  run () {
    const value = this.get()
    if (value !== this.value || typeof value === 'object') {
      const oldValue = this.value
      this.value = value
      this.cb.call(this.vm, value, oldValue)
    }
  } 
  
  get () {
    Dep.target = this
    let value = this.getter.call(this.vm, this.vm)
    Dep.target = null
    // there is a cleanupDeps function that compares newDep with dep
    // it removes any watcher from dep if it's not dependent anymore
    return value
  }
}

function parseGetter (exp: string) {
  if (/[^\w.$]/.test(exp)) return
  
  const exps = exp.split('.')
  return function (obj) {
      for (let i = 0, len = exps.length; i < len; i++) {
          if (!obj) return;
          obj = obj[exps[i]];
      }
      return obj;
  }
  
}