# jRPC Client
JSONRPC 2.0 Client package for Nodejs. Fully tested to comply with the official [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification)

![GitHub package.json version](https://img.shields.io/github/package-json/v/mahsumurebe/jrpc-client?style=for-the-badge)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/mahsumurebe/jrpc-client?style=for-the-badge)
![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/mahsumurebe/jrpc-client?style=for-the-badge)
![npm](https://img.shields.io/npm/dt/@mahsumurebe/jrpc-client?style=for-the-badge)

![Libraries.io SourceRank, scoped npm package](https://img.shields.io/librariesio/sourcerank/npm/@mahsumurebe/jrpc-client?style=for-the-badge)
![minzipped-size](https://img.shields.io/bundlephobia/minzip/@mahsumurebe/jrpc-client/1.2.5?style=for-the-badge)
![minfied-size](https://img.shields.io/bundlephobia/min/@mahsumurebe/jrpc-client/1.2.5?style=for-the-badge)

![issues-open](https://img.shields.io/github/issues/mahsumurebe/jrpc-client?style=for-the-badge)
![issues-closed](https://img.shields.io/github/issues-closed/mahsumurebe/jrpc-client?style=for-the-badge)
![license](https://img.shields.io/github/license/mahsumurebe/jrpc-client?style=for-the-badge)

## Quick Overview  
  It is used to quickly create JSONRPC Client. Method call is very simple.  

#### To Create a Server
You can use the [@mahsumurebe/jrpc-server](https://www.npmjs.com/package/@mahsumurebe/jrpc-server) package to create a server.

## Install  
For installation, you can run the following command in the directory of your project.
```  
npm install @mahsumurebe/jrpc-client  
```  
  
## Usage  
  
It should not create a Client Class instance.  
```typescript  
const client = new RPCClient({ 
	url: 'http://127.0.0.1:3000',  
});  
```  
Method calls are made after the Client Class instance is created.  
```typescript  
async function init() {  
 const help = await client.call('help');  
  console.log(help);  
}  
init().catch(e=>console.error(e));  
```  
The call method returns the JSONRPC response. Returns the ErrorResponse class instance if the request response is an error.  

## Batch Call  
Call method can be used to call requests. You can review the usage example below.  
  
```typescript  
async function init() {  
    const help = await client.call([{
        method: 'help'
    },
    {
    method: 'anotherFn',
    params: [
      "param1",
      2,
      {
        "param": "obj"
      }
    ]
  }]);  
  console.log(help);  
}  
init().catch(e=>console.error(e));  
```

## Configuration List
Configurations are defined in the object in the first parameter of the construction method when creating the Client object.

| KEY        | DEFAULT | DESCRIPTION                                 | EXAMPLE                                                                            |
|------------|---------|---------------------------------------------|------------------------------------------------------------------------------------|
| url        | null    | JSONRPC Server address                      | "http://127.0.0.1:3000"                                                            |
| pathname   | "/"     | Server path                                 | /jsonrpc                                                                           |
| proxy      | null    | Proxy                                       | { host: '127.0.0.1', port: 8888, auth:{ username: "admin", password:"password" } } |
| auth       | null    | RPC Credentials                             | { username: "rpcuser", password:"rpcpassword" }                                    |
| headers    | null    | HTTP Headers                                | { 'X-Header': 'Header Value' }                                                     |
| paramsType | "array" | Default parameter type  (array  or object ) | "object"                                                                           |
| axios      | null    | Axios Config                                |                                                                                    |

## Resources

 - [Changelog](https://github.com/mahsumurebe/jrpc-client/blob/development/CHANGELOG.md)
 - [Axios Config Keys](https://github.com/axios/axios#request-config)
