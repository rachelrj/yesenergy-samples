/*

Send one to three elements to TitleNew.
Left elements are justified left, right elements are justified right, center elements are centered.

	By default, elements are equal width.
	(Take up equal horizontal space)

	For any element, increase relative width by setting '[center|right|left]ColLong=true'
	Can only increase relative width of ONE ELEMENT

	For any element, decrease font size by setting '[center|right|left]SmallText=true'

*/

import {
   React, Button, Icon, BackButton
} from 'reapp-kit';

class TitleNew extends React.Component {

	constructor(props) {
        super(props);

        var leftCol;
  		var rightCol;
  		var centerCol;

  		var smallFontCenter;
  		var smallFontRight;
  		var smallFontLeft;
    }

    propTypes: {
      	centerContent: React.PropTypes.any,
      	leftContent: React.PropTypes.any,
      	rightContent: React.PropTypes.any,
      	centerColLong: React.PropTypes.bool,
      	rightColLong: React.PropTypes.bool,
      	leftColLong: React.PropTypes.bool,
      	centerSmallText: React.PropTypes.bool,
      	leftSmallText: React.PropTypes.bool,
      	rightSmallText: React.PropTypes.bool
    }

  	render() {

        this.leftCol = (typeof(this.props.leftContent) !== "undefined");
  		this.rightCol = (typeof(this.props.rightContent) !== "undefined");
  		this.centerCol = (typeof(this.props.centerContent) !== "undefined");
  		
  		this.smallFontCenter = (this.props.centerSmallText === true);
  		this.smallFontRight = (this.props.rightSmallText === true);
  		this.smallFontLeft = (this.props.leftSmallText === true);

  		var leftColumnStyle;
  		var rightColumnStyle;
  		var centerColumnStyle;

  		//three elements in title bar: left, center, and right
  		if(this.leftCol && this.centerCol && this.rightCol){
  			/*	bar contains twelve columns
  				determine number of columns each element fills
  			*/

  			//left = 3 columns; right = 3 columns; center = 6 columns
			if(this.props.centerColLong === true){
  				leftColumnStyle = styles.threeElements.fourthHalfFourth.left;
  				centerColumnStyle = styles.threeElements.fourthHalfFourth.center;
  				rightColumnStyle = styles.threeElements.fourthHalfFourth.right;
  			}
  			//left = 6 columns; right = 3 columns; center = 3 columns
  			else if(this.props.leftColLong === true){
  				leftColumnStyle = styles.threeElements.halfFourthFourth.left;
  				centerColumnStyle = styles.threeElements.halfFourthFourth.center;
  				rightColumnStyle = styles.threeElements.halfFourthFourth.right;
  			}
  			//left = 3 columns; right = 6 columns; center = 3 columns
  			else if(this.props.rightColLong == true){
  				leftColumnStyle = styles.threeElements.fourthFourthHalf.left;
  				centerColumnStyle = styles.threeElements.fourthFourthHalf.center;
  				rightColumnStyle = styles.threeElements.fourthFourthHalf.right;  				
  			}
  			//left = 4 columns; right = 4 columns; center = 4 columns
  			else {
  				leftColumnStyle = styles.threeElements.thirdThirdThird.left;
  				centerColumnStyle = styles.threeElements.thirdThirdThird.center;
  				rightColumnStyle = styles.threeElements.thirdThirdThird.right;
  			}

  		}
  		//two elements in titlebar: left and center
  		else if(this.centerCol && this.leftCol){

  			/* 	bar contains twelve columns
				determine number of columns each element fills
			*/

			//left = 4 columns; center = 8 columns
			if(this.props.centerColLong === true) {
				centerColumnStyle = styles.twoElements.thirdTwoThirds.centerAlignedRight;
				leftColumnStyle = styles.twoElements.thirdTwoThirds.leftAlignedLeft;
			}
			//left = 8 columns; center = 4 columns
			else if(this.props.leftColLong === true) {
				centerColumnStyle = styles.twoElements.twoThirdsThird.centerAlignedRight;
				leftColumnStyle = styles.twoElements.twoThirdsThird.leftAlignedLeft;
			}
			//left = 6 columns; center = 6 columns
			else {
				centerColumnStyle = styles.twoElements.twoThirdsThird.centerAlignedRight;
				leftColumnStyle = styles.twoElements.twoThirdsThird.leftAlignedLeft;
			}

  		}
  		//two elements in titlebar: center and right
  		else if(this.centerCol && this.rightCol){

  			//center = 8 columns; right = 4 columns
  			if(this.props.centerColLong === true) {
  				centerColumnStyle = styles.twoElements.twoThirdsThird.centerAlignedLeft;
  				rightColumnStyle = styles.twoElements.twoThirdsThird.rightAlignedRight;
  			}
  			//center = 4 columns; right = 8 columns
  			else if(this.props.rightColLong === true) {
  				centerColumnStyle = styles.twoElements.thirdTwoThirds.centerAlignedLeft;
  				rightColumnStyle = styles.twoElements.thirdTwoThirds.rightAlignedRight;
  			}
  			//center = 6 columns; right = 6 columns
  			else {
  				centerColumnStyle = styles.twoElements.halfHalf.centerAlignedLeft;
				rightColumnStyle = styles.twoElements.halfHalf.rightAlignedRight;
  			}
  		}
  		//two elements in titlebar: left and right
  		else if(this.leftCol && this.rightCol){

  			//left = 4 columns; right = 8 columns
  			if(this.props.leftColLong){
  				leftColumnStyle = styles.twoElements.twoThirdsThird.leftAlignedLeft;
  				rightColumnStyle = styles.twoElements.twoThirdsThird.rightAlignedRight;
  			}
  			//left = 8 columns; right = 4 columns
  			else if (this.props.rightColLong){
  				leftColumnStyle = styles.twoElements.thirdTwoThirds.leftAlignedLeft;
  				rightColumnStyle = styles.twoElements.thirdTwoThirds.rightAlignedRight;
  			}
  			//left = 6 columns; right = 6 columns
  			else {
  				leftColumnStyle = styles.twoElements.halfHalf.leftAlignedLeft;
				rightColumnStyle = styles.twoElements.halfHalf.rightAlignedRight;
  			}
  		}
  		//one element in title bar: left
  		else if(this.leftCol){
  			leftColumnStyle = styles.oneElement.leftAlignedCenter;
  		}
  		//one element in title bar: right
  		else if(this.rightCol){
  			rightColumnStyle = styles.oneElement.rightAlignedCenter;
  		}
  		//one element in title bar: center
  		else{
  			centerColumnStyle = styles.oneElement.centerAlignedCenter;
  		}

  		return(

  		<div styles={styles.parentContainer}>
  			{
  				this.centerCol === true && this.smallFontCenter === true &&
					<div className={'titleCenter'} styles={centerColumnStyle}>
						<div styles={styles.smallText}>{this.props.centerContent}</div>
					</div>  				
  			}

  			{
  				this.centerCol === true && this.smallFontCenter === false &&
					<div className={'titleCenter'} styles={centerColumnStyle}>{this.props.centerContent}</div>    				
  			}

  			{
  				this.rightCol === true && this.smallFontRight === true &&
					<div className={'titleRight'} styles={rightColumnStyle}>
						<div styles={styles.smallText}>{this.props.rightContent}</div>
					</div> 				
  			}

  			{
  				this.rightCol === true && this.smallFontRight === false &&
					<div className={'titleRight'} styles={rightColumnStyle}>{this.props.rightContent}</div>
  			}

  			{
  				this.leftCol === true && this.smallFontLeft === true &&
					<div className={'titleLeft'} styles={leftColumnStyle}>
						<div styles={styles.smallText}>{this.props.leftContent}</div>
					</div>
  			}

  			{
  				this.leftCol === true && this.smallFontLeft === false &&
					<div className={'titleLeft'} styles={leftColumnStyle}>{this.props.leftContent}</div>  				
  			}

  		</div>

  		);
  	}
}
export default TitleNew;

const styles = {
	parentContainer: {
		display: 'block',
		width: '100%',
		height: '50px',
		fontSize: '16px',
		lineHeight: '3em',
		paddingLeft: '10px',
		paddingRight: '10px',
		boxShadow: "0 1px 1px -1px gray"
	},
	smallText: {
    	width: '100%',
    	fontSize: '14px',
    	lineHeight: '1em',
    	display: 'inline-block',
    	verticalAlign: 'middle',
    	margin: 'auto'
	},
	threeElements: {
		fourthHalfFourth: {
			center: {
				textAlign: 'center',
				display: 'inline-block',
				width: '50%'
			},
			left: {
				textAlign: 'left',
				float: 'left',
				width: '25%'
			},
			right: {
				textAlign: 'right',
				display: 'inline-block',
				float: 'right',
				width: '25%'
			}
		},
		halfFourthFourth: {
			center: {
				textAlign: 'center',
				display: 'inline-block',
				width: '25%'
			},
			left: {
				textAlign: 'left',
				float: 'left',
				width: '50%'
			},
			right: {
				textAlign: 'right',
				display: 'inline-block',
				float: 'right',
				width: '25%'
			}
		},
		fourthFourthHalf: {
			center: {
				textAlign: 'center',
				display: 'inline-block',
				width: '25%'
			},
			left: {
				textAlign: 'left',
				float: 'left',
				width: '25%'
			},
			right: {
				textAlign: 'right',
				display: 'inline-block',
				float: 'right',
				width: '50%'
			}
		},
		thirdThirdThird: {
			center: {
				textAlign: 'center',
				display: 'inline-block',
				width: '33.4%',
				margin: 'auto'
			},
			left: {
				textAlign: 'left',
				float: 'left',
				width: '33.3%',
				left: '0'
			},
			right: {
				textAlign: 'right',
				display: 'inline-block',
				float: 'right',
				width: '33.3%',
				right: '0'
			}
		}
	},
	twoElements: {
		halfHalf: {
			leftAlignedLeft: {
				textAlign: 'left',
				float: 'left',
				width: '50%',
				left: '0'
			},
			centerAlignedLeft: {
				textAlign: 'center',
				float: 'left',
				width: '50%',
				margin: 'auto'
			},
			rightAlignedRight:{
				textAlign: 'right',
				display: 'inline-block',
				float: 'right',
				width: '50%',
				right: '0'
			},
			centerAlignedRight:{
				textAlign: 'center',
				float: 'right',
				width: '50%',
				margin: 'auto'
			}
		},
		thirdTwoThirds: {
			leftAlignedLeft: {
				textAlign: 'left',
				float: 'left',
				width: '33%',
				left: '0'
			},
			centerAlignedLeft: {
				textAlign: 'center',
				float: 'left',
				width: '33%',
				margin: 'auto'
			},
			rightAlignedRight:{
				textAlign: 'right',
				display: 'inline-block',
				float: 'right',
				width: '66%',
				right: '0'
			},
			centerAlignedRight:{
				textAlign: 'center',
				float: 'right',
				width: '66%',
				margin: 'auto'
			}
		},
		twoThirdsThird: {
			leftAlignedLeft: {
				textAlign: 'left',
				float: 'left',
				width: '66%',
				left: '0'
			},
			centerAlignedLeft: {
				textAlign: 'center',
				float: 'left',
				width: '66%',
				margin: 'auto'
			},
			rightAlignedRight:{
				textAlign: 'right',
				display: 'inline-block',
				float: 'right',
				width: '33%',
				right: '0'
			},
			centerAlignedRight:{
				textAlign: 'center',
				float: 'right',
				width: '33%',
				margin: 'auto'
			}
		}
	},
	oneElement: {
		centerAlignedCenter:{
			width: '100%',
			textAlign: 'center',
			display: 'inline-block',
			margin: 'auto'			
		},
		leftAlignedCenter:{
			width: '100%',
			textAlign: 'left',
			float: 'left',
			left: '0'				
		},
		rightAlignedCenter:{
			width: '100%',
			textAlign: 'right',
			display: 'inline-block',
			float: 'right',
			right: '0'
		}
	}
}