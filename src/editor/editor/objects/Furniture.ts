import { Graphics, Sprite, Texture } from "pixi.js";
import { endpoint } from "../../../api/api-client";
import { FurnitureData } from "../../../stores/FurnitureStore";
import { useStore } from "../../../stores/ToolStore";
import { DeleteFurnitureAction } from "../actions/DeleteFurnitureAction";
import { METER, Tool } from "../constants";
import { IFurnitureSerializable } from "../persistence/IFurnitureSerializable";
import { TransformLayer } from "./TransformControls/TransformLayer";
// import { Wall } from "./Walls/Wall";

export class Furniture extends Sprite {


    private id: number; // fiecare mobila isi stie index-ul in plan. uuids?
    // private dragging: boolean;
    public isAttached:boolean;
    public attachedToLeft:number;
    public attachedToRight:number;
    public xLocked:boolean;
    private transformLayer: TransformLayer;
    public resourcePath: string;
    constructor(data:FurnitureData, id:number, attachedTo?:Graphics, attachedToLeft?:number, attachedToRight?:number) {

        let texture = Texture.from(`${endpoint}2d/${data.imagePath}`);
        super(texture);
        this.resourcePath = data.imagePath;
        this.id = id;
        this.transformLayer = TransformLayer.Instance;
        
        if (attachedTo) {
            this.isAttached = true;
            this.parent = attachedTo;
            this.attachedToLeft = attachedToLeft;
            this.attachedToRight = attachedToRight;
            this.xLocked = true;
        } else {
            this.xLocked = false;
            this.isAttached = false;
        }
        this.interactive = true;
        // this.dragging = false;
        this.width = data.width * METER;
        this.height = data.height * METER;

        this.on('mousedown', this.onMouseDown)
        this.on('mousemove', this.onMouseMove)

    }

    public getId() {
        return this.id;
    }
    private onMouseDown() {

        console.log("click!!")
        switch (useStore.getState().activeTool) {
            case Tool.FurnitureEdit:
                this.transformLayer.select(this);
                break;

            case Tool.FurnitureRemove:
                let action = new DeleteFurnitureAction(this.id);
                action.execute();
                break;
        }
    }

    private onMouseMove() {
        this.transformLayer.update();        
    }

    public serialize() {
        let res: IFurnitureSerializable;
        res = {
            x: this.x,
            y: this.y,
            height: this.height / METER,
            width: this.width / METER,
            id: this.id,
            texturePath: this.resourcePath,
            rotation: this.rotation,
            attachedToLeft: this.attachedToLeft,
            attachedToRight: this.attachedToRight
        }


        return res;
    }
}