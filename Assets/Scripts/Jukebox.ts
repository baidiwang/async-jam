import { AnchorComponent } from "Spatial Anchors.lspkg/AnchorComponent";
import { AudioRecording } from "./Audio";
import { Instrument } from "./Instrument";

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
    private _anchorComponent?: AnchorComponent;
    private _audioRecording: AudioRecording;
    private _instrumentOrder: Instrument[];
    private _instrumentIndex: number;
    
    onAwake() {
        this._anchorComponent = this.sceneObject.getComponent(AnchorComponent.getTypeName());
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
        // TODO
    }

    /**
     * Load this jukebox's data from persistent storage. The anchor component should have
     * an anchor by the time this is called. If the anchor isn't found in storage, it will
     * initialize this jukebox anew
     */
    load() {
        // TODO
    }
}
