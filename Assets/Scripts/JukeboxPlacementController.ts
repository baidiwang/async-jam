import { Anchor } from "Spatial Anchors.lspkg/Anchor";
import { AnchorComponent } from "Spatial Anchors.lspkg/AnchorComponent";
import { AnchorModule } from "Spatial Anchors.lspkg/AnchorModule";
import { AnchorSession, AnchorSessionOptions } from "Spatial Anchors.lspkg/AnchorSession";
import { Jukebox } from "./Jukebox";

@component
export class JukeboxPlacementController extends BaseScriptComponent {
    @input anchorModule: AnchorModule;
    @input jukeboxPrefab: ObjectPrefab;
    @input localizationTooltip: SceneObject;
    
    private anchorSession?: AnchorSession;
    
    async onAwake() {
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });
    }

    private async onStart() {
        const anchorSessionOptions = new AnchorSessionOptions();
        
        anchorSessionOptions.area = "devland2";
        anchorSessionOptions.scanForWorldAnchors = true;

        this.anchorSession = await this.anchorModule.openSession(anchorSessionOptions);
        this.anchorSession.onAnchorNearby.add(this.onAnchorNearby.bind(this));

        this.localizationTooltip.enabled = false;
    }

    private onAnchorNearby(anchor: Anchor) {
        this.attachNewObjectToAnchor(anchor);
    }

    public async createAnchor(worldTransform: mat4) {
        const anchor = await this.anchorSession.createWorldAnchor(worldTransform);

        try {
            this.localizationTooltip.enabled = true;
            const userAnchor = await this.anchorSession.saveAnchor(anchor);

            // if made it this far (call above has finished), then the area scan is done
            
            this.attachNewObjectToAnchor(userAnchor);
        } catch (e) {
            console.error(`Error saving anchor: ${e}`)
            console.error(`Error saving anchor. stack trace: ${e.stack}`);
        }

        this.localizationTooltip.enabled = false;
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