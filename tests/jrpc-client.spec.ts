import * as Server from "@mahsumurebe/jrpc-server";
import {
  CONST_RPC_ERROR_CODE_INTERNAL_ERROR,
  CONST_RPC_ERROR_MESSAGE_INTERNAL_ERROR,
} from "@mahsumurebe/jrpc-server/lib/core";
import * as Client from "../src";
import {
  InternalErrorException,
  InvalidParamsException,
  MethodNotFoundException,
  RequestTimeoutException,
} from "../src";
import { generateJRPCClient, generateJRPCServer } from "./utils/utils";

describe("JRPCClient", () => {
  let server: Server.JRPCServer;
  let client: Client.JRPCClient;
  describe("Adapters", () => {
    describe("HTTPAdapter", () => {
      beforeAll(async () => {
        const serverConfig: Server.HttpAdapterConfigInterface = {
          hostname: "localhost",
          port: 3000,
        };

        const clientConfig: Client.HttpAdapterConfigInterface = {
          hostname: serverConfig.hostname,
          port: serverConfig.port,
          schema: "http",
          timeout: 2_000,
        };

        server = await generateJRPCServer(new Server.HttpAdapter(serverConfig));
        client = await generateJRPCClient(new Client.HttpAdapter(clientConfig));
      });
      describe("call", () => {
        it("should be return response", async () => {
          await expect(
            client.call({
              id: 1,
              jsonrpc: "2.0",
              method: "foo",
              params: [1, 2, 3],
            })
          ).resolves.toEqual({
            id: 1,
            jsonrpc: "2.0",
            result: {
              a: 1,
              b: 2,
              c: 3,
            },
          });
        });
        it("should be timeout", async () => {
          await expect(
            client.call({
              id: 2,
              jsonrpc: "2.0",
              method: "timeout",
              params: [],
            })
          ).rejects.toThrow(new RequestTimeoutException());
        });
        it("should be return invalid params error response", async () => {
          await expect(
            client.call({
              id: 2,
              jsonrpc: "2.0",
              method: "bar",
              params: {},
            })
          ).resolves.toEqual(new InvalidParamsException(2));
        });
        it("should be return method not found error response", async () => {
          await expect(
            client.call({
              id: 2,
              jsonrpc: "2.0",
              method: "bar",
              params: [],
            })
          ).resolves.toEqual(new MethodNotFoundException(2));
        });
        it("should be return internal error response", async () => {
          await expect(
            client.call({
              id: 4,
              jsonrpc: "2.0",
              method: "foo-throw",
              params: [],
            })
          ).resolves.toEqual(
            new InternalErrorException(4, {
              data: "error detail",
              code: CONST_RPC_ERROR_CODE_INTERNAL_ERROR,
              message: CONST_RPC_ERROR_MESSAGE_INTERNAL_ERROR,
            })
          );
        });
        it("should be able batch request and return response without notification request", async () => {
          await expect(
            client.call([
              {
                id: 1,
                jsonrpc: "2.0",
                method: "foo",
                params: [1, 2, 3],
              },
              {
                id: 2,
                jsonrpc: "2.0",
                method: "foo",
                params: [4, 5, 6],
              },
              {
                jsonrpc: "2.0",
                method: "foo",
                params: [7, 8, 9],
              },

              {
                id: 3,
                jsonrpc: "2.0",
                method: "foo",
                params: {},
              },
            ])
          ).resolves.toEqual([
            {
              id: 1,
              jsonrpc: "2.0",
              result: {
                a: 1,
                b: 2,
                c: 3,
              },
            },
            {
              id: 2,
              jsonrpc: "2.0",
              result: {
                a: 4,
                b: 5,
                c: 6,
              },
            },
            new InvalidParamsException(3),
          ]);
        });
      });
      describe("notification", () => {
        it("should be no response", async () => {
          await expect(
            client.notification({
              jsonrpc: "2.0",
              method: "foo",
              params: [1, 2, 3],
            })
          ).resolves.toBeUndefined();
        });
        it("should be no response (method not found error response)", async () => {
          await expect(
            client.notification({
              jsonrpc: "2.0",
              method: "bar",
              params: [],
            })
          ).resolves.toBeUndefined();
        });
        it("should be no response (invalid params error response)", async () => {
          await expect(
            client.notification({
              jsonrpc: "2.0",
              method: "bar",
              params: {},
            })
          ).resolves.toBeUndefined();
        });
        it("should be no response (internal error response)", async () => {
          await expect(
            client.notification({
              jsonrpc: "2.0",
              method: "foo-throw",
              params: [],
            })
          ).resolves.toBeUndefined();
        });
      });
      afterAll(async () => {
        await client.destroy();
        await server.shutdown();
        client = undefined;
        server = undefined;
      });
    });
    describe("WebsocketAdapter", () => {
      beforeAll(async () => {
        const serverConfig: Server.WebsocketAdapterConfigInterface = {
          hostname: "localhost",
          port: 3000,
        };

        const clientConfig: Client.WebsocketAdapterConfigInterface = {
          hostname: serverConfig.hostname,
          port: serverConfig.port,
          schema: "ws",
          timeout: 2_000,
        };

        server = await generateJRPCServer(
          new Server.WebsocketAdapter(serverConfig)
        );
        client = await generateJRPCClient(
          new Client.WebsocketAdapter(clientConfig)
        );
      });
      describe("call", () => {
        it("should be return response", async () => {
          await expect(
            client.call({
              id: 1,
              jsonrpc: "2.0",
              method: "foo",
              params: [1, 2, 3],
            })
          ).resolves.toEqual({
            id: 1,
            jsonrpc: "2.0",
            result: {
              a: 1,
              b: 2,
              c: 3,
            },
          });
        });
        it("should be return invalid params error response", async () => {
          await expect(
            client.call({
              id: 2,
              jsonrpc: "2.0",
              method: "bar",
              params: {},
            })
          ).resolves.toEqual(new InvalidParamsException(2));
        });
        it("should be timeout", async () => {
          await expect(
            client.call({
              id: 2,
              jsonrpc: "2.0",
              method: "timeout",
              params: [],
            })
          ).rejects.toThrow(new RequestTimeoutException());
        });
        it("should be return method not found error response", async () => {
          await expect(
            client.call({
              id: 2,
              jsonrpc: "2.0",
              method: "bar",
              params: [],
            })
          ).resolves.toEqual(new MethodNotFoundException(2));
        });
        it("should be return internal error response", async () => {
          await expect(
            client.call({
              id: 4,
              jsonrpc: "2.0",
              method: "foo-throw",
              params: [],
            })
          ).resolves.toEqual(
            new InternalErrorException(4, {
              data: "error detail",
              code: CONST_RPC_ERROR_CODE_INTERNAL_ERROR,
              message: CONST_RPC_ERROR_MESSAGE_INTERNAL_ERROR,
            })
          );
        });
        it("should be able batch request and return response without notification request", async () => {
          await expect(
            client.call([
              {
                id: 1,
                jsonrpc: "2.0",
                method: "foo",
                params: [1, 2, 3],
              },
              {
                id: 2,
                jsonrpc: "2.0",
                method: "foo",
                params: [4, 5, 6],
              },
              {
                jsonrpc: "2.0",
                method: "foo",
                params: [7, 8, 9],
              },
              {
                id: 3,
                jsonrpc: "2.0",
                method: "foo",
                params: {},
              },
            ])
          ).resolves.toEqual([
            {
              id: 1,
              jsonrpc: "2.0",
              result: {
                a: 1,
                b: 2,
                c: 3,
              },
            },
            {
              id: 2,
              jsonrpc: "2.0",
              result: {
                a: 4,
                b: 5,
                c: 6,
              },
            },
            new InvalidParamsException(3),
          ]);
        });
      });
      describe("notification", () => {
        it("should be no response", async () => {
          await expect(
            client.notification({
              jsonrpc: "2.0",
              method: "foo",
              params: [1, 2, 3],
            })
          ).resolves.toBeUndefined();
        });
        it("should be no response (method not found error response)", async () => {
          await expect(
            client.notification({
              jsonrpc: "2.0",
              method: "bar",
              params: [],
            })
          ).resolves.toBeUndefined();
        });
        it("should be no response (invalid params error response)", async () => {
          await expect(
            client.notification({
              jsonrpc: "2.0",
              method: "bar",
              params: {},
            })
          ).resolves.toBeUndefined();
        });
        it("should be no response (internal error response)", async () => {
          await expect(
            client.notification({
              jsonrpc: "2.0",
              method: "foo-throw",
              params: [],
            })
          ).resolves.toBeUndefined();
        });
      });
      afterAll(async () => {
        await client.destroy();
        await server.shutdown();
        client = undefined;
        server = undefined;
      });
    });
  });
});
