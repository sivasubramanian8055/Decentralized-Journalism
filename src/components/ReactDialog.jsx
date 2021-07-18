import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, FormGroup, InputGroup, TagInput, Button, TextArea, Switch, ButtonGroup } from '@blueprintjs/core'
import "../styles/community.scss"
import main from './main';

export default function CreateNewDialog(props) {
    let [state, setState] = useState({
        react: 0,
        descreption: '',
    })
    useEffect(() => {
        setState({ ...state, react: props.react, descreption: props.descreption })
    }, [props])
    const onSave = async () => {
        await main.methods.changeTagDetails(props.tagId, state.react, state.descreption).send({ from: props.account })
        window.location.reload()
    }

    return (
        <Fragment>
            <Dialog
                icon="annotation"
                title="Respond to Tag"
                canOutsideClickClose={false}
                autoFocus={true}
                canEscapeKeyClose={true}
                enforceFocus={true}
                isOpen={props.reactOpen}
                usePortal={true}
                onClose={() => { props.reactToggle() }}
                style={{ width: '500px', height: '350px' }}
            >
                <div className="padding">
                    <ButtonGroup style={{ minWidth: 200 }}>
                        <Button icon="endorsed"
                            intent={'success'}
                            onClick={() => { setState({ ...state, react: 1 }) }}
                            active={parseInt(state.react) === 1}>
                            Approved
                        </Button>
                        <Button icon="drawer-right"
                            intent={'warning'}
                            onClick={() => { setState({ ...state, react: 0 }) }}
                            active={parseInt(state.react) === 0}>
                            Yet to react or Ignored
                        </Button>
                        <Button icon="cross" intent={'danger'}
                            onClick={() => { setState({ ...state, react: 2 }) }}
                            active={parseInt(state.react) === 2}>
                            Disapprove
                        </Button>
                    </ButtonGroup>
                    <br></br>
                    <br></br>
                    <FormGroup label="Explain your stand:">
                        <TextArea
                            growVertically={true}
                            placeholder="reason"
                            fill={true}
                            large={true}
                            intent='primary'
                            onChange={(event) => { setState({ ...state, descreption: event.target.value }) }}
                            value={state.descreption}
                        />
                    </FormGroup>
                    <Button intent='success' onClick={() => { onSave() }}>Save</Button>
                </div>
            </Dialog>
        </Fragment>
    );
}

