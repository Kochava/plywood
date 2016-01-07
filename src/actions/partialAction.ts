module Plywood {
  export class PartialAction extends Action {
    static fromJS(parameters: ActionJS): PartialAction {
      var value = Action.jsToValue(parameters);
      value.regexp = parameters.regexp;
      return new PartialAction(value);
    }

    public regexp: string;

    constructor(parameters: ActionValue) {
      super(parameters, dummyObject);
      this.regexp = parameters.regexp;
      this._ensureAction("partial");
    }

    public getOutputType(inputType: string): string {
      this._checkInputType(inputType, 'STRING');
      return 'STRING';
    }

    public valueOf(): ActionValue {
      var value = super.valueOf();
      value.regexp = this.regexp;
      return value;
    }

    public toJS(): ActionJS {
      var js = super.toJS();
      js.regexp = this.regexp;
      return js;
    }

    protected _toStringParameters(expressionString: string): string[] {
      return [this.regexp];
    }

    public equals(other: MatchAction): boolean {
      return super.equals(other) &&
        this.regexp === other.regexp;
    }

    protected _getFnHelper(inputFn: ComputeFn): ComputeFn {
      var re = new RegExp(this.regexp);
      return (d: Datum, c: Datum) => {
        return (String(inputFn(d, c)).match(re) || [])[1] || null;
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

  Action.register(PartialAction);
}