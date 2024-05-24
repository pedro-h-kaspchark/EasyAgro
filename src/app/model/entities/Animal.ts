export class Animal {
    private _id!: string;
    private _uid!: string;
    private _name!: string;
    private _species!: string;
    private _birthDate!: string;
    private _number!: number;
    private _historyOfIllnesses!: string;
    private _treatmentHistory!: string;
    private _farmId!: string;

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
  }