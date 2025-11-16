// declare const require: any;

// const SIK = require('SpectaclesInteractionKit/SIK').SIK;
// const interactionConfiguration = SIK.InteractionConfiguration;

// @component
// export class RecordButton extends BaseScriptComponent {
//   @input('Component.ScriptComponent')
//   recorder: any;

//   private interactable: any;
//   private isRecording: boolean = false;

//   onAwake() {
//     this.createEvent('OnStartEvent').bind(() => {
//       this.onStart();
//     });
//   }

//   private onStart() {
//     const interactableType =
//       interactionConfiguration.requireType('Interactable');
//     this.interactable = this.sceneObject.getComponent(interactableType);

//     if (!this.interactable) {
//       print('RecordButton: Interactable missing');
//       return;
//     }

//     this.interactable.onInteractorTriggerStart((event: any) => {
//       this.toggle();
//     });
//   }

//   private toggle() {
//     if (!this.recorder) {
//       print('RecordButton: recorder not assigned');
//       return;
//     }

//     if (this.isRecording) {
//       this.recorder.stopRecording();
//       this.isRecording = false;
//     } else {
//       this.recorder.startRecording();
//       this.isRecording = true;
//     }
//   }
// }
