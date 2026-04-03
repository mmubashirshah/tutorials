const cv = require('@techstark/opencv-js');

/**
 * processImage
 *
 * Applies the following sequence of transformations:
 *   1. Grayscale conversion  — reduces RGBA to single brightness channel
 *   2. Adaptive Thresholding — converts to black/white based on local region brightness
 *
 * @param {HTMLImageElement} img - The loaded HTML image element to process
 * @returns {cv.Mat} dst2 - The final processed image as an OpenCV Mat.
 *                          The CALLER is responsible for calling dst2.delete()
 *                          to free memory after use.
 */
function processImage(img) {

    // -------------------------------------------------------------------------
    // Step 1: Read the image into an OpenCV Mat
    // -------------------------------------------------------------------------
    // Reads pixel data from the HTML image element into a Mat (RGBA format).
    let src = cv.imread(img);
    console.log(`  Source image size: ${src.cols}x${src.rows}, channels: ${src.channels()}`);

    // -------------------------------------------------------------------------
    // Step 2: Convert to Grayscale
    // -------------------------------------------------------------------------
    // Converts RGBA (4 channels) to grayscale (1 channel).
    // Required before thresholding, which only works on single-channel images.
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
    console.log("  Applied: Grayscale conversion");

    // -------------------------------------------------------------------------
    // Step 3: Adaptive Thresholding
    // -------------------------------------------------------------------------
    // Unlike standard thresholding (which uses one global brightness cutoff),
    // adaptive thresholding calculates a different threshold for each small region
    // of the image. This handles uneven lighting much better.
    //
    // Parameters:
    //   maxValue   = 200                          — value assigned to pixels that pass
    //   method     = ADAPTIVE_THRESH_GAUSSIAN_C   — threshold based on weighted local average
    //   type       = THRESH_BINARY                — pixels above threshold → maxValue, else 0
    //   blockSize  = 5                            — size of local region (must be odd)
    //   C          = 2                            — constant subtracted from the local mean
    let dst2 = new cv.Mat();
    cv.adaptiveThreshold(dst, dst2, 200, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 5, 2);
    console.log("  Applied: Adaptive thresholding");

    // -------------------------------------------------------------------------
    // Step 4: Free intermediate Mats from memory
    // -------------------------------------------------------------------------
    // OpenCV.js requires manual memory management — delete every Mat when done.
    // dst2 is kept alive and returned to the caller (who must delete it after use).
    src.delete();
    dst.delete();

    return dst2;
}

module.exports = { processImage };