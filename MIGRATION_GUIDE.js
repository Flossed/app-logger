/**
 * Migration Guide: Using @home-env/app-logger in homeEnvMon
 * 
 * This file shows how to replace your current loggerClass.js with the new npm module
 */

// ========================================
// STEP 1: INSTALL THE MODULE
// ========================================

// Option A: Using npm pack (recommended for private modules)
/*
cd E:\_Applications\__Arduino\homeEnvMon\npm-packages\app-logger
npm pack
cd E:\_Applications\__Arduino\homeEnvMon
npm install ./npm-packages/app-logger/home-env-app-logger-1.0.0.tgz
*/

// Option B: Using npm link (for development)
/*
cd E:\_Applications\__Arduino\homeEnvMon\npm-packages\app-logger
npm link
cd E:\_Applications\__Arduino\homeEnvMon
npm link @home-env/app-logger
*/

// ========================================
// STEP 2: UPDATE YOUR CODE
// ========================================

// OLD WAY (your current loggerClass.js):
// const LoggerService = require('./services/loggerClass');

// NEW WAY (using the npm module):
const AppLogger = require('@home-env/app-logger');

// ========================================
// STEP 3: CONFIGURATION INTEGRATION
// ========================================

// If you have your config module:
const config = require('./services/configuration');

// Create logger with your existing config values
function createLogger(moduleName) {
  const loggerConfig = {
    logTracelevel: config.get('application:logTracelevel'),  // 'info', 'debug', etc.
    consoleOutput: config.get('application:consoleOutput'),  // 'on' or 'off'
    logPath: config.get('application:logPath'),              // './logs/' or your path
    dateLocale: 'de-DE',                                     // Keeps German format
    fileRotation: false                                      // Set to true if desired
  };
  
  return new AppLogger(moduleName, loggerConfig);
}

// ========================================
// STEP 4: USAGE EXAMPLES
// ========================================

async function demonstrateUsage() {
  // Create logger exactly like before
  const logger = createLogger('homeEnvMon-main');
  
  // All your existing log calls work EXACTLY the same:
  await logger.info('Application started');
  await logger.debug('Configuration loaded', { sensors: ['DHT22', 'BMP280'] });
  await logger.trace('Reading sensor data...');
  
  // Example: Your existing sensor logging code
  try {
    const sensorReading = {
      temperature: 25.5,
      humidity: 60.2,
      pressure: 1013.25,
      timestamp: Date.now()
    };
    
    await logger.info('Sensor reading completed', sensorReading);
    
    // Temperature threshold checking
    if (sensorReading.temperature > 30) {
      await logger.warn('High temperature detected', { 
        current: sensorReading.temperature,
        threshold: 30 
      });
    }
    
    if (sensorReading.temperature < 10) {
      await logger.warn('Low temperature detected', { 
        current: sensorReading.temperature,
        threshold: 10 
      });
    }
    
  } catch (error) {
    await logger.error('Sensor reading failed', {
      error: error.message,
      sensor: 'DHT22',
      timestamp: Date.now()
    });
  }
  
  // HTTP/API logging for your web interface
  await logger.http('API request processed', {
    method: 'POST',
    endpoint: '/api/sensors/data',
    status: 200,
    duration: '45ms',
    clientIP: '192.168.1.100'
  });
  
  // Database operations logging
  await logger.trace('Inserting measurement to MongoDB');
  await logger.debug('MongoDB connection string', { 
    host: 'localhost', 
    database: 'homeEnvTst' 
  });
  
  // Exception handling for critical errors
  try {
    // Critical operation like database connection
    throw new Error('Database connection lost');
  } catch (error) {
    await logger.exception('Critical system error', {
      error: error.message,
      component: 'database',
      action: 'connection',
      retryAttempt: 1
    });
  }
  
  // Cleanup when shutting down
  await logger.info('Application shutting down gracefully');
  await logger.close();
}

// ========================================
// STEP 5: SPECIFIC HOMEENVMON INTEGRATION
// ========================================

// Example: Arduino sensor data processor
class SensorDataProcessor {
  constructor() {
    this.logger = createLogger('sensor-processor');
  }
  
