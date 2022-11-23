import { JrpcClientBaseException } from "./abstracts";

/**
 * Response Timeout Exception
 */
export class RequestTimeoutException extends JrpcClientBaseException {
  constructor() {
    super("Request Timeout");
  }
}
