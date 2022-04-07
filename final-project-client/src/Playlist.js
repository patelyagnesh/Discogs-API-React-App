import React from 'react'
import Styles from './Main.module.css'

class Playlist extends React.Component {
    constructor (props, context) {
        super(props)
        this.state = {
            tracks_data: [], // will contain tracks data array from server
            current_tracks: null,
            new_track: {
                id: '',
                playlist_title: '',
                title: '',
                uri: '',
                master_id: ''
            },
            tracks_index: 0, // the index of the track currently shown, start at first in array
            tracks_count: 0, // how many tracks in data array from server
            isLoaded: false, // will be true after data have been received from server
            error: null // no errors yet !
        }
    }
    componentDidMount () {
        // AJAX call using fetch. Make sure the track server is running !
        fetch('http://localhost:8000/tracks').then(
            response => {
                if (response.ok) {
                    // get only JSON data returned from server with .json()
                    response.json().then(json_response => {
                        console.log(json_response)
                        this.setState({
                            tracks_data: json_response.tracks,
                            current_tracks: json_response.tracks.length
                                ? json_response.tracks[0]
                                : null,
                            tracks_count: json_response.tracks.length, // how many tracks in array
                            tracks_index: 0, // will first show the first track in the array
                            isLoaded: true, // we got data
                            error: null // no errors
                        })
                    })
                } else {
                    // handle errors, for example 404
                    response.json().then(json_response => {
                        this.setState({
                            isLoaded: false,
                            error: json_response,
                            tracks_data: {},
                            tracks_count: 0,
                            tracks_index: 0
                        })
                    })
                }
            },

            error => {
                this.setState({
                    isLoaded: false,
                    error: {
                        message:
                            'AJAX error, URL wrong or unreachable, see console'
                    }, // save the AJAX error in state for display below
                    tracks_data: {}, // no data received from server
                    tracks_count: 0,
                    tracks_index: 0
                })
            }
        )
    }

    //To delete track from the database
    delete = () => {
        const id = this.state.tracks_data[this.state.tracks_index].id
        fetch('http://localhost:8000/tracks/' + id, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                // eslint-disable-next-line no-restricted-globals
                location.reload()
            })
    }

    trackHTML = track => {
        return (

                <div id={Styles['column']}>
                <h2>My playlist</h2>

                <table>
                    <tbody>
                        <tr>
                            {this.state.tracks_data.map((item, index) => (
                                <div key={`playlist${index}`}>
                                    <td>
                                        <div>
                                            <p>{item.title}</p>
                                            <p>{index + 1}</p>
                                            <p>{item.playlist_title}</p>
                                            <a href={item.uri}>{item.uri}</a>
                                            <p>{item.master_id}</p>
                                        </div>
                                    </td>

                                    <td>
                                        <div>
                                            <button
                                                id={Styles['button btn-delete']}
                                                type='button'
                                                onClick={() => this.delete()}
                                            >
                                                Delete{' '}
                                            </button>
                                        </div>
                                    </td>
                                </div>
                            ))}
                        </tr>
                    </tbody>
                </table>
                </div>

        )
    }

    // display the tracks table
    render () {
        if (this.state.error) {
            return (
                <div>
                    <b>{this.state.error.message}</b>
                </div>
            )
        } else if (this.state.isLoaded) {
            if (this.state.tracks_count !== 0) {
                return (
                    <div>
                        {this.trackHTML(
                            this.state.current_tracks
                                ? this.state.current_tracks
                                : this.state.new_track
                        )}
                    </div>
                )
            } else {
                return (
                    <div>
                        <b>Tarck table is empty</b>
                    </div>
                )
            }
        } else {
            return (
                <div>
                    <b>Waiting for server ...</b>
                </div>
            )
        }
    }
}
export default Playlist