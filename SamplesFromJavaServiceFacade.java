Sample code from a React jsx component.
Taken with permission from Yes Energy.

@Controller
public class MobileServiceFacade implements IMobileServiceFacade {

	@Autowired
	private IConstraintService constraintService;

	@Autowired
	private IDataSeriesSearchService dataSeriesSearchService;

	@RequestMapping(method = RequestMethod.GET, value = "/constraints/{iso}")
	public MobileConstraint[] getConstraints(@PathVariable("iso") String iso) {
		return getConstraints(iso, "RT");
	}

	@RequestMapping(method = RequestMethod.GET, value = "/constraints/{iso}/{market}")
	public MobileConstraint[] getConstraints(@PathVariable("iso") String iso,
			@PathVariable("market") String market) {
		MobileConstraint[] result = null;
		YesResult<ArrayList<HashMap<String, Object>>> yr = null;
		try {
			yr = constraintService.getLatestConstraints(iso, "N", "N", market);
		} catch (Exception e) {
			com.yesenergy.util.Util.logException(e);
		}
		if (yr != null && yr.getRows() > 0) {
			result = new MobileConstraint[yr.getRows()];
			int index = 0;
			for (HashMap<String, Object> row : yr.getResults()) {
				result[index] = new MobileConstraint(row);
				index++;
			}
		}
		return result;
	}


	private ArrayList<MobileDashBoardItem> createDashboardItemListFromSearchResult(YesResult yr){
		ArrayList<MobileDashBoardItem> res = new ArrayList<MobileDashBoardItem>();
		MobileDashBoardItem item = null;
		for (int index = 0; index < yr.getRows(); index++) {
			item = dataSeriesSearchCache.getDashBoardItemFromSearch(yr, index);
			res.add(item);
			if (index > MAX_SEARCH)
				break;
		}

		return res;	
	}

	private ArrayList<MobileDashBoardItem> findNew(String searchString) {
		YesResult yr = dataSeriesSearchService.searchAllObjects("%", "QS_MOBILE", searchString, sec.getUserId());
		return createDashboardItemListFromSearchResult(yr);
	}
	
	private ArrayList<MobileDashBoardItem> findNew(String searchString, String isoString) {
		YesResult yr = dataSeriesSearchService.searchAllObjects(isoString, "QS_MOBILE", searchString, sec.getUserId());
		return createDashboardItemListFromSearchResult(yr);
	}
	
	private ArrayList<MobileDashBoardItem> findNew(String searchString, String isoString, Long dataTypeID) {
		if(searchString == null){
			searchString = "%";
		}
		if(isoString == null){
			isoString = "%";
		}
		YesResult yr = dataSeriesSearchService.searchDataSeriesObjects(isoString, "QS_MOBILE", dataTypeID, searchString);
		return createDashboardItemListFromSearchResult(yr);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/searchnew/items")
	// @Secured({"ROLE_BASE"})	
	public MobileDashBoardItem[] searchNew(
			@RequestParam(value = "series", required = false) Long dataType,
			@RequestParam(value = "iso", required = false) String isoString,
			@RequestParam(value = "search", required = false) String searchString) {
	
		//if all parameters are null besides ISO, do not bother to search
		ArrayList<MobileDashBoardItem> res = new ArrayList<MobileDashBoardItem>();
		if(dataType == null && searchString == null){
			return null;
		}
		
		if(dataType == null){
			if(isoString == null){
				res = findNew(searchString);
			}
			else {
				res = findNew(searchString, isoString);
			}
		}
		else {
			res = findNew(searchString, isoString, dataType);
		}
		
		return (MobileDashBoardItem[]) res.toArray(new MobileDashBoardItem[1]);
	}
