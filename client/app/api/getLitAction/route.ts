import fs from "fs";
import path from "path";
import { promisify } from "util";
import { NextResponse, NextRequest } from "next/server";

const readFileAsync = promisify(fs.readFile);

// Get the correct base path based on environment
const getBasePath = () => {
  return process.cwd();
};

export async function GET(req: NextRequest) {
  try {
    console.log("🚀 Starting Get Custom Lit Action Code process...");

    // Get request parameters from URL search params
    const searchParams = req.nextUrl.searchParams;
    const signatures = searchParams.get("signatures")?.split(",") || [];
    const addresses = searchParams.get("addresses")?.split(",") || [];
    const threshold = Number(searchParams.get("threshold")) || 0;

    // Validate required input parameters
    if (!signatures || !Array.isArray(signatures)) {
      return NextResponse.json(
        { error: "signatures must be an array" },
        { status: 400 }
      );
    }

    if (!addresses || !Array.isArray(addresses)) {
      return NextResponse.json(
        { error: "addresses must be an array" },
        { status: 400 }
      );
    }

    if (threshold === undefined || typeof threshold !== "number") {
      return NextResponse.json(
        { error: "threshold must be a number" },
        { status: 400 }
      );
    }

    // Get the base path
    const basePath = getBasePath();

    // Get the path to the litActionCode.js file
    const litActionCodePath = path.join(
      basePath,
      "app",
      "api",
      "litActionCode.js"
    );
    console.log(`📂 Lit Action Code file path: ${litActionCodePath}`);

    // Read the litActionCode.js file
    console.log(`📖 Reading litActionCode.js file from: ${litActionCodePath}`);
    const litActionCodeContent = await readFileAsync(litActionCodePath, "utf8");

    // Replace placeholders with provided values
    const modifiedContent = litActionCodeContent
      .replace("$signatures$", JSON.stringify(signatures))
      .replace("$addresses$", JSON.stringify(addresses))
      .replace("$threshold$", threshold.toString());

    // Set response headers and send the modified code
    return NextResponse.json({
      status: 200,
      body: modifiedContent,
    });
  } catch (error) {
    console.error("get-custom-lit-action-code", error);
    return NextResponse.json({
      error: "Failed to get custom lit action code",
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: "end-to-end process",
    });
  }
}
