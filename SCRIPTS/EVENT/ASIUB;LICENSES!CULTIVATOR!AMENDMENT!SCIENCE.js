try{
	loadAppSpecificBefore(AInfo); 
	loadASITablesBefore();
	logDebug("loadASITablesBefore");
	statusArray = [];
	if(matches(AInfo["LSA Review Status-NEW"],"Annual", "Provisional")) {
		var lsaCheck = true;
		if(!matches(AInfo["APN Matches Premises-LSA-NEW"],"Yes","N/A","No")) {
			lsaCheck = false;
		}
		if(!matches(AInfo["APN Matches Adjacent Parcel-NEW"],"Yes","N/A","No")) {
			lsaCheck = false;
		}
		for(ls in LAKEANDSTREAMBEDALTERATION) {
			if(matches(LAKEANDSTREAMBEDALTERATION[ls]["LSA ID Number"], null,"",undefined)) {
				lsaCheck = false;
			}
			if(matches(LAKEANDSTREAMBEDALTERATION[ls]["Document Type"], null,"",undefined)) {
			 	lsaCheck = false;
			}
		}
		
		if(!lsaCheck) {
			cancel = true;
			showMessage = true;
			comment("The LSA Review Status cannot be marked Complete as at least one of the fields is insufficient.");
		}
	}
	if (typeof(SOURCEOFWATERSUPPLY) == "object"){
		if(SOURCEOFWATERSUPPLY.length > 0){
			for(xx in SOURCEOFWATERSUPPLY){
				statusArray.push(SOURCEOFWATERSUPPLY[xx]["Type of Water Supply"]);
			}
		}
	}		
	if(AInfo["Water Rights Review Status-NEW"] == "Complete") {
		if (WATERRIGHTS.length > 0){
			if(getOccurrence(statusArray, "Diversion from Waterbody") != WATERRIGHTS.length) {
				cancel = true;
				showMessage = true;
				comment("The number of water sources in this table and the Source of Water Supply Data Table do not match. Please verify the number of line items on each table.");
			}
		}else{
			cancel = true;
			showMessage = true;
			comment("The Water Rights Review Status cannot be marked Complete as at least one of the fields is insufficient.");	
		}
	}
	if(AInfo["Rainwater Catchment Review Status-NEW"] == "Complete") {	
		if(RAINWATERCATCHMENT.length > 0){	
			if(getOccurrence(statusArray, "Rainwater Catchment") != RAINWATERCATCHMENT.length) {
				cancel = true;
				showMessage = true;
				comment("The number of water sources in the Rain Catchment table and the Source of Water Supply Data Table do not match. Please verify the number of line items on each table.");
			}
		}else{
				cancel = true;
				showMessage = true;
				comment("The Rainwater Catchment Review Status cannot be marked Complete as at least one of the fields is insufficient");
		}
	}
	
	if(AInfo["Groundwater Well Review Status-NEW"] == "Complete") {
		if(GROUNDWATERWELL.length > 0){
			if(getOccurrence(statusArray, "Groundwater Well") != GROUNDWATERWELL.length) {
				cancel = true;
				showMessage = true;
				comment("The number of water sources in this table and the Source of Water Supply Data Table do not match. Please verify the number of line items on each table.");
			}
		}else{
			cancel = true;
			showMessage = true;
			comment("The Groundwater Review Status cannot be marked Complete as at least one of the fields is insufficient.");
		}
	}
	if(AInfo["Retail Water Supplier Review Status-NEW"] == "Complete") {
		if(RETAILWATERSUPPLIER.length > 0){
			if(getOccurrence(statusArray, "Retail Supplier") != RETAILWATERSUPPLIER.length) {
				cancel = true;
				showMessage = true;
				comment("The number of Retail Supplier water sources in this table and the Source of Water Supply Data Table do not match. Please verify the number of line items on each table.");
			}
		}else{
			cancel = true;
			showMessage = true;
			comment("The Retail Water Supplier Review Status cannot be marked Complete as at least one of the fields is insufficient.");
		}
	}
	if(AInfo["Small Retail Water Supplier Review Status-NEW"] == "Complete") {
		if(!SMALLRETAILWATERSUPPLIERS.length > 0){
			if((getOccurrence(statusArray, "Small Retail Supplier Diversion") + getOccurrence(statusArray, "Small Retail Supplier - Delivery or pickup of water from a groundwater well")) != SMALLRETAILWATERSUPPLIERS.length) {
				cancel = true;
				showMessage = true;
				comment("The number of water sources in this table and the Source of Water Supply Data Table do not match. Please verify the number of line items on each table.");
			}
		}else{
			cancel = true;
			showMessage = true;
			comment("The Small Retail Water Supplier Review Status cannot be marked Complete as at least one of the fields is insufficient.");
		}
	}
	
	if (typeof(APNSPATIALINFORMATION) == "object"){
		if(APNSPATIALINFORMATION.length > 0){
			var premCounty = getAppSpecific("Premise County");
			for(apn in APNSPATIALINFORMATION){
				var apnValid = true;
				var valAPN = APNSPATIALINFORMATION[apn]["Validated APN"];
				if(!matches(valAPN,null,undefined,"")){
					var apnPattern = lookup("Lookup:APN County Format",String(premCounty));
					if (!matches(apnPattern,null,undefined,"")){
						var apnPatternArray = String(apnPattern).split("-");
						var variable1Array = String(valAPN).split("-");
						if (apnPatternArray.length == variable1Array.length){
							for (i = 0; i < apnPatternArray.length; i++) {
								if (apnPatternArray[i].length == variable1Array[i].length){
									continue;
								}else{
									apnValid = false;
								}
								
							}
						}else{
							apnValid = false;
						}
					}
				}
			}
		
			if (!apnValid){
				cancel = true;
				showMessage = true;
				comment("APN does not match " + premCounty + " format - the format should be " + apnPattern + ".");
			}
		}
	}
}catch(err){
	logDebug("An error has occurred in ASIUB:LICENSES/CULTIVATOR/*/APPLICATION: Water Source Reviews: " + err.message);
	logDebug(err.stack);
	aa.sendMail(sysFromEmail, debugEmail, "", "An error has occurred in ASIUB:LICENSES/CULTIVATOR/*/APPLICATION: Water Source Reviews: "+ startDate, capId + br+ err.message+ br+ err.stack);
}
