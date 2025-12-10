export class Animal {
    private _id!: string;
    private _uid!: string;
    private _name!: string;
    private _species!: string;
    private _birthDate!: string;
    private _deathDate?: string | undefined;
    private _number!: number;
    private _historyOfIllnesses!: string;
    private _treatmentHistory!: string;
    private _farmId!: string;
    private _life!: boolean;
    private _type!: string;
    private _lotId!: string;

// --------------------------------------------------------
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
// --------------------------------------------------------
    public get uid(): string {
        return this._uid;
    }
    public set uid(value: string) {
        this._uid = value;
    }
// --------------------------------------------------------
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
// --------------------------------------------------------
    public get species(): string {
        return this._species;
    }
    public set species(value: string) {
        this._species = value;
    }
// --------------------------------------------------------
    public get birthDate(): string {
        return this._birthDate;
    }
    public set birthDate(value: string) {
        this._birthDate = value;
    }
// --------------------------------------------------------
    public get deathDate(): string | undefined {
        return this._deathDate;
    }
    public set deathDate(value: string | undefined) {
        this._deathDate = value;
    }
// --------------------------------------------------------
    public get number(): number {
        return this._number;
    }
    public set number(value: number) {
        this._number = value;
    }
// --------------------------------------------------------
    public get historyOfIllnesses(): string {
        return this._historyOfIllnesses;
    }
    public set historyOfIllnesses(value: string) {
        this._historyOfIllnesses = value;
    }
// --------------------------------------------------------
    public get treatmentHistory(): string {
        return this._treatmentHistory;
    }
    public set treatmentHistory(value: string) {
        this._treatmentHistory = value;
    }
// --------------------------------------------------------
    public get farmId(): string {
        return this._farmId;
    }
    public set farmId(value: string) {
        this._farmId = value;
    }
// --------------------------------------------------------
    public get life(): boolean {
        return this._life;
    }
    public set life(value: boolean) {
        this._life = value;
    }
// --------------------------------------------------------
    public get type(): string {
        return this._type;
    }
    public set type(value: string) {
        this._type = value;
    }
// --------------------------------------------------------
    public get lotId(): string {
        return this._lotId;
    }
    public set lotId(value: string) {
        this._lotId = value;
    }
  }