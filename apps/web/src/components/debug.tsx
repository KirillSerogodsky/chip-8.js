import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bug } from "lucide-react"

export function Debug() {
  const [cpuState] = useState({
    PC: 0x200,
    I: 0,
    SP: 0,
    ST: 0,
    DT: 0,
  })

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Bug className="mr-2" /> Debug Info
      </h2>
      <Tabs defaultValue="cpu" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cpu">CPU</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
        </TabsList>
        <TabsContent value="cpu" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pc">PC</Label>
              <Input
                id="pc"
                value={`0x${cpuState.PC.toString(16).padStart(4, "0")}`}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="sp">SP</Label>
              <Input
                id="sp"
                value={`0x${cpuState.SP.toString(16).padStart(2, "0")}`}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="a">I</Label>
              <Input
                id="a"
                value={`0x${cpuState.I.toString(16).padStart(2, "0")}`}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="x">ST</Label>
              <Input
                id="x"
                value={`0x${cpuState.ST.toString(16).padStart(2, "0")}`}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="y">DT</Label>
              <Input
                id="y"
                value={`0x${cpuState.DT.toString(16).padStart(2, "0")}`}
                readOnly
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="memory">
          <p className="text-sm text-muted-foreground">
            Memory viewer not implemented.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
