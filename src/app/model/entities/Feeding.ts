export class Feeding {
  private _id!: string;
  private _animalId!: string;
  private _farmId!: string;
  private _date!: string;
  private _feedType!: string;
  private _amount!: number;
  private _notes!: string;

  constructor(
    id?: string,
    animalId?: string,
    farmId?: string,
    date?: string,
    feedType?: string,
    amount?: number,
    notes?: string
  ) {
    this._id = id || '';
    this._animalId = animalId || '';
    this._farmId = farmId || '';
    this._date = date || '';
    this._feedType = feedType || '';
    this._amount = amount || 0;
    this._notes = notes || '';
  }

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

  public get date(): string {
    return this._date;
  }
  public set date(value: string) {
    this._date = value;
  }

  public get feedType(): string {
    return this._feedType;
  }
  public set feedType(value: string) {
    this._feedType = value;
  }

  public get amount(): number {
    return this._amount;
  }
  public set amount(value: number) {
    this._amount = value;
  }

  public get notes(): string {
    return this._notes;
  }
  public set notes(value: string) {
    this._notes = value;
  }
}
