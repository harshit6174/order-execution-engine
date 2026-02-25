# Order Execution Engine

## Overview

This project implements an asynchronous order execution engine that processes orders via a queue-based architecture and streams real-time execution updates to clients using WebSockets.
The focus is on backend system design, execution flow, concurrency handling, and reliability, not on real blockchain integrations.

## Chosen Order Type

### Implemented Order Type: Market Order

A market order executes immediately at the best available price.
This order type was chosen because it best demonstrates DEX routing, real-time execution flow, and asynchronous processing.

### Extending to Other Order Types

Limit Orders can be supported by adding a limitPrice field and executing the order only when the routed DEX price satisfies the constraint.

Stop Orders can be implemented by monitoring market prices and enqueuing the execution job only after the trigger price is reached.

The existing execution engine (queue, worker, WebSocket) remains unchanged; only pre-execution conditions are extended

## High-Level System Design

**Client**
  |
  | POST /api/orders/execute
  |
**API Server (Fastify)**
  |
  | Create order (DB)
  | Enqueue execution job
  ↓
**Redis Queue (BullMQ)**
  |
  | Dequeue job
  ↓
**Worker**
  |
  | Route order → Execute → Update DB
  | Emit status updates
  ↓
**WebSocket**
  |
Client receives real-time updates


## Core Components

**1.API Server**

-->Accepts orders via HTTP

-->Persists initial order state

-->Enqueues execution jobs

-->Hosts WebSocket endpoint for live updates

**2.Queue (Redis + BullMQ)**

-->Decouples API from execution

-->Enables concurrent processing

-->Provides retry and backoff support

**3.Worker**

-->Consumes jobs asynchronously

-->Performs DEX routing

-->Executes orders (mocked)

-->Updates order state

-->Emits WebSocket events

**4.Database (PostgreSQL)**

-->Stores order lifecycle states

-->Acts as the source of truth

-->Enables post-mortem analysis

**5.WebSocket Layer**

-->Upgrades HTTP to WebSocket

-->Streams real-time execution events

-->One WebSocket connection per order

## Order Lifecycle

| State       | Description                    |
| ----------- | ------------------------------ |
| `pending`   | Order created and stored       |
| `routing`   | Worker started processing      |
| `building`  | DEX selected                   |
| `confirmed` | Execution successful           |
| `failed`    | Execution failed after retries |


Note : pending is stored in the database only.
WebSocket streams execution events starting from routing.

## DEX Routing Logic

The engine simulates routing between multiple DEXs (e.g., Raydium and Meteora).

    Each DEX returns a mocked quote with slight price variation

    Prices are compared

    The best-priced DEX is selected

    Routing decisions are logged in the worker

This models best-execution logic without relying on external SDKs.

Queue, Retry & Error Handling

    Orders are enqueued with maximum 3 retry attempts

    Retries use exponential backoff

    Worker throws errors to trigger retries

    After retries are exhausted:

        Order is marked as failed

        Failure is emitted via WebSocket

        State is persisted for analysis

This mirrors real-world background job systems.

## WebSocket Execution Updates

Endpoint : ws://localhost:3000/api/orders/ws?orderId=<ORDER_ID>

Behavior

    Same HTTP server upgrades to WebSocket

    Client subscribes using orderId

    Execution status is streamed in real time

Example Messages

{ "status": "routing" }
{ "status": "building", "dex": "meteora" }
{ "status": "confirmed", "txHash": "0xabc123" }

## End-to-End Flow

1.Client submits an order via HTTP

2.API creates order and enqueues job

3.Worker picks up job asynchronously

4.Order is routed to best DEX

5.Execution is simulated

6.Order status is updated in DB

7.WebSocket streams live updates to client


## Setup Instructions

**Prerequisites**

Node.js (v18+)

Docker

PostgreSQL

Redis

**Start Redis**
docker run -d -p 6379:6379 redis

**Install Dependencies** 
npm install

**Start Worker**
npm run worker

**Start API server**
npm run dev

## Testing

Unit and integration tests cover:

DEX routing logic

Queue configuration and retry behavior

WebSocket lifecycle semantics

Worker input contracts

Total tests: 15

Run tests with:
npm test


## Design Principles

    Asynchronous, non-blocking execution

    Clear separation of concerns

    Queue-driven reliability

    Event-based real-time updates

    Strong typing (no any)

    Extensible order model