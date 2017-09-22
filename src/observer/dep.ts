import Watcher from './watcher'

let uid = 0

// "target" is the current watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
// so it's a static property


export default class Dep {
  id: number
  subs: Array<Watcher>
  static target: Watcher

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher): void {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher): void {
    let index = this.subs.indexOf(sub)
    if (index > -1) {
      this.subs.splice(index, 1)
    }
  }

  // Because target is globally unique, so we use Dep class to access target
  // instead of instance because this should be only one target at any time
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  
  notify () {
    // Vue create a copy of original subs to "stabilize"
    // need furthur understanding of this
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null