function updateLicCase(licNbr, capId) {
// Link Case record to License record as a child
	var parentAltId = licNbr
	parentId = aa.cap.getCapID(parentAltId).getOutput();
	aa.cap.createAppHierarchy(parentId,capId);
	
// Set alt id for the case record based on the number of child case records linked to the license record	
	cIds = getChildren("Licenses/Cultivator/License Case/*",parentId);
	if(matches(cIds, null, "", undefined)) 
		amendNbr = amendNbr = "000" + 1;
	else {
		cIdLen = cIds.length
		if(cIds.length <= 9)
			amendNbr = "000" +  cIdLen;
		else
			if(cIds.length <= 99)
				amendNbr = "00" +  cIdLen;
			else
				if(cIds.length <= 999)
					amendNbr = "00" +  cIdLen;
				else
					amendNbr = cIdLen
	}
	altId = capId.getCustomID();
	yy = altId.substring(0,2);
	newAltId = parentId.getCustomID() + "-LC"+ yy + "-" + amendNbr;
	var updateResult = aa.cap.updateCapAltID(capId, newAltId);
	if (updateResult.getSuccess()) 
		logDebug("Updated amendment record AltId to " + newAltId + ".");
	else 
		logDebug("Error renaming amendment record " + capId);
	
			
// Copy the Designated resposible Party contact from the License Record to the Case record
	copyContactsByType_rev(parentId,capId,"Designated Responsible Party");
	
// Copy custom fields from the license record to the Case record
	PInfo = new Array;
	loadAppSpecific(PInfo,parentId);
	editAppSpecific("License Type",PInfo["License Type"],capId);
	editAppSpecific("Legal Business Name",PInfo["Legal Business Name"],capId);
	editAppSpecific("Premises City",PInfo["Premise City"],capId);
	editAppSpecific("Premises County",PInfo["Premise County"]);
	editAppSpecific("Local Authority Type",PInfo["Local Authority Type"],capId);
	editAppSpecific("Type of License",PInfo["License Issued Type"],capId);
	editAppSpecific("License Start Date",PInfo["Valid From Date"],capId);
	editAppName(AInfo["Case Renewal Type"],capId);
	
// Add Condition
	if(AInfo["Case Opened By"] == "Science - Provisional") {
		if(!appHasCondition("Notice","Applied","Provisional Science Licensing Action in Process","Notice")) {
			addStdCondition("Notice","Provisional Science Licensing Action in Process",parentId);
		}
	}
}	
