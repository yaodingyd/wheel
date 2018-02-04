export type Key = string | number

/**
 * vnode has a specific property just for text
 */
export interface VNode {
  tag: string | undefined
  props: VNodeProps | undefined
  children: Array<VNode | string> | undefined
  elm: Node | undefined
  text: string | undefined
  key: Key | undefined
}

export interface VNodeProps {
  props?: any
  key?: Key
}

// Construct a vnode
export function vnode(
  tag: string | undefined,
  props: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | undefined
): VNode {
  let key = props === undefined ? undefined : props.key
  return {
    tag,
    props,
    children,
    text,
    elm,
    key
  }
}