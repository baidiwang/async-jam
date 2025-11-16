export enum Instrument {
    Piano,
    Triangle,
    Drums,
    Kolintang
}

export enum GestureType {
    POKE = 'poke',        
    PINCH = 'pinch',      
    SWIPE = 'swipe',    
    GRAB = 'grab',        
    CUSTOM = 'custom'  
}

export type InstrumentData = {
    type: Instrument;
    name: string;
    modelPrefab: ObjectPrefab;
    SoundAsset: AudioTrackAsset;  
    index: number;
    gestureTypes: GestureType[];   
}

export enum RecordingState {
    RECORDING = "recording",
    STOPPED = "stopped",
}
