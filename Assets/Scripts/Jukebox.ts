import { AnchorComponent } from "Spatial Anchors.lspkg/AnchorComponent";
import { AudioRecording, expandAudioRecording, flattenAudioRecording, SAMPLE_RATE } from "./Audio";
import { Instrument, shuffledInstruments } from "./Instrument";
import { MusicGenerator } from "./MusicGenerator";

// Keys are appended the anchor ID
const SERIALIZATION_KEYS = {
    RECORDING_PCM: "JUKEBOX_RECORDING_PCM",     // Float32Array
    INSTRUMENT_ORDER: "JUKEBOX_INSTRUMENTS",    // Uint8Array
    INSTRUMENT_INDEX: "JUKEBOX_INSTRUMENT_IDX", // int
};

/**
 * State machine for a user interaction with the jukebox.
 */
enum State {
    /**
     * Initial state when the jukebox exists but has been interacted with. The audio
     * is still playing but at a low volume
     */
    Idle,
    /**
     * State when the user is in close proximity of the jukebox and looking at it. The
     * audio is still playing at max volume, and three instrument bubbles are presented
     */
    Focused,
    /**
     * State after the user has clicked on an instrument bubble. The audio is still playing
     * at max volume and a virtual instrument has spawned in, but it is *not* recording
     */
    InstrumentSelected,
    /**
     * State when user has pressed record. Loop is still playing at mid-high volume (so the
     * user can hear themselves) and the virtual instrument is present and recording for one
     * loop.
     */
    Recording,
    /**
     * State after user has recorded. The loop is playing at max volume with their track mixed-in.
     */
    RecordingDone,
}

@component
export class Jukebox extends BaseScriptComponent {    
    @input firstTrackTooltip: SceneObject;
    @input audioOutput: AudioTrackAsset;
    
    private _anchorComponent?: AnchorComponent;
    private _audioRecording: AudioRecording;
    private _instrumentOrder: Instrument[];
    private _instrumentIndex: number;
    private _persistentStorage: GeneralDataStore;
    private _audioOutputProvider: AudioOutputProvider;
    
    onAwake() {
        this._persistentStorage = global.persistentStorageSystem.store;
        this._anchorComponent = this.sceneObject.getComponent(AnchorComponent.getTypeName());
        
        this._audioOutputProvider = this.audioOutput.control as AudioOutputProvider;
        this._audioOutputProvider.sampleRate = SAMPLE_RATE;

        this._persistentStorage.onStoreFull = () => {
            console.error(`Storage is full! Was ${this._persistentStorage.getSizeInBytes()} but max is ${this._persistentStorage.getMaxSizeInBytes()}`);
        }
        console.log(`Storage max: ${this._persistentStorage.getMaxSizeInBytes()} bytes`);
    }

    get id(): string {
        if (!this._anchorComponent) {
            throw new Error("Jukebox needs an anchor component attached!");
        }
        if (!this._anchorComponent.anchor) {
            throw new Error("Attempting to use jukebox before the anchor has been set!");
        }
        return this._anchorComponent.anchor.id;
    }

    /**
     * Get the audio for every instrument so far (pre-mixed)
     */
    get audioRecording(): AudioRecording {
        return this._audioRecording;
    }

    /**
     * Get the instrument that should be next added to this jukebox
     */
    get currentInstrument() {
        return this._instrumentOrder[this._instrumentIndex % this._instrumentOrder.length];
    }

    /**
     * Get the number of tracks added so far
     */
    get numTracks() {
        return this._instrumentIndex;
    }

    /**
     * Add a music track to the current mix of instruments. This changes currentInstrument to
     * the next instrument
     */
    addTrack(audio: AudioRecording) {
        // TODO
    }

    /**
     * Save this jukebox's data to persistent storage
     */
    save() {
        const id = this.id;
        const s = this._persistentStorage;

        try {
            s.putFloat32Array(SERIALIZATION_KEYS.RECORDING_PCM + id, flattenAudioRecording(this._audioRecording));
            s.putUint8Array(SERIALIZATION_KEYS.INSTRUMENT_ORDER + id, new Uint8Array(this._instrumentOrder));
            s.putInt(SERIALIZATION_KEYS.INSTRUMENT_INDEX + id, this._instrumentIndex);
        } catch (e) {
            console.error(`Error saving jukebox: ${e}`);
        }

        console.log(`Storage is ${this._persistentStorage.getSizeInBytes()} / ${this._persistentStorage.getMaxSizeInBytes()} bytes`);
    }

    /**
     * Load this jukebox's data from persistent storage. The anchor component should have
     * an anchor by the time this is called. If the anchor isn't found in storage, it will
     * initialize this jukebox anew
     */
    load() {
        const id = this.id;
        const s = this._persistentStorage;

        // New jukebox!
        if (!s.has(SERIALIZATION_KEYS.INSTRUMENT_INDEX + id)) {
            this._instrumentOrder = shuffledInstruments();
            this._instrumentIndex = 0;
            this._audioRecording = expandAudioRecording(new Float32Array([0]));
            
            // generate first track
            this.firstTrackTooltip.enabled = true;
            MusicGenerator.generateRandomTrack().then((track) => {
                this.firstTrackTooltip.enabled = false;

                if (track.length > SAMPLE_RATE * 10) {
                    track = track.slice(0, SAMPLE_RATE * 10);
                }

                this._audioRecording = expandAudioRecording(track);
                this._audioOutputProvider.enqueueAudioFrame(
                    this._audioRecording[0].audioFrame,
                    this._audioRecording[0].audioFrameShape
                );
                this.save();

                console.log(s.getAllKeys());
            });

            // save to persistent storage with initalized values
            this.save();
            return;
        }

        try {
            this._audioRecording = expandAudioRecording(s.getFloat32Array(SERIALIZATION_KEYS.RECORDING_PCM + id));
            this._instrumentOrder = [...s.getUint8Array(SERIALIZATION_KEYS.INSTRUMENT_ORDER + id)];
            this._instrumentIndex = s.getInt(SERIALIZATION_KEYS.INSTRUMENT_INDEX + id);
        } catch (e) {
            console.error(`error loading jukebox: ${e}`);
        }

        console.log(`Loaded anchor#${id} with audio (${this._audioRecording.length} samples) and index = ${this._instrumentIndex}`);
    }
}
