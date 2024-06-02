import { Animal } from "./Animal";

export class Farm{
    private _farmLocation!: string;
    private _farmName!: string;
    private _farmId!: string;
    private _uid!: string;
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
    public get id(): string {
        return this._farmId;
    }
    public set id(value: string) {
        this._farmId = value;
    }
// --------------------------------------------------------
    public get uid(): string {
        return this._uid;
    }
    public set uid(value: string) {
        this._uid = value;
    }
}
