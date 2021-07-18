import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

class IPFSManager extends Component {

    uploadToIPFS = (event) => {
        event.preventDefault()
        const IPFS = require('ipfs-http-client')
        const ipfsInstance = IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
        const file = event.target.files[0]
        const input = new window.FileReader()
        input.readAsArrayBuffer(file)
        input.onloadend = () => {
            this.setState({ flag: 'Uploading...' })
            const uload = Buffer(input.result)
            ipfsInstance.add(uload, (error, result) => {
                if (error) {
                    this.setState({ flag: 'Upload Failed. Try Again' })
                }
                else {
                    const intent = this
                    const hash = result[0].hash
                    var sightengine = require('sightengine')('721804061', '2GKYtYh5sPbgSzdaBPNL');
                    sightengine.check(['offensive', 'wad', 'nudity']).set_url("https://ipfs.infura.io/ipfs/" + hash).then(function (result) {
                        if (result.alcohol < 0.5 && result.nudity.safe > 0.60 && result.drugs < 0.5 && result.weapon < 0.5 && result.offensive.prob < 0.5) {
                            intent.setState({ flag: 'Uploaded successfully', ipfsHash: hash }, () => {
                                intent.props.dataHandler(hash)
                            })
                        }
                        else {
                            intent.setState({ ipfsHash: '', flag: 'Upload Failed due to inappropriate image' })
                        }
                    }).catch(function (err) {
                        console.log(err)
                    });
                }
            })
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            flag: '',
            ipfsHash: ''
        }
    }

    render() {
        return (
            <div style={{ marginTop: '6px' }}>
                <Form.Control type="file" onChange={this.uploadToIPFS} />
                <Form.Label>{this.state.flag}</Form.Label>
            </div>
        );
    }
}
export default IPFSManager;
