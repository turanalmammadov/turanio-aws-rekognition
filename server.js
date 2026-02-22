'use strict'

const fs = require('fs')
const http = require('http')
const https = require('https')
const privateKey = fs.readFileSync('assets/key.pem', 'utf8')
const certificate = fs.readFileSync('assets/certificate.pem', 'utf8')
const bodyParser = require('body-parser')
const AWS = require('aws-sdk')
AWS.config.update({region:'us-east-2'});
AWS.config.loadFromPath('assets/aws-config.json')
const rekognition = new AWS.Rekognition()


const credentials = {
    key: privateKey,
    cert: certificate
}
const express = require('express')
const app = express()
app.use(express.static('.'))

app.use(bodyParser.json({
    limit: '500mb'
}))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.raw({
    type: 'text/plain',
    limit: '500mb'
}))

app.use((req, res, next) => {
    console.log(`req.headers.origin ${req.headers.origin}`)
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Origin", `${req.headers.origin}`);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, contentType");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
})

app.post('/doFaceAnalysis', async (req, res, next) => {
    try {
        // Validate request body
        if (!req.body || req.body.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Request body is required'
            })
        }

        const postText = req.body.toString('utf-8')
        
        // Validate base64 image data
        if (!postText.includes('base64,')) {
            return res.status(400).json({
                success: false,
                error: 'Invalid image format. Expected base64-encoded image data.'
            })
        }

        const base64Text = postText.split('base64,')[1]
        
        if (!base64Text) {
            return res.status(400).json({
                success: false,
                error: 'No image data found after base64 marker'
            })
        }

        const picData = Buffer.from(base64Text, 'base64')
        
        // Validate buffer size
        if (picData.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Empty image buffer'
            })
        }

        const result = await detectFaceAWSPromise(picData)
        res.status(200).json({
            success: true,
            data: result
        })
    } catch(err) {
        console.error('Face analysis error:', err)
        res.status(500).json({
            success: false,
            error: err.message || 'Face analysis failed',
            code: err.code
        })
    }
})

app.post('/doCompare', async (req, res, next) => {
    try {
        // Validate request body
        if (!req.body || !req.body.leftImage || !req.body.rightImage) {
            return res.status(400).json({
                success: false,
                error: 'Both leftImage and rightImage are required'
            })
        }

        const leftPicText = req.body.leftImage.toString('utf-8')
        const leftBase64Text = leftPicText.split('base64,')[1]
        
        if (!leftBase64Text) {
            return res.status(400).json({
                success: false,
                error: 'Invalid leftImage format'
            })
        }
        
        const leftBase64Data = Buffer.from(leftBase64Text, 'base64')

        const rightPicText = req.body.rightImage.toString('utf-8')
        const rightBase64Text = rightPicText.split('base64,')[1]
        
        if (!rightBase64Text) {
            return res.status(400).json({
                success: false,
                error: 'Invalid rightImage format'
            })
        }
        
        const rightBase64Data = Buffer.from(rightBase64Text, 'base64')

        const compareResult = await compareFacesPromiseRaw(leftBase64Data, rightBase64Data)
        res.status(200).json({
            success: true,
            data: compareResult
        })
    } catch (err) {
        console.error('Face comparison error:', err)
        res.status(500).json({
            success: false,
            error: err.message || 'Face comparison failed',
            code: err.code
        })
    }
})

app.post('/savePics', async (req, res, next) => {
    const leftPicText = req.body.leftImage.toString('utf-8')
    const leftBase64Text = leftPicText.split('base64,')[1]
    const leftBase64Data = Buffer.from(leftBase64Text, 'base64')

    const rightPicText = req.body.rightImage.toString('utf-8')
    const rightBase64Text = rightPicText.split('base64,')[1]
    const rightBase64Data = Buffer.from(rightBase64Text, 'base64')

    fs.writeFileSync('leftImage.png', leftBase64Data)
    fs.writeFileSync('rightImage.png', rightBase64Data)

    res.status(201).send('OK')
})

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)

const PORT = process.env.PORT || 80
httpServer.listen(PORT, () => {
    console.log(`HTTP listening on ${PORT}`)
})

const PORT2 = process.env.PORT || 5555

httpsServer.listen(PORT2, () => {
    console.log(`HTTPS listening on ${PORT2}`)
 })


function compareFacesPromiseRaw(sourceImageBuffer, targetImageBuffer) {
    return new Promise((resolve, reject) => {
        const params = {
            SimilarityThreshold: 0,
            SourceImage: {
                Bytes: sourceImageBuffer
            },
            TargetImage: {
                Bytes: targetImageBuffer
            }
        }
        rekognition.compareFaces(params, (err, data) => {
            if (err) {
                console.log('error in compare faces', err, err.stack)
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function detectFaceAWSPromise(picBuffer) {
    return new Promise((resolve, reject) => {

        let params = {
            Image: {
                Bytes: picBuffer
            },
            Attributes: ['ALL']
        }

        rekognition.detectFaces(params, (err, data) => {
            if (err) {
                console.log(err, err.stack)
                reject(err)
            } else {
                console.log(JSON.stringify(data, null, 2))
                resolve(data)
            }
        })

    })
}


function compareFacesPromise(sourceFilename, targetFilename) {
    const sourceBuffer = fs.readFileSync(sourceFilename)
    const targetBuffer = fs.readFileSync(targetFilename)
    return compareFacesPromiseRaw(sourceBuffer, targetBuffer)
}
