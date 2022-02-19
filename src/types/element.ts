export interface TurtleElement {
  form: HTMLFormElement
  select: HTMLSelectElement
  canvas: HTMLCanvasElement
  moveOptsTmpl: HTMLTemplateElement
  rotateOptsTmpl: HTMLTemplateElement
  containerOption: HTMLDivElement
  outputCommands: HTMLPreElement
}

export type TurtleSelectors = Record<keyof TurtleElement, string>;
