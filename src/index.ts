/*
 * @Author: tackchen
 * @Date: 2022-09-27 22:49:01
 * @Description: Class-based disable devtool implementation
 */
import './utils/log';
import { disableKeyAndMenu } from './utils/key-menu';
import { initInterval } from './utils/interval';
import { getUrlParam, initIS, IS } from './utils/util';
import { mergeConfig, config } from './utils/config';
import md5 from './utils/md5';
import version from './version';
import { initDetectors } from './detector/index';
import { DetectorType } from './utils/enum';
import { isDevToolOpened } from './utils/open-state';
import { IConfig, IDisableDevtool } from './type';
import { initLogs } from './utils/log';
import { checkScriptUse } from './plugins/script-use';

export class DisableDevtoolClass {
  private _isRunning: boolean = false;
  private _isSuspend: boolean = false;

  // Static properties
  public static md5 = md5;
  public static version = version;
  public static DetectorType = DetectorType;
  public static isDevToolOpened = isDevToolOpened;

  // Instance properties
  public get isRunning(): boolean {
    return this._isRunning;
  }

  public get isSuspend(): boolean {
    return this._isSuspend;
  }

  public set isSuspend(value: boolean) {
    this._isSuspend = value;
  }

  // Instance methods
  public md5(value: string): string {
    return md5(value);
  }

  public get version(): string {
    return version;
  }

  public get DetectorType() {
    return DetectorType;
  }

  public isDevToolOpened(): boolean {
    return isDevToolOpened();
  }

  /**
   * Initialize and start the disable devtool protection
   * @param opts Configuration options
   * @returns Result object with success status and reason
   */
  public init(opts?: Partial<IConfig>): { success: boolean; reason: string } {
    const r = (reason = '') => ({ success: !reason, reason });

    if (this._isRunning) return r('already running');

    initIS(); // ! 首先初始化env
    initLogs(); // 然后初始化log
    mergeConfig(opts);

    // 被 token 绕过 或者
    if (this.checkTk()) return r('token passed');

    // 开启了保护seo 并且 是seobot
    if (config.seo && IS.seoBot) return r('seobot');

    this._isRunning = true;

    // Create a wrapper object that implements IDisableDevtool interface
    const wrapper: IDisableDevtool = Object.assign((opts?: Partial<IConfig>) => this.init(opts), {
      isRunning: this._isRunning,
      isSuspend: this._isSuspend,
      md5,
      version,
      DetectorType,
      isDevToolOpened,
    });

    // Update wrapper properties to reflect current state
    Object.defineProperty(wrapper, 'isRunning', {
      get: () => this._isRunning,
      enumerable: true,
    });

    Object.defineProperty(wrapper, 'isSuspend', {
      get: () => this._isSuspend,
      set: (value: boolean) => {
        this._isSuspend = value;
      },
      enumerable: true,
    });

    initInterval(wrapper);
    disableKeyAndMenu(wrapper);
    initDetectors();

    return r();
  }

  /**
   * Stop the disable devtool protection
   */
  public stop(): void {
    this._isRunning = false;
    this._isSuspend = false;
  }

  /**
   * Suspend the disable devtool protection temporarily
   */
  public suspend(): void {
    this._isSuspend = true;
  }

  /**
   * Resume the disable devtool protection
   */
  public resume(): void {
    this._isSuspend = false;
  }

  /**
   * Check if token is valid for bypassing protection
   * @returns true if token is valid
   */
  private checkTk(): boolean {
    if (!config.md5) return false;
    // 启用了 md5
    const tk = getUrlParam(config.tkName);
    return md5(tk) === config.md5; // 命中tk
  }
}

// Default export for easy usage
export default DisableDevtoolClass;

// Auto-initialize if script usage is detected
const options = checkScriptUse();
if (options) {
  const instance = new DisableDevtoolClass();
  instance.init(options);
}
