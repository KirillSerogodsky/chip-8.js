// import { useMediaQuery } from "@/hooks/use-media-query"
import { type ReactNode, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export interface DrawerDialogProps {
  trigger: ReactNode
  children: ReactNode
  title: string
  description: string
}

export function DrawerDialog(props: DrawerDialogProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = true // useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{props.trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            {props.description && (
              <DialogDescription>{props.description}</DialogDescription>
            )}
          </DialogHeader>
          {props.children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{props.trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          {props.description && (
            <DrawerDescription>{props.description}</DrawerDescription>
          )}
        </DrawerHeader>
        <div className="px-4">{props.children}</div>
      </DrawerContent>
    </Drawer>
  )
}
