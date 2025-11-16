// @component
// export class MelodyRecorder extends BaseScriptComponent {
//   public isRecording: boolean = false;

//   private startTime: number = 0;

//   // time + instrument + key
//   private events: { time: number; instrument: string; key: string }[] = [];

//   public startRecording() {
//     this.isRecording = true;
//     this.startTime = getTime();
//     this.events = [];
//     print('Start recording');
//   }

//   public stopRecording() {
//     this.isRecording = false;
//     print('Stop recording. Events:');
//     this.events.forEach((e, i) => {
//       print(
//         `${i}: ${e.instrument}.${e.key} at ${e.time.toFixed(2)}s`
//       );
//     });
//   }

//   public onKeyHit(instrumentId: string, keyId: string) {
//     if (!this.isRecording) return;
//     const t = getTime() - this.startTime;
//     this.events.push({ time: t, instrument: instrumentId, key: keyId });
//   }
// }
