import { AnchorComponent } from "Spatial Anchors.lspkg/AnchorComponent";
import { AudioRecording } from "./Audio";

@component
export class Jukebox extends BaseScriptComponent {    
    private _anchorComponent?: AnchorComponent;
    private _audioRecording: AudioRecording;
    
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
     * Add a music track to the current mix of instruments
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
     * an anchor by the time this is called
     */
    load() {
        // TODO
    }
}
