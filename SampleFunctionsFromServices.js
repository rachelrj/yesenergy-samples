import statements;
var services = (function () {

var contentInitDone = false;
var timer;
var timerPing;
var pingIntervalSeconds = 60;
var isSearching = false;


function getLatestConstraintsByItem(iso, market){
	superagent('get', url('constraints/'+iso+'/'+market+constants.serverPostfix))
		.then(validResponse, handleServerError)
		.then(data => {
			var constraints = store().get('constraints');
			var key = iso + ":" + market;
			constraints[key] = data;
			store().set('constraints', constraints);
		})
      	.catch(catchError)
		;
}

function getLatestConstraints() {
	if(isSearching === true) {
		Log.log("Skipping getConstraints. User is searching");
		return;
	}
	var items = store().get('selectedDashboardItems');
	var constraints = {};
	if(items !== null && items.length){
		for(var i = 0; i < items.length; i++){
			if(!ObjectUtil.isEmpty(items[i]) && (items[i].feedType.toUpperCase().indexOf("CONSTRAINTS") > -1){
				var iso = items[i].iso;
				var market = "RT";
				if( (typeof(items[i].feedType) === "string") && (items[i].feedType.toUpperCase().indexOf("RTPD") > -1) ) {
					market = "RTPD";
				}
				var key = iso + ":" + market;
				constraints[key] = {iso:iso, market:market};
			}
		}
	}	
	else {
		return;
	}
	for(var key in constraints){
		getLatestConstraintsByItem(constraints[key].iso, constraints[key].market);
    }
}

    // The public API
    return {
        initMobileApp: initMobileApp,
        loadLatestTickDetail: loadLatestTickDetail,
        loadDashboard: getSelectedDashboardItems,
        getDashboardList: getDashboardList,
        getMobileConfiguration: getMobileConfiguration,
        loadLatestTicks: getLatestTicks,
        getDashboardById : getDashboardById,
        doSearch: doSearch,
        saveUserDashboards: saveUserDashboards,
        setRefreshIntervalSecs: setRefreshIntervalSecs,
        setLastDashboardId: setLastDashboardId,
        refreshSelectedDashboardViewData: refreshSelectedDashboardViewData,
        completeSearch: completeSearch,
        pauseDashboardItemRequests: pauseDashboardItemRequests,
        resumeDashboardItemRequests: resumeDashboardItemRequests,
        getLatestTickDescription: getLatestTickDescription,
        setAvailableSeries: setAvailableSeries
    };

}());

export default services;