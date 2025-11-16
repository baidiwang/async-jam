@component
export class NewScript extends BaseScriptComponent {
    @input child: SceneObject
    @input amp: number;
    @input freq: number;
    onAwake() {
        this.createEvent("UpdateEvent").bind(() => {
            this.child.getTransform().setLocalPosition(new vec3(0, 0,  this.amp * Math.sin(getTime() * 6.28 * this.freq)))
        });     

    }
}
