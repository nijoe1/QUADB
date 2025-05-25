# Welcome to QUADB 🚀🧑‍🚀⚛

<div >
  <img src="./client/public/images/logo.png" alt="QUADB Logo" style="border-radius: 5%; width: 400px;" />
</div>

## Description📜

### Database Namespaces Protocol (QUADB)

**QUADB** is a groundbreaking protocol designed to revolutionize data management and access control in decentralized environments. With a focus on Web3 technologies and integration with Filecoin Naming Service (ENS), Tableland, Fleek, Lighthouse, and Lit Protocol, QUADB aims to become the premier platform for data sharing, collaboration, and monetization in the decentralized web. Provides a structured and secure way to organize, share, and monetize datasets and associated codebases. Leveraging the power of IPFS and Filecoin networks, alongside advanced encryption techniques and smart contract capabilities, QUADB ensures data integrity, accessibility, and incentivized participation.

### [QUADB website](https://quad-db.vercel.app/)

### Key Features

- **Permissionless IPNS Updates:** QUADB implements a novel approach to IPNS updates using Lit Protocol, where no single entity has access to the IPNS private key. Instead, updates are managed through a quorum-based signature system, ensuring decentralized control and consensus-driven updates.

- **Structured Namespace:** Users can create hierarchical namespaces under the root quadb.fil, facilitating organization and categorization of datasets and codebases.

- **Access Control:** Datasets can be designated as PUBLIC, GROUPED-PUBLIC, PAID-GROUPED, or PAID-PRIVATE, allowing fine-grained control over data access and curation.

- **Encryption:** Utilizes Lit Protocol to secure IPNS records and dataset contents, ensuring that only authorized curators can decrypt and modify data.

- **IPFS/Filecoin Integration:** All data and code are stored on the IPFS and Filecoin networks, providing decentralized storage and immutable data integrity.

- **Tableland Protocol:** Utilizes Tableland protocol for SQL indexing within smart contracts, enhancing data searchability and query efficiency.

- **Incentivization Mechanism:** Active users and subscribers are rewarded with QUADB tokens, encouraging engagement and contributions to the platform.

- **Verification Mechanism (WIP):** A mechanism to incentivize good datasets and slash bad datasets using Prediction Markets.

### Use Cases

#### Financial Insights & Agent Swarms

- **Decentralized Financial Data Updates:** Financial bots and agent swarms can collaborate to update market insights and analysis
- **Quorum-Based Updates:** Multiple agents must reach consensus before updating financial data
- **Transparent History:** All updates are tracked and verifiable on-chain
- **Real-time Collaboration:** Agents can propose updates and vote on changes in real-time

#### Research Collaboration

- **Consensus-Driven Updates:** Researchers must reach quorum to update datasets
- **Version Control:** Complete history of dataset updates is maintained
- **Collaborative Curation:** Multiple researchers can propose and vote on changes
- **Reputation System:** Researchers build reputation through quality contributions

#### Private Datasets

- **Curator-Only Access:** Private datasets are only accessible to authorized curators
- **Subscription Model:** Users can subscribe to spaces/instances for latest updates
- **Encrypted Storage:** Data is encrypted using Lit Protocol
- **Access Control:** Fine-grained permissions for different user roles

### Technical Architecture

#### IPNS x Lit Protocol Integration

- **Permissionless Updates:** IPNS private key is never exposed, managed through Lit Protocol
- **Quorum Signatures:** Updates require multiple signatures to reach consensus
- **Encrypted Storage:** Data and IPNS records are encrypted using Lit Protocol
- **Decentralized Control:** No single entity has control over updates

#### Storage & Access

- **IPFS/Filecoin:** Decentralized storage for all data and code
- **Tableland:** SQL indexing and query capabilities
- **Lit Protocol:** Encryption and access control
- **FNS:** Namespace management and categorization

### 🧑‍💻 Acknowledgments & Technologies Used 🤖

We would like to thank the following individuals and organizations for their contributions and support in developing QUADB:

- **STORACHA (IPNS - IPFS - FILECOIN)** 🔓

  - Storing and Encrypting Data on IPFS&Filecoin using the RAAS service
  - Implementing permissionless IPNS updates through quorum-based signatures
  - [code](https://github.com/nijoe1/QUADB/blob/main/app/utils/IPFS.js)

- **FILECOIN Naming Service (FNS)** 🔮

  - Creating a graph of unified categories using FNSsubnames
  - [code](https://github.com/nijoe1/QUADB/blob/main/contracts/contracts/libraries/FNS.sol)

- **Lit Protocol** 🔥

  - Encryption of files and IPNS keys
  - Permissionless update mechanism through quorum signatures
  - Access control for private datasets

- **Tableland Protocol** 🕸️
  - Tableland Queries
  - [code](https://github.com/nijoe1/QUADB/blob/main/app/utils/tableland.js)

---

## Smart Contracts

- [QUADB Contract](https://github.com/nijoe1/QUADB/blob/main/contracts/contracts/QUADB.sol)
- [Tableland Integration Contract](https://github.com/nijoe1/QUADB/blob/main/contracts/contracts/libraries/Tableland.sol)
- [FNSIntegration Contract](https://github.com/nijoe1/QUADB/blob/main/contracts/contracts/libraries/FNS.sol)

**Authors:**

- [nijoe1](https://github.com/nijoe1)