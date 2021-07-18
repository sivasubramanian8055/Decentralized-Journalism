import React, { Fragment, useState } from 'react'
import { Dialog, FormGroup, InputGroup, TagInput, Button, FileInput, TextArea, Switch } from '@blueprintjs/core'
import axios from 'axios';
import "../styles/community.scss"
import main from './main';
import IPFSManager from './IPFSManager';

export default function CreateNewDialog(props) {
  let [state, setState] = useState({
    title: '',
    descreption: '',
    categories: [],
    community: 'TOI',
    isCommunity: false,
    imageURL: '',
    ipfsHash: '',
    taggedPeople: [],
    isCommunity: false,
    descreptionCheck: true
  })
  const clearButton = (
    state.categories.length > 0 ?
      <Button
        icon="cross"
        minimal={true}
        onClick={() => { setState({ ...state, categories: [] }) }}
      /> : null
  );
  const clearPeopleButton = (
    state.taggedPeople.length > 0 ?
      <Button
        icon="cross"
        minimal={true}
        onClick={() => { setState({ ...state, taggedPeople: [] }) }}
      /> : null
  );

  const maskOffensiveWord = () => {
    const FormData = require('form-data');
    let data = new FormData();
    data.append('text', state.descreption);
    data.append('lang', 'en');
    data.append('mode', 'standard');
    data.append('api_user', '721804061');
    data.append('api_secret', '2GKYtYh5sPbgSzdaBPNL');
    axios({
      url: 'https://api.sightengine.com/1.0/text/check.json',
      method: 'post',
      data: data,
      header: { 'Content-Type': 'application/json' }
    })
      .then(function (response) {
        let descreption = state.descreption
        for (var i = 0; i < response.data.profanity.matches.length; i++) {
          let word = response.data.profanity.matches[i].match
          if (descreption.includes(word))
            descreption = descreption.replaceAll(word, '*'.repeat(word.length))
        }
        setState({ ...state, descreption, descreptionCheck: false })
      })
      .catch(function (error) {
        console.log(error)
      });
  }

  const onSave = async () => {
    await main.methods.createNews(props.account, state.title, (new Date()).getTime(), state.descreption, state.categories.join(','), state.community, state.isCommunity, state.ipfsHash).send({ from: props.account })
    let newsId = await main.methods.currentCount().call()
    newsId -= 1
    for (var count = 0; count < state.taggedPeople.length; count++) {
      await main.methods.tagRelatedPeople(state.taggedPeople[count], newsId, state.taggedPeople[count] + '@' + newsId.toString()).send({ from: props.account })
    }
    window.location.reload()
  }

  return (
    <Fragment>
      <Dialog
        icon="draw"
        title="Compose News"
        canOutsideClickClose={false}
        autoFocus={true}
        canEscapeKeyClose={true}
        enforceFocus={true}
        isOpen={props.isOpen}
        usePortal={true}
        onClose={() => { props.toggle() }}
        style={{ width: '900px', height: '650px' }}
      >
        <div className="padding">
          <FormGroup
            label="Enter Title:"
            inline={true}
          >
            <InputGroup style={{ width: '350px' }} id="text-input" placeholder="Title for News" onChange={(event) => { setState({ ...state, title: event.target.value }) }} />
          </FormGroup>
          <FormGroup
            label="Categories:"
            inline={true}
          >
            <div style={{ width: '350px' }}>
              <TagInput
                addOnBlur={false}
                addOnPaste={true}
                intent="none"
                tagIntent={false}
                tagMinimal={false}
                leftIcon="tag"
                onChange={(e) => { setState({ ...state, categories: [...e] }) }}
                placeholder="Enter Categories"
                rightElement={clearButton}
                values={state.categories}
              />
            </div>
          </FormGroup>
          <FormGroup
            label="Banner:"
            inline={true}
          >
            <div style={{ paddingLeft: '22px' }}>
              <IPFSManager dataHandler={(hash) => { setState({ ...state, ipfsHash: hash }) }} />
            </div>
          </FormGroup>
          <FormGroup
            label="Tag People:"
            inline={true}
          >
            <div style={{ width: '350px' }}>
              <TagInput
                addOnBlur={false}
                addOnPaste={true}
                intent="none"
                tagIntent={false}
                tagMinimal={false}
                leftIcon="new-person"
                onChange={(e) => { setState({ ...state, taggedPeople: [...e] }) }}
                placeholder="ethereum address"
                rightElement={clearPeopleButton}
                values={state.taggedPeople}
              />
            </div>
          </FormGroup>
          <FormGroup label="Descreption:">
            <TextArea
              growVertically={true}
              fill={true}
              large={true}
              intent='primary'
              onChange={(event) => { setState({ ...state, descreption: event.target.value, descreptionCheck: true }) }}
              value={state.descreption}
            />
          </FormGroup>
          <Button intent='success' onClick={() => { maskOffensiveWord() }} style={{ marginRight: '10px' }}>Profanity Check</Button>
          <Button intent='success' onClick={() => { onSave() }} disabled={state.descreptionCheck} >Save</Button>
        </div>
      </Dialog>
    </Fragment>
  );
}

