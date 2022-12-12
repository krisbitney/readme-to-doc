import { PolywrapClient } from "@polywrap/client-js";
import path from "path";

jest.setTimeout(30000);

describe("readme-to-docusaurus", () => {

  let uri: string;
  let client: PolywrapClient;

  beforeAll(() => {
    const wrapperPath: string = path.join(__dirname, "..", "build");
    const absPath: string = path.resolve(wrapperPath);
    uri = `wrap://fs/${absPath}`;

    client = new PolywrapClient();
  });

  test("Query works", async () => {

  });

});
