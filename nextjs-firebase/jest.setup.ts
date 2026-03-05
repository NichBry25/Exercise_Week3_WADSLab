import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { ReadableStream, TransformStream, WritableStream } from "stream/web";
import { MessageChannel, MessagePort } from "worker_threads";

(globalThis as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder = TextEncoder;
(globalThis as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
if (!globalThis.ReadableStream) {
  (globalThis as unknown as { ReadableStream: typeof ReadableStream }).ReadableStream = ReadableStream;
}
if (!globalThis.WritableStream) {
  (globalThis as unknown as { WritableStream: typeof WritableStream }).WritableStream = WritableStream;
}
if (!globalThis.TransformStream) {
  (globalThis as unknown as { TransformStream: typeof TransformStream }).TransformStream = TransformStream;
}
if (!globalThis.MessageChannel) {
  (globalThis as unknown as { MessageChannel: typeof MessageChannel }).MessageChannel = MessageChannel;
}
if (!globalThis.MessagePort) {
  (globalThis as unknown as { MessagePort: typeof MessagePort }).MessagePort = MessagePort;
}

const { fetch, Headers, Request, Response } = require("undici") as {
  fetch: typeof globalThis.fetch;
  Headers: typeof globalThis.Headers;
  Request: typeof globalThis.Request;
  Response: typeof globalThis.Response;
};

if (!globalThis.fetch) {
  (globalThis as unknown as { fetch: typeof fetch }).fetch = fetch;
}

if (!globalThis.Headers) {
  (globalThis as unknown as { Headers: typeof Headers }).Headers = Headers;
}

if (!globalThis.Request) {
  (globalThis as unknown as { Request: typeof Request }).Request = Request;
}

if (!globalThis.Response) {
  (globalThis as unknown as { Response: typeof Response }).Response = Response;
}
