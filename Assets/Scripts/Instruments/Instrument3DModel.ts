// no SIK Interactable version

import { InstrumentData, GestureType } from "../Instrument";

class EventWrapper<T> {
  private callbacks: Array<(data?: T) => void> = [];

  add(callback: (data?: T) => void) {
    this.callbacks.push(callback);
  }

  remove(callback: (data?: T) => void) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);  
    }
  }

  trigger(data?: T) {
    this.callbacks.forEach((cb) => cb(data));
  }

  clear() {
    this.callbacks = [];
  }
}

@component
export class Instrument3DModel extends BaseScriptComponent {
  @input
  @hint("Parent object to spawn instruments")
  spawnParent: SceneObject;

  private currentInstrumentObject: SceneObject | null = null;
  private currentGestureTypes: GestureType[] = [];

  public onKeyPressed: EventWrapper<GestureType>;

  onAwake() {
    this.onKeyPressed = new EventWrapper<GestureType>();
    print("Instrument3DModel initialized (Tap-only version)");
  }

  spawnInstrument(
    instrumentData: InstrumentData,
    position: vec3
  ): SceneObject {
    print(
      `Spawning ${instrumentData.name} with gestures: ${instrumentData.gestureTypes.join(
        ", "
      )}`
    );

    if (this.currentInstrumentObject) {
      this.currentInstrumentObject.destroy();
    }

    this.currentGestureTypes = instrumentData.gestureTypes;

    this.currentInstrumentObject = instrumentData.modelPrefab.instantiate(
      this.spawnParent
    );
    this.currentInstrumentObject
      .getTransform()
      .setWorldPosition(position);

    // for now all the gestures are called by TapEvent
    // instrumentData.gestureTypes.forEach((gestureType) => {
    //   this.setupTapInteraction(gestureType);
    // });

    return this.currentInstrumentObject;
  }

  // private setupTapInteraction(gestureType: GestureType) {
  //   print(`Using TapEvent for gesture: ${gestureType}`);

  //   const tapEvent = this.createEvent("TapEvent");
  //   tapEvent.bind(() => {
  //     print(`Tap detected (gesture: ${gestureType})`);
  //     this.onKeyPressed.trigger(gestureType);
  //   });
  // } 

  //  SIK（Interactable）envoke by passing Behavior
  public onKeyFromSIKIndex(index: number) {
  print(`SIK event received! index=${index}`);
  const gestureType =
    this.currentGestureTypes[index] ??
    this.currentGestureTypes[0] ??
    GestureType.POKE;

  print(
    `[Instrument3DModel] SIK key index ${index}, gesture: ${gestureType}`
  );

  this.onKeyPressed.trigger(gestureType);
}

  destroyCurrentInstrument() {
    if (this.currentInstrumentObject) {
      this.currentInstrumentObject.destroy();
      this.currentInstrumentObject = null;
      this.currentGestureTypes = [];
    }
  }
}
