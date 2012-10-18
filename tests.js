var pharmacyFactory = function () {
    var pharmacy = new PainCalc.Pharmacy();
    pharmacy.Medications(PainCalc.meds);
    return pharmacy;
};
test("can create a pharmacy", function () {
    var pharmacy = pharmacyFactory();
    equal(PainCalc.meds.length, pharmacy.Medications().length);
});

test("CAN TEST AVAILABLE STRENGTHS", function () {
    var pharmacy = pharmacyFactory();
    ok(pharmacy.Medications()[0].AvailableStrengths);
});

test("can access short term medications", function () {
    var pharmacy = pharmacyFactory();
    ok(pharmacy.Medications(PainCalc.MedicationTypes.ShortActing).length, "could not get short term meds");
});

test("can access long term medications", function () {
    var pharmacy = pharmacyFactory();
    ok(pharmacy.Medications(PainCalc.MedicationTypes.LongActing).length, "could not access long acting meds");
});


test("can create a regimen with one rx", function () {
    var regimenInput = new PainCalc.Regimen(new PainCalc.Rx(pharmacyFactory().Medications(PainCalc.MedicationTypes.ShortActing)[0]));
    equal(regimenInput.Rxs().length, 1);
});

test("can create a regimen with two rxs", function () {
    var regimenInput = new PainCalc.Regimen(new PainCalc.Rx(pharmacyFactory().Medications(PainCalc.MedicationTypes.ShortActing)[0]), new PainCalc.Rx(pharmacyFactory().Medications(PainCalc.MedicationTypes.LongActing)[0]));
    equal(regimenInput.Rxs().length, 2);
});




test("CAN GET THE NORMALIZATION VALUE FOR A REGIMEN WITH ONE PRESCRIPTION", function () {
    //var pharmacy = pharmacyFactory();
    var medX = new PainCalc.Medication({ Name: "x", AvailableMultiples: 5, TypicalDosesPerDay: 3, ConversionFactor: 2 });
    //pharmacy.Medications([medX]);
    var regimenInput = new PainCalc.Regimen(medX);
    ok(regimenInput.Normalized() == 5 * 3 / 2);
});

test("CAN GET THE NORMALIZATION VALUE FOR A REGIMEN WITH TWO PRESCRIPTION", function () {
    var medX = new PainCalc.Medication({ Name: "x", AvailableMultiples: 5, TypicalDosesPerDay: 3, ConversionFactor: 2 });
    var medY = new PainCalc.Medication({ Name: "y", AvailableMultiples: 5, TypicalDosesPerDay: 3, ConversionFactor: 0.5 });
    var regimenInput = new PainCalc.Regimen(medX, medY);
    ok(regimenInput.Normalized() == (5 * 3 / 2) + (5 * 3 / 0.5));
});

test("CAN CREATE A MEDICATION CONVERTOR", function () {
    var medX = new PainCalc.Medication({ Name: "x", AvailableMultiples: 5, TypicalDosesPerDay: 3, ConversionFactor: 2 });
    var medY = new PainCalc.Medication({ Name: "y", AvailableMultiples: 5, TypicalDosesPerDay: 3, ConversionFactor: 0.5 });
    var convertor = new PainCalc.RegimenConvertor(new PainCalc.Regimen(medX), new PainCalc.Regimen(medX));
    //regimenInput.Add(medX);
    //regimenInput.Add(medY);
    ok(convertor.Input().Rxs().length == 1);
});

test("MEDICATION CONVERTOR CAN CONVERT THE SAME PRESCRIPTION TO ITSELF", function () {
    var medX = new PainCalc.Medication({ Name: "x", AvailableMultiples: 5, TypicalDosesPerDay: 3, ConversionFactor: 2 });
    var medY = new PainCalc.Medication({ Name: "y", AvailableMultiples: 5, TypicalDosesPerDay: 3, ConversionFactor: 0.5 });
    var convertor = new PainCalc.RegimenConvertor(new PainCalc.Regimen(medX), new PainCalc.Regimen(medX));
    ok(convertor.Output().Rxs()[0].Dose == 5);
});

test("CAN CONVERT FROM A SHORT TERM MED TO SHORT AND LONG TERM MED", function () {
    var medX = new PainCalc.Medication({ Name: "x", AvailableMultiples: 5, TypicalDosesPerDay: 3, ConversionFactor: 2 });
    var medY = new PainCalc.Medication({ Name: "y", AvailableMultiples: 5, TypicalDosesPerDay: 3, ConversionFactor: 0.5 });
    var convertor = new PainCalc.RegimenConvertor(new PainCalc.Regimen(medX), new PainCalc.Regimen(medX));
    ok(convertor.Output().Rxs()[0].Dose == 5);
});

test("CAN GET MEDICATION BY NAME", function () {
    var pharm = pharmacyFactory();
    var Hydromorphone = pharm.Medication("Hydromorphone", PainCalc.MedicationTypes.ShortActing);
    ok(Hydromorphone);
});

test("CAN GET SHORT ACTING MEDICATION FROM CONVERTOR", function () {
    var pharm = pharmacyFactory();
    var strName = "Hydromorphone";
    var Hydromorphone = pharm.Medication(strName, PainCalc.MedicationTypes.ShortActing);
    var convertor = new PainCalc.RegimenConvertor(null, new PainCalc.Regimen(Hydromorphone));
    ok(convertor.ShortTermOutput().Medication.Name == strName);
});

test("A CONVERTOR WITH NO SHORT TERM OUTPUT, WILL NOT THROW AN EXCEPTION WHEN ACCESSING IT", function () {
    var pharm = pharmacyFactory();
    var strName = "Fentanyl IV";
    var med = pharm.Medication(strName, PainCalc.MedicationTypes.IV);
    var convertor = new PainCalc.RegimenConvertor(null, new PainCalc.Regimen(med));
    ok(!convertor.ShortTermOutput());

});

test("CAN GET LONG ACTING OUTPUT FROM CONVERTOR", function () {
    var pharm = pharmacyFactory();
    var medName = "Fentanyl Patch";
    var med = pharm.Medication(medName, PainCalc.MedicationTypes.LongActing);
    var convertor = new PainCalc.RegimenConvertor(null, new PainCalc.Regimen(med));
    ok(convertor.LongTermOutput().Medication.Name == medName);
});


test("A CONVERTOR WITH NO LONG TERM OUTPUT, WILL NOT THROW AN EXCEPTION WHEN ACCESSING IT", function () {
    var pharm = pharmacyFactory();
    var strName = "Fentanyl IV";
    var med = pharm.Medication(strName, PainCalc.MedicationTypes.IV);
    var convertor = new PainCalc.RegimenConvertor(null, new PainCalc.Regimen(med));
    ok(!convertor.LongTermOutput());
});


test("CAN GET IV OUTPUT FROM CONVERTOR", function () {
    var pharm = pharmacyFactory();
    var medName = "Fentanyl IV";
    var med = pharm.Medication(medName, PainCalc.MedicationTypes.IV);
    var convertor = new PainCalc.RegimenConvertor(null, new PainCalc.Regimen(med));
    ok(convertor.IVOutput().Medication.Name == medName);
});

test("A CONVERTOR WITH ONLY AN IV OUTPUT IS VALID", function () {
    var pharm = pharmacyFactory();
    var medName = "Fentanyl IV";
    var med = pharm.Medication(medName, PainCalc.MedicationTypes.IV);
    var convertor = new PainCalc.RegimenConvertor(null, new PainCalc.Regimen(med));
    ok(convertor.ValidOutput());
});

test("A CONVERTOR WITH A SHORT TERM OUTPUT IS VALID", function () {
    var pharm = pharmacyFactory();
    var strName = "Hydromorphone";
    var Hydromorphone = pharm.Medication(strName, PainCalc.MedicationTypes.ShortActing);
    var convertor = new PainCalc.RegimenConvertor(null, new PainCalc.Regimen(Hydromorphone));
    ok(convertor.ValidOutput());
});

test("A CONVERTOR WITH A LONG TERM OUTPUT IS VALID", function () {
    var pharm = pharmacyFactory();
    var medName = "Fentanyl Patch";
    var med = pharm.Medication(medName, PainCalc.MedicationTypes.LongActing);
    var convertor = new PainCalc.RegimenConvertor(null, new PainCalc.Regimen(med));
    ok(convertor.ValidOutput());
});

test("A CONVERTOR WITH A LONG TERM AND SHORT TERM OUTPUT IS VALID", function () {
    var pharm = pharmacyFactory();
    var medName = "Fentanyl Patch";
    var med = pharm.Medication(medName, PainCalc.MedicationTypes.LongActing);
    var strName = "Hydromorphone";
    var Hydromorphone = pharm.Medication(strName, PainCalc.MedicationTypes.ShortActing);
    var convertor = new PainCalc.RegimenConvertor(null, new PainCalc.Regimen(med, Hydromorphone));
    ok(convertor.ValidOutput());
});

test("A CONVERTOR WITH A LONG TERM AND SHORT TERM INPUT IS VALID", function () {
    var pharm = pharmacyFactory();
    var medName = "Fentanyl Patch";
    var med = pharm.Medication(medName, PainCalc.MedicationTypes.LongActing);
    var strName = "Hydromorphone";
    var Hydromorphone = pharm.Medication(strName, PainCalc.MedicationTypes.ShortActing);
    var convertor = new PainCalc.RegimenConvertor(new PainCalc.Regimen(med, Hydromorphone), null);
    ok(convertor.ValidInput());
});

test("A CONVERTOR WITH ONLY AN IV INPUT IS VALID", function () {
    var pharm = pharmacyFactory();
    var medName = "Fentanyl IV";
    var med = pharm.Medication(medName, PainCalc.MedicationTypes.IV);
    var convertor = new PainCalc.RegimenConvertor(new PainCalc.Regimen(med), null);
    ok(convertor.ValidInput());
});
//test("A CONVERTOR WITH NO LONG TERM OUTPUT, WILL NOT THROW AN EXCEPTION WHEN ACCESSING IT", function () {
//    var pharm = pharmacyFactory();
//    var strName = "Fentanyl IV";
//    var med = pharm.Medication(strName);
//    var convertor = new PainCalc.RegimenConvertor(null, new PainCalc.Regimen(med));
//    ok(!convertor.LongTermOutput());
//});