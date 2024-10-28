"use client";

import { Container } from "@/components/ui/container";

export default function DataQuests() {
  return (
    <Container>
      <div style={{ padding: "20px", lineHeight: "1.6", fontWeight: "bold" }}>
        <h1>Data Quests</h1>
        <p>
          Welcome to Data Quests, a work-in-progress feature designed to enable
          dataset curators to stake on their provided data.
        </p>
        <br />
        <p>
          Data consumers will be able to verify the validity and maintenance of
          datasets in a deterministic and user-friendly way.
        </p>
        <br />
        <p>
          If someone finds an inconsistency in the data, they can initiate a
          quest, which serves as the dispute resolution process. The quest will
          be resolved as long as many consumers can verify the data. We are
          currently researching two potential scenarios for this process: one
          utilizing a Prediction Market, where verifiable data flaws provide a
          way to earn money, and another using truth-incentivized oracles like
          UMA. In both cases, the robust verification process ensures that
          manipulators will lose money. Our goal is to offer a high-margin Data
          Quests dashboard, incentivizing curators to act correctly or face
          penalties.
        </p>
      </div>
    </Container>
  );
}
