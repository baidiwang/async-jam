@component
export class KeyTapSound extends BaseScriptComponent {
  @input
  @hint("key: Audio Track")
  audioTrack: AudioTrackAsset;

  private audioComponent: AudioComponent;

  onAwake() {
 
    this.audioComponent = this.sceneObject.getComponent("AudioComponent") as AudioComponent;
    if (!this.audioComponent) {
      this.audioComponent = this.sceneObject.createComponent("AudioComponent") as AudioComponent;
    }

    if (this.audioTrack) {
      this.audioComponent.audioTrack = this.audioTrack;
    } else {
      print("KeyTapSound: audioTrack NOT set on " + this.sceneObject.name);
    }

    const tapEvent = this.createEvent("TapEvent");
    tapEvent.bind(() => {
      this.onTapped();
    });
  }

  private onTapped() {
    if (!this.audioComponent || !this.audioComponent.audioTrack) {
      print("KeyTapSound: no audio to play on " + this.sceneObject.name);
      return;
    }

    print("🔊 Key tapped: " + this.sceneObject.name);
    this.audioComponent.play(1); 
}
}