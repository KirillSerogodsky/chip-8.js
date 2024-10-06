export class Keyboard {
  private readonly KEY_MAP: Record<string, number> = {
    KeyX: 0x0,
    Digit1: 0x1,
    Digit2: 0x2,
    Digit3: 0x3,
    KeyQ: 0x4,
    KeyW: 0x5,
    KeyE: 0x6,
    KeyA: 0x7,
    KeyS: 0x8,
    KeyD: 0x9,
    KeyZ: 0xa,
    KeyC: 0xb,
    Digit4: 0xc,
    KeyR: 0xd,
    KeyF: 0xe,
    KeyV: 0xf,
  }
  private readonly pressedKeys = new Set<number>()
  public nextKeyPressed?: (key: number) => void

  constructor() {
    addEventListener("keydown", this.onKeyDown.bind(this))
    addEventListener("keyup", this.onKeyUp.bind(this))
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.code in this.KEY_MAP) {
      const key = this.KEY_MAP[event.code]
      this.pressedKeys.add(key)

      if (this.nextKeyPressed) {
        this.nextKeyPressed(key)
        this.nextKeyPressed = undefined
      }
    }
  }

  private onKeyUp = (event: KeyboardEvent) => {
    if (event.code in this.KEY_MAP) {
      this.pressedKeys.delete(this.KEY_MAP[event.code])
    }
  }

  public isPressed(key: number) {
    return this.pressedKeys.has(key)
  }
}
