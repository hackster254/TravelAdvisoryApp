import React, {useState, useEffect, useRef} from 'react'
import BottomNavBar from '../components/BottomNavBar'

import * as cocossd from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs'
import Webcam from 'react-webcam'

import * as mobilenet from '@tensorflow-models/mobilenet'

import Button from '@mui/material/Button';

import { drawRect } from "../utilities";
//import {  model } from '@tensorflow/tfjs'


const Camera = () => {

    const [camera, setCamera] = useState(false)
    const [upload, setUpload] = useState(false)

    const [imageURL, setImageURL] = useState(null)
    const [isModelLoading, setIsModelLoading] = useState(false)
    const [model, setModel] = useState(null)

    // TO STORE RESULTS AFTER CLASSIFICATION
    const [results, setResults] = useState([])

    const imageRef = useRef()
  

    const webcamRef = useRef(null)
    const canvasRef = useRef(null)

    const loadModel = async () => {
        setIsModelLoading(true)
        try {
            const model = await mobilenet.load()
            setModel(model)
            setIsModelLoading(false)
        } catch (error) {
            console.log(error)
            setIsModelLoading(false)
        }
    }
    
    // main function to run the prediction of objects
    const runCoco = async () => {
        const net = await cocossd.load()

        setInterval(() => {
            detect(net)
        }, 10);

    }

    
    

    const detect = async (net) => {
        // check if data is available

        if (
            typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;


            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // make some detections
            const obj = await net.detect(video)
            console.log(obj)

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");

            drawRect(obj, ctx)



        }
    }
    const CameraCanvas = ()=>{
        return (
            <div>
                <Webcam ref={webcamRef}
                    muted={true}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}

                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 8,
                        width: 640,
                        height: 480,
                    }}

                />
            </div>
        )
    }
    const pressed =()=> {
        setCamera(true)
        setUpload(false)
    
    }

    const uploaded = ()=> {
        setUpload(true)
        setCamera(false)
    }

    const identify = async()=> {
        const results = await model.classify(imageRef.current)
        console.log('results of identification are '+ JSON.stringify(results))
    
        setResults(results)
    }
    const InputFile =()=>{
        
        console.log('please upload a photo')
        return(
            <div>
                <div>
                <input type='file' accept='image/*' capture='camera' onChange={uploadImage} />

                </div>
                <div className='mainWrapper'>
                    <div className='mainContent'>
                        <div className='imageHolder'>
                            {imageURL && (
                                <img src={imageURL} alt="upload Preview"
                                    crossOrigin='anonymous' ref={imageRef}
                                />
                            )}
                            {results.length > 0 && <div className='resultsHolder'>
                                {results.map((result, index) => {
                                    return (
                                        <div className='result' key={result.className}>
                                            <span className='name'>{result.className}</span>
                                            <span className='confidence'>Confidence level: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Best Guess</span>}</span>
                                        </div>
                                    )
                                })}
                            </div>}


                            {imageURL && (<Button variant="contained" onClick={identify}>
                                Identify Image
                                </Button>)}

                        </div>

                    </div>
                </div>

                
                
            </div>
        )
    }
    
    

    const uploadImage=async(e)=> {
        console.log(e)
        const {files} = e.target
        if (files.length > 0){
            // create url for the file
            const url = await URL.createObjectURL(files[0])
            setImageURL(url)
            console.log('image url saved is'+ imageURL)

        } else {
            setImageURL(null)
        }
    }

    useEffect(() => { runCoco() }, []);

    // every time page reloads 
    useEffect(() => {
        loadModel()
    }, [])
    
    return (
        <>
        <div>
            <h1>Camera</h1>
                <Button variant="contained" onClick={pressed}>Take a photo</Button>
                {camera ? <CameraCanvas /> : null} 
                <Button variant="contained" onClick={uploaded}>Upload a photo</Button>
                {upload ? <InputFile /> : null}
            {/* <CameraCanvas /> */}
            <BottomNavBar name='camera' />
        </div>
        </>
    )
}

export default Camera
