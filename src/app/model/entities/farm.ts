import { Animal } from "./Animal";

export class Farm {
    private _farmLocation!: string;
    private _farmName!: string;
    private _newFarmId!: string;
    private _uid!: string;
    private _ownerUid!: string;
    private _id!: any;
    private _allowedUsers: string[] = [];

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
    public get newFarmId(): string {
        return this._newFarmId;
    }
    public set newFarmId(value: string) {
        this._newFarmId = value;
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

    // --------------------------------------------------------
    public get allowedUsers(): string[] {
        return this._allowedUsers;
    }
    public set allowedUsers(value: string[]) {
        this._allowedUsers = value;
    }
    // --------------------------------------------------------
    public get ownerUid(): string {
        return this._ownerUid;
    }
    public set ownerUid(value: string) {
        this._ownerUid = value;
    }
}
