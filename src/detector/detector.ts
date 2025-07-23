/*
 * @Author: tackchen
 * @Date: 2022-09-27 22:10:25
 * @Description: Coding something
 */
import { closeWindow } from '../utils/close-window';
import { config } from '../utils/config';
import { DetectorType } from '../utils/enum';
import { clearDDInterval, clearDDTimeout, registInterval } from '../utils/interval';
import { markDevToolOpenState } from '../utils/open-state';

export interface IDetectorConfig {
  type: DetectorType;
  enabled?: boolean;
}

export abstract class Detector {
  type: DetectorType = DetectorType.Unknown;
  enabled: boolean = true;

  constructor({ type, enabled = true }: IDetectorConfig) {
    this.type = type;
    this.enabled = enabled;
    if (this.enabled) {
      registInterval(this);
      this.init();
    }
  }

  onDevToolOpen() {
    console.warn(`You don't have permission to use DEVTOOL!【type = ${this.type}】`);
    if (config.clearIntervalWhenDevOpenTrigger) {
      clearDDInterval();
    }
    clearDDTimeout();
    config.ondevtoolopen(this.type, closeWindow);
    markDevToolOpenState(this.type);
  }

  init() {}
  abstract detect(time: number): void;
}
