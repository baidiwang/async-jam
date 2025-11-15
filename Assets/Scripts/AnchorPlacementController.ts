import { Anchor } from "Spatial Anchors.lspkg/Anchor";
import { AnchorModule } from "Spatial Anchors.lspkg/AnchorModule";
import { AnchorSession, AnchorSessionOptions } from "Spatial Anchors.lspkg/AnchorSession";

@component
export class NewScript extends BaseScriptComponent {
    @input anchorModule: AnchorModule;

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
}
