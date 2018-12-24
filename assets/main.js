let page
let cameraFrontBack = 'front'
let chosenCanvas

function init() {
    console.log('init')
    page = getPageElements()

    const divWidth = page.leftImageDivElm.clientWidth
    const computedHeight = getNewImageHeight(page.sampleHeadshotElm, divWidth)

    page.computedImageWidth = divWidth
    page.computedImageHeight = computedHeight

    console.log(`computed w h ${page.computedImageWidth} ${page.computedImageHeight}`)

    page.leftImageDivElm.style.height = `${page.sampleHeadshotElm.height * (divWidth / page.sampleHeadshotElm.width)}px`
    page.rightImageDivElm.style.height = `${page.sampleHeadshotElm.height * (divWidth / page.sampleHeadshotElm.width)}px`
    page.leftImageCanvasCtx.drawImage(page.sampleHeadshotElm, 0, 0, page.leftImageCanvasElm.width, page.leftImageCanvasElm.height)
    page.rightImageCanvasCtx.drawImage(page.sampleHeadshotElm, 0, 0, page.rightImageCanvasElm.width, page.rightImageCanvasElm.height)
    page.leftImageDivElm.addEventListener('click', handleImageTouch)
    page.rightImageDivElm.addEventListener('click', handleImageTouch)
    page.cameraDirectionBtn.addEventListener('click', handleCameraDir)
    page.mainCameraIcon.addEventListener('click', takePicture)
    page.compareBtn.addEventListener('click', handleCompare)
    page.compareMenuButton.addEventListener('click', handleCompareMenu)
    page.happySadButton.addEventListener('click', handleHappySadMenu)
    page.happySadCameraIcon.addEventListener('click', handleHappySadTakePicture)
    page.burger.addEventListener('click', handleBurger)

    // this is hacky
    page.leftImageCanvasElm.style.height = '100%'
    page.rightImageCanvasElm.style.height = '100%'
}

const frontConstraints = {
    audio: false,
    video: {
        facingMode: 'user'
    }
}

const backConstraints = {
    audio: false,
    video: {
        facingMode: 'environment'
    }
}

function hideAllPages() {
    page.mainMenuPage.style.display = 'none'
    page.happySadPage.style.display = 'none'
    page.resultsPage.style.display = 'none'
    page.previewPage.style.display = 'none'
}

function handleBurger() {
    console.log('burger')
    stopAllVideo()
    hideAllPages()
    page.mainMenuPage.style.display = 'flex'
}

function handleCompareMenu() {
    page.mainMenuPage.style.display = 'none'
    hideAllPages()
    showResultsPage()
}

function handleHappySadRedo() {
    handleHappySadMenu()
}

function handleHappySadMenu() {
    hideAllPages()
    page.mainMenuPage.style.display = 'none'
    page.happySadPage.style.display = 'flex'
    page.redo.addEventListener('click', handleHappySadRedo)
    clearStats()
    showHappySadVideoPreview()
}

function clearStats() {
    page.happySadStats.style.display='none'
    while (page.happySadStats.firstChild) {
        page.happySadStats.removeChild(page.happySadStats.firstChild)
    }
}

