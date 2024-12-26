# Welcome to QUADB 🚀🧑‍🚀⚛

<div >
  <img src="./client/public/images/logo.png" alt="QUADB Logo" style="border-radius: 5%; width: 400px;" />
</div>

## Description📜

### Database Namespaces Protocol (QUADB)

**QUADB** is a groundbreaking protocol designed to revolutionize data management and access control in decentralized environments. With a focus on Web3 technologies and integration with Filecoin Naming Service (ENS), Tableland, Fleek, Lighthouse, QUADB aims to become the premier platform for data sharing, collaboration, and monetization in the decentralized web. Provides a structured and secure way to organize, share, and monetize datasets and associated codebases. Leveraging the power of IPFS and Filecoin networks, alongside advanced encryption techniques and smart contract capabilities, QUADB ensures data integrity, accessibility, and incentivized participation.

### [QUADB website](https://quad-db.vercel.app/)

### Key Features

- **Structured Namespace:** Users can create hierarchical namespaces under the root quadb.fil, facilitating organization and categorization of datasets and codebases.

- **Access Control:** Datasets can be designated as PUBLIC, GROUPED-PUBLIC, PAID-GROUPED, or PAID-PRIVATE, allowing fine-grained control over data access and curation.

- **Encryption:** Utilizes Lit Protocol to secure IPNS records, ensuring that only authorized curators can decrypt and modify dataset contents and associated code.

- **IPFS/Filecoin** Integration: All data and code are stored on the IPFS and Filecoin networks, providing decentralized storage and immutable data integrity.

- **Tableland Protocol:** Utilizes Tableland protocol for SQL indexing within smart contracts, enhancing data searchability and query efficiency.

- **Incentivization Mechanism:** Active users and subscribers are rewarded with QUADB tokens, encouraging engagement and contributions to the platform.

- **Verification Mechanism (WIP):** A mechanism to incentivize good datasets and slash bad datasets using Prediction Markets


### 🧑‍💻 Acknowledgments & Technologies Used 🤖

We would like to thank the following individuals and organizations for their contributions and support in developing QUADB:

- STORACHA(IPNS - IPFS - FILECOIN) 🔓
  - Storing and Encrypting Data on IPFS&Filecoin using the RAAS service. [code](https://github.com/nijoe1/QUADB/blob/main/app/utils/IPFS.js)
  - Making IPNS support multiple access to update records by encrypting and storing the Private key on tableland giving access only to dataset and code curators.
- FILECOIN Naming Service (FNS) 🔮
  - Creating a graph of unified categories using FNSsubnames [code](https://github.com/nijoe1/QUADB/blob/main/contracts/contracts/libraries/FNS.sol)
- Lit protocol 🔥
  - Encryption of the files and the IPNS keys
- Tableland Protocol 🕸️
  - Tableland Queries [code](https://github.com/nijoe1/QUADB/blob/main/app/utils/tableland.js)

---

## Smart Contracts

- [QUADB Contract](https://github.com/nijoe1/QUADB/blob/main/contracts/contracts/QUADB.sol)

- [Tableland Integration Contract](https://github.com/nijoe1/QUADB/blob/main/contracts/contracts/libraries/Tableland.sol)

- [FNSIntegration Contract](https://github.com/nijoe1/QUADB/blob/main/contracts/contracts/libraries/FNS.sol)

**Authors:**

- [nijoe1](https://github.com/nijoe1)
