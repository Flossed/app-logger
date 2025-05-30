/**
 * @fileoverview Application Logger Service
 * @author Daniel S. A. Khan
 * @copyright Daniel S. A. Khan (c) 2021-2025
 * @description A comprehensive logging service for applications using Winston
 * @version 1.0.0
 */

const winston                          =   require('winston');
require('winston-daily-rotate-file');

const path                             =   require('path');
const fs                               =   require('fs');

/**
 * Default logging configuration
 */
const DEFAULT_CONFIG                  =    {   logTracelevel: 'info',
                                               consoleOutput: 'on',
                                               logPath: './logs/',
                                               dateLocale: 'de-DE',
                                               fileRotation: false,
                                               maxFileSize: '20m',
                                               maxFiles: '14d'
                                           };

/**
 * Date formatting options
 */
const DATE_OPTIONS                    =   {   month: "2-digit",
                                              day: "2-digit", 
                                              year: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              second: "2-digit"
                                          };

/**
 * Custom logging levels
 */
const LOGGING_LEVELS                  =   {   levels: {   exception: 0,
                                                          error: 1,
                                                          warn: 2,
                                                          info: 3,
                                                          http: 4,
                                                          trace: 5,
                                                          debug: 6
                                                      },
                                              colors: {   exception: 'red bold',
                                                          error: 'red',
                                                          warn: 'yellow',
                                                          info: 'green',
                                                          http: 'magenta',
                                                          trace: 'cyan',
                                                          debug: 'blue'
                                                      }
                                          };

/**
 * Formats the current date according to specified locale and options
 * @param {string} locale - The locale for date formatting
 * @returns {string} Formatted date string
 */
function formatDate(locale = 'de-DE') 
{   return new Date(Date.now()).toLocaleString(locale, DATE_OPTIONS);
}



/**
 * Creates a formatted log string
 * @param {Object} info - Winston log info object
 * @returns {string} Formatted log message
 */
function createLogString(info) 
{   const logLevel                     =   info.level.toUpperCase().padStart(9);
    const timestamp                    =   formatDate();
    const message                      =   `${timestamp} | ${logLevel} | ${info.message}`;
    
    // Add object data if present
    if (info.obj) 
    {   return `${message} | ${JSON.stringify(info.obj)}`;
    }    
    return `${message} |`;
}



/**
 * Application Logger Service Class
 * Provides comprehensive logging functionality for applications
 */
class AppLogger 
{   /**
    * Creates a new logger instance
    * @param {string} route - The route/module name for the logger
    * @param {Object} config - Configuration options
    */
    constructor(route, config = {}) 
    {   this.config                      =   { ...DEFAULT_CONFIG, ...config };
        this.route                       =   this._generateRoute(route);
        this.logger                      =   this._createWinstonLogger();
      
      // Ensure log directory exists
      this._ensureLogDirectory();
    }
  
    /**
     * Generates a unique route name with date
     * @param {string} route - Base route name
     * @returns {string} Generated route with date
     * @private
     */
    _generateRoute(route) 
    {   const dateString               =   formatDate(this.config.dateLocale);
        const [datePart]               =   dateString.split(',');
        const [day, month, year]       =   datePart.split('.');
        const formattedDate            =   `${year}${month}${day}`;        
        return `${route}-${formattedDate}`;
    }
  
    /**
     * Ensures the log directory exists
     * @private
     */
    _ensureLogDirectory() 
    {   const logDir                   =   path.dirname(path.resolve(this.config.logPath));
        if (!fs.existsSync(logDir)) 
        {   fs.mkdirSync(logDir, { recursive: true });
        }
    }
  
