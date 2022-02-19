export function queryElement<K extends keyof HTMLElementTagNameMap>(
  selector: K | string,
  parent?: Document | HTMLElement
): HTMLElementTagNameMap[K]

export function queryElement<K extends keyof SVGElementTagNameMap>(
  selector: K | string,
  parent?: Document | SVGElement
): SVGElementTagNameMap[K]

export function queryElement<
  K extends keyof (HTMLElementTagNameMap | SVGElementTagNameMap)
>(
  selector: K | string,
  parent: Document | HTMLElement | SVGElement = document
) {
  return parent.querySelector(selector)
}

function castArrayToObject<T>(array: T[]) {
  return array.reduce((acc, curr) => ({ ...acc, ...curr }), {})
}

export function queryGroupBySelector<
  G extends Record<string, string>,
  R extends Record<keyof G, R[keyof G]>
>(selectors: G) {
  const keySelectorMap = Object.entries(selectors);

  const mapFn = ([key, selector]: [string, string]) => ({ [key]: queryElement(selector) });

  return castArrayToObject(keySelectorMap.map(mapFn)) as R;
}
