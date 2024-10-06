import { DrawerDialog } from "@/components/drawer-dialog"
import { Button } from "@/components/ui/button"
import { Settings as SettingsIcon } from "lucide-react"

export function Settings() {
  return (
    <DrawerDialog
      title="Settings"
      description="Configure the emulator"
      trigger={
        <Button variant="ghost">
          <SettingsIcon className="mr-2 h-4 w-4" /> Settings
        </Button>
      }
    >
      Not implemented
    </DrawerDialog>
  )
}
