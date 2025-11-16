export enum Instrument {
    Piano,
    DrumKit,
    Xylophone,
    // add more later...
}

export function shuffledInstruments(): Instrument[] {
    return [
        Instrument.Piano,
        Instrument.DrumKit,
        Instrument.Xylophone,
    ].sort(() => 0.5 - Math.random());
}