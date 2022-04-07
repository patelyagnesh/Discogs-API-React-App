import React from 'react'
import Styles from './Main.module.css'

class Discogs extends React.Component {
    constructor (props, context) {
        super(props)
        this.state = {
            searches_data: [], // will contain tracks data array from server
            inputSearch: null,
            isLoading: false, // will be true after data have been received from server
            error: null // no errors yet !
        }
    }
    searchArtist () {
        const search = this.state.inputSearch
        this.setState({
            isLoading: true
        })
        // AJAX call using fetch. Make sure the track server is running !
        fetch(
            'https://api.discogs.com/database/search?key=tPQeIlBmvKtIOrLFvWxh&secret=wTuVFLXqdoIgkNssoLOzxikJgrypcSpx&artist=' +
                search +
                '&country=canada'
        ).then(response => {
            // here full fetch response object
            //console.log(response)
            // fetch not like jQuery ! both ok code 200 and error code 404 will execute this .then code
            if (response.ok) {
                // get only JSON data returned from server with .json()
                response.json().then(res => {
                    console.log(res)
                    this.setState({
                        searches_data: res.results, // data received from server
                        isLoading: false, // we got data
                        error: null // no errors
                    })
                })
            } else {
                // handle errors, for example 404
                response.json().then(json_response => {
                    this.setState({
                        isLoading: false,
                        error: json_response
                    })
                })
            }
        })
    }

    //To add tracks in the database
    add = item => {
        console.log(item)
        console.log(item.genre[0])

        const Data = {
            playlist: item.genre[0],
            title: item.title,
            uri: item.uri,
            master_id: item.master_id
        }
        fetch('http://localhost:8000/tracks/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Data)
        }).then(response => {
            // eslint-disable-next-line no-restricted-globals
            location.reload()
        })
    }
    // display the tracks table
    render () {
        return (
            <div id={Styles['column']}>
                <div>
                <h2>Music provided by Discogs.com <a href="www.discogs.com">See API Doc</a></h2>
                    <form id={Styles['search-div']}>
                        <div>
                            <p>Search by <b>Artist </b>
                            <input
                                value={this.state.inputSearch}
                                type='text'
                                onChange={event =>
                                    this.setState({
                                        inputSearch: event.target.value
                                    })
                                }
                                id='search'
                                name='search'
                            />
                             Canadian release only</p>
                        </div>
                        <div className='text-center'>
                            <button
                                id={Styles['button btn-search']}
                                type='button'
                                onClick={this.searchArtist.bind(this)}
                            >
                                Search{' '}
                            </button>
                        </div>
                    </form>
                    {this.state.isLoading && <div> loading</div>}
                    <div>
                        <table>
                            <tr>
                                {this.state.searches_data.map((item, index) => (
                                    <div key={`playlist${index}`} id={Styles['table-style']}>
                                        <td>
                                            <div>
                                                <p>{item.title}</p>
                                                <img
                                                    src={item.cover_image}
                                                    alt='cover'
                                                />{' '}
                                                <p>{item.style}</p>
                                                <p>{item.uri}</p>
                                                <a
                                                    href={
                                                        'https://www.discogs.com' +
                                                        item.uri
                                                    }
                                                >
                                                    More information
                                                </a>
                                            </div>
                                        </td>

                                        <td>
                                            <p>{item.master_id}</p>
                                        </td>
                                        <td>
                                            <div>
                                                <button
                                                    type='button'
                                                    onClick={() =>
                                                        this.add(item)
                                                    }
                                                >
                                                    Add{' '}
                                                </button>
                                            </div>
                                        </td>
                                    </div>
                                ))}
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
export default Discogs