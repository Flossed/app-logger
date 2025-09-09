# @zandd/app-logger

A comprehensive logging service for applications using Winston.

## Features

- 🚀 **High Performance**: Built on Winston for reliable logging
- 📁 **File Rotation**: Optional daily file rotation with size limits
- 🎨 **Colorized Console**: Beautiful console output with color coding
- 🌍 **Internationalization**: Configurable date locales
- 📊 **Multiple Log Levels**: Exception, Error, Warn, Info, HTTP, Trace, Debug
- 🔧 **Configurable**: Highly customizable configuration options
- 📝 **TypeScript Support**: Full TypeScript definitions included
- 🏠 **Application Optimized**: Designed for general application logging

## Installation

### NPM Registry (Recommended)
```bash
npm install @zandd/app-logger
```

### Yarn
```bash
yarn add @zandd/app-logger
```

### Local Development Installation
```bash
# Clone and install locally for development
git clone https://github.com/Flossed/app-logger.git
cd app-logger
npm install
npm test
```

## Quick Start

```javascript
const AppLogger = require('@zandd/app-logger');

// Create a logger instance
const logger = new AppLogger('my-module');

// Start logging
await logger.info('Application started successfully');
await logger.debug('Debug information', { temperature: 25.5, humidity: 60 });
await logger.error('An error occurred', { error: 'Database connection failed' });
```

## Configuration Options

```javascript
const config = {
  logTracelevel: 'info',        // Log level: exception|error|warn|info|http|trace|debug
  consoleOutput: 'on',          // Console output: 'on'|'off'
  logPath: './logs/',           // Path for log files
  dateLocale: 'de-DE',          // Date formatting locale
  fileRotation: true,           // Enable daily file rotation
  maxFileSize: '20m',           // Maximum file size before rotation
  maxFiles: '14d'               // Keep files for 14 days
};

const logger = new AppLogger('my-service', config);
```

## API Reference

### Constructor

```javascript
new AppLogger(route, config)
```

- **route** (string): Module/service name for the logger
- **config** (object, optional): Configuration options

### Logging Methods

All logging methods are async and return a Promise:

```javascript
// Basic logging
await logger.info(message, [object])
await logger.debug(message, [object])
await logger.trace(message, [object])
await logger.warn(message, [object])
await logger.error(message, [object])
await logger.exception(message, [object])
await logger.http(message, [object])

// Generic logging
await logger.genLog(level, message, [object])
```

### Utility Methods

```javascript
// Get current configuration
const config = logger.getConfig();

// Update configuration
logger.updateConfig({ logTracelevel: 'debug' });

// Close logger and cleanup
await logger.close();
```

## Log Levels

The logger supports 7 log levels (in order of priority):

1. **exception** (0) - Critical exceptions
2. **error** (1) - Error conditions  
3. **warn** (2) - Warning conditions
4. **info** (3) - Informational messages
5. **http** (4) - HTTP request/response logs
6. **trace** (5) - Trace information
7. **debug** (6) - Debug information

## Log Format

Logs are formatted as:
```
DD.MM.YYYY, HH:MM:SS |     LEVEL | Message | [Optional Object]
```

Example:
```
26.05.2025, 14:30:15 |      INFO | Temperature sensor reading | {"temp":25.5,"humidity":60}
26.05.2025, 14:30:16 |     ERROR | Sensor connection failed | {"sensor":"DHT22","error":"timeout"}
```

## File Organization

When file rotation is enabled:
- Files are created with format: `route-YYYY-MM-DD-DATE.log`
- Rotation happens daily at midnight
- Old files are automatically cleaned up based on `maxFiles` setting

When file rotation is disabled:
- Single file with format: `route-YYYYMMDD.log`

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import AppLogger, { LoggerConfig } from '@zandd/app-logger';

const config: LoggerConfig = {
  logTracelevel: 'debug',
  consoleOutput: 'on',
  fileRotation: true
};

const logger = new AppLogger('my-typescript-service', config);
await logger.info('TypeScript logger initialized');
```

## Examples

### Basic Usage
```javascript
const AppLogger = require('@zandd/app-logger');
const logger = new AppLogger('temperature-service');

// Log sensor readings
await logger.info('Sensor reading started');
await logger.debug('Raw sensor data', { 
  temperature: 25.5, 
  humidity: 60.2, 
  timestamp: Date.now() 
});

if (temperature > 30) {
  await logger.warn('High temperature detected', { temperature });
}
```

### Advanced Configuration
```javascript
const logger = new AppLogger('iot-gateway', {
  logTracelevel: 'trace',
  consoleOutput: 'on',
  logPath: '/var/log/app/',
  fileRotation: true,
  maxFileSize: '50m',
  maxFiles: '30d',
  dateLocale: 'en-US'
});

// Log HTTP requests
await logger.http('API request received', {
  method: 'POST',
  endpoint: '/api/sensors',
  timestamp: new Date().toISOString()
});
```

### Error Handling
```javascript
try {
  // Some operation that might fail
  await connectToDatabase();
  await logger.info('Database connection successful');
} catch (error) {
  await logger.error('Database connection failed', {
    error: error.message,
    stack: error.stack,
    timestamp: Date.now()
  });
  
  // Log as exception for critical errors
  await logger.exception('Critical system failure', { error });
}
```

### Migration from loggerClass.js

If you're migrating from the original loggerClass.js:

```javascript
// OLD WAY:
// const LoggerService = require('./services/loggerClass');
// const logger = new LoggerService('my-module');

// NEW WAY:
const AppLogger = require('@zandd/app-logger');
const logger = new AppLogger('my-module');

// All existing method calls work exactly the same!
await logger.info('Application started');
await logger.debug('Debug info', { data: 'value' });
await logger.error('Error occurred', { error: 'details' });
```

## Dependencies

- **winston**: ^3.8.0 - Core logging functionality
- **winston-daily-rotate-file**: For file rotation (automatically included)

## License

MIT License - see [LICENSE](LICENSE) file for details.

This package is open source and available under the MIT License.

## Author

Daniel S. A. Khan (c) 2021-2025

## Changelog

### v1.1.1 (2025-09-09)
- **Documentation updates** for public npm package
- Updated installation instructions to use public npm registry
- Corrected license information from UNLICENSED to MIT License
- Updated package status note to reflect public availability
- Final preparation for npm publishing

### v1.1.0 (2025-09-09)
- **Major version bump** to supersede v1.0.2 and establish clear versioning
- Prepared package for public npm registry publishing
- Updated repository URL for public GitHub repository
- Consolidated all improvements from v1.0.1 into stable v1.1.0 release
- Ready for npm publish with public access

### v1.0.1 (2025-09-09)
- Fixed filename format inconsistencies - removed duplicate date in rotating log files
- Updated package name from `@home-env/app-logger` to `@zandd/app-logger` across all documentation
- Removed circular dependency from package.json
- Consolidated test files and improved test structure
- Fixed test scripts and removed problematic test files
- Updated README installation instructions with correct registry URL
- Improved project consistency and documentation

### v1.0.0
- Initial release
- Winston-based logging with custom levels
- File and console transport support
- TypeScript definitions
- Configurable options
- File rotation support
- Color-coded console output
- Migration from loggerClass.js

---

**Note**: This is a public npm module available at [@zandd/app-logger](https://www.npmjs.com/package/@zandd/app-logger) for application logging.  
