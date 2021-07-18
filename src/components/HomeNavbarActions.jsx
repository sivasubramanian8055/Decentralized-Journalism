import { Button, Toaster } from '@blueprintjs/core'
import React from 'react'
import web3 from './web3'
import { NavLink } from 'react-router-dom'

const centerNavActions = [
  {
    id: "wfp",
    label: "Why DJ",
    linkTo: "/",
  },
  {
    id: "about_us",
    label: "About us",
    linkTo: "/about_us",
  },
  {
    id: "community",
    label: "Community",
    linkTo: "/community",
  },
];

const globalToast = Toaster.create({
  position: 'top'
})

class HomeNavbarActions extends React.Component {


  state = {
    account: null,
    web3: undefined,
  };

  loadBlockchain = async () => {
    if (web3 !== "Not_Found") {
      this.setState({ web3 });
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      this.setState({ account: accounts[0] });
      this.props.history.push('dashboard/')
    }
    else {
      globalToast.show({
        message: "Feel free to install Metamask and join us in building DJ", intent: 'warning',
        action: {
          href: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
          target: "_blank",
          text: 'Install Metamask'
        },
        timeout: 10000
      })
    }
  };

  render() {
    let { account, web3 } = this.state;
    return (
      <>
        <div className="nav__link">
          {centerNavActions.map((centerNavAction) => {
            return (<NavLink to={centerNavAction.linkTo} key={centerNavAction.id}>
              <Button minimal>{centerNavAction.label}</Button>
            </NavLink>)
          })}
        </div>
        <div className="nav__link">
          <Button
            minimal
            intent={
              web3 === undefined ? "none" : "success"
            }
            onClick={this.loadBlockchain}
            large={true}
          >
            {web3 === undefined
              ? "Connect Blockchain"
              : "Connected to Blockchain"}
          </Button>
        </div>
      </>
    );
  }

}
export default HomeNavbarActions;
