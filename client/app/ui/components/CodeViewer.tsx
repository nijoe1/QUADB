"use client";

import React, { useState } from "react";

import { NotebookPreviewer } from "@/components/NotebookPreviewer";
import { showToast } from "@/lib/toast";
import { Button } from "@/primitives/Button";
import { Badge } from "@/ui-shadcn/badge";
import { Card, CardContent } from "@/ui-shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui-shadcn/tabs";

const CodeViewer = ({ code }: { code: any; onClose: () => void }) => {
  const [, /* tabIndex */ setTabIndex] = useState(0);

  const handleTabChange = (value: string) => {
    setTabIndex(value === "notebook" ? 0 : 1);
  };

  const handleToDo = () => {
    showToast.info("Coming soon sir 🚀");
  };

  return (
    <Card className="mx-auto w-full overflow-auto border-none bg-[#424242] shadow-lg">
      <CardContent className="bg-[#424242] p-4">
        {/* Code creator profile */}
        <div className="mb-4 text-white">
          <div className="flex flex-col justify-center gap-2 p-2">
            <span className="font-bold">Code Creator</span>
            <div className="flex flex-row items-center gap-2">
              <img width={25} src={code?.blockie} className="rounded-lg" alt="Creator" />
              <Badge className="cursor-pointer rounded-full bg-black text-sm text-white">
                {`${code.creator?.slice(0, 6)}...${code.creator?.slice(-6)}`}
              </Badge>
              <span>{code.desc}</span>
            </div>
          </div>
        </div>

        {/* Tabs for notebook, discussions, input dataset, and output */}
        <Tabs defaultValue="notebook" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="mb-4 grid w-full grid-cols-2 bg-[#424242]">
            <TabsTrigger
              value="notebook"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Notebook
            </TabsTrigger>
            <TabsTrigger
              value="output"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Compute Output
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notebook">
            <div className="h-[800px] overflow-y-auto">
              <NotebookPreviewer code={code.codeCID} />
            </div>
          </TabsContent>

          <TabsContent value="output">
            <div className="flex h-[800px] flex-col items-center justify-center overflow-y-auto p-5 text-center">
              {/* Compute output */}
              <div className="mb-4 rounded-lg border bg-white p-2 text-black">
                Compute output with Bacalhau
              </div>
              <img src="/images/bacalhau.png" className="max-h-[100px]" alt="Bacalhau" />
              <Button
                className="mt-4 rounded-lg border bg-white text-black"
                onClick={handleToDo}
                value="Compute Output"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeViewer;
