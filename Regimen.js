PainCalc.Regimen = function(rxs) {
    this._rxs = [];
    var rx;
    for (var i = 0; i < arguments.length; i++) {
        var rx = this.ConvertFromMedication(arguments[i]);
        this._rxs.push(rx);
    };
}

PainCalc.Regimen.prototype = {
    Rxs: function () {
        return this._rxs;
    },
    ConvertFromMedication: function (rx) {
        return rx instanceof PainCalc.Medication ? new PainCalc.Rx(rx) : rx;
    }, 
    Normalized: function () {
        var sum = 0;
        $(this.Rxs()).each(function () {
            sum += this.Normalized();
        });
        return sum;
    },
    FindByMedicationType: function (medicationType) {
        return $.grep(this.Rxs(), function (item) {
            return item.Medication.MedicationType == medicationType;
        });
    },
    LongActing: function () {
        return this.FindByMedicationType(PainCalc.MedicationTypes.LongActing);
    },
    HasLongActing: function () {
        return this.LongActing().length > 0;
    },
    ShortActing: function () {
        return this.FindByMedicationType(PainCalc.MedicationTypes.ShortActing);
    },
    IV: function () {
        return this.FindByMedicationType(PainCalc.MedicationTypes.IV);
    },
    HasShortActing: function () {
        return this.ShortActing().length > 0;
    },
    Count: function () {
        return this.Rxs().length;
    }
};

