import { Color } from "../../../domain/color";
import { Cache } from "../cache";

export class AwsCache implements Cache {
  set(xPos: number, yPos: number, color: Color): void {
    // do some redis shit with aws
  }
}