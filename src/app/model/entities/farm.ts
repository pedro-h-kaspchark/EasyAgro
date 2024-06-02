import { Animal } from "./Animal";

export class Farm{
    private _farmLocation!: string;
    private _farmName!: string;
    private _farmId!: string;
    private _uid!: string;
    private _id!: any;
    private animals?: Animal[];

    // --------------------------------------------------------
    public get location(): string {
        return this._farmLocation;
    }
    public set location(value: string) {
        this._farmLocation = value;
    }
// --------------------------------------------------------
    public get farmName(): string {
        return this._farmName;
    }
    public set farmName(value: string) {
        this._farmName = value;
    }
// --------------------------------------------------------
    public get farmId(): string {
        return this._farmId;
    }
    public set farmId(value: string) {
        this._farmId = value;
    }
// --------------------------------------------------------
    public get uid(): string {
        return this._uid;
    }
    public set uid(value: string) {
        this._uid = value;
    }
// --------------------------------------------------------
    public get id(): any {
        return this._id;
    }
    public set id(value: any) {
        this._id = value;
    }
}
