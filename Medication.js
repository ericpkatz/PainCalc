PainCalc.MedicationTypes = {
    ShortActing: "SA",
    LongActing: "LA",
    IV: "IV"
};

PainCalc.MedicationUnits = {
    Mg: "mg",
    Mc: "mcg"
};

//a medication

PainCalc.Medication = function (config) {
    this.Name = config.Name;
    this.ConversionFactor = config.ConversionFactor;
    this.Units = config.Units;
    this.AvailableMultiples = config.AvailableMultiples;
    this.TypicalDosesPerDay = config.TypicalDosesPerDay;
    this.MedicationType = config.MedicationType;
    this.AvailableStrengths = config.AvailableStrengths;
}