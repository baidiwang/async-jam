import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";

@component
export class InstrumentAudioManager extends BaseScriptComponent {
    @input colliders: Interactable[];
    @input sounds: AudioTrackAsset[];

    private _audioComponentPool: AudioComponent[] = [];

    onAwake() {
        if (this.colliders.length !== this.sounds.length) {
            throw new Error("The colliders and sounds list should be 1:1");
        }

        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });
    }

    onStart() {
        for (let i = 0; i < this.colliders.length; i++) {
            this.registerInteractable(this.colliders[i], this.sounds[i]);
        }
    }

    private registerInteractable(interactable: Interactable, sound: AudioTrackAsset) {
        console.log("registering...");
        interactable.onTriggerStart(() => {
            console.log("trigger start for hi-hat");
            this.playNote(sound);
        });
    }

    private playNote(sound: AudioTrackAsset) {
        let audioComponent: AudioComponent;
        if (this._audioComponentPool.length > 0) {
            audioComponent = this._audioComponentPool.pop();
        } else {
            audioComponent = this.sceneObject.createComponent("AudioComponent");
        }

        // Recycle components
        audioComponent.setOnFinish(() => this._audioComponentPool.push(audioComponent));

        audioComponent.audioTrack = sound;
        audioComponent.play(1);
    }
}
