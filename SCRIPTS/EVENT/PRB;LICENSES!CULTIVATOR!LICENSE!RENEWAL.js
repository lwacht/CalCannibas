try{
	if(balanceDue>0 && !isTaskComplete("Renewal Review")){
		activateTask("Renewal Review")
		updateAppStatus("Fee Paid", "Updated via PRB:LICENSES/CULTIVATOR/*/Renewal.");
		
		}else{
		
		updateAppStatus("Submitted", "Updated via PRB:LICENSES/CULTIVATOR/*/Renewal.");
	}
}catch(err){
	logDebug("An error has occurred in PRB:LICENSES/CULTIVATOR/*/Renewal: Renewal Fees Paid:  " + err.message);
	logDebug(err.stack);
}