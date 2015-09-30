import statements;

img & icon constants;

class Search extends React.Component {

    constructor(props) {
        super(props);
        var searchResults = null;
        var cancelButton;
        this.state = {
          searching: false,
          hasSearched: false,
          showModal: false,
          isoValue: 'ALL',
          seriesValue: 'ALL',
          selectingSeries: false,
          selectingISO: false,
          loadingISOs: true,
          loadingSeries: true
        };
        var seriesID = null;
        var yesImage;
        var availableISOs = null;
        var availableSeries;
        var seriesUnavailableForSelectedISO = false;
        var search = null;
    }

	propTypes: {
        handleAdd: React.PropTypes.func,
	   handleCancel: React.PropTypes.func
	}

	state getters & setters() {

        example:
        openModal() {
            this.setState({ showModal: true});
        }
	}

	componentWillMount() {
    	this.action.getAvailableISOsForSearchAction()
        	.then((result) => {
            	this.availableISOs = result;
        	});
    	this.availableSeries = this.action.getAvailableSeriesForSearchAction();
    	this.backButton = <BackButton iconProps={{ size: 24, stroke: 1}}
        		onTap={this.goBack.bind(this)}
        		chromeless/>;
    	this.backDiv = <div className={'backButton'}>{this.backButton}</div>;
    	this.yesImage = <img src={yesLogo}/>;
    	this.learnMoreButton = <Button
        		iconProps={{  file: learnMoreIcon, size: 24, stroke: 1}}
        		onTap={this.openModal.bind(this)}
        		chromeless/>;
    	this.modalTitleForDashboardAddingMode = "Add an Item";
    	this.modalMessageForDashboardAddingMode = "Instructions for Search";
	}

	goBack() {
    	this.props.handleCancel();
	}

    //run new search if the search filters change
    componentDidUpdate(prevProps, prevState) {
        //if new ISO filter, keep previous search term
        if(this.state.isoValue !== prevState.isoValue){

            if(ObjectUtil.isNotNull(this.search)){
                this.refs.searchField.getDOMNode().value = this.search;
            }

            //get the available data series for the newly selected ISO
            this.action.getAvailableSeriesForSearchAction(this.state.isoValue)
                .then( (availableSeries) => {
                    this.availableSeries = availableSeries;
            });

            //check if the selected data series is available for the newly selected ISO 
            if(this.state.seriesValue === 'ALL'){
                this.seriesUnavailableForSelectedISO = false;
            }
            else {
                this.action.getSeriesIDFromSeriesName(this.state.seriesValue)
                    .then( (result) => {
                        if(result === null){
                            this.seriesUnavailableForSelectedISO = true;
                        }
                        else {
                            this.seriesUnavailableForSelectedISO = false;
                            this.seriesID = result;
                        }
                    });
            }
            //always search if ISO changes
            this.handleSearch();
        }
        //if user selected a new data series, keep the search term that the user left off with
        else if(this.state.seriesValue !== prevState.seriesValue){
            //if new Series filter, keep previous search term
            if(ObjectUtil.isNotNull(this.search)){
                this.refs.searchField.getDOMNode().value = this.search;
            }
            //always search if series changes
            this.handleSearch();
        }
    }

    searchDone(searchResults) {
        this.setState({searching: false});
        this.action.completeSearchAction();
    }

    handleSearch() {
        //dont even bother trying if the selected series is not available for the selected ISO
        if(this.seriesUnavailableForSelectedISO === true){
            this.searchResults = null;
            return;
        }

        var search = this.search = this.refs.searchField.getDOMNode().value;
        var selectedISO = this.state.isoValue;
        var selectedSeries = this.seriesID;
        var query = {selectedISO:selectedISO, selectedSeries:selectedSeries, search:search};

        if (ObjectUtil.isNotNull(query.search) || ObjectUtil.isNotNull(query.selectedSeries)) {
            this.setState({hasSearched: true});
            this.setState({searching: true});
            this.action.doSearch(query)
                .then( (results) => {
                    this.searchResults = results;
                })
                .then(this.searchDone.bind(this));
        }
        else {
            this.searchResults = null;
            this.searchDone();
        }
    }

    handleAdd(widget) {
        this.action.addWidget(widget);
        this.props.handleAdd(widget);
    }

    handleCancel() {
        this.setState({hasSearched: false});
        this.searchResults = null;
        this.refs.searchField.getDOMNode().value = "";
        this.handleSearch();
    }

    handleISOChange(iso) {
        this.setState({selectingISO: false});
        this.setState({isoValue: iso});
    }

    //if user changes series, get and set the series ID.
    //then, update the series selection states
    handleSeriesChange(series) {
        if(series === 'ALL'){
            this.seriesUnavailableForSelectedISO = false;
            this.seriesID = null;
            this.setState({selectingSeries: false});
            this.setState({seriesValue: series});
            return;          
        }  

        this.action.getSeriesIDFromSeriesName(series)
        .then( (result) => {
            if(result === null){
                this.seriesUnavailableForSelectedISO = false;
                this.seriesID = null;
            } else {
                this.seriesUnavailableForSelectedISO = false;
                this.seriesID = result;
            }
        })
        .then(() => {
            this.setState({selectingSeries: false});
            this.setState({seriesValue: series});
        });
    }

