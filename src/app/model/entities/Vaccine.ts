export class Vaccine {
  private _id!: string;
  private _animalId!: string;
  private _farmId!: string;
  private _name!: string;
  private _date!: string;
  private _notes!: string;
  private _administeredBy!: string;

  constructor(
    id?: string,
    animalId?: string,
    farmId?: string,
    name?: string,
    date?: string,
    notes?: string,
    administeredBy?: string
  ) {
    this._id = id || '';
    this._animalId = animalId || '';
    this._farmId = farmId || '';
    this._name = name || '';
    this._date = date || '';
    this._notes = notes || '';
    this._administeredBy = administeredBy || '';
  }

  // ✅ Getters e Setters
  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }

  public get animalId(): string {
    return this._animalId;
  }
  public set animalId(value: string) {
    this._animalId = value;
  }

  public get farmId(): string {
    return this._farmId;
  }
  public set farmId(value: string) {
    this._farmId = value;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get date(): string {
    return this._date;
  }
  public set date(value: string) {
    this._date = value;
  }

  public get notes(): string {
    return this._notes;
  }
  public set notes(value: string) {
    this._notes = value;
  }

  public get administeredBy(): string {
    return this._administeredBy;
  }
  public set administeredBy(value: string) {
    this._administeredBy = value;
  }
}
