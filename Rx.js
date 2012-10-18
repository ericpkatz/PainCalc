PainCalc.Rx = function (medication, dose, dosesPerDay, units) {
    this.Medication = medication;
    this.Dose = dose || medication.AvailableMultiples;
    this.DosesPerDay = dosesPerDay || medication.TypicalDosesPerDay;
    this.DisplayUnits = units || medication.Units;
};

PainCalc.Rx.prototype = {
    Normalized: function () {
        return this.Dose * this.DosesPerDay / this.Medication.ConversionFactor;
    },
    OutputFactor: function () {
        return this.Medication.ConversionFactor / this.DosesPerDay;
    }
};