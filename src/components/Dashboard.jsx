import { Button, Card, Elevation, Navbar, Alignment, Callout, Tabs, Tab, Divider, InputGroup, PopoverInteractionKind, Popover, TextArea, Radio, RadioGroup, FormGroup, Switch } from "@blueprintjs/core";
import React, { Component, Fragment } from "react";
import { Image } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ReactDialog from "./ReactDialog";
import CreateNewsDialog from "./CreateNewsDialog";
import main from "./main";
import web3 from './web3';

const calloutIntent = ['warning', 'success', 'danger']
const calloutIcon = ['drawer-right', 'endorsed', 'high-priority']
const calloutMessage = ['Yet to see or Ignored By', 'Approved By', 'Disapproved By']

export default class Dashboard extends Component {
  async componentDidMount() {
    if (web3 !== "Not_Found") {
      const a = await web3.eth.getAccounts();
      this.setState({ account: a[0] })
      await this.loadNews();
    }
  }
  toggleDialog = (condition) => {
    this.setState({ dialogOpen: !this.state.dialogOpen })
  }
  reactToggle = () => {
    this.setState({ reactOpen: !this.state.reactOpen })
  }
  banNews = async () => {
    await main.methods.banNews(this.state.selectedCardNews.id, this.state.banReason, this.state.informer, this.state.banStatus).send({ from: this.state.account }, () => {
      this.setState({ informer: '', banStatus: false, banReason: '', informer: '' })
    })
    window.location.reload()
  }
  tipAuthor = async (receiver, amnt) => {
    this.setState({ loading: true })
    await main.methods.tipAccount(this.state.id, receiver).send({ from: this.state.account, value: web3.utils.toWei(amnt, 'ether') }, () => {
      this.setState({ loading: false, tipAuthorAmt: 0, tipPopOpen: false })
    }
    )
  }
  tipUpVotersF = async (amnt) => {
    this.setState({ loading: true })
    await main.methods.payUpVoters(this.state.selectedCardNews.id).send({ from: this.state.account, value: web3.utils.toWei(amnt, 'ether') }, () => {
      this.setState({ loading: false, tipUpVoter: 0, tipUpPopOpen: false })
    })
  }
  tipDownVotersF = async (amnt) => {
    this.setState({ loading: true })
    await main.methods.payDownVoters(this.state.selectedCardNews.id).send({ from: this.state.account, value: web3.utils.toWei(amnt, 'ether') }, () => {
      this.setState({ loading: false, tipDownVoter: 0, tipDownPopOpen: false })
    })
  }
  upVoteButton = async (newsId) => {
    if (!this.state.newsUpVote.includes(this.state.account)) {
      await main.methods.vote(newsId, true).send({ from: this.state.account })
      window.location.reload()
    }
  }
  downVoteButton = async (newsId) => {
    if (!this.state.newsDownVote.includes(this.state.account)) {
      await main.methods.vote(newsId, false).send({ from: this.state.account })
      window.location.reload()
    }
  }
  newsByIndex = async (index) => {
    const result = await main.methods.newsById(index).call()
    return (result)
  }
  onCardClick = async (news) => {
    if (news !== undefined) {
      const upVote = await main.methods.getNewsUpVote(news.id).call();
      const downVote = await main.methods.getNewsDownVote(news.id).call();
      const ban = await main.methods.bannedNews(news.id).call();
      let taggedIds = await main.methods.getNewsTags(news.id).call()
      let tags = []
      for (let index = 0; index < taggedIds.length; index++) {
        let tag = await main.methods.tags(taggedIds[index]).call()
        tags.push(tag)
      }
      this.setState({ selectedCardNews: news, selectedCardTags: tags, banReason: ban.reason, banStatus: ban.status, informer: ban.informer, newsUpVote: upVote, newsDownVote: downVote })
    }
  }

