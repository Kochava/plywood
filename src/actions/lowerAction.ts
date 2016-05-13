module Plywood {
  export class LowerAction extends Action {
    static fromJS(parameters: ActionJS): LowerAction {
      var value = Action.jsToValue(parameters);
      return new LowerAction(value);
    }

    constructor(parameters: ActionValue) {
      super(parameters, dummyObject);
      this._ensureAction("lower");
    }

    public getOutputType(inputType: string): string {
      this._checkInputType(inputType, 'STRING');
      return 'STRING';
    }

    public valueOf(): ActionValue {
      var value = super.valueOf();
      return value;
    }

    public toJS(): ActionJS {
      var js = super.toJS();
      return js;
    }

    protected _toStringParameters(expressionString: string): string[] {
      return [];
    }

    public equals(other: LowerAction): boolean {
      return super.equals(other);
    }

    protected _getFnHelper(inputFn: ComputeFn): ComputeFn {
      return (d: Datum, c: Datum) => {
        return (String(inputFn(d, c)).toLowerCase() || [])[1] || null;
      }
    }

    protected _getJSHelper(inputJS: string, expressionJS: string): string {
      throw new Error('not implemented yet');
      //return `((''+${inputJS}).match(/${this.regexp}/) || [])[1] || null`;
    }

    protected _getSQLHelper(dialect: SQLDialect, inputSQL: string, expressionSQL: string): string {
      throw new Error('not implemented yet'); // https://github.com/mysqludf/lib_mysqludf_preg
    }
  }

  Action.register(LowerAction);
}