async function handleHappySadTakePicture() {
    page.happySadCanvas.width = page.happySadVideoPreview.videoWidth
    page.happySadCanvas.height = page.happySadVideoPreview.videoHeight

    page.happySadFaceGeoCanvas.width = page.happySadVideoPreview.videoWidth
    page.happySadFaceGeoCanvas.height = page.happySadVideoPreview.videoHeight

    // page.happySadCanvas.height = page.happySadVideoPreview.videoHeight * (page.body.clientWidth / page.happySadVideoPreview.videoWidth )
    // page.happySadCanvas.height = 400
    console.log(`canvas w h ${page.happySadCanvas.width} ${page.happySadCanvas.height}`)
    console.log(`canvas client w h ${page.happySadCanvas.clientWidth} ${page.happySadCanvas.clientHeight}`)
    console.log(`canvas scroll w h ${page.happySadCanvas.scrollWidth} ${page.happySadCanvas.scrollHeight}`)
    console.log(`canvas offset w h ${page.happySadCanvas.offsetWidth} ${page.happySadCanvas.offsetHeight}`)

    const canvasCtx = page.happySadCanvas.getContext('2d')
    page.happySadCanvasDiv.style.display = 'block'
    canvasCtx.drawImage(page.happySadVideoPreview, 0, 0)
    page.happySadVideoPreview.style.display = 'none'

    page.happySadVideoPreview.pause()
    page.happySadVideoPreview.srcObject.getTracks()[0].stop()

    console.log('drawingCanvasBEFORE', page.happySadFaceGeoCanvas.getContext)
    page.happySadFaceGeoCanvas.getContext('2d');

    const resultJSON = await doHappySadFaceAnalysis(page.happySadCanvas.toDataURL())
    console.log('resultJSON', resultJSON)
    if (resultJSON && resultJSON.FaceDetails && resultJSON.FaceDetails.length > 0) {
        drawFaceLandmarks(resultJSON.FaceDetails[0].Landmarks, page.happySadFaceGeoCanvas)
        drawFaceBox(resultJSON.FaceDetails[0].BoundingBox, page.happySadFaceGeoCanvas)
        addFaceStats(resultJSON.FaceDetails[0])
    }
}

function drawFaceBox(boundingBox, drawingCanvas) {
    const faceGeoContext = drawingCanvas.getContext('2d');
    faceGeoContext.beginPath()
    faceGeoContext.lineWidth = 5
    faceGeoContext.strokeStyle = '#0000ff'
    faceGeoContext.rect(
        boundingBox.Left * drawingCanvas.width,
        boundingBox.Top * drawingCanvas.height,
        boundingBox.Width * drawingCanvas.width,
        boundingBox.Height * drawingCanvas.height
    )
    faceGeoContext.stroke()
}

function drawFaceLandmarks(landmarks, drawingCanvas) {
    const faceGeoContext = drawingCanvas.getContext('2d');

    (landmarks || []).forEach(point => {
        let xCoord = Math.floor(point.X * drawingCanvas.width)
        let yCoord = Math.floor(point.Y * drawingCanvas.height)
        faceGeoContext.beginPath()
        faceGeoContext.arc(xCoord, yCoord, 2, 0, 2 * Math.PI, false)
        faceGeoContext.lineWidth = 5
        faceGeoContext.strokeStyle = '#00ff00'
        faceGeoContext.stroke()
    })
}




function addStat(label, value) {
    const newStat = document.createElement('div')
    newStat.classList.add('stat')
    const newLabel = document.createElement('div')
    newLabel.classList.add('label')
    newLabel.innerHTML = label
    const newValue = document.createElement('div')
    newValue.classList.add('value')
    newValue.innerHTML = value

    newStat.appendChild(newLabel)
    newStat.appendChild(newValue)

    page.happySadStats.appendChild(newStat)
}

function addFaceStats(faceDetails) {
    page.happySadStats.style.display='flex'
    addStat(`Age Range`, `${faceDetails.AgeRange.Low} - ${faceDetails.AgeRange.High}`)
    addStat(`Gender`, `${faceDetails.Gender.Value} ${faceDetails.Gender.Confidence.toFixed(0)}%`)
    faceDetails.Emotions.forEach(e => {
        addStat(`${e.Type}`, `${e.Confidence.toFixed(0)}%`)
    })
    addStat(`Eyeglasses`, `${faceDetails.Eyeglasses.Value}`)
    addStat(`Sunglasses`, `${faceDetails.Sunglasses.Value}`)
    addStat(`Smile`, `${faceDetails.Smile.Value} ${faceDetails.Smile.Confidence.toFixed(0)}%`)
    addStat(`Mustache`, `${faceDetails.Mustache.Value} ${faceDetails.Mustache.Confidence.toFixed(0)}%`)
    addStat(`Beard`, `${faceDetails.Beard.Value} ${faceDetails.Beard.Confidence.toFixed(0)}%`)
    addStat(`Mouth Open`, `${faceDetails.MouthOpen.Value} ${faceDetails.MouthOpen.Confidence.toFixed(0)}%`)
    addStat(`Eyes Open`, `${faceDetails.EyesOpen.Value} ${faceDetails.EyesOpen.Confidence.toFixed(0)}%`)
}


function doHappySadFaceAnalysis(imageURL) {
    return fetch('/doFaceAnalysis', {
        method: 'POST',
        body: imageURL
    }).then(response => {
        if (!response.ok) {
            console.log('error in doFaceAnalysisPost', response)
        }
        return response.json()
    })
}

function handleCompare() {
    const post = {
        leftImage: page.leftImageCanvasElm.toDataURL(),
        rightImage: page.rightImageCanvasElm.toDataURL()
    }

    fetch('/doCompare', {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
            'content-type': 'application/json'
        }
    }).then(result => {
        return result.json()
    }).then(json => {
        console.log('compareResult', json)

        drawFaceBox(json.SourceImageFace.BoundingBox, page.leftImageCanvasElm)
        drawFaceBox(json.FaceMatches[0].Face.BoundingBox, page.rightImageCanvasElm)
        drawFaceLandmarks(json.FaceMatches[0].Face.Landmarks, page.rightImageCanvasElm)


        let simValue
        if (json.FaceMatches && json.FaceMatches.length > 0) {
            simValue = json.FaceMatches[0].Similarity
        } else if (json.UnmatchedFaces && json.UnmatchedFaces.length > 0) {
            simValue = json.UnmatchedFaces[0].Similarity
        } else {
            simValue = '--'
        }

        page.similarityValue.innerHTML = `${simValue}`
    })
}

function handleCameraDir() {
    cameraFrontBack = cameraFrontBack === 'front' ? 'back' : 'front'
    showVideoPreview()
}

function setImageIndexField() {
    imageIndexField.innerHTML = imageIndex === 0 ? 'first' : 'second'
}

function handleImageTouch(event) {
    chosenCanvas = event.srcElement
    chosenCanvas.getContext('2d').clearRect(0, 0, chosenCanvas.width, chosenCanvas.height)
    console.log('touched', event.srcElement.parentElement)
    showVideoPage()
    showVideoPreview()
}

function showVideoPage() {
    page.resultsPage.style.display = 'none'
    page.previewPage.style.display = 'flex'
}

function showResultsPage() {
    // first set display
    page.resultsPage.style.display = 'flex'
    page.previewPage.style.display = 'none'

    // then compute sizes
    const divWidth = page.leftImageDivElm.clientWidth
    const computedHeight = getNewImageHeight(page.sampleHeadshotElm, divWidth)

    page.computedImageWidth = divWidth
    page.computedImageHeight = computedHeight

    console.log(`computed w h ${page.computedImageWidth} ${page.computedImageHeight}`)

    page.leftImageDivElm.style.height = `${page.sampleHeadshotElm.height * (divWidth / page.sampleHeadshotElm.width)}px`
    page.rightImageDivElm.style.height = `${page.sampleHeadshotElm.height * (divWidth / page.sampleHeadshotElm.width)}px`

    // page.leftImageCanvasCtx.drawImage(page.sampleHeadshotElm, 0, 0, page.leftImageCanvasElm.width, page.leftImageCanvasElm.height)
    // page.rightImageCanvasCtx.drawImage(page.sampleHeadshotElm, 0, 0, page.rightImageCanvasElm.width, page.rightImageCanvasElm.height)
}

function showHappySadVideoPreview() {
    page.happySadVideoPreview.style.display = 'block'
    page.happySadStill.style.display = 'none'
    const constraints = cameraFrontBack === 'front' ? frontConstraints : backConstraints
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            page.happySadVideoPreview.srcObject = stream
            page.happySadVideoPreview.addEventListener('loadedmetadata', x => {
                console.log('loadmetadata', x)
                page.happySadVideoPreview.play()
            })
        })
        .catch(err => {
            console.log('caught video error', err)
        })
}

function showVideoPreview() {
    const constraints = cameraFrontBack === 'front' ? frontConstraints : backConstraints
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            page.videoPreview.srcObject = stream
            page.videoPreview.addEventListener('loadedmetadata', x => {
                console.log('loadmetadata', x)
                page.videoPreview.play()
            })
        })
        .catch(err => {
            console.log('caught video error', err)
        })
}

function stopAllVideo() {
    if (page.videoPreview.srcObject && page.videoPreview.srcObject.getTracks()) {
        page.videoPreview.srcObject.getTracks()[0].stop()
    }
    if (page.happySadVideoPreview.srcObject && page.happySadVideoPreview.srcObject.getTracks()) {
        page.happySadVideoPreview.srcObject.getTracks()[0].stop()
    }
}

function takePicture() {
    const videoCurrentHeight = page.videoPreview.videoHeight
    // super hacky
    chosenCanvas.style.height = null
    chosenCanvas.width = page.videoPreview.videoWidth
    chosenCanvas.height = page.videoPreview.videoHeight
    const newDivHeight = page.videoPreview.videoHeight * (page.computedImageWidth / page.videoPreview.videoWidth)
    page.leftImageDivElm.style.height = `${newDivHeight}px`
    page.rightImageDivElm.style.height = `${newDivHeight}px`
    const canvasCtx = chosenCanvas.getContext('2d')
    canvasCtx.drawImage(page.videoPreview, 0, 0)
    page.videoPreview.srcObject.getTracks()[0].stop()
    page.videoPreview.pause()
    showResultsPage()
}

function getNewImageWidth(img, newHeight) {
    return img.width * (newHeight / img.height)
}

function getNewImageHeight(img, newWidth) {
    return img.height * (newWidth / img.width)
}

function getNumFromPx(px) {
    return parseInt(px.substr(0, px.indexOf('px')))
}

function getPageElements() {
    const pageObj = {}
    pageObj.sampleHeadshotElm = document.querySelector('.sample-headshot')
    pageObj.body = document.querySelector('body')
    pageObj.leftImageDivElm = document.querySelector('.results .left-image')
    pageObj.leftImageCanvasElm = document.querySelector('.results .left-image canvas')
    pageObj.leftImageCanvasCtx = pageObj.leftImageCanvasElm.getContext('2d')
    pageObj.rightImageDivElm = document.querySelector('.results .right-image')
    pageObj.rightImageCanvasElm = document.querySelector('.results .right-image canvas')
    pageObj.rightImageCanvasCtx = pageObj.rightImageCanvasElm.getContext('2d')
    pageObj.resultsPage = document.querySelector('.results-column')
    pageObj.previewPage = document.querySelector('.preview')
    pageObj.videoPreview = document.querySelector('.preview .video-preview')
    pageObj.happySadVideoPreview = document.querySelector('.happy-sad-page video')
    pageObj.mainCameraIcon = document.querySelector('.preview .bottom-menu .main-camera')
    pageObj.imageFilesIcon = document.querySelector('.bottom-menu .image-files')
    pageObj.cameraDirectionBtn = document.querySelector('.bottom-menu .direction')
    pageObj.imageUpload = document.querySelector('#upload')
    pageObj.imageIndexField = document.querySelector('.top-message .snapshot-index')
    pageObj.compareBtn = document.querySelector('.compare')
    pageObj.similarityValue = document.querySelector('.similarityValue')
    pageObj.mainMenuPage = document.querySelector('.main-menu')
    pageObj.compareMenuButton = document.querySelector('.menu-item.compare-faces')
    pageObj.happySadButton = document.querySelector('.menu-item.happy-sad')
    pageObj.happySadPage = document.querySelector('.happy-sad-page')
    pageObj.happySadCameraIcon = document.querySelector('.happy-sad-page .bottom-menu .main-camera')
    pageObj.happySadCanvas = document.querySelector('.happy-sad-page .still')
    pageObj.happySadStill = document.querySelector('.happy-sad-page .happy-sad-still')
    pageObj.happySadFaceGeoCanvas = document.querySelector('.happy-sad-page .face-geo')
    pageObj.happySadCanvasDiv = document.querySelector('.happy-sad-page .happy-sad-still')
    pageObj.happySadStats = document.querySelector('.happy-sad-page .stats')
    pageObj.burger = document.querySelector('.top-title-bar .burger')
    pageObj.redo = document.querySelector('.top-title-bar .redo')
    return pageObj
}

window.onload = () => {
    init()
}
