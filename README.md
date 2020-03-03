# jRPC Client

Typed JSONRPC 2.0 Client for Nodejs.

Fully tested to comply with the official [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification)

## Quick Overview

It is used to quickly create JSONRPC Client. Method call is very simple.
## Install
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

The call method can be used to call requests. You can review the usage example below.

```typescript
async function init() {
    const help = await client.call([
        {
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
        }                      
    ]);
    console.log(help);
}
init().catch(e=>console.error(e));
```