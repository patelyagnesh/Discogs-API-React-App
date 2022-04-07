'use strict'

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.urlencoded())
app.use(express.json())
app.use(express.static('public_html'))

app.get('/', function (req, res) {
    res.writeHead(200) // optional because 200 is the default response code
    res.end('<h1>Welcome to a Music Playlist Manager</h1>')
})

// SELECT ALL - GET
app.get('/tracks', (req, res) => {
    const DB = require('./src/dao')
    DB.connect()
    DB.query(
        'SELECT *, playlist.title as playlist_title  FROM playlist , track where playlist.id = track.playlist_id ;',
        function (tracks) {
            if (tracks.rowCount > 0) {
                const officesJSON = { msg: 'OK', tracks: tracks.rows }
                const officesJSONString = JSON.stringify(officesJSON, null, 4)
                // set content type
                res.writeHead(200, { 'Content-Type': 'application/json' })
                // send out a string
                res.end(officesJSONString)
            } else {
                // set content type
                const officesJSON = { msg: 'Table empty, no tracks found' }
                const officesJSONString = JSON.stringify(officesJSON, null, 4)
                res.writeHead(404, { 'Content-Type': 'application/json' })
                // send out a string
                res.end(officesJSONString)
            }

            DB.disconnect()
        }
    )
})

// DELETE
app.delete('/tracks/:id', function (request, response) {
    const id = request.params.id // read the :id value send in the URL
    const DB = require('./src/dao')
    DB.connect()

    DB.queryParams('DELETE from track WHERE id=$1', [id], function (tracks) {
        const officesJSON = { msg: 'OK track deleted' }
        const officesJSONString = JSON.stringify(officesJSON, null, 4)
        // set content type
        response.writeHead(200, { 'Content-Type': 'application/json' })
        // send out a string
        response.end(officesJSONString)
        DB.disconnect()
    })
})

// INSERT - POST
app.post('/tracks', function (request, response) {
    // get the form inputs from the body of the HTTP request
    console.log(request.body)
    const playlist = request.body.playlist
    const title = request.body.title
    const uri = request.body.uri
    const masterId = request.body.master_id

    const DB = require('./src/dao')
    DB.connect()
    DB.queryParams(
        'select * from playlist where title=$1',
        [playlist],
        function (playlist) {
            let playlistJSON = {}
            if (playlist.rowCount > 0) {
                playlistJSON = playlist.rows[0]
            }
            DB.queryParams(
                'INSERT INTO track(playlist_id, title, uri, master_id) VALUES ($1,$2,$3,$4)',
                [playlistJSON.id || 1, title, uri, masterId],
                function (tracks) {
                    const playlitJSON = { msg: 'OK track added' }
                    // send out a string
                    response.send(playlitJSON)
                    DB.disconnect()
                }
            )
        }
    )
})

app.listen(8000, function () {
    console.log('server listening to port 8000')
})
