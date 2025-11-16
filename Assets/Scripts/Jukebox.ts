import { AnchorComponent } from "Spatial Anchors.lspkg/AnchorComponent";
import { AudioRecording, expandAudioRecording, flattenAudioRecording, SAMPLE_RATE } from "./Audio";
import { Instrument, shuffledInstruments } from "./Instrument";
import { MusicGenerator } from "./MusicGenerator";
import { setTimeout } from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";

const SERVER_URL = "https://unattempted-darline-pertinently.ngrok-free.dev";

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
    @input internetModule: InternetModule;
    
    private _anchorComponent?: AnchorComponent;
    private _audioRecording: AudioRecording;
    private _instrumentOrder: Instrument[];
    private _instrumentIndex: number;
    private _persistentStorage: GeneralDataStore;
    private _audioOutputProvider: AudioOutputProvider;
    
    onAwake() {
        this._anchorComponent = this.sceneObject.getComponent(AnchorComponent.getTypeName());
        
        this._audioOutputProvider = this.audioOutput.control as AudioOutputProvider;
        this._audioOutputProvider.sampleRate = SAMPLE_RATE;
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
    async save() {
        const pcm = flattenAudioRecording(this._audioRecording);
        console.log("here C");
        
        const serialized = {
            pcm: Base64.encode(new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength)),
            instrumentOrder: this._instrumentOrder,
            instrumentIndex: this._instrumentIndex,
        };

        console.log("here D");

        const req = new Request(`${SERVER_URL}/${this.id}`, {
            method: "POST",
            body: JSON.stringify(serialized),
        });
        const res = await this.internetModule.fetch(req);

        console.log("here E");
        
        if (res.status != 200 && res.status != 201) {
            console.error(`Error saving ${JSON.stringify(await res.json())} (error code ${res.status})`);
        } else {
            console.log(`Succesfully saved jukebox#${this.id}`);
        }
    }

    /**
     * Load this jukebox's data from persistent storage. The anchor component should have
     * an anchor by the time this is called. If the anchor isn't found in storage, it will
     * initialize this jukebox anew
     */
    async load() {
        console.log(`Loading jukebox#${this.id}...`);

        const req = new Request(`${SERVER_URL}/${this.id}`, {
            method: "GET"
        });
        const res = await this.internetModule.fetch(req);

        // Generate the jukebox from scratch since it wasn't found
        if (res.status != 200) {
            console.log(`Jukebox#${this.id} is new, initializing...`);
            this._instrumentOrder = shuffledInstruments();
            this._instrumentIndex = 0;
            this._audioRecording = expandAudioRecording(new Float32Array([0]));
            
            // generate first track
            this.firstTrackTooltip.enabled = true;
            await this.save();
            await MusicGenerator.generateRandomTrack().then(async (track) => {
                this.firstTrackTooltip.enabled = false;

                this._audioRecording = expandAudioRecording(track);

                console.log(`HERE A: ${this._audioRecording[0].audioFrameShape.x}`);

                await this.save();

                console.log("HERE B");

                this._audioOutputProvider.enqueueAudioFrame(
                    this._audioRecording[0].audioFrame,
                    this._audioRecording[0].audioFrameShape
                );
            });
            return;
        };

        console.log(`Restored state for jukebox#${this.id}!`);

        // Got the jukebox state from the server
        const deserialized = JSON.parse(await res.text());
        const pcm = Base64.decode(deserialized.pcm);

        this._audioRecording = expandAudioRecording(new Float32Array(pcm.buffer));
        this._instrumentOrder = deserialized.instrumentOrder;
        this._instrumentIndex = deserialized.instrumentIndex;

        setTimeout(() => {
            this._audioOutputProvider.enqueueAudioFrame(
                this._audioRecording[0].audioFrame,
                this._audioRecording[0].audioFrameShape
            );
        }, 1000);
        

        console.log(this._audioRecording[0].audioFrameShape);

        console.log(`Completely done with jukebox#${this.id}`);
    }
}