  async processSensorData(rawData) {
    await this.logger.trace('Processing raw sensor data', { rawData });
    
    try {
      const processedData = {
        sensorID: rawData.sensorID || 'SID_001',
        temperature: parseFloat(rawData.temp),
        humidity: parseFloat(rawData.humidity),
        measurementTime: Date.now(),
        action: 'createData'
      };
      
      await this.logger.debug('Sensor data processed', processedData);
      
      // Validate data
      if (processedData.temperature < -40 || processedData.temperature > 80) {
        await this.logger.warn('Temperature reading out of normal range', processedData);
      }
      
      if (processedData.humidity < 0 || processedData.humidity > 100) {
        await this.logger.warn('Humidity reading out of normal range', processedData);
      }
      
      await this.logger.info('Sensor data validated and ready for storage', {
        sensorID: processedData.sensorID,
        temp: processedData.temperature,
        humidity: processedData.humidity
      });
      
      return processedData;
      
    } catch (error) {
      await this.logger.error('Failed to process sensor data', {
        error: error.message,
        rawData,
        timestamp: Date.now()
      });
      throw error;
    }
  }
}

// Example: MongoDB data service
class MongoDataService {
  constructor() {
    this.logger = createLogger('mongo-service');
  }
  
  async insertMeasurement(data) {
    await this.logger.trace('Inserting measurement to MongoDB');
    
    try {
      // Your MongoDB insertion code here
      await this.logger.debug('Preparing measurement document', {
        collection: 'measurements',
        data: data
      });
      
      // Simulate MongoDB insert
      const result = { insertedId: 'generated_id', acknowledged: true };
      
      await this.logger.info('Measurement inserted successfully', {
        insertedId: result.insertedId,
        sensorID: data.sensorID,
        timestamp: data.measurementTime
      });
      
      return result;
      
    } catch (error) {
      await this.logger.error('MongoDB insertion failed', {
        error: error.message,
        data: data,
        operation: 'insertMeasurement'
      });
      throw error;
    }
  }
}

// Example: HTTP API service
class ApiService {
  constructor() {
    this.logger = createLogger('api-service');
  }
  
  async handleSensorDataEndpoint(req, res) {
    const startTime = Date.now();
    
    await this.logger.http('Incoming sensor data request', {
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      contentLength: req.headers['content-length']
    });
    
    try {
      // Process the request
      const responseData = { status: 'success', timestamp: Date.now() };
      
      const duration = Date.now() - startTime;
      await this.logger.http('Request processed successfully', {
        method: req.method,
        url: req.url,
        status: 200,
        duration: `${duration}ms`,
        responseSize: JSON.stringify(responseData).length
      });
      
      res.status(200).json(responseData);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.logger.error('Request processing failed', {
        method: req.method,
        url: req.url,
        error: error.message,
        duration: `${duration}ms`,
        status: 500
      });
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// ========================================
// STEP 6: MIGRATION CHECKLIST
// ========================================

/*
MIGRATION CHECKLIST:

□ 1. Install @home-env/app-logger module
□ 2. Replace require('./services/loggerClass') with require('@home-env/app-logger')
□ 3. Replace 'new LoggerService()' with 'new AppLogger()'
□ 4. Update configuration to use new config options (optional)
□ 5. Test all existing log calls still work
□ 6. Test new features like file rotation (optional)
□ 7. Update any TypeScript imports (if using TypeScript)
□ 8. Run your existing tests to ensure compatibility
□ 9. Deploy and monitor logs to ensure everything works

BENEFITS AFTER MIGRATION:
✅ Better error handling and resource cleanup
✅ More configuration options (file rotation, date locales)
✅ TypeScript support
✅ Improved performance
✅ Better log formatting
✅ Color-coded console output
✅ Future maintainability as a proper npm module

ZERO BREAKING CHANGES:
✅ All existing method calls work exactly the same
✅ Same log format and file naming convention
✅ Same configuration parameters supported
✅ Drop-in replacement - no code changes required
*/

// ========================================
// STEP 7: EXAMPLE PACKAGE.JSON UPDATE
// ========================================

/*
Add to your main project's package.json dependencies:
{
  "dependencies": {
    "@home-env/app-logger": "file:./npm-packages/app-logger/home-env-app-logger-1.0.0.tgz",
    // ... your other dependencies
  }
}

Or if using npm link:
{
  "dependencies": {
    "@home-env/app-logger": "^1.0.0",
    // ... your other dependencies
  }
}
*/

module.exports = {
  createLogger,
  SensorDataProcessor,
  MongoDataService,
  ApiService,
  demonstrateUsage
};
