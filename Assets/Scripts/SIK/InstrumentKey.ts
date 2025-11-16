// declare const require: any;

// const SIK = require('SpectaclesInteractionKit/SIK').SIK;
// const interactionConfiguration = SIK.InteractionConfiguration;

// @component
// export class InstrumentKey extends BaseScriptComponent {
//   // triangle / xylophone / drums
//   @input
//   instrumentId: string = 'triangle';

//   // single / key1 / kick ...
//   @input
//   keyId: string = 'single';

//   @input('Asset.AudioTrackAsset')
//   audioTrack: any;

//   // MelodyRecorder，用 ScriptComponent 引用
//   @input('Component.ScriptComponent')
//   recorder: any;

//   private interactable: any;
//   private audioComponent: AudioComponent | null = null;

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
//       print('❌ InstrumentKey: Interactable missing');
//       return;
//     }

//     this.interactable.onInteractorTriggerStart((event: any) => {
//       this.onHit();
//     });
//   }

//   private ensureAudioComponent() {
//     if (this.audioComponent) return;

//     // 在当前物体上创建一个 AudioComponent
//     const comp = this.sceneObject.createComponent(
//       'Component.AudioComponent'
//     ) as AudioComponent;

//     if (this.audioTrack) {
//       comp.audioTrack = this.audioTrack;
//     } else {
//       print(
//         `⚠️ InstrumentKey(${this.instrumentId}.${this.keyId}): no audioTrack assigned`
//       );
//     }

//     this.audioComponent = comp;
//   }

//   private onHit() {
//     // 播放声音
//     if (this.audioTrack) {
//       this.ensureAudioComponent();
//       if (this.audioComponent) {
//         this.audioComponent.play(0);
//       }
//     }

//     // 录制事件
//     if (this.recorder && this.recorder.onKeyHit) {
//       this.recorder.onKeyHit(this.instrumentId, this.keyId);
//     }
//   }
// }
