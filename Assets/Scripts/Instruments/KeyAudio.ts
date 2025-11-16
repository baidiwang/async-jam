@component
export class KeyAudio extends BaseScriptComponent {
  @input('Asset.AudioTrackAsset')
  audioTrack: any;

  private audioComponent: AudioComponent | null = null;

  onAwake() {
    if (this.audioTrack) {
      const comp = this.sceneObject.createComponent(
        'Component.AudioComponent'
      ) as AudioComponent;
      comp.audioTrack = this.audioTrack;
      this.audioComponent = comp;
    }
  }

  public play() {
    if (this.audioComponent) {
      this.audioComponent.play(0);
    }
  }
}
