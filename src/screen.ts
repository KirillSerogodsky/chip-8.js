export class Screen {
  private readonly BG_COLOR = "black"
  private readonly SPRITE_COLOR = "white"
  private readonly HEIGHT = 32
  private readonly WIDTH = 64
  private readonly SCALE = 10
  private readonly context: CanvasRenderingContext2D
  private readonly framebuffer = new Uint8Array(this.WIDTH * this.HEIGHT)

  constructor(params: { canvas: HTMLCanvasElement }) {
    this.context = params.canvas.getContext("2d")!
  }

  public setPixel = (x: number, y: number) => {
    const collision = this.framebuffer[x + y * this.WIDTH] === 1
    this.framebuffer[x + y * this.WIDTH] ^= 1
    return collision
  }

  public reset = () => {
    this.framebuffer.fill(0)
    this.clearScreen()
  }

  private clearScreen = () => {
    this.context.fillStyle = this.BG_COLOR
    this.context.fillRect(
      0,
      0,
      this.WIDTH * this.SCALE,
      this.HEIGHT * this.SCALE,
    )
  }

  public draw = () => {
    this.clearScreen()
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        if (this.framebuffer[x + y * this.WIDTH]) {
          this.context.fillStyle = this.SPRITE_COLOR
          this.context.fillRect(
            x * this.SCALE,
            y * this.SCALE,
            this.SCALE,
            this.SCALE,
          )
        }
      }
    }
  }
}
