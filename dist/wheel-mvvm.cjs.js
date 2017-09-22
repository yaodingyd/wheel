/*
* wheel-mvvm v0.0.1
*
* @license MIT
* @author yding
*/
'use strict';

var uid = 0;
// "target" is the current watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
// so it's a static property
var Dep = (function () {
    function Dep() {
        this.id = uid++;
        this.subs = [];
    }
    Dep.prototype.addSub = function (sub) {
        this.subs.push(sub);
    };
    Dep.prototype.removeSub = function (sub) {
        var index = this.subs.indexOf(sub);
        if (index > -1) {
            this.subs.splice(index, 1);
        }
    };
    // Because target is globally unique, so we use Dep class to access target
    // instead of instance because this should be only one target at any time
    Dep.prototype.depend = function () {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    };
    Dep.prototype.notify = function () {
        // Vue create a copy of original subs to "stabilize"
        // need furthur understanding of this
        var subs = this.subs.slice();
        for (var i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    };
    return Dep;
}());
Dep.target = null;

var Observer$1 = (function () {
    function Observer(value) {
        this.value = value;
        this.dep = new Dep();
        this.walk(value);
    }
    Observer.prototype.walk = function (obj) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[keys[i]]);
        }
    };
    return Observer;
}());
function defineReactive(obj, key, val) {
    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && !property.configurable) {
        return;
    }
    var getter = property && property.get;
    var setter = property && property.set;
    var childOb = observe(val);
    var dep = new Dep();
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGet() {
            var value = getter ? getter.call(obj) : val;
            console.log('depends trigger');
            if (Dep.target) {
                //TODO: why not obj.dep.depend()
                dep.depend();
                if (childOb) {
                    childOb.dep.depend();
                }
            }
            return value;
        },
        set: function reactiveSet(newVal) {
            var value = getter ? getter.call(obj) : val;
            // Vue has one more condition to check for NaN !== NaN
            // (newVal !== newVal && value !== value)
            // omit this corner case for now
            if (newVal === value) {
                return;
            }
            if (setter) {
                setter.call(obj, newVal);
            }
            else {
                val = newVal;
            }
            childOb = observe(newVal);
            dep.notify();
        }
    });
}
function observe(val) {
    if (val === null || typeof val !== 'object') {
        return;
    }
    var ob;
    ob = new Observer$1(val);
    return ob;
}

var Watcher = (function () {
    function Watcher(vm, expOrFn, cb) {
        this.vm = vm;
        this.cb = cb;
        this.deps = [];
        this.depIds = [];
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        }
        else {
            this.getter = parseGetter(expOrFn);
        }
        this.value = this.get();
    }
    Watcher.prototype.addDep = function (dep) {
        var id = dep.id;
        if (this.depIds.indexOf(id) === -1) {
            this.depIds.push(id);
            this.deps.push(dep);
            dep.addSub(this);
        }
    };
    Watcher.prototype.update = function () {
        this.run();
    };
    Watcher.prototype.run = function () {
        var value = this.get();
        if (value !== this.value || typeof value === 'object') {
            var oldValue = this.value;
            this.value = value;
            this.cb.call(this.vm, value, oldValue);
        }
    };
    Watcher.prototype.get = function () {
        Dep.target = this;
        var value = this.getter.call(this.vm, this.vm);
        Dep.target = null;
        // there is a cleanupDeps function that compares newDep with dep
        // it removes any watcher from dep if it's not dependent anymore
        return value;
    };
    return Watcher;
}());
function parseGetter(exp) {
    if (/[^\w.$]/.test(exp))
        return;
    var exps = exp.split('.');
    return function (obj) {
        for (var i = 0, len = exps.length; i < len; i++) {
            if (!obj)
                return;
            obj = obj[exps[i]];
        }
        return obj;
    };
}

module.exports = Observer$1;
