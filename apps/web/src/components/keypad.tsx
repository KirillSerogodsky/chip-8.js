import { Button } from "@/components/ui/button"
const chip8Keys = [
  "1",
  "2",
  "3",
  "C",
  "4",
  "5",
  "6",
  "D",
  "7",
  "8",
  "9",
  "E",
  "A",
  "0",
  "B",
  "F",
]

export function Keypad() {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-4 gap-2">
        {chip8Keys.map((key) => (
          <Button
            key={key}
            variant="outline"
            className="h-12 w-12 text-lg font-bold"
            // onClick={() => handleKeyPress(key)}
          >
            {key}
          </Button>
        ))}
      </div>
    </div>
  )
}
