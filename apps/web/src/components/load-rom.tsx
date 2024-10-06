import { useEffect, useState } from "react"
import { DrawerDialog } from "@/components/drawer-dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileUp } from "lucide-react"

type RomsJson = {
  name: string
  children: RomItem[]
}[]

type RomItem = {
  name: string
  url: string
}

interface LoadRomProps {
  onLoad: (rom: string) => void
}

export function LoadRom(props: LoadRomProps) {
  const [roms, setRoms] = useState<RomsJson>([])
  const [selectedRom, setSelectedRom] = useState<string>()

  useEffect(() => {
    fetchRoms().then((result) => setRoms(result))
  }, [])

  const handleRomChange = (rom: string) => {
    setSelectedRom(rom)
  }

  const handleLoad = () => {
    props.onLoad(selectedRom!)
  }

  return (
    <DrawerDialog
      title="Load ROM"
      description="Select a ROM to load"
      trigger={
        <Button variant="ghost">
          <FileUp className="mr-2 h-4 w-4" /> Load ROM
        </Button>
      }
    >
      <Select value={selectedRom} onValueChange={handleRomChange}>
        <SelectTrigger>
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {roms.map(({ name, children }) => (
            <SelectGroup key={name}>
              <SelectLabel>{name}</SelectLabel>
              {children?.map(({ name, url }) => (
                <SelectItem key={name} value={url}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleLoad} disabled={!selectedRom}>
        <FileUp className="mr-2 h-4 w-4" /> Load
      </Button>
    </DrawerDialog>
  )
}

async function fetchRoms() {
  const result = await fetch("./roms/roms.json").then((res) => res.json())
  return result
}
