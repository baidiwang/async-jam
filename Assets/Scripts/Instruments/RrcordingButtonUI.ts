import  { RecordingState } from '../Instrument';

@component
export class RecordingButtonUI extends BaseScriptComponent {
    @input
    @hint('Record button - click to start/stop recording')
    recordButton: SceneObject;

    @input
    @hint('Text component for button label')
    buttonText: Text;

    @input
    @hint('Reference to InstrumentSound component')
    instrumentSound: any;

    private isRecording: boolean = false; 

    onAwake() {
        print('recordingButtonUI initialized!')
        this.setupButton();
        this.updateButtonUI();
    }

    private setupButton() {
        const tapEvent = this.createEvent('TapEvent');
        tapEvent.bind(() => {
            this.onButtonTapped();
        })
    }

    private onButtonTapped() {
        this.isRecording = !this.isRecording;
       
        if (this.isRecording) {
            print("record button tapped! START!");
            this.instrumentSound.startRecording(); 
        } else {
            print("record button tapped! STOP!")
            const audioData = this.instrumentSound.stopRecording();

            if (audioData) {
                print ("recording saved!")
            }
        }

        this.updateButtonUI();
    }

    private updateButtonUI() {
        if (this.buttonText) {
            this.buttonText.text = this.isRecording ? "Stop Recording" : "Start Recording"
        }
    }
}