    render() {

        //Create the series searching artifacts
        var searchHandler = FunctionUtil.debounce(this.handleSearch.bind(this), 750);
        var searchText = 'Search';
        var searchField = <input type="search" ref='searchField' style={styles.inputStyles} onChange={searchHandler}></input>;
        var searchBar =
            <div style={{height: '100%'}}>
                <div style={{textAlign:'left', float:'left', display:'inline-block', width:'50px', marginRight:'10px'}}>
                    {searchText}
                </div>
                <div style={{textAlign: 'right', overflow:'hidden', marginTop:'7.5px', marginBottom:'7.5px'}}>
                    {searchField}
                </div>
            </div>;

        var isoText = 'ISO';
        var isoChangeText = 'Change';
        var isoSelector = <input type="text" value={this.state.isoValue} styles={styles.disabledInputStyles} disabled></input>;
        var isoChange = <a style={{textDecoration:"underline"}} onClick={this.setSelectingISO.bind(this)}>{isoChangeText}</a>;

        var isoFieldBar =
            <div style={{height: '100%'}}>
                <div style={{textAlign:'right', float:'right', display:'inline-block', width:'60px', margin:'auto'}}>
                    {isoChange}
                </div>
                <div style={{textAlign:'left', float:'left', display:'inline-block', width:'50px', marginRight:'10px'}}>
                    {isoText}
                </div>
                <div style={{overflow:'hidden', textAlign:'right', marginBottom:'7.5px', marginTop:'7.5px'}}>
                    {isoSelector}
                </div>
            </div>;

        var seriesText = 'Series';
        var seriesChangeText = 'Change';
        var seriesSelector = <input type="text" value={this.state.seriesValue} styles={styles.disabledInputStyles} disabled></input>;
        var seriesChange = <a style={{textDecoration:"underline"}} onClick={this.setSelectingSeries.bind(this)}>{seriesChangeText}</a>

        var seriesFieldBar =
            <div style={{height: '100%'}}>
                <div style={{textAlign:'right', float:'right', display:'inline-block', width:'60px', margin:'auto'}}>
                    {seriesChange}
                </div>
                <div style={{textAlign:'left', float:'left', display:'inline-block', width:'50px', marginRight:'10px'}}>
                    {seriesText}
                </div>
                <div style={{overflow:'hidden', textAlign:'right', marginBottom:'7.5px', marginTop:'7.5px'}}>
                    {seriesSelector}
                </div>
            </div>;


    return (
            <div>

                { this.state.selectingISO === false && this.state.selectingSeries === false &&

                <TitleNew leftContent={this.backDiv} centerContent={this.yesImage} rightContent={this.learnMoreButton} centerColLong={true}></TitleNew>

                }

                {
                    this.state.showModal === true && this.state.selectingISO === false &&
                    <Modal
                    title={this.modalTitleForDashboardAddingMode}
                    message={this.modalMessageForDashboardAddingMode}
                    type="alert"
                    closeFunction={this.closeModal.bind(this)}/>
                }

                {
                    this.state.selectingISO === true &&
                    <ISOSelector availableISOs={this.availableISOs} unsetSelectingISO={this.unsetSelectingISO.bind(this)} handleISOChange={this.handleISOChange.bind(this)}/>
                }

                {
                    this.state.selectingSeries === true &&
                    <SeriesSelector selectedISO={this.state.isoValue} handleSeriesChange={this.handleSeriesChange.bind(this)} unsetSelectingSeries={this.unsetSelectingSeries.bind(this)}/>
                }

                {
                    this.state.selectingISO === false && this.state.selectingSeries === false &&

                    <div>

                        <TitleNew leftContent={isoFieldBar}></TitleNew>

                        <TitleNew leftContent={seriesFieldBar}></TitleNew>

                        <TitleNew leftContent={searchBar}></TitleNew>


                        {
                            this.state.searching === true && 
                            <LoadingIcon/>
                        }

                        {
                            this.state.searching === false && !ObjectUtil.isArray(this.searchResults) && this.state.hasSearched === false &&
                            <div style={{padding:'10px', color:"#307cff", textAlign:'center', fontSize:16}}>
                                {this.modalMessageForDashboardAddingMode}
                            </div>
                        }

                        {
                            this.state.searching === false && 
                            ObjectUtil.isArray(this.searchResults) && this.searchResults[0] == undefined &&
                            <div style={{padding:'10px', color:"#307cff", textAlign:'center', fontSize:16}}>
                                No results found.
                            </div>
                        }

                        {
                            this.state.searching === false && this.seriesUnavailableForSelectedISO === true &&
                            <div style={{padding:'10px', color:"#307cff", textAlign:'center', fontSize:16}}>
                                The selected series is not available for the selected ISO.
                            </div>   
                        }

                        <List>
                        
                            {ObjectUtil.isArray(this.searchResults) && this.searchResults.map(widget =>
                                
                                { 
                                    if (!ObjectUtil.isEmpty(widget)) {
                                        return <SearchDashboardItem key={widget.id} widget={widget} handleAdd={this.handleAdd.bind(this,widget)}/>;
                                    }
                                    else {
                                        return null;
                                    }
                                }
                            )} 

                        </List>

                    </div>
                }

            </div>
        );

    }
}

export default Search;

const styles = {
    helpfulText: {
        padding:'10px', 
        color:"#307cff", 
        textAlign:'center', 
        fontSize:'16px'
    },
    inputStyles: {
        width:'100%', 
        height:'35px', 
        fontSize:'20px',
        color:'black'
    },
    disabledInputStyles: {
        width:'100%', 
        height:'35px', 
        fontSize:'20px', 
        color:'black', 
        backgroundColor:'#d3d3d3', 
        border:'1px solid #a9a9a9', 
        padding: '3px'
    }
}