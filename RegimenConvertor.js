PainCalc.RegimenConvertor = function (input, output) {
    this._input = input;
    this._output = output;
    this.Convert();
};

PainCalc.RegimenConvertor.prototype = {
    ShortTermFactor: 1 / 4,
    LongTermFactor: 3 / 4,
    IVFactor: 3 / 4,
    Input: function () {
        return this._input;
    },
    Output: function () {
        return this._output;
    },
    ShortTermOutput: function () {
        return this.Output().ShortActing()[0]
    },
    LongTermOutput: function () {
        return this.Output().LongActing()[0]
    },
    IVOutput: function () {
        return this.Output().IV()[0]
    },
    ShortTermInput: function () {
        return this.Input().ShortActing()[0]
    },
    LongTermInput: function () {
        return this.Input().LongActing()[0]
    },
    IVInput: function () {
        return this.Input().IV()[0]
    },
    ValidOutput: function () {
        if (!this.Output() || this.Output().Count() == 0)
            return false;
        if (this.IVOutput() && this.Output().Count() == 1)
            return true;
        if (this.ShortTermOutput() && this.Output().Count() == 1)
            return true;
        if (this.LongTermOutput() && this.Output().Count() == 1)
            return true;
        if (this.LongTermOutput() && this.ShortTermOutput() && this.Output().Count() == 2)
            return true;
    },
    ValidInput: function () {
        if (!this.Input() || this.Input().Count() == 0)
            return false;
        if (this.IVInput() && this.Input().Count() == 1)
            return true;
        if (this.ShortTermInput() && this.Input().Count() == 1)
            return true;
        if (this.LongTermInput() && this.Input().Count() == 1)
            return true;
        if (this.LongTermInput() && this.ShortTermInput() && this.Input().Count() == 2)
            return true;
    },
    CanConvert: function () {
        return this.ValidInput() && this.ValidOutput();
    },
    Convert: function () {
        if (!this.CanConvert())
            return;
        if (this.Input().Count() == 1 && this.Output().Count() == 1) {
            this.Output().Rxs()[0].Dose =
                            this.Output().Rxs()[0].Medication.AvailableMultiples
                            *
                            Math.floor(this.Output().Rxs()[0].OutputFactor() * this.Input().Normalized() / this.Output().Rxs()[0].Medication.AvailableMultiples);
        };
    }
};