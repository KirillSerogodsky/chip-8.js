export class Screen {
  private readonly context: CanvasRenderingContext2D
  private readonly framebuffer = new Uint8Array(64 * 32)

  constructor(params: { canvas: HTMLCanvasElement }) {
    this.context = params.canvas.getContext("2d")!
  }

  public setPixel = (x: number, y: number, value: number) => {
    const collision = this.framebuffer[x + y * 64] === 1
    this.framebuffer[x + y * 64] ^= value
    return collision
  }

  public reset = () => {
    this.framebuffer.fill(0)
    this.context.fillStyle = "black"
    this.context.fillRect(0, 0, 640, 320)
  }

  public draw = () => {
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 64; x++) {
        if (this.framebuffer[x + y * 64]) {
          this.context.fillStyle = "green"
          this.context.fillRect(10 * x, 10 * y, 10, 10)
        } else {
          this.context.fillStyle = "black"
          this.context.fillRect(10 * x, 10 * y, 10, 10)
        }
      }
    }
  }
}
