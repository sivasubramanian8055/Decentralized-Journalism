pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract main {
    address public admin;
    uint256 public currentCount;
    uint256 public banCount;
    uint256 public communityNumber;
    struct news {
        uint256 timestamp;
        string descreption;
        string title;
        uint256 id;
        address author;
        string categories;
        uint256 donations;
        string communityId;
        bool communityNews;
        string ipfsImage;
    }

    struct account {
        address payable author;
        uint256 donated;
        uint256 received;
    }
    struct community {
        address payable leader;
        string communityId;
        uint256 newsCount;
        uint256 totalDonation;
    }
    struct tag {
        address author;
        address taggedPerson;
        uint256 react;
        string taggedPersonDescreption;
        uint256 newsId;
    }

    struct flag {
        bool status;
        uint256 newsId;
        string reason;
        address informer;
    }
    mapping(address => account) public accounts;
    mapping(uint256 => news) public newsById;
    mapping(string => address payable) addresses;
    mapping(uint256 => flag) public bannedNews;
    mapping(uint256 => address payable[]) public newsUpVote;
    mapping(uint256 => address payable[]) public newsDownVote;
    mapping(address => uint256[]) public newsForAuthor;
    mapping(string => tag) public tags;
    mapping(address => uint256[]) public newsForAccounts;
    mapping(uint256 => string[]) public tagForNews;
    mapping(string => community) communities;
    mapping(string => uint256[]) public communityNews;
    mapping(string => address[]) public communityAuthors;

    constructor() public {
        admin = msg.sender;
        currentCount = 0;
        banCount = 0;
        communityNumber = 0;
    }

    function string_check(string memory str1, string memory str2)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2)));
    }

    function createNews(
        string memory _hashedaddr,
        string memory _title,
        uint256 _time,
        string memory _descreption,
        string memory _categories,
        string memory _community,
        bool _iscommunitynews,
        string memory _ipfsImage
    ) public {
        if (addresses[_hashedaddr] == address(0)) {
            addresses[_hashedaddr] = msg.sender;
            accounts[msg.sender] = account(msg.sender, 0, 0);
        }
        newsById[currentCount] = news(
            _time,
            _descreption,
            _title,
            currentCount,
            msg.sender,
            _categories,
            0,
            _community,
            _iscommunitynews,
            _ipfsImage
        );
        bannedNews[currentCount] = flag(false, currentCount, "", address(0));
        newsForAuthor[msg.sender].push(currentCount);
        if (_iscommunitynews) communityNews[_community].push(currentCount);
        currentCount += 1;
    }

    function tagRelatedPeople(
        address _taggedPerson,
        uint256 _newsId,
        string memory _tagId
    ) public {
        require(
            newsById[_newsId].author == msg.sender,
            "author only can tag people"
        );
        require(!string_check(_tagId, ""), "tag id cant be empty");
        tags[_tagId] = tag(
            msg.sender,
            _taggedPerson,
            0,
            "Yet To react",
            _newsId
        );
        newsForAccounts[_taggedPerson].push(_newsId);
        tagForNews[_newsId].push(_tagId);
    }

    function changeTagDetails(
        string memory _tagId,
        uint256 _reactId,
        string memory _descreption
    ) public {
        require(msg.sender == tags[_tagId].taggedPerson, "Access denied");
        tags[_tagId].react = _reactId;
        tags[_tagId].taggedPersonDescreption = _descreption;
    }

    function banNews(
        uint256 _newsId,
        string memory _reason,
        address _informer,
        bool _status
    ) public {
        require(msg.sender == admin, "You are not admin!");
        bannedNews[_newsId].status = _status;
        bannedNews[_newsId].reason = _reason;
        bannedNews[_newsId].informer = _informer;
        banCount += 1;
    }

    function createCommunity(string memory _communityId) public {
        require(
            communities[_communityId].leader == address(0),
            "community already exist"
        );
        communities[_communityId] = community(msg.sender, _communityId, 0, 0);
        communityNumber += 1;
    }

    function addAuthorToCommunity(string memory _communityId, address _author)
        public
    {
        require(
            communities[_communityId].leader == msg.sender,
            "Access denied"
        );
        communityAuthors[_communityId].push(_author);
    }

    function vote(uint256 _newsId, bool isUpVote) public {
        require(newsById[_newsId].author != msg.sender, "author cannot vote");
        if (isUpVote) newsUpVote[_newsId].push(msg.sender);
        else newsDownVote[_newsId].push(msg.sender);
    }

    function payUpVoters(uint256 _newsId) public payable {
        require(newsUpVote[_newsId].length != 0, "no upvoters found");
        uint256 transferAmount = msg.value / newsUpVote[_newsId].length;
        for (uint256 vote = 0; vote < newsUpVote[_newsId].length; vote++) {
            newsUpVote[_newsId][vote].transfer(transferAmount);
        }
    }

    function payDownVoters(uint256 _newsId) public payable {
        require(newsDownVote[_newsId].length != 0, "no downvoters found");
        uint256 transferAmount = msg.value / newsDownVote[_newsId].length;
        for (uint256 vote = 0; vote < newsDownVote[_newsId].length; vote++) {
            newsDownVote[_newsId][vote].transfer(transferAmount);
        }
    }

    function getAuthorNews(address _id) public view returns (uint256[] memory) {
        return newsForAuthor[_id];
    }

    function getAccountNews(address _id)
        public
        view
        returns (uint256[] memory)
    {
        return newsForAccounts[_id];
    }

    function getNews(uint256 _id) public view returns (news memory) {
        return newsById[_id];
    }

    function getNewsUpVote(uint256 _id)
        public
        view
        returns (address payable[] memory)
    {
        return newsUpVote[_id];
    }

    function getNewsDownVote(uint256 _id)
        public
        view
        returns (address payable[] memory)
    {
        return newsDownVote[_id];
    }

    function getNewsTags(uint256 _id) public view returns (string[] memory) {
        return tagForNews[_id];
    }

    function getCommunityNews(string memory _id)
        public
        view
        returns (uint256[] memory)
    {
        return communityNews[_id];
    }

    function getCommunityAuthors(string memory _id)
        public
        view
        returns (address[] memory)
    {
        return communityAuthors[_id];
    }

    function setUpVotes(uint256 _id, address payable[] memory _addresses)
        public
    {
        newsUpVote[_id] = _addresses;
    }

    function setDownVotes(uint256 _id, address payable[] memory _addresses)
        public
    {
        newsDownVote[_id] = _addresses;
    }

    function tipAccount(string memory _sender, string memory _receiver)
        public
        payable
    {
        if (addresses[_sender] == address(0)) {
            addresses[_sender] = msg.sender;
            accounts[msg.sender] = account(msg.sender, 0, 0);
        }
        (addresses[_receiver]).transfer(msg.value);
        accounts[addresses[_receiver]].received += msg.value;
        accounts[msg.sender].donated += msg.value;
    }
}