    /**
     * Creates and configures the Winston logger instance
     * @returns {winston.Logger} Configured Winston logger
     * @private
     */
    _createWinstonLogger() 
    {   const transports               =   [];
      
      // File transport
      if (this.config.fileRotation) 
      {   transports.push(new winston.transports.DailyRotateFile({   filename: path.join(this.config.logPath, `${this.route}-%DATE%.log`),
                                                                     datePattern: 'YYYY-MM-DD',
                                                                     maxSize: this.config.maxFileSize,
                                                                     maxFiles: this.config.maxFiles,
                                                                     format: winston.format.printf(createLogString)
                                                                 }));
      } 
      else 
      {   transports.push(new winston.transports.File({  filename: path.join(this.config.logPath, `${this.route}.log`),
                                                         format: winston.format.printf(createLogString)
                                                      }));
      }
      
      // Console transport  

      if (this.config.consoleOutput === 'on') 
      {   transports.push(new winston.transports.Console({   format: winston.format.combine(     winston.format.printf(createLogString),
                                                                                                 winston.format.colorize({ all: true })
                                                                                            )                                                                                            
                                                         }));
      }
  
      // Add colors to Winston
      winston.addColors(LOGGING_LEVELS.colors);
  
      return winston.createLogger({   levels: LOGGING_LEVELS.levels,
                                      level: this.config.logTracelevel,
                                      transports,
                                      format: winston.format.printf(createLogString)
                                  });
    }
  
    /**
     * Generic logging method
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} [obj] - Optional object to log
     * @returns {Promise<void>}
     */
    async genLog(level, message, obj = null) 
    {   if (obj) 
        {   this.logger.log(level, message, { obj });
        } 
        else 
        {   this.logger.log(level, message);
        }
    }
  
    /**
     * Log an info message
     * @param {string} message - Log message
     * @param {Object} [obj] - Optional object to log
     * @returns {Promise<void>}
     */
    async info(message, obj) 
    {   return this.genLog('info', message, obj);
    }
  
    /**
     * Log a trace message
     * @param {string} message - Log message
     * @param {Object} [obj] - Optional object to log
     * @returns {Promise<void>}
     */
    async trace(message, obj) 
    {   return this.genLog('trace', message, obj);
    }
  
    /**
     * Log a debug message
     * @param {string} message - Log message
     * @param {Object} [obj] - Optional object to log
     * @returns {Promise<void>}
     */
    async debug(message, obj) 
    {   return this.genLog('debug', message, obj);
    }
  
    /**
     * Log an error message
     * @param {string} message - Log message
     * @param {Object} [obj] - Optional object to log
     * @returns {Promise<void>}
     */
    async error(message, obj) 
    {   return this.genLog('error', message, obj);
    }
  
    /**
     * Log an exception message
     * @param {string} message - Log message
     * @param {Object} [obj] - Optional object to log
     * @returns {Promise<void>}
     */
    async exception(message, obj) 
    {   return this.genLog('exception', message, obj);
    }
  
    /**
     * Log a warning message
     * @param {string} message - Log message
     * @param {Object} [obj] - Optional object to log
     * @returns {Promise<void>}
     */
    async warn(message, obj) 
    {   return this.genLog('warn', message, obj);
    }
  
    /**
     * Log an HTTP message
     * @param {string} message - Log message
     * @param {Object} [obj] - Optional object to log
     * @returns {Promise<void>}
     */
    async http(message, obj) 
    {   return this.genLog('http', message, obj);
    }
  
    /**
     * Close the logger and cleanup resources
     * @returns {Promise<void>}
     */
    async close() 
    {   return new Promise((resolve) => {  this.logger.close(() => {   resolve(); }); });
    }
  
    /**
     * Get current configuration
     * @returns {Object} Current configuration
     */
    getConfig() 
    {   return { ...this.config };
    }
  
    /**
     * Update configuration
     * @param {Object} newConfig - New configuration options
     */
    updateConfig(newConfig) 
    {   this.config = { ...this.config, ...newConfig };
        // Recreate logger with new config
        this.logger = this._createWinstonLogger();
    }
}

module.exports                         =   AppLogger;
