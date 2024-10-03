import { CPU } from "./cpu"

export class Instructions {
  public cpu: CPU

  constructor(cpu: CPU) {
    this.cpu = cpu
  }

  public SYS() {
    return () => {
      this.cpu.PC += 2
    }
  }

  public CLS() {
    return () => {
      this.cpu.screen.reset()
      this.cpu.PC += 2
    }
  }

  public RET() {
    return () => {
      if (this.cpu.SP === 0) {
        throw new Error("Stack underflow")
      }
      this.cpu.SP--
      this.cpu.PC = this.cpu.S[this.cpu.SP]
      this.cpu.S[this.cpu.SP] = 0
      this.cpu.PC += 2
    }
  }

  public JP_nnn(nnn: number) {
    return () => {
      this.cpu.PC = nnn
    }
  }

  public CALL_nnn(nnn: number) {
    return () => {
      if (this.cpu.SP === 15) {
        throw new Error("Stack overflow")
      }
      this.cpu.S[this.cpu.SP] = this.cpu.PC
      this.cpu.SP++
      this.cpu.PC = nnn
    }
  }

  public LD_Vx_kk(x: number, kk: number) {
    return () => {
      this.cpu.V[x] = kk
      this.cpu.PC += 2
    }
  }

  public LD_I_nnn(nnn: number) {
    return () => {
      this.cpu.I = nnn
      this.cpu.PC += 2
    }
  }

  public JP_V0_nnn(nnn: number) {
    return () => {
      this.cpu.PC = nnn + this.cpu.V[0]
      this.cpu.PC += 2
    }
  }

  public RND_Vx_kk(x: number, kk: number) {
    return () => {
      this.cpu.V[x] = Math.floor(Math.random() * 0xff) & kk
      this.cpu.PC += 2
    }
  }

  public DRW_Vx_Vy_n(x: number, y: number, n: number) {
    return () => {
      this.cpu.V[0xf] = 0
      for (let row = 0; row < n; ++row) {
        const spriteRow = this.cpu.memory.read(this.cpu.I + row)
        for (let bit = 0; bit < 8; ++bit) {
          if (spriteRow & (0b10000000 >> bit)) {
            const collision = this.cpu.screen.setPixel(
              (this.cpu.V[x] + bit) % 64,
              (this.cpu.V[y] + row) % 32,
            )
            if (collision) {
              this.cpu.V[0xf] = 1
            }
          }
        }
      }
      this.cpu.screen.draw()
      this.cpu.PC += 2
    }
  }

  public ADD_Vx_kk(x: number, kk: number) {
    return () => {
      this.cpu.V[x] += kk
      this.cpu.PC += 2
    }
  }

  public SE_Vx_kk(x: number, kk: number) {
    return () => {
      if (this.cpu.V[x] === kk) {
        this.cpu.PC += 4
      } else {
        this.cpu.PC += 2
      }
    }
  }

  public SNE_Vx_kk(x: number, kk: number) {
    return () => {
      if (this.cpu.V[x] !== kk) {
        this.cpu.PC += 4
      } else {
        this.cpu.PC += 2
      }
    }
  }

  public SE_Vx_Vy(x: number, y: number) {
    return () => {
      if (this.cpu.V[x] === this.cpu.V[y]) {
        this.cpu.PC += 4
      } else {
        this.cpu.PC += 2
      }
    }
  }

  public SNE_Vx_Vy(x: number, y: number) {
    return () => {
      if (this.cpu.V[x] !== this.cpu.V[y]) {
        this.cpu.PC += 4
      } else {
        this.cpu.PC += 2
      }
    }
  }

  public LD_Vx_Vy(x: number, y: number) {
    return () => {
      this.cpu.V[x] = this.cpu.V[y]
      this.cpu.PC += 2
    }
  }

  public OR_Vx_Vy(x: number, y: number) {
    return () => {
      this.cpu.V[x] |= this.cpu.V[y]
      this.cpu.PC += 2
    }
  }

  public AND_Vx_Vy(x: number, y: number) {
    return () => {
      this.cpu.V[x] &= this.cpu.V[y]
      this.cpu.PC += 2
    }
  }

