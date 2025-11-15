import { Anchor } from "Spatial Anchors.lspkg/Anchor";
import { AnchorComponent } from "Spatial Anchors.lspkg/AnchorComponent";
import { AnchorModule } from "Spatial Anchors.lspkg/AnchorModule";
import { AnchorSession, AnchorSessionOptions } from "Spatial Anchors.lspkg/AnchorSession";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import SIK from "SpectaclesInteractionKit.lspkg/SIK";

@component
export class NewScript extends BaseScriptComponent {
    @input anchorModule: AnchorModule;
    @input pinchButton: PinchButton;

    @input camera: SceneObject;
    @input prefab: ObjectPrefab;

    private anchorSession?: AnchorSession;

    async onAwake() {
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });
    }

    private async onStart() {
        // Button just creates an anchor in front of the user
        this.pinchButton.onButtonPinched.add(() => {
            const anchorPos = this.camera
                .getTransform()
                .getWorldTransform()
                .mult(mat4.fromTranslation(new vec3(0, 0, -5)));
            
            this.createAnchor(anchorPos);
        });

        // Hands create an anchor wherever the pinch happened
        const hands = SIK.HandInputData;
        for (const hand of [hands.getHand("left"), hands.getHand("right")]) {
            hand.onPinchDown.add(() => {
                this.createAnchor(mat4.fromTranslation(hand.indexTip.position));
            });
        }

        const anchorSessionOptions = new AnchorSessionOptions();
        anchorSessionOptions.scanForWorldAnchors = true;

        this.anchorSession = await this.anchorModule.openSession(anchorSessionOptions);
        this.anchorSession.onAnchorNearby.add(this.onAnchorNearby.bind(this));
    }

    private onAnchorNearby(anchor: Anchor) {
        
    }

    private async createAnchor(worldTransform: mat4) {
        const anchor = await this.anchorSession.createWorldAnchor(worldTransform);

        this.attachNewObjectToAnchor(anchor);
        try {
            this.anchorSession.saveAnchor(anchor);
        } catch (e) {
            console.error(`Error saving anchor: ${e}`);
        }
    }

    private attachNewObjectToAnchor(anchor: Anchor) {
        const obj = this.prefab.instantiate(this.getSceneObject());
        obj.setParent(this.getSceneObject());

        const anchorComponent = obj.createComponent(AnchorComponent.getTypeName()) as AnchorComponent;
        anchorComponent.anchor = anchor;
    }
}