  loadNews = async () => {
    const count = await main.methods.currentCount().call();
    const banCount = await main.methods.banCount().call();
    const admin = await main.methods.admin().call();
    console.log(admin)
    const communityCount = await main.methods.communityNumber().call();
    const taggedNews = await main.methods.getAccountNews(this.state.account).call()
    console.log(taggedNews)
    let status = true
    for (var itr = count - 1; itr >= 0; itr--) {
      const newsObj = await this.newsByIndex(itr)
      const ban = await main.methods.bannedNews(itr).call();
      if (ban.status === true) {
        newsObj.descreption = "Admin has banned this news and the reason was " + ban.reason
        this.setState({ BannedNews: [...this.state.BannedNews, newsObj] })
      }
      else {
        if (taggedNews.includes(itr.toString())) {
          this.setState({ TaggedNews: [...this.state.TaggedNews, newsObj] })
        }
        if (this.state.account === newsObj.author) {
          this.setState({ AuthorNews: [...this.state.AuthorNews, newsObj] })
        }
        let categories = newsObj.categories.split(',')
        for (let i = 0; i < categories.length; i++) {
          switch (categories[i].toLowerCase()) {
            case "politics":
              {
                this.setState({ Poltics: [...this.state.Poltics, newsObj] })
                break;
              }
            case "sports":
              {
                this.setState({ Sports: [...this.state.Sports, newsObj] })
                break;
              }
            case "entertainment":
              {
                this.setState({ Entertainment: [...this.state.Entertainment, newsObj] })
                break;
              }
            case "weather":
              {
                this.setState({ Weather: [...this.state.Weather, newsObj] })
                break;
              }
            case "celebrity":
              {
                this.setState({ Celebrity: [...this.state.Celebrity, newsObj] })
                break;
              }
            case "technology":
              {
                this.setState({ Technology: [...this.state.Technology, newsObj] })
                break;
              }
            default:
              {
                this.setState({ Others: [...this.state.Others, newsObj] })
              }
          }
        }
        if (this.state.LatestNews.length < 10)
          this.setState({ LatestNews: [...this.state.LatestNews, newsObj] });
        if (status) {
          this.onCardClick(newsObj)
          status = false
        }
      }
    }
    this.setState({ cardElement: this.state.LatestNews, adminAddress: admin })
  };
  onTabChange = (event) => {
    this.setState({ navbarTabId: event, banPopOpen: false })
    switch (event) {
      case 'a': {
        this.setState({ cardElement: this.state.LatestNews })
        this.onCardClick(this.state.LatestNews[0])
        break;
      }
      case "b":
        {
          this.setState({ cardElement: this.state.Poltics })
          this.onCardClick(this.state.Poltics[0])
          break;
        }
      case "g":
        {
          this.setState({ cardElement: this.state.Sports })
          this.onCardClick(this.state.Sports[0])
          break;
        }
      case "c":
        {
          this.setState({ cardElement: this.state.Entertainment })
          this.onCardClick(this.state.Entertainment[0])
          break;
        }
      case "d":
        {
          this.setState({ cardElement: this.state.Weather })
          this.onCardClick(this.state.Weather[0])
          break;
        }
      case "e":
        {
          this.setState({ cardElement: this.state.Celebrity })
          this.onCardClick(this.state.Celebrity[0])
          break;
        }
      case "f":
        {
          this.setState({ cardElement: this.state.Technology })
          this.onCardClick(this.state.Technology[0])
          break;
        }
      case "h":
        {
          this.setState({ cardElement: this.state.BannedNews })
          this.onCardClick(this.state.BannedNews[0])
          break;
        }
      case "i":
        {
          this.setState({ cardElement: this.state.Others })
          this.onCardClick(this.state.Others[0])
          break;
        }
      case "k":
        {
          this.setState({ cardElement: this.state.AuthorNews })
          this.onCardClick(this.state.AuthorNews[0])
          break;
        }
      default:
        {
          this.setState({ cardElement: this.state.TaggedNews })
          this.onCardClick(this.state.TaggedNews[0])
        }
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      LatestNews: [],
      Poltics: [],
      Entertainment: [],
      Weather: [],
      Celebrity: [],
      Technology: [],
      Sports: [],
      Others: [],
      BannedNews: [],
      TaggedNews: [],
      AuthorNews: [],
      id: '',
      loading: false,
      author: '',
      navbarTabId: 'a',
      dialogOpen: false,
      account: '',
      cardElement: [],
      selectedCardNews: {},
      selectedCardTags: [],
      tipPopOpen: false,
      tipUpPopOpen: false,
      tipDownPopOpen: false,
      tipAuthorAmt: 0,
      tipUpVoter: 0,
      tipDownVoter: 0,
      reactOpen: false,
      clickedTagId: '',
      tagReact: 0,
      tagDescreption: '',
      adminBanOpen: false,
      adminAddress: '',
      banReason: '',
      informer: '',
      banStatus: false,
      banOpenPop: false,
      newsUpVote: [],
      newsDownVote: []
    };
  }
  render() {

    return (
      <div>
        <div>
          <Navbar fixedToTop="true">
            <Navbar.Group align={Alignment.LEFT}>
              <Navbar.Heading>Decentalized Journalism</Navbar.Heading>
              <Navbar.Divider />
              <Tabs
                animate={true}
                id="navbar"
                large={true}
                onChange={(event) => { this.onTabChange(event) }}
                selectedTabId={this.state.navbarTabId}
              >
                <Tab id="a" title="Latest News" />
                <Tab id="k" title="Your News" />
                <Tab id="j" title="Tagged News" />
                <Tab id="b" title="Politics" />
                <Tab id="c" title="Entertainment" />
                <Tab id="d" title="Weather" />
                <Tab id="e" title="Celebrity" />
                <Tab id="f" title="Technology" />
                <Tab id="g" title="Sports" />
                <Tab id="h" title="Banned News" />
                <Tab id="i" title="Others" />
              </Tabs>
              <Navbar.Divider />
              <Button className="bp3-minimal" className='minimal' icon="add" text="Compose News" onClick={() => { this.toggleDialog() }} />
            </Navbar.Group>
          </Navbar>
        </div>
        <div style={{ width: '100%', height: '768px', display: 'flex', flexDirection: 'row', marginTop: '30px', padding: '20px' }}>
          <div style={{ width: '30%', paddingTop: '20px', display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
            {this.state.cardElement.map((news, index) => {
              return (<div key={index} style={{ padding: '5px 10px' }}>
                <Card interactive={true} elevation={Elevation.TWO} onClick={() => { this.onCardClick(news) }}>
                  <h5><i>{news.title}</i></h5>
                  <p>{'Written by: ' + news.author}</p>
                  <p>{'Published at: ' + (new Date(parseInt(news.timestamp))).toLocaleString('en-IN')}</p>
                </Card>
              </div>);
            })
            }
          </div>
          <Divider style={{ padding: '0px 10px' }} />
          <div style={{ width: '70%', paddingTop: '20px', overflowY: 'auto', paddingLeft: '20px' }}>
            {this.state.cardElement.length !== 0 ?
              <div style={{ marginBottom: '200px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <h1 style={{ marginRight: '5px' }}>{this.state.selectedCardNews.title}</h1>
                    <Button icon="thumbs-up"
                      intent={this.state.newsUpVote.includes(this.state.account) ? 'success' : 'none'}
                      active={this.state.newsUpVote.includes(this.state.account)}
                      minimal
                      onClick={() => { this.upVoteButton(this.state.selectedCardNews.id) }}
                    >
                      <span>{this.state.newsUpVote.length}</span>
                    </Button>
                    <Button
                      icon="thumbs-down"
                      intent={this.state.newsDownVote.includes(this.state.account) ? 'danger' : 'none'}
                      active={this.state.newsDownVote.includes(this.state.account)}
                      minimal
                      onClick={() => { this.downVoteButton(this.state.selectedCardNews.id) }}
                    >
                      <span>{this.state.newsDownVote.length}</span>
                    </Button>
                    <span style={{ marginRight: '10px' }}>-Authored by {this.state.selectedCardNews.author}</span>
                    {this.state.adminAddress === this.state.account ?
                      <Popover
                        content=
                        {
                          <div>
                            <Button style={{ marginLeft: '290px' }}
                              onClick={() => { this.setState({ banPopOpen: false }) }}
                              minimal='true'
                              icon='cross' />
                            <div style={{ margin: '10px', display: 'flex', flexDirection: 'column' }}>
                              <h5>Admin Privlege-Ban News</h5>
                              <Switch large checked={this.state.banStatus} label="Ban news" onChange={(e) => { this.setState({ banStatus: e.target.checked }) }} />
                              <h6>reason</h6>
                              <div style={{ paddingTop: '10px', display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                                <TextArea placeholder=""
                                  growVertically={true}
                                  fill={true}
                                  large={true}
                                  intent='primary'
                                  onChange={(event) => { this.setState({ banReason: event.target.value }) }}
                                  value={this.state.banReason}
                                />
                              </div>
                              <FormGroup
                                label="Informer"
                                inline={true}
                              >
                                <InputGroup
                                  style={{ width: '200px' }}
                                  id="text-input" placeholder="Informer"
                                  onChange={(event) => { this.setState({ ...this.state, informer: event.target.value }) }}
                                  value={this.state.informer}
                                />
                              </FormGroup>
                              <Button onClick={() => { this.banNews() }} intent='success'>
                                save
                              </Button>
                            </div>
                          </div>
                        }
                        interactionKind={PopoverInteractionKind.CLICK}
                        isOpen={this.state.banPopOpen}
                        position='bottom'
                      >
                        <button className="bp3-button"
                          onClick={() => { this.setState({ banPopOpen: true }) }}>
                          Block or unblock
                        </button>
                      </Popover> : null}
                  </div>
                  {this.state.selectedCardNews !== undefined && this.state.selectedCardNews.categories.length !== 0 ?
                    <span>
                      Associated Categories: {this.state.selectedCardNews.categories[0].toUpperCase() + this.state.selectedCardNews.categories.slice(1).toLowerCase()}
                    </span> : null
                  }
                  <p style={{ marginTop: '10px' }}>{'Published at: ' + (new Date(parseInt(this.state.selectedCardNews.timestamp))).toLocaleString('en-IN')}</p>
                  <div style={{ display: 'flex', flexDirection: 'row', margin: '20px 0px' }}>
                    {
                      this.state.selectedCardTags.map((tag, index) => {
                        return (
                          <Card
                            key={index}
                            style={{ padding: '0px', width: '50%' }}
                            onClick={() => {
                              if (this.state.account === tag.taggedPerson) {
                                this.setState({
                                  clickedTagId: this.state.account + '@' + tag.newsId.toString(),
                                  reactOpen: true,
                                  tagReact: tag.react,
                                  tagDescreption: tag.taggedPersonDescreption
                                })
                              }
                            }}
                          >
                            <div>
                              <Callout icon={calloutIcon[tag.react]} intent={calloutIntent[tag.react]} title={calloutMessage[tag.react] + ' ' + tag.taggedPerson}>
                                {tag.taggedPersonDescreption}
                              </Callout>
                            </div>
                          </Card>
                        )
                      })
                    }
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Popover
                      content=
                      {
                        <div>
                          <Button style={{ marginLeft: '290px' }}
                            onClick={() => { this.setState({ tipPopOpen: false }) }}
                            minimal='true'
                            icon='cross' />
                          <div style={{ margin: '10px', display: 'flex', flexDirection: 'column' }}>
                            <h5>How much are you willing to tip</h5>
                            <div style={{ paddingTop: '10px', display: 'flex', flexDirection: 'row' }}>
                              <InputGroup placeholder="tip amount"
                                onChange={(event) => { this.setState({ tipAuthorAmt: event.target.value }) }}
                              />
                              <Button onClick={() => { this.tipAuthor(this.state.selectedCardNews.author, this.state.tipAuthorAmt) }}
                              >Tip In eth
                              </Button>
                            </div>
                          </div>
                        </div>
                      }
                      interactionKind={PopoverInteractionKind.CLICK}
                      isOpen={this.state.tipPopOpen}
                      position='right'
                    >
                      <button className="bp3-button"
                        onClick={() => { this.setState({ tipPopOpen: true }) }}>
                        Tip Author
                      </button>
                    </Popover>
                    <Popover
                      content=
                      {
                        <div style={{ marginLeft: '5px' }}>
                          <Button
                            style={{ marginLeft: '290px' }}
                            onClick={() => { this.setState({ tipUpPopOpen: false }) }}
                            minimal='true'
                            icon='cross' />
                          <div style={{ margin: '10px', display: 'flex', flexDirection: 'column' }}>
                            <h5>How much are you willing to tip</h5>
                            <div style={{ paddingTop: '10px', display: 'flex', flexDirection: 'row' }}>
                              <InputGroup placeholder="tip amount"
                                onChange={(event) => { this.setState({ tipUpVoter: event.target.value }) }}
                              />
                              <Button onClick={() => { this.tipUpVotersF(this.state.tipUpVoter) }}
                              >Tip In eth
                              </Button>
                            </div>
                          </div>
                        </div>
                      }
                      interactionKind={PopoverInteractionKind.CLICK}
                      isOpen={this.state.tipUpPopOpen}
                      position='right'
                    >
                      <button
                        className="bp3-button"
                        onClick={() => { this.setState({ tipUpPopOpen: true }) }}>
                        Tip Up voters
                      </button>
                    </Popover>
                    <Popover
                      content=
                      {
                        <div style={{ marginLeft: '5px' }}>
                          <Button
                            style={{ marginLeft: '290px' }}
                            onClick={() => { this.setState({ tipDownPopOpen: false }) }}
                            minimal='true'
                            icon='cross'
                          />
                          <div style={{ margin: '10px', display: 'flex', flexDirection: 'column' }}>
                            <h5>How much are you willing to tip</h5>
                            <div style={{ paddingTop: '10px', display: 'flex', flexDirection: 'row' }}>
                              <InputGroup placeholder="tip amount"
                                onChange={(event) => { this.setState({ tipDownVoter: event.target.value }) }}
                              />
                              <Button onClick={() => { this.tipDownVotersF(this.state.tipDownVoter) }}
                                style={{ marginLeft: '5px' }}
                              >
                                Tip In eth
                              </Button>
                            </div>
                          </div>
                        </div>
                      }
                      interactionKind={PopoverInteractionKind.CLICK}
                      isOpen={this.state.tipDownPopOpen}
                      position='right'
                    >
                      <button
                        className="bp3-button"
                        onClick={() => { this.setState({ tipDownPopOpen: true }) }}>
                        Tip Down voters
                      </button>
                    </Popover>
                  </div>
                </div>
                <div style={{ marginTop: '60px' }}>
                  {this.state.navbarTabId !== 'h' && this.state.selectedCardNews.ipfsImage !== '' ?
                    <Image src={"https://ipfs.infura.io/ipfs/" + this.state.selectedCardNews.ipfsImage} fluid />
                    : null}
                  <p style={{ marginTop: '5px' }}>{this.state.selectedCardNews.descreption}</p>
                </div>
              </div>
              : null}
          </div>
        </div>
        <CreateNewsDialog isOpen={this.state.dialogOpen} toggle={this.toggleDialog} account={this.state.account} />
        <ReactDialog
          reactOpen={this.state.reactOpen}
          reactToggle={this.reactToggle}
          account={this.state.account}
          tagId={this.state.clickedTagId}
          react={this.state.tagReact}
          descreption={this.state.tagDescreption}
        />
      </div >
    );
  }
}
