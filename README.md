# Wheel.js

Reinventing the wheels helps learn JavaScript framework in a deeper level.

## Introduction

This project holds several component that should I seperate from Vue or Preact's sourcecode to help me better understand how modern frameworks work. It includes these parts:

1. Vue's Observer

### Vue's Observer

Vue achieves its 'unobtrusive reactivity system' by utilizing its `Observer` module. It uses a mechanism called 'data hijacking' which converts JavaScript object to getter/setter using `Object.defineProperty`. In getter, Vue performs dependency-tracking, and in setter, vue does change-notification.

There are two other modules used with Observer: `Dep` and `Watcher`. Dep is a dependency containers and can add/remove dependency and notify, which is essential a pub-sub pattern. Watcher would be the dependecy and it watches data and executes callbacks when there is a change. (For a directive, the change would be DOM update) 

A general workflow is like this:

A new Observer is instantiated upon a component(or a POJO) -> walk through all properties to convert to getter/setter -> a new Watcher is instantiated on one of the property -> Watcher is being evaluated, tries to get initial value -> Watcher is set to be current Dep target -> Observer's getter is called -> Dep.target exists, try to add dependency -> Observer's dep adds this watcher, watcher's dep container adds this Observer's dep -> remmove Dep.target as current Watcher evaluation is done

2. Vue's virtual DOM implementation (Snabbdom)