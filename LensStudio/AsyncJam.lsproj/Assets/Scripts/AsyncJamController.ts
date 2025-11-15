// Handles audio recording, playback, and music box visualization

import { MicrophoneRecorder } from './MicrophoneRecorder';

@component
export class AsyncJamController extends BaseScriptComponent {
    @input
    microphoneRecorder: MicrophoneRecorder;

    @input
    musicBox: SceneObject;

    @input
    musicBoxMaterial: Material;

    // @input
    // musicBoxMesh: RenderMeshVisual;

    private isRecording: boolean = false;
    private hasRecording: boolean = false;
    private recordingTimer: number = 0;
    
    // flosting values
    private floatTimer: number = 0; 
    private baseYPosition: number = 0.5; 
    private floatAmplitude: number = 0.15; 
    private floatSpeed: number = 1.5;

    // private recorder: any;

    onAwake() {
        print('Async Jam Controller Initialized');

        // this.recorder = this.microphoneRecorder;
        
        this.musicBox.enabled = false;

        // const clonedMaterial = this.musicBoxMaterial.clone();
        // this.musicBoxMesh.mainMaterial = clonedMaterial;
        // this.musicBoxMaterial = clonedMaterial;

        const initialPos = this.musicBox.getTransform().getLocalPosition();
        this.baseYPosition = initialPos.y;

        const updateEvent = this.createEvent('UpdateEvent');
        updateEvent.bind(() => {
            this.onUpdate();
        });

        this.startAutoDemo();
    }

    startAutoDemo() {
        print('Starting auto demo sequence...');
        
        this.scheduleAction(5, () => {
            print('Auto-recording started');
            this.startRecording();
        });

        this.scheduleAction(10, () => {
            print('Auto-stop recording');
            this.stopRecording();
        });

        this.scheduleAction(15, () => {
            print('Auto-playback');
            this.playback();
        });
    }

    onUpdate() {
        if (!this.musicBox) return;

        if (this.isRecording) {
            this.recordingTimer += getDeltaTime();
            const pulse = Math.sin(this.recordingTimer * 5) * 0.5 + 0.5;
            const scale = 0.3 + pulse * 0.1;
            this.musicBox.getTransform().setLocalScale(
                new vec3(scale, scale, scale)
            );
        }

        // if (this.hasRecording && !this.isRecording) {
        //     this.playbackTimer += getDeltaTime();
        //     // this.musicBox.getTransform().setLocalRotation(
        //     //     quat.fromEulerAngles(0, this.playbackTimer * 2, 0)
        //     // );
        // } 

 if (this.hasRecording && !this.isRecording) {
      this.floatTimer += getDeltaTime();
      
      const floatOffset = Math.sin(this.floatTimer * this.floatSpeed) * this.floatAmplitude;
      const newY = this.baseYPosition + floatOffset;
      
      const currentPos = this.musicBox.getTransform().getLocalPosition();
      
      this.musicBox.getTransform().setLocalPosition(
        new vec3(currentPos.x, newY, currentPos.z)
      );
    }
    
    }

    // red
    startRecording() {
        print('START RECORDING');
        this.isRecording = true;
        this.microphoneRecorder.recordMicrophoneAudio(true);

        this.musicBoxMaterial.mainPass.baseColor = new vec4(1, 0, 0, 1);
        this.musicBox.getTransform().setLocalScale(new vec3(0.3, 0.3, 0.3));
        
        this.musicBox.enabled = true;

    }

    // green
    stopRecording() {
        print('STOP RECORDING');
        this.isRecording = false;
        this.hasRecording = true;
        this.microphoneRecorder.recordMicrophoneAudio(false);
        
        this.musicBoxMaterial.mainPass.baseColor = new vec4(0, 1, 0, 1);
        this.musicBox.getTransform().setLocalScale(new vec3(0.3, 0.3, 0.3));
    }

    // blue
    playback() {
        print('PLAYBACK');
        const success = this.microphoneRecorder.playbackRecordedAudio();
        
        if (success) {
            this.musicBoxMaterial.mainPass.baseColor = new vec4(0, 0, 1, 1);
            this.floatTimer = 0;
        } else {
            print('No audio to play!');
        }
    }

    /**
     * delay
     * @param seconds 
     * @param action 
     */
    scheduleAction(seconds: number, action: () => void) {
        const delayEvent = this.createEvent('DelayedCallbackEvent');
        delayEvent.bind(action);
        delayEvent.reset(seconds);
    }
}