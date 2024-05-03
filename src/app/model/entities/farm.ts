import { Animal } from "./Animal";

export class Farm{
    private _farmLocation!: string;
    private _farmName!: string;
    private _id!: number;
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
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
// --------------------------------------------------------
    public get uid(): string {
        return this._uid;
    }
    public set uid(value: string) {
        this._uid = value;
    }
}
