module Plywood {
  export class TimeBucketAction extends Action {
    static fromJS(parameters: ActionJS): TimeBucketAction {
      var value = Action.jsToValue(parameters);
      value.duration = Duration.fromJS(parameters.duration);
      if (parameters.timezone) value.timezone = Timezone.fromJS(parameters.timezone);
      if (parameters.origin) value.origin = new Date(parameters.origin);
      return new TimeBucketAction(value);
    }

    public duration: Duration;
    public timezone: Timezone;
    public origin: Date;

    constructor(parameters: ActionValue) {
      super(parameters, dummyObject);
      this.duration = parameters.duration;
      this.timezone = parameters.timezone;
      this.origin = parameters.origin;
      this._ensureAction("timeBucket");
      if (!Duration.isDuration(this.duration)) {
        throw new Error("`duration` must be a Duration");
      }
      if (this.origin && !(this.origin instanceof Date)) {
        throw new Error("`origin` must be a Date");
      }
    }

    public valueOf(): ActionValue {
      var value = super.valueOf();
      value.duration = this.duration;
      if (this.timezone) value.timezone = this.timezone;
      if (this.origin) value.origin = this.origin;
      return value;
    }

    public toJS(): ActionJS {
      var js = super.toJS();
      js.duration = this.duration.toJS();
      if (this.timezone) js.timezone = this.timezone.toJS();
      if (this.origin) js.origin = this.origin.toISOString();
      return js;
    }

    public getOutputType(inputType: string): string {
      this._checkInputTypes(inputType, 'TIME', 'TIME_RANGE');
      return 'TIME_RANGE';
    }

    protected _toStringParameters(expressionString: string): string[] {
      var ret = [this.duration.toString()];
      if (this.timezone) ret.push(this.timezone.toString());
      if (this.origin) ret.push(this.origin.toISOString());
      return ret;
    }

    public equals(other: TimeBucketAction): boolean {
      return super.equals(other) &&
        this.duration.equals(other.duration) &&
        Boolean(this.timezone) === Boolean(other.timezone) &&
        (!this.timezone || this.timezone.equals(other.timezone)) &&
        this.origin === other.origin;
    }

    protected _getFnHelper(inputFn: ComputeFn): ComputeFn {
      var duration = this.duration;
      var timezone = this.timezone;
      var origin = this.origin;
      return (d: Datum, c: Datum) => {
        var inV = inputFn(d, c);
        if (inV === null) return null;
        timezone = timezone || (c['timezone'] ? Timezone.fromJS(c['timezone']) : Timezone.UTC);
        origin = origin || new Date("1970-01-01T00:00:00Z");
        return TimeRange.timeBucket(inV, duration, timezone);
      }
    }

    protected _getJSHelper(inputJS: string): string {
      throw new Error("implement me");
    }

    protected _getSQLHelper(dialect: SQLDialect, inputSQL: string, expressionSQL: string): string {
      return dialect.timeBucketExpression(inputSQL, this.duration, this.timezone);
    }
  }

  Action.register(TimeBucketAction);
}
