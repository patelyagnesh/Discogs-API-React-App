import React from 'react'
import './Footer.css'

class Footer extends React.Component {

    render () {
        return(
            <footer>{this.props.authorName}</footer>
        )
    }
}

export default Footer
