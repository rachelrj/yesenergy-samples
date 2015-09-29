
@Controller
public class MobileServiceFacade implements IMobileServiceFacade {

	@Autowired
	private IConstraintService constraintService;

	@RequestMapping(method = RequestMethod.GET, value = "/constraints/{iso}")
	public MobileConstraint[] getConstraints(@PathVariable("iso") String iso) {
		return getConstraints(iso, "RT");
	}

	@RequestMapping(method = RequestMethod.GET, value = "/constraints/{iso}/{market}")
	public MobileConstraint[] getConstraints(@PathVariable("iso") String iso,
			@PathVariable("market") String market) {
		MobileConstraint[] result = null;
		YesResult yr = null;
		try {
			yr = constraintService.getLatestConstraints(iso, "N", "N", market);
		} catch (Exception e) {
			com.yesenergy.util.Util.logException(e);
		}
		if (yr != null && yr.getRows() > 0) {
			result = new MobileConstraint[yr.getRows()];
			int index = 0;
			for (HashMap<String, Object> row : (ArrayList<HashMap<String, Object>>) yr
					.getResults()) {
				result[index] = new MobileConstraint(row);
				index++;
			}
		}
		return result;
	}
}