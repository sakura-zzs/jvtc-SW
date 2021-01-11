/*
 * @Author: bucai
 * @Date: 2021-01-11 14:01:02
 * @LastEditors: bucai
 * @LastEditTime: 2021-01-11 14:10:07
 * @Description: 
 */
/**
 * Created by Troy W. on 6/7/17.
 * Contributors:
 */

declare module 'opencv'
{
	/**
	 * TODO functions with arguments of ...unknown:any[] have not yet been tested/written --- TWW
	 */
	export class VideoCapture {
		/**
		 * Construct a new video capture object
		 * @param deviceNumOrFilename device number (as enumerated by the system) or the filename of a saved video file.
		 */
		constructor(deviceNumOrFilename: number | string);

		/**
		 * Asynchronously read the next frame image
		 * @param cb callback for handling the matrix data
		 */
		read (cb: (err: any, mat: Matrix) => void): void;

		setWidth (...unknown: any[]): any;

		setHeight (...unknown: any[]): any;

		setPosition (...unknown: any[]): any;

		getFrameAt (...unknown: any[]): any;

		getFrameCount (...unknown: any[]): any;

		release (...unknown: any[]): any; 1

		/**
		 * Synchronously read the next frame matrix
		 * @constructor
		 */
		ReadSync (): Matrix;

		grab (...unknown: any[]): any;

		retrieve (...unknown: any[]): any;
	}

	export class Matrix {
		/**
		 * Construct a new matrix
		 * @param rowsOrHeight number of rows for the matrix
		 * @param colsOrWidth number of cols for the matrix
		 */
		constructor(rowsOrHeight: number, colsOrWidth: number);

		/**
		 * Get a certain row in the matrix
		 * @param iRow row number (somewhere along the height)
		 */
		row (iRow: number): number[];

		/**
		 * Get a certain column in the matrix
		 * @param jCol col number (somewhere along the width)
		 */
		col (jCol: number): number[];

		/**
		 * Get a certain row of pixels (rgb values) in the matrix (rgb values not grouped)
		 * @param iRow row number (somewhere along the height)
		 */
		pixelRow (iRow: number): number[];

		/**
		 * Get a certain col of pixels (rgb values) in the matrix (rgb values not grouped)
		 * @param jCol col number (somewhere along the width)
		 */
		pixelCol (jCol: number): number[];

		empty (...unknown: any[]): any;

		/**
		 * Get a certain pixel (float value) in the matrix
		 * @param iRow row number
		 * @param jCol col number
		 */
		get (iRow: number, jCol: number): number;

		set (...unknown: any[]): any;

		put (...unknown: any[]): any;

		brightness (...unknown: any[]): any;

		normalize (...unknown: any[]): any;

		norm (...unknown: any[]): any;

		getData (...unknown: any[]): any;

		/**
		 * Get a certain pixel (rgb value) in the matrix
		 * @param iRow
		 * @param jCol
		 */
		pixel (iRow: number, jCol: number): [number, number, number];

		/**
		 * Return the width of the matrix (number of columns)
		 */
		width (): number;

		/**
		 * Return the height of the matrix (number of rows)
		 */
		height (): number;

		/**
		 * Return the height of the matrix as [rows, cols]
		 */
		size (): [number, number];

		clone (...unknown: any[]): any;

		crop (...unknown: any[]): any;

		toBuffer (): Buffer;

		toBufferAsync (...unknown: any[]): any;

		ellipse (...unknown: any[]): any;

		rectangle (...unknown: any[]): any;

		/**
		 * Draw a red line on the matrix
		 * @param pt1 point 1, format of [ jCol, iRow ]
		 * @param pt2 point 2, format of [ jCol, iRow ]
		 */
		line (pt1: [number, number], pt2: [number, number]): void;

		fillPoly (...unknown: any[]): any;

		/**
		 * Save the matrix as a jpg image
		 * @param filename ex. './test_image.jpg' or path.join(__dirname, 'test_image.jpg');
		 */
		save (filename: string): number;

		saveAsync (...unknown: any[]): any;

		resize (...unknown: any[]): any;

		rotate (...unknown: any[]): any;

		warpAffine (...unknown: any[]): any;

		copyTo (...unknown: any[]): any;

		convertTo (...unknown: any[]): any;

		pyrDown (...unknown: any[]): any;

		pyrUp (...unknown: any[]): any;

		channels (...unknown: any[]): any;

		convertGrayscale (): void;

		convertHSVscale (...unknown: any[]): any;

		gaussianBlur (...unknown: any[]): any;

		medianBlur (...unknown: any[]): any;

		bilateralFilter (...unknown: any[]): any;

		sobel (...unknown: any[]): any;

		copy (...unknown: any[]): any;

		flip (...unknown: any[]): any;

		roi (...unknown: any[]): any;

		ptr (...unknown: any[]): any;

		absDiff (...unknown: any[]): any;

		addWeighted (...unknown: any[]): any;

		bitwiseXor (...unknown: any[]): any;

		bitwiseNot (...unknown: any[]): any;

		bitwiseAnd (...unknown: any[]): any;

		countNonZero (...unknown: any[]): any;

		moments (...unknown: any[]): any;

		canny (...unknown: any[]): any;

		dilate (...unknown: any[]): any;

		erode (...unknown: any[]): any;

		findContours (...unknown: any[]): any;

		drawContour (...unknown: any[]): any;

		drawAllContours (...unknown: any[]): any;

		goodFeaturesToTrack (...unknown: any[]): any;

		houghLinesP (...unknown: any[]): any;

		crop (...unknown: any[]): any;

		houghCircles (...unknown: any[]): any;

		inRange (...unknown: any[]): any;

		adjustROI (...unknown: any[]): any;

		locateROI (...unknown: any[]): any;

		threshold (...unknown: any[]): this;

		adaptiveThreshold (...unknown: any[]): any;

		meanStdDev (...unknown: any[]): any;

		cvtColor (...unknown: any[]): any;

		split (...unknown: any[]): any;

		merge (...unknown: any[]): any;

		equalizeHist (...unknown: any[]): any;

		floodFill (...unknown: any[]): any;

		matchTemplate (...unknown: any[]): any;

		matchTemplateByMatrix (...unknown: any[]): any;

		templateMatches (...unknown: any[]): any;

		minMaxLoc (...unknown: any[]): any;

		pushBack (...unknown: any[]): any;

		putText (...unknown: any[]): any;

		getPerspectiveTransform (...unknown: any[]): any;

		warpPerspective (...unknown: any[]): any;

		copyWithMask (...unknown: any[]): any;

		setWithMask (...unknown: any[]): any;

		meanWithMask (...unknown: any[]): any;

		mean (...unknown: any[]): any;

		shift (...unknown: any[]): any;

		reshape (...unknown: any[]): any;

		release (...unknown: any[]): any;

		subtract (...unknown: any[]): any;

		static Zeros (...unknown: any[]): any;

		static Ones (...unknown: any[]): any;

		/**
		 * Return an identity matrix
		 * @param rows
		 * @param cols
		 * @constructor
		 */
		static Eye (rows: number, cols: number): Matrix;

		static getRotationMatrix2D (...unknown: any[]): any;
	}

	/**
	 * Read a filename/buffer into a matrix
	 * @param filenameOrBuffer name of the file or a buffer object to load
	 * @param cb callback for handling the matrix data
	 */
	export function readImage (filenameOrBuffer: string | Buffer, cb: (err: any, mat: Matrix) => void): void;
}