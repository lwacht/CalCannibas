try{
//mhart 01/22/2018 Defect 4740
//add parent if app number provided
	if(!publicUser){
		if(!matches(AInfo["App Number"],null,"", "undefined")){
			addParent(AInfo["App Number"]);
		}
	}
//mhart 01/22/2018 Defect 4740
} catch(err){
	logDebug("An error has occurred in ASA:LICENSES/CULTIVATOR/TEMPORARY/APPLICATION: Add Permanent Record: " + err.message);
	logDebug(err.stack);
	aa.sendMail(sysFromEmail, debugEmail, "", "An error has occurred in ASA:LICENSES/CULTIVATOR/TEMPORARY/APPLICATION: Add Permanent Record: "+ startDate, capId + br + err.message + br + err.stack + br + currEnv);
}

//lwacht: 171214: story 5175: create a reference contact for the temp drp and bsns contact
//this will be in ASA:LICENSES/CULTIVATOR/*/APPLICATION, with all the other logic
//lwacht: 171214: story 5175: end