import { InstrumentData, RecordingState } from "../Instrument";

@component
export class InstrumentSound extends BaseScriptComponent {
    @input
    @hint('Microphone recorder for recording user audio')
    microphoneRecorder: any;

    private audioComponent: AudioComponent;
    private currentInstrument: InstrumentData | null = null;
    private recordingState: RecordingState = RecordingState.STOPPED;

    onAwake() {
        this.audioComponent = this.sceneObject.createComponent('AudioComponent');
        print('sound is initalized!')
    }

    // subscribe the event
    subscribeToInstrument(instrument3DModel: any) {
        instrument3DModel.onKeyPressed.add(() => {
            this.onInstrumentPressed();
        });
    }

    setCurrentInstrument(instrumentData: InstrumentData) {
        this.currentInstrument = instrumentData;

        if (this.currentInstrument && this.currentInstrument.SoundAsset) {
            this.audioComponent.audioTrack = this.currentInstrument.SoundAsset; 
        } else { 
            print('no sound asset for instrument!')
        }
    }

    private onInstrumentPressed() {
        print('instrument pressed!')
    
        this.playSound();

        if (this.recordingState === RecordingState.RECORDING) {
            print('recordinig user audio!')
        }
    }

    playSound() {
        if (!this.currentInstrument) {
            return;
        }

        print('palying sound!')
        this.audioComponent.play(1); // only play for one time
    }

    startRecording() {
        this.recordingState = RecordingState.RECORDING;

        if (this.microphoneRecorder) {
            this.microphoneRecorder.recordMicrophoneAudio(true);
        } else {
            print ('error: MicrophoneRecorder not assigned!')
        }
    }

    stopRecording() {
        this.recordingState = RecordingState.STOPPED;
        
        if(this.microphoneRecorder) {
            this.microphoneRecorder.recordMicrophoneAudio(false);
        }

        return this.getRecordedAudio();
    }

    private getRecordedAudio() {
        if (this.microphoneRecorder) {
            const audioData = {
                duration: this.microphoneRecorder.recordingDuration,
        // TODO: we need get actual sound from MicrophoneRecorder
        };
            return audioData;
        }
        return null;
    }

    getRecordingState(): RecordingState {
        return this.recordingState;
    }

    isRecording(): boolean {
        return this.recordingState === RecordingState.RECORDING;
    }
}
