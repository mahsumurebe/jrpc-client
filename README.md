# JRPC Client
JSONRPC 2.0 Client package for Nodejs. Fully tested to comply with the official [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification)

![GitHub package.json version](https://img.shields.io/github/package-json/v/mahsumurebe/jrpc-client?style=for-the-badge)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/mahsumurebe/jrpc-client?style=for-the-badge)
![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/mahsumurebe/jrpc-client?style=for-the-badge)
![npm](https://img.shields.io/npm/dt/@mahsumurebe/jrpc-client?style=for-the-badge)

![Libraries.io SourceRank, scoped npm package](https://img.shields.io/librariesio/sourcerank/npm/@mahsumurebe/jrpc-client?style=for-the-badge)
![minzipped-size](https://img.shields.io/bundlephobia/minzip/@mahsumurebe/jrpc-client/latest?style=for-the-badge)
![minfied-size](https://img.shields.io/bundlephobia/min/@mahsumurebe/jrpc-client/latest?style=for-the-badge)

![issues-open](https://img.shields.io/github/issues/mahsumurebe/jrpc-client?style=for-the-badge)
![issues-closed](https://img.shields.io/github/issues-closed/mahsumurebe/jrpc-client?style=for-the-badge)
![license](https://img.shields.io/github/license/mahsumurebe/jrpc-client?style=for-the-badge)

## Quick Overview  
  It is used to quickly create JSONRPC Client. Method call is very simple.  

#### To Create a Server
You can use the [@mahsumurebe/jrpc-server](https://www.npmjs.com/package/@mahsumurebe/jrpc-server) package to create a server.

## Install  
For installation, you can run the following command in the directory of your project.
```shell script
npm install @mahsumurebe/jrpc-client  
```  

## Usage
It should not create a JRPCClient instance.  
```typescript
import { JRPCClient, HttpAdapter } from '@mahsumurebe/jrpc-client';

// Create instance
const clientInstance = new JRPCClient(new HttpAdapter('http://localhost:3000'));
// Call start method for connection
await clientInstance.start();
```  

### Call Method
Method calls are made after the JRPCClient instance is created.  
```typescript
// Call foo method with "bar" and "baz" parameters
const response = await clientInstance.call({
  id: 1,
  jsonrpc: "2.0",
  method: "foo",
  params: ["bar", "baz"],
});
console.log(response);
// Response Object
// { id: 1, jsonrpc: "2.0", response: "foo response" }
```  
The call method returns the JSONRPC response. Returns the ErrorResponse class instance if the request response is an error.  

### Batch Call Method 
Call method can be used to call requests. You can review the usage example below.  
  
```typescript
const batchResponse = await clientInstance.call([
  { id: 1, jsonrpc: "2.0", method: "foo", params: ["bar", "baz"] },
  { id: 2, jsonrpc: "2.0", method: "bar", params: ["bar", "baz"] },
  { jsonrpc: "2.0", method: "notification", params: ["bar", "baz"] }, // Notification request does not return value
]);
console.log(batchResponse);
// [
//   { id: 1, jsonrpc: "2.0", response: "foo response" },
//   { id: 2, jsonrpc: "2.0", response: "bar response" },
// ]
```

### Notification Method
Check out the sample code below to make a method notification.

```typescript
// Notification foo method with "bar" and "baz" parameters
await clientInstance.notification({
  jsonrpc: "2.0",
  method: "foo",
  params: ["bar", "baz"],
});
```  
**Note:** The notification method does not return any response. The request is sent to the server. No response is expected from the server.

### Batch Notification Method 

Check out the example below for sending batch notifications.

```typescript
await clientInstance.notification([
  { jsonrpc: "2.0", method: "foo", params: ["bar", "baz"] },
  { jsonrpc: "2.0", method: "bar", params: ["bar", "baz"] },
  { jsonrpc: "2.0", method: "baz", params: ["bar", "baz"] }, 
]);
```

## Adapters

There are HTTP and Websocket adapters available.

### HTTP

HTTP Adapter is used to connect to JRPC Servers served over HTTP Protocol.

```typescript
// Adapter Instance
import {JRPCClient, HttpAdapter} from '@mahsumurebe/jrpc-client';

const adapter = new HttpAdapter('http://localhost:3000');

// Client Instance
const clientInstance = new JRPCClient(adapter);
```

#### Configuration List
Configurations are defined in the object in the first parameter of the construction method when creating the HttpAdapter.

| KEY       | DEFAULT   | DESCRIPTION            | Type              |
|-----------|-----------|------------------------|-------------------|
| schema    | http      | Server schema          | "http" or "https" |
| hostname  | undefined | JSONRPC Server address | string            |
| port      | 80        | Server port            | number            |
| pathname  | "/"       | Server path            | string            |
| headers   | null      | HTTP Headers           | object            |
| timeout   | 10_000    | Timeout                | number            |


### Websocket

Websocket Adapter is used to connect to JRPC Servers served over Websocket Protocol.

```typescript
// Adapter Instance
import { JRPCClient, WebsocketAdapter } from '@mahsumurebe/jrpc-client';

const adapter = new WebsocketAdapter('ws:/localhost:3000');

// Client Instance
const clientInstance = new JRPCClient(adapter);
```

#### Configuration List
Configurations are defined in the object in the first parameter of the construction method when creating the WebsocketAdapter.

| KEY       | DEFAULT   | DESCRIPTION            | Type          |
|-----------|-----------|------------------------|---------------|
| schema    | ws        | Server schema          | "ws" or "wss" |
| hostname  | undefined | JSONRPC Server address | string        |
| port      | 80        | Server port            | number        |
| pathname  | "/"       | Server path            | string        |
| headers   | null      | HTTP Headers           | object        |
| timeout   | 10_000    | Timeout                | number        |

#### Custom Adapters

For custom adapters, you need to extend the adapter class with the `AdapterAbstract` abstract class.
You have to create the abstract functions request, connect and destroy inside the class.

**connect**: A piece of code that provides the protocol connection should be added to this method.

**destroy**: A piece of code that breaks the protocol connection should be added to this method.

**request**: A piece of code that sends the body to the server and parses the output should be added to this method.
_When there is a response from the server, the response object should be sent to the `AdapterAbstract.parseData` function._

## Resources

 - [Changelog](https://github.com/mahsumurebe/jrpc-client/blob/development/CHANGELOG.md)
