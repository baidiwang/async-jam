import { Instrument, InstrumentData, GestureType } from "../Instrument";

@component
export class InstrumentAssets extends BaseScriptComponent {
    @input
    @hint('Piano instrument prefab')
    pianoPrefab: ObjectPrefab;

    @input
    @hint('Piano sound asset')
    pianoSound: AudioTrackAsset;

    @input
    @hint('Triangle instrument prefab')
    trianglePrefab: ObjectPrefab;

    @input
    @hint('Triangle sound asset')
    triangleSound: AudioTrackAsset;

    @input
    @hint('Drums instrument prefab')
    drumsPrefab: ObjectPrefab;

    @input
    @hint('Drums sound asset')
    drumsSound: AudioTrackAsset;

    @input
    @hint('Kolintang instrument prefab')
    kolintangPrefab: ObjectPrefab;

    @input
    @hint('Kolintang sound asset')
    kolintangSound: AudioTrackAsset;

    private instruments: InstrumentData[] = [];
    private currentIndex: number = 0;
    
    onAwake() {
        this.initializeInstruments();
    }

    public initializeInstruments() {
        this.instruments = [
        {
        type: Instrument.Piano,
        name: 'Piano',
        modelPrefab: this.pianoPrefab,
        SoundAsset: this.pianoSound,
        index: 0,
        gestureTypes: [GestureType.POKE],
      },
      {
        type: Instrument.Triangle,
        name: 'Triangle',
        modelPrefab: this.trianglePrefab,
        SoundAsset: this.triangleSound,
        index: 1,
        gestureTypes: [GestureType.POKE],  
      },
      {
        type: Instrument.Drums,
        name: 'Drums',
        modelPrefab: this.drumsPrefab,
        SoundAsset: this.drumsSound,
        index: 2,
        gestureTypes: [GestureType.POKE], 
      },
      {
        type: Instrument.Kolintang,
        name: 'Kolintang',
        modelPrefab: this.kolintangPrefab,
        SoundAsset: this.kolintangSound,
        index: 3,
        gestureTypes: [GestureType.POKE, GestureType.SWIPE], 
      },
    ];

        // this.shuffleInstruments();
        print('initializing data!')
    }

    private shuffleInstruments() {
        for (let i = this.instruments.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            const temp = this.instruments[i];
            this.instruments[i] = this.instruments[j];
            this.instruments[j] = temp;
        }

        this.instruments.forEach((inst, idx) => {
            inst.index = idx;
        })
    }

    getCurrentInstrument(): InstrumentData | null {
    if (this.currentIndex >= this.instruments.length) {
      print('No more instruments available');
      return null;
    }
    return this.instruments[this.currentIndex];
  }

  moveToNext(): InstrumentData | null {
    this.currentIndex++;
    print('moving to the next instrument!')
    return this.getCurrentInstrument();
  }

  getAllInstruments(): InstrumentData[] {
    return this.instruments;
  } 

  reset() {
    this.currentIndex = 0;
    print('reset to the first one!')
  }
}