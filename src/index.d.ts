/**
 * Application Logger TypeScript Definitions
 */

export interface LoggerConfig {
  /** Log trace level */
  logTracelevel?: 'exception' | 'error' | 'warn' | 'info' | 'http' | 'trace' | 'debug';
  /** Console output setting */
  consoleOutput?: 'on' | 'off';
  /** Log file path */
  logPath?: string;
  /** Date locale for formatting */
  dateLocale?: string;
  /** Enable file rotation */
  fileRotation?: boolean;
  /** Maximum file size for rotation */
  maxFileSize?: string;
  /** Maximum files to keep */
  maxFiles?: string;
}

export interface LoggingLevels {
  levels: {
    exception: number;
    error: number;
    warn: number;
    info: number;
    http: number;
    trace: number;
    debug: number;
  };
  colors: {
    exception: string;
    error: string;
    warn: string;
    info: string;
    http: string;
    trace: string;
    debug: string;
  };
}

/**
 * Application Logger Service Class
 */
export declare class AppLogger {
  /**
   * Creates a new logger instance
   * @param route The route/module name for the logger
   * @param config Configuration options
   */
  constructor(route: string, config?: LoggerConfig);

  /**
   * Generic logging method
   * @param level Log level
   * @param message Log message
   * @param obj Optional object to log
   */
  genLog(level: string, message: string, obj?: any): Promise<void>;

  /**
   * Log an info message
   * @param message Log message
   * @param obj Optional object to log
   */
  info(message: string, obj?: any): Promise<void>;

  /**
   * Log a trace message
   * @param message Log message
   * @param obj Optional object to log
   */
  trace(message: string, obj?: any): Promise<void>;

  /**
   * Log a debug message
   * @param message Log message
   * @param obj Optional object to log
   */
  debug(message: string, obj?: any): Promise<void>;

  /**
   * Log an error message
   * @param message Log message
   * @param obj Optional object to log
   */
  error(message: string, obj?: any): Promise<void>;

  /**
   * Log an exception message
   * @param message Log message
   * @param obj Optional object to log
   */
  exception(message: string, obj?: any): Promise<void>;

  /**
   * Log a warning message
   * @param message Log message
   * @param obj Optional object to log
   */
  warn(message: string, obj?: any): Promise<void>;

  /**
   * Log an HTTP message
   * @param message Log message
   * @param obj Optional object to log
   */
  http(message: string, obj?: any): Promise<void>;

  /**
   * Close the logger and cleanup resources
   */
  close(): Promise<void>;

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig;

  /**
   * Update configuration
   * @param newConfig New configuration options
   */
  updateConfig(newConfig: Partial<LoggerConfig>): void;
}

export default AppLogger;
