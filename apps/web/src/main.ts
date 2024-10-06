import Chip8 from "chip-8.js"
import "./style.css"

const app = document.querySelector<HTMLDivElement>("#app")!

const canvas = document.createElement("canvas")
canvas.id = "canvas"
canvas.width = 640
canvas.height = 320

const chip8 = new Chip8(canvas)

const roms = await fetch("./roms/roms.json").then((res) => res.json())
const select = document.createElement("select")
select.id = "rom-selector"
const emptyOption = document.createElement("option")
emptyOption.value = ""
emptyOption.innerText = "Select ROM"
select.appendChild(emptyOption)
for (const rom of roms) {
  const option = document.createElement("option")
  option.value = rom.url
  option.innerText = rom.name
  select.appendChild(option)
}
select.addEventListener("change", (e) => {
  if (e.target) {
    const value = (e.target as HTMLSelectElement).value
    if (value) {
      chip8.stop()
      chip8.reset()
      chip8.loadRomFromUrl(value)
    } else {
      chip8.reset()
    }
  }
})

app.appendChild(select)
app.appendChild(canvas)