  public XOR_Vx_Vy(x: number, y: number) {
    return () => {
      this.cpu.V[x] ^= this.cpu.V[y]
      this.cpu.PC += 2
    }
  }

  public ADD_Vx_Vy(x: number, y: number) {
    return () => {
      const sum = this.cpu.V[x] + this.cpu.V[y]
      this.cpu.V[x] = sum
      this.cpu.V[0xf] = sum > 0xff ? 1 : 0
      this.cpu.PC += 2
    }
  }

  public SUB_Vx_Vy(x: number, y: number) {
    return () => {
      const sum = this.cpu.V[x] - this.cpu.V[y]
      this.cpu.V[x] = sum
      this.cpu.V[0xf] = sum < 0 ? 0 : 1
      this.cpu.PC += 2
    }
  }

  public SHR_Vx_Vy(x: number, y: number) {
    return () => {
      const Vf = this.cpu.V[y] & 0x01
      this.cpu.V[x] = this.cpu.V[y] >> 1
      this.cpu.V[0xf] = Vf
      this.cpu.PC += 2
    }
  }

  public SUBN_Vx_Vy(x: number, y: number) {
    return () => {
      const sum = this.cpu.V[y] - this.cpu.V[x]
      this.cpu.V[x] = sum
      this.cpu.V[0xf] = sum < 0 ? 0 : 1
      this.cpu.PC += 2
    }
  }

  public SHL_Vx_Vy(x: number, y: number) {
    return () => {
      const Vf = (this.cpu.V[y] >> 7) & 0x01
      this.cpu.V[x] = this.cpu.V[y] << 1
      this.cpu.V[0xf] = Vf
      this.cpu.PC += 2
    }
  }

  public LD_Vx_DT(x: number) {
    return () => {
      this.cpu.V[x] = this.cpu.DT
      this.cpu.PC += 2
    }
  }

  public LD_Vx_K(x: number) {
    return () => {
      this.cpu.halted = true
      this.cpu.keyboard.nextKeyPressed = (key: number) => {
        this.cpu.V[x] = key
        this.cpu.PC += 2
        this.cpu.halted = false
      }
    }
  }

  public LD_DT_Vx(x: number) {
    return () => {
      this.cpu.DT = this.cpu.V[x]
      this.cpu.PC += 2
    }
  }

  public LD_ST_Vx(x: number) {
    return () => {
      this.cpu.ST = this.cpu.V[x]
      this.cpu.PC += 2
    }
  }

  public ADD_I_Vx(x: number) {
    return () => {
      this.cpu.I += this.cpu.V[x]
      this.cpu.PC += 2
    }
  }

  public LD_F_Vx(x: number) {
    return () => {
      this.cpu.I = this.cpu.V[x] * 5
      this.cpu.PC += 2
    }
  }

  public LD_B_Vx(x: number) {
    return () => {
      this.cpu.memory.write(this.cpu.I, Math.trunc(this.cpu.V[x] / 100))
      this.cpu.memory.write(
        this.cpu.I + 1,
        Math.trunc((this.cpu.V[x] % 100) / 10),
      )
      this.cpu.memory.write(this.cpu.I + 2, this.cpu.V[x] % 10)
      this.cpu.PC += 2
    }
  }

  public LD_I_Vx(x: number) {
    return () => {
      for (let i = 0; i <= x; i++) {
        this.cpu.memory.write(this.cpu.I + i, this.cpu.V[i])
      }
      this.cpu.PC += 2
    }
  }

  public LD_Vx_I(x: number) {
    return () => {
      for (let i = 0; i <= x; i++) {
        this.cpu.V[i] = this.cpu.memory.read(this.cpu.I + i)
      }
      this.cpu.PC += 2
    }
  }

  public SKP_Vx(x: number) {
    return () => {
      if (this.cpu.keyboard.isPressed(this.cpu.V[x])) {
        this.cpu.PC += 4
      } else {
        this.cpu.PC += 2
      }
    }
  }

  public SKNP_Vx(x: number) {
    return () => {
      if (!this.cpu.keyboard.isPressed(this.cpu.V[x])) {
        this.cpu.PC += 4
      } else {
        this.cpu.PC += 2
      }
    }
  }
}
