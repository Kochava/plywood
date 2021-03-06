module Plywood {
  export class ExternalExpression extends Expression {
    static fromJS(parameters: ExpressionJS): Expression {
      var value: ExpressionValue = {
        op: parameters.op
      };
      value.external = External.fromJS(parameters.external);
      return new ExternalExpression(value);
    }

    public external: External;

    constructor(parameters: ExpressionValue) {
      super(parameters, dummyObject);
      this.external = parameters.external;
      if (!this.external) throw new Error('must have an external');
      this._ensureOp('external');
      this.type = 'DATASET';
      this.simple = true;
    }

    public valueOf(): ExpressionValue {
      var value = super.valueOf();
      value.external = this.external;
      return value;
    }

    public toJS(): ExpressionJS {
      var js = super.toJS();
      js.external = this.external.toJS();
      return js;
    }

    public toString(): string {
      return `E:${this.external.toString()}`;
    }

    public getFn(): ComputeFn {
      throw new Error('should not call getFn on External');
    }

    public equals(other: ExternalExpression): boolean {
      return super.equals(other) &&
        this.external.equals(other.external);
    }

    public _fillRefSubstitutions(typeContext: FullType, indexer: Indexer, alterations: Alterations): FullType {
      indexer.index++;
      var newTypeContext = this.external.getFullType();
      newTypeContext.parent = typeContext;
      return newTypeContext;
    }

    public _computeResolvedSimulate(simulatedQueries: any[]): any {
      var external = this.external;
      if (external.suppress) return external;
      simulatedQueries.push(external.getQueryAndPostProcess().query);
      return external.simulate();
    }

    public _computeResolved(): Q.Promise<any> {
      var external = this.external;
      if (external.suppress) return Q(external);
      return external.queryValues();
    }

    public unsuppress(): ExternalExpression {
      var value = this.valueOf();
      value.external = this.external.show();
      return new ExternalExpression(value);
    }

    public addAction(action: Action): ExternalExpression {
      var newExternal = this.external.addAction(action);
      if (!newExternal) return;
      return new ExternalExpression({ external: newExternal });
    }

    public makeTotal(dataName: string): ExternalExpression {
      var newExternal = this.external.makeTotal(dataName);
      if (!newExternal) return null;
      return new ExternalExpression({ external: newExternal });
    }

    public getEmptyLiteral(): LiteralExpression {
      var external = this.external;
      var emptyTotalDataset = external.getEmptyTotalDataset();
      if (!emptyTotalDataset) return null;
      return r(emptyTotalDataset);
    }
  }

  Expression.register(ExternalExpression);
}
