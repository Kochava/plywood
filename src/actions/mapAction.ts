module Plywood {
  export class MapAction extends Action {
    static fromJS(parameters: ActionJS): MapAction {
      var value = Action.jsToValue(parameters);
      value.map = parameters.map;
      return new MapAction(value);
    }

    public map: Lookup<any>;

    constructor(parameters: ActionValue) {
      super(parameters, dummyObject);
      this.map = parameters.map;
      this._ensureAction("map");
    }

    public getOutputType(inputType: string): string {
      this._checkInputTypes(inputType, 'STRING', 'NUMBER');
      return inputType;
    }

    public valueOf(): ActionValue {
      var value = super.valueOf();
      value.map = this.map;
      return value;
    }

    public toJS(): ActionJS {
      var js = super.toJS();
      js.map = this.map;
      return js;
    }

    protected _toStringParameters(expressionString: string): string[] {
      return [String(this.map)];
    }

    public equals(other: MapAction): boolean {
      return super.equals(other) &&
        this.map === other.map;
    }

    public fullyDefined(): boolean {
      return false;
    }

    protected _getFnHelper(inputFn: ComputeFn): ComputeFn {
      throw new Error('can not express as JS');
    }

    protected _getJSHelper(inputJS: string): string {
      throw new Error('can not express as JS');
    }

    protected _getSQLHelper(dialect: SQLDialect, inputSQL: string, expressionSQL: string): string {
      throw new Error('can not express as SQL');
    }
  }

  Action.register(MapAction);
}