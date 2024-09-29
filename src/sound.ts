export class Sound {
  private oscillator?: OscillatorNode

  public play() {
    if (this.oscillator) {
      return
    }

    const context = new AudioContext()
    const gain = context.createGain()
    gain.gain.value = 0.05
    gain.connect(context.destination)
    this.oscillator = context.createOscillator()
    this.oscillator.type = "square"
    this.oscillator.frequency.value = 440
    this.oscillator.connect(gain)
    this.oscillator.start()
  }

  public stop() {
    if (!this.oscillator) {
      return
    }

    this.oscillator.stop()
    this.oscillator.disconnect()
    this.oscillator = undefined
  }
}
