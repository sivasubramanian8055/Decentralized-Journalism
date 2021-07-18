import web3 from './web3';
import main from '../abis/main';
let instance;

if (web3 !== "Not_Found") {
  instance = new web3.eth.Contract(
    main.abi,
    main.networks[5777].address
  );
}
else {
  instance = web3;
}

export default instance;
