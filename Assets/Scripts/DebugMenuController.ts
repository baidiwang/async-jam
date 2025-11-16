import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import { Interactor, InteractorInputType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import SIK from "SpectaclesInteractionKit.lspkg/SIK";
import { JukeboxPlacementController } from "./JukeboxPlacementController";
import { MusicGenerator } from "./MusicGenerator";
import { expandAudioRecording, SAMPLE_RATE } from "./Audio";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";

@component
export class DebugMenuController extends BaseScriptComponent {
    @input menuUi: SceneObject;
    @input closeButton: PinchButton;
    @input addJukeboxButton: PinchButton;
    @input generateMusicButton: PinchButton;
    @input jukeboxGhostPrefab: ObjectPrefab;
    @input jukeboxPlacementController: JukeboxPlacementController;
    @input audioOutput: AudioTrackAsset;
    
    private _openDebugMenuTime: number = 0;
    private _openDebugMenuHand?: 'lt' | 'rt';
    
    private _leftHand?: Interactor;
    private _rightHand?: Interactor;

    private _jukeboxGhost?: SceneObject;

    private _audioOutputProvider: AudioOutputProvider;
    
    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart());
        this.createEvent("UpdateEvent").bind((e) => this.onUpdate(e));
    }

    private onStart() {
        this._leftHand = SIK.InteractionManager.getInteractorsByType(InteractorInputType.LeftHand)[0];
        this._rightHand = SIK.InteractionManager.getInteractorsByType(InteractorInputType.RightHand)[0];

        this.menuUi.enabled = false;

        this.closeButton.onButtonPinched(() => this.closeMenu());
        this.addJukeboxButton.onButtonPinched(() => this.addJukeboxGhost());
        this.generateMusicButton.onButtonPinched(() => this.generateMusic());

        this._audioOutputProvider = this.audioOutput.control as AudioOutputProvider;
        this._audioOutputProvider.sampleRate = SAMPLE_RATE;
    }

    get isMenuOpen(): boolean {
        return this.menuUi.enabled; // TODO
    }

    private onUpdate(e: UpdateEvent) {
        this.openMenuItalianMode(e.getDeltaTime());

        if (this._jukeboxGhost) {
            const hand = SIK.HandInputData.getHand(this._openDebugMenuHand == "lt" ? "left" : 'right')
            const pos = hand.indexTip.position;
            const rot = quat.lookAt(vec3.forward(), vec3.up());
            const transform = mat4.compose(pos, rot, vec3.one());
            // const camera = WorldCameraFinderProvider.getInstance().getTransform();
            // const offset = camera.back.uniformScale(60);
            // const position = camera.getWorldPosition().add(offset);
            // const rotation = quat.lookAt(vec3.forward(), vec3.up());
            // const transform = mat4.compose(position, rotation, vec3.one());

            this._jukeboxGhost
                .getTransform()
                .setWorldTransform(transform);

            // Spawn actual jukebox
            if (hand.isPinching()) {
                this.destroyJukeboxGhost();
                this.jukeboxPlacementController.createAnchor(transform);
            }
        }
    }

    private openMenuItalianMode(dt: number) {
        // This opens the secret debug menu if the user pinches either hand for over 5 seconds (italian mode)
        const lt = this._leftHand?.isTriggering;
        const rt = this._rightHand?.isTriggering;

        if (this.isMenuOpen) {
            return;
        }

        if ((lt && this._openDebugMenuHand == "lt") ||
            (rt && this._openDebugMenuHand == "rt")) {
            // Same hand is continuously pressed, increase trigger timer
            this._openDebugMenuTime += dt;
        } else {
            this._openDebugMenuTime = 0;
            if (lt) {
                this._openDebugMenuHand = "lt";
            } else if (rt) {
                this._openDebugMenuHand = "rt";
            }
        }

        if (this._openDebugMenuTime >= 2) {
            if (this._jukeboxGhost) {
                this.destroyJukeboxGhost();
            }

            this._openDebugMenuTime = 0;
            this.menuUi.enabled = true;
        }
    }

    private closeMenu() {
        this.menuUi.enabled = false;
    }

    private addJukeboxGhost() {
        this.closeMenu();
        this._jukeboxGhost = this.jukeboxGhostPrefab.instantiate(this.getSceneObject());
    }

    private destroyJukeboxGhost() {
        this._jukeboxGhost.destroy();
        this._jukeboxGhost = null;
    }

    private async generateMusic() {
        console.log("Generating music...");
        const track = expandAudioRecording(await MusicGenerator.generateRandomTrack());

        console.log("Done, playing...");

        this._audioOutputProvider.enqueueAudioFrame(track[0].audioFrame, track[0].audioFrameShape);
    }
}