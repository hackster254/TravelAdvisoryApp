import React, {useEffect, useState} from 'react'
import BottomNavBar from '../components/BottomNavBar'

import Map, {Marker, Popup} from 'react-map-gl'

import axios from 'axios'

import {Room} from '@material-ui/icons'
import {Stack} from '@mui/material'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {format} from 'timeago.js'
import Register from '../components/Register'
import Login from '../components/Login'

const Home = () => {

    //set up storage to store user credentials
    const myStorage = window.localStorage
    // set states 
    // const [currentUser, setCurrentUser] = useState(null)
    const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"))
    const [pins, setPins] = useState([])
    const [currentPlaceId, setCurrentPlaceId]=useState(null)


    // states for a new site/pin
    const [title, setTitle]=useState(null)
    const [desc, setDesc] = useState(null)
    const [image, setImage] = useState(null)

    // to show or hide register/login form
    const [showRegister, setShowRegister] = useState(false)
    const [showLogin, setShowLogin] = useState(false)


    const [newPlace, setNewPlace] = useState(null)

    const [viewport, setViewport] = useState({

        longitude: 36.817223,
        latitude: -1.286389,
        zoom: 6

    })

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const handleMarkerClick=(id, lat, long)=>{

        setCurrentPlaceId(id)
        setViewport({...viewport, 
                    latitude: lat,
                longitude: long
            })

    }
    const handleAddClick =async(e)=>{
       // e.preventDefault()
        console.log(e)
        const {longitude, latitude} =  e.lngLat
        console.log(e.lngLat)
        setNewPlace({
            lat: (e.lngLat.lat),
            long: (e.lngLat.lng)

        })
    };


    const handleSubmit = async (e)=>{
        e.preventDefault()


        const newPin = {
            username: currentUser,
            title,
            desc,
            image,
            lat: newPlace.lat,
            long: newPlace.long,
        }

        try {
            console.log(newPin)
            const res = await axios.post("http://localhost:8000/api/pins/", newPin)
            setPins([...pins, res.data])
            setNewPlace(null)
        } catch (error) {
            console.log(error)
        }
    }
    const handleLogout =()=>{
        myStorage.removeItem("user");
        setCurrentUser(null)
    }


    useEffect(()=> {

        const getPins = async()=> {
            try {

                const res = await axios.get("http://localhost:8000/api/pins/")
                const array = JSON.stringify(res.data.pins)
                const newarray = JSON.parse(array)
                newarray.forEach(element => {
                    console.log(element)
                });

                console.log('pins recieved from datbase are' + JSON.stringify(res.data.pins))
                console.log(array)
                setPins(newarray)
                
            } catch (error) {
                console.log('cannot get pins' + error)
                
            }
        }
        getPins()

    }, [])
    return (
        <div>
            <h1>home</h1>
            <Map
               {...viewport}
               onViewportChange={nextViewport =>setViewport(nextViewport)}
                style={{ width: "100vw", height: "100vh" }}
                mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
                mapboxAccessToken={process.env.REACT_APP_MAPBOX}
                onDblClick = {handleAddClick}
                transitionDuration="200"
            
            >   {console.log(pins)}
            {pins.map(p => (

            <>
                <Marker latitude={p.lat}
                    longitude={p.long}

                        offsetLeft={-viewport.zoom * 3.5}
                    offsetTop={-viewport.zoom * 7}
                >   <Room style={{
                        cursor: "pointer",

                        fontSize: viewport.zoom * 7,
                        color: p.username === currentUser ? "tomato" : "slateblue"
                
                }}
                        onClick={()=>handleMarkerClick(p._id, p.lat, p.long)}

                    />
                    <div>
                        You are here
                    </div>

                </Marker>
                {p._id === currentPlaceId &&(
                        <Popup longitude={p.long} latitude={p.lat}
                            anchor="left"
                            closeButton={true}
                            closeOnClick={false}
                            onClose={()=>setCurrentPlaceId(null)}
                        >

                            <div className='card'>
                                <label>Place</label>
                                <h4 className='place'>{p.title}</h4>
                                <label>Description</label>
                                <p className='desc'>{p.desc}</p>
                                <label>Image</label>
                                <img src="https://constructionreviewonline.com/wp-content/uploads/2018/06/top-con.jpg"
                                    width={150} height={150}
                                    alt='Construction site'
                                    className='img'
                                />
                                <label>Events</label>

                                <Stack direction="row" spacing={2}>
                                    <Item>Concrete</Item>
                                    <Item>Excavation</Item>
                                    <Item>Pumping</Item>
                                </Stack>

                                <label>Information</label>
                                <span className='username'>Created by <b>{p.username}</b></span>
                                <span className='date'>{format(p.createdAt)}</span>




                            </div>
                        </Popup>
                ) }
                

            </>
            ))}
            {newPlace && (
                    <Popup longitude={newPlace.long} latitude={newPlace.lat}
                        anchor="left"
                        closeButton={true}
                        closeOnClick={false}
                        onClose={() => setCurrentPlaceId(null)} >
                             <div>
                                 <form onSubmit={handleSubmit}>
                                <label>Place</label>

                                <input placeholder='Enter name for your site'
                                    onChange={(e)=> setTitle(e.target.value)}
                                />

                                <label>Description</label>
                                <textarea placeholder='enter a brief desc'
                                    onChange={(e) => setDesc(e.target.value)}
                                />

                                <label>Image</label>

                                <input type="image" 
                                    onChange={(e) => setImage(e.target.value)}
                                />

                                <button className='submitButton'>Add Pin</button>
                                 </form>
                             </div>

                    </Popup>
            )}

                {currentUser ? (<button className='button logout'
                        onClick={handleLogout}
                >Logout</button>): (
                    <div className='buttons'>
                        <button className='button login' 
                                onClick={()=>setShowLogin(true)}
                        >Login</button>


                        <button className='button register'
                            onClick={() => setShowRegister(true)}
                        
                        >Register</button>
                    </div>
                )}
               {showRegister &&(
                   <Register setShowRegister={setShowRegister}/>
               )}

               {showLogin &&(
                   <Login setShowLogin={setShowLogin} myStorage={myStorage}
                   
                        setCurrentUser={setCurrentUser}
                   />
               )}

                
            
               

            </Map>
            {/* <Register /> */}
            <BottomNavBar name='home' />
        </div>
    )
}

export default Home
