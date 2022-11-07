/**
 * WebSocket Adapter Configuration
 *
 *
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @licence MIT
 * @interface
 */
import { HttpAdapterConfigInterface } from "../../http";

export interface WebsocketAdapterConfigInterface
  extends Omit<HttpAdapterConfigInterface, "protocol"> {
  /**
   * protocol
   *
   * @default ws
   * @type {string}
   */
  protocol?: "ws" | "wss";
}
