import { Memory } from "./memory"
import { Sound } from "./sound"
import { Screen } from "./screen"
import { Keyboard } from "./keyboard"
import { Instructions } from "./instructions"
import { toHexString } from "./utils"

export class CPU {
  public PC = 0x200
  public I = 0
  public V = new Uint8Array(16)
  public S = new Array()
  public SP = 0
  public ST = 0
  public DT = 0
  public halted = true
  public instructions: Instructions
  public memory = new Memory()
  public screen: Screen
  public sound = new Sound()
  public keyboard = new Keyboard()

  private timeoutHandle?: number

  constructor(params: { canvas: HTMLCanvasElement }) {
    this.screen = new Screen({
      canvas: params.canvas,
    })
    this.instructions = new Instructions(this)
  }

  public reset() {
    this.halted = true
    this.PC = 0x200
    this.I = 0
    this.V.fill(0)
    this.S.fill(0)
    this.SP = 0
    this.ST = 0
    this.DT = 0
    this.memory.reset()
    this.screen.reset()
  }

  public run(rom: Uint8Array) {
    this.reset()
    this.memory.writeRom(rom)
    this.halted = false

    const loop = () => {
      this.tick()

      if (!this.halted) {
        this.step()
      }

      this.timeoutHandle = setTimeout(loop, 1)
    }
    loop()
  }

  public stop() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle)
    }
  }

  private tick() {
    if (this.DT > 0) {
      this.DT--
    }

    if (this.ST > 0) {
      this.ST--
      this.sound.play()
    } else {
      this.sound.stop()
    }
  }

  private step() {
    const opcode = this.fetch()
    const instruction = this.decode(opcode)

    if (!instruction) {
      throw new Error("Unknown opcode: " + toHexString(opcode))
    }

    instruction()
  }

  private fetch() {
    return (this.memory.read(this.PC) << 8) | this.memory.read(this.PC + 1)
  }

  private decode(opcode: number) {
    const nnn = opcode & 0x0fff
    const n = opcode & 0x000f
    const x = (opcode & 0x0f00) >> 8
    const y = (opcode & 0x00f0) >> 4
    const kk = opcode & 0x00ff

    switch (opcode & 0xf000) {
      case 0x0000:
        switch (opcode) {
          case 0x00e0:
            return this.instructions.CLS()
          case 0x00ee:
            return this.instructions.RET()
          default:
            return this.instructions.SYS()
        }
      case 0x1000:
        return this.instructions.JP_nnn(nnn)
      case 0x2000:
        return this.instructions.CALL_nnn(nnn)
      case 0x3000:
        return this.instructions.SE_Vx_kk(x, kk)
      case 0x4000:
        return this.instructions.SNE_Vx_kk(x, kk)
      case 0x5000:
        return this.instructions.SE_Vx_Vy(x, y)
      case 0x6000:
        return this.instructions.LD_Vx_kk(x, kk)
      case 0x7000:
        return this.instructions.ADD_Vx_kk(x, kk)
      case 0x8000:
        switch (opcode & 0x000f) {
          case 0x0000:
            return this.instructions.LD_Vx_Vy(x, y)
          case 0x0001:
            return this.instructions.OR_Vx_Vy(x, y)
          case 0x0002:
            return this.instructions.AND_Vx_Vy(x, y)
          case 0x0003:
            return this.instructions.XOR_Vx_Vy(x, y)
          case 0x0004:
            return this.instructions.ADD_Vx_Vy(x, y)
          case 0x0005:
            return this.instructions.SUB_Vx_Vy(x, y)
          case 0x0006:
            return this.instructions.SHR_Vx_Vy(x, y)
          case 0x0007:
            return this.instructions.SUBN_Vx_Vy(x, y)
          case 0x000e:
            return this.instructions.SHL_Vx_Vy(x, y)
          default:
            return
        }
      case 0x9000:
        return this.instructions.SNE_Vx_Vy(x, y)
      case 0xa000:
        return this.instructions.LD_I_nnn(nnn)
      case 0xb000:
        return this.instructions.JP_V0_nnn(nnn)
      case 0xc000:
        return this.instructions.RND_Vx_kk(x, kk)
      case 0xd000:
        return this.instructions.DRW_Vx_Vy_n(x, y, n)
      case 0xe000:
        switch (opcode & 0x00ff) {
          case 0x009e:
            return this.instructions.SKP_Vx(x)
          case 0x00a1:
            return this.instructions.SKNP_Vx(x)
          default:
            return
        }
      case 0xf000:
        switch (opcode & 0x00ff) {
          case 0x0007:
            return this.instructions.LD_Vx_DT(x)
          case 0x000a:
            return this.instructions.LD_Vx_K(x)
          case 0x0015:
            return this.instructions.LD_DT_Vx(x)
          case 0x0018:
            return this.instructions.LD_ST_Vx(x)
          case 0x001e:
            return this.instructions.ADD_I_Vx(x)
          case 0x0029:
            return this.instructions.LD_F_Vx(x)
          case 0x0033:
            return this.instructions.LD_B_Vx(x)
          case 0x0055:
            return this.instructions.LD_I_Vx(x)
          case 0x0065:
            return this.instructions.LD_Vx_I(x)
          default:
            return
        }
      default:
        return
    }
  }
}
