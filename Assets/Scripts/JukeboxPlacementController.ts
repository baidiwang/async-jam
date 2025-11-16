import { Anchor } from "Spatial Anchors.lspkg/Anchor";
import { AnchorComponent } from "Spatial Anchors.lspkg/AnchorComponent";
import { AnchorModule } from "Spatial Anchors.lspkg/AnchorModule";
import { AnchorSession, AnchorSessionOptions } from "Spatial Anchors.lspkg/AnchorSession";
import { Jukebox } from "./Jukebox";

@component
export class JukeboxPlacementController extends BaseScriptComponent {
    @input anchorModule: AnchorModule;
    @input jukeboxPrefab: ObjectPrefab;
    
    private anchorSession?: AnchorSession;
    
    async onAwake() {
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });
    }

    private async onStart() {
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
        const obj = this.jukeboxPrefab.instantiate(this.getSceneObject());
        obj.setParent(this.getSceneObject());

        const anchorComponent = obj.getComponent(AnchorComponent.getTypeName());
        const jukeboxComponent = obj.getComponent(Jukebox.getTypeName());

        anchorComponent.anchor = anchor;
        jukeboxComponent.load();
    }
}