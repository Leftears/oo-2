import React from 'react'
import { Button } from 'semantic-ui-react'
export default class extends React.Component {
    static async getInitialProps ({ req }) {
        return req
        ? { userAgent: req.headers['user-agent'] }
        : { userAgent: navigator.userAgent }
    }
    render () {
        return <div>
            <Button>
                Click Here
            </Button>
            Hello World {this.props.userAgent}
        </div>
    }
}
