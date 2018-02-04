import { vnode, VNode, VNodeProps } from './vnode'

/**
 * h function's second argument could be children, props or text
 * h function's third argument could be children or text
 */

export function h (
  tag: string,
  b?: any,
  c?: any,
): VNode {
  let props: VNodeProps
  let children: any
  let text: any

  if (c !== undefined) {
    props = b
    if (Array.isArray(c)) {
      children = c
    } else  if (typeof c === 'string' || typeof c === 'number') {
      text = c
    } else if (c && c.tag) {
      children = [c]
    }
  } else if (b !== undefined) {
    if (Array.isArray(b)) {
      children = b
    } else  if (typeof b === 'string' || typeof b === 'number') {
      text = b
    } else if (b && b.tag) {
      children = [b]
    } else {
      props = b
    }
  }

  // iterate children to combine primitive children into one
  let isPrimitive = false
  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    if (typeof child === 'string' || typeof child === 'number') {
      if (isPrimitive) {
        children[i - 1] += child
        children.splice(i - 1, 1)
      }
      isPrimitive = true
    }
  }

  // if after the previous operation all children can be concatenated into one string or number
  // combine children with text
  if (children.length === 1 && (typeof children[0] === 'string' || typeof children[0] === 'number')) {
    if (text === undefined) {
      text = children[0] 
    } else {
      text += children[0]
    }
    children = undefined
  }

  return vnode(tag, props, children, text, undefined)
}