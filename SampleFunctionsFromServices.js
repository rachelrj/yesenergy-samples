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

function doSearch(query) {


	if(lastSearch !== undefined && lastSearch !== null){
		if(typeof(lastSearch.then) === "function") {
			lastSearch.cancel();
		}
	}

	//cannot search without a query
	if(ObjectUtil.isNull(query)){
		return;
	}

	var isoFilterIsDefined = (ObjectUtil.isNotNull(query.selectedISO) && query.selectedISO.toUpperCase() !== 'ALL');
	var datatypeFilterDefined = (ObjectUtil.isNotNull(query.selectedSeries));
	var queryDefined = (ObjectUtil.isNotNull(query.search) && query.search.trim() !== "");

	//cannot search with just iso
	if(!queryDefined && !datatypeFilterDefined){
		return;
	}

	var isoParam = isoFilterIsDefined ? "iso="+query.selectedISO+"&" : "";
	var seriesParam = datatypeFilterDefined ? "series="+query.selectedSeries+"&" : "";
	var searchParam = queryDefined ? "search="+query.search+"&" : "";

	var str = searchParam + isoParam + seriesParam;

	if(str.length > 0){
		str = str.substring(0, str.length-1);
	}

	return lastSearch = superagent('get', url('searchnew/items'+constants.serverPostfix+'?'+str))
  		.then(validResponse, handleServerError)
		.catch(catchError);
}

function completeSearch(){
	lastSearch = null;
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