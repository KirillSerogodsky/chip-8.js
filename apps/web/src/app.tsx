import { useEffect, useRef, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LoadRom } from "@/components/load-rom"
import { Settings } from "@/components/settings"
import { MobileMenu } from "@/components/mobile-menu"
import { Keypad } from "@/components/keypad"
import { Debug } from "@/components/debug"
import { Play, Pause, RotateCcw, Github, Cpu } from "lucide-react"
import Chip8 from "chip-8.js"

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chip8Ref = useRef<Chip8>()
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      chip8Ref.current = new Chip8(canvasRef.current)
    }
  }, [])

  const toggleEmulator = () => {
    setIsRunning(!isRunning)
    // In a real emulator, this would start or pause the emulation loop
  }

  const resetEmulator = () => {
    setIsRunning(false)
    chip8Ref.current?.reset()
  }

  const handleLoadRom = (rom: string) => {
    chip8Ref.current?.loadRomFromUrl(rom)
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container mx-auto px-8 max-w-7xl">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Cpu />
                <h1 className="text-xl font-bold ml-2">chip-8.js</h1>
              </div>
              <div className="flex items-center">
                <nav className="hidden md:flex items-center">
                  <LoadRom onLoad={handleLoadRom} />
                  <Settings />
                </nav>
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href="https://github.com/KirillSerogodsky/chip-8.js"
                    target="_blank"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
                <ModeToggle />
                <MobileMenu />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 py-6">
          <div className="container mx-auto px-8 max-w-7xl">
            <div className="grid lg:grid-cols-[minmax(642px,1fr),1fr] gap-6">
              <div className="space-y-6">
                <div className="aspect-[2/1] bg-black rounded-lg flex items-center justify-center overflow-hidden border">
                  <canvas ref={canvasRef} width={640} height={320} />
                </div>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={toggleEmulator}
                    variant="outline"
                    size="icon"
                  >
                    {isRunning ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button onClick={resetEmulator} variant="outline" size="icon">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <Keypad />
              </div>
              <div className="space-y-6">
                <Debug />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
