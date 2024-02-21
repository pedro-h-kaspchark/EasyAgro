export class user{
    private _name!: string;
    private _number!: string;
    private _location!: string;
    private _email!: string;
    private _downloadURL!: any;
    private _id!: string;
    private _uid!: any;

    constructor(name: string, number: string, location: string){
        this._name = name;
        this._number = number;
        this._location = location;
    }
// --------------------------------------------------------
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
// --------------------------------------------------------
    public get number(): string {
        return this._number;
    }
    public set number(value: string) {
        this._number = value;
    }
// --------------------------------------------------------
    public get location(): string {
        return this._location;
    }
    public set location(value: string) {
        this._location = value;
    }
// --------------------------------------------------------
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
// --------------------------------------------------------
    public get downloadURL(): any {
        return this._downloadURL;
    }
    public set downloadURL(value: any) {
        this._downloadURL = value;
    }
// --------------------------------------------------------
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
// --------------------------------------------------------
    public get uid(): any {
        return this._uid;
    }
    public set uid(value: any) {
        this._uid = value;
    }
}