import { CPU } from "./cpu"

export default class Chip8 {
  private cpu: CPU

  constructor(params: { canvas: HTMLCanvasElement }) {
    this.cpu = new CPU({
      canvas: params.canvas,
    })
  }

  public async loadRomFromUrl(url: string) {
    const file = await fetch(url)
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    this.cpu.run(uint8Array)
  }

  public reset() {
    this.cpu.reset()
  }

  public stop() {
    this.cpu.stop()
  }
}
