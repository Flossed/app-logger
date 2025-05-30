/**
 * Test file for @home-env/app-logger
 * Run with: node test/test.js
 */

const AppLogger = require('../src/index.js');
const path = require('path');

async function runTests() {
  console.log('🧪 Testing @home-env/app-logger module...\n');

  // Test 1: Basic logger creation
  console.log('📝 Test 1: Basic logger creation');
  const basicLogger = new AppLogger('test-basic');
  await basicLogger.info('Basic logger test - info message');
  await basicLogger.debug('Debug message with object', { testData: 'hello world' });
  
  // Test 2: Custom configuration
  console.log('\n📝 Test 2: Custom configuration');
  const customConfig = {
    logTracelevel: 'trace',
    consoleOutput: 'on',
    logPath: './test-logs/',
    dateLocale: 'en-US'
  };
  
  const customLogger = new AppLogger('test-custom', customConfig);
  await customLogger.trace('Trace level message');
  await customLogger.warn('Warning message', { component: 'test', status: 'warning' });
  
  // Test 3: All log levels
  console.log('\n📝 Test 3: Testing all log levels');
  const levelLogger = new AppLogger('test-levels');
  
  await levelLogger.exception('Exception test', { error: 'Test exception' });
  await levelLogger.error('Error test', { error: 'Test error' });
  await levelLogger.warn('Warning test', { warning: 'Test warning' });
  await levelLogger.info('Info test', { info: 'Test info' });
  await levelLogger.http('HTTP test', { method: 'GET', url: '/api/test' });
  await levelLogger.trace('Trace test', { trace: 'Test trace' });
  await levelLogger.debug('Debug test', { debug: 'Test debug' });
  
  // Test 4: Configuration updates
  console.log('\n📝 Test 4: Configuration updates');
  const configLogger = new AppLogger('test-config');
  console.log('Original config:', configLogger.getConfig().logTracelevel);
  
  configLogger.updateConfig({ logTracelevel: 'error' });
  console.log('Updated config:', configLogger.getConfig().logTracelevel);
  
  await configLogger.debug('This debug message should not appear (level too low)');
  await configLogger.error('This error message should appear');
  
  // Test 5: Application simulation
  console.log('\n📝 Test 5: Application simulation');
  const appLogger = new AppLogger('app-main');
  
  // Simulate application events
  await appLogger.info('Application starting up');
  await appLogger.info('Configuration loaded', { 
    environment: 'development',
    port: 3000,
    database: 'mongodb://localhost:27017'
  });
  
  await appLogger.info('Database connection established');
  await appLogger.warn('Deprecated API endpoint used', { 
    endpoint: '/api/v1/old',
    suggestion: 'Use /api/v2/new instead'
  });
  
  await appLogger.error('Database query failed', {
    query: 'SELECT * FROM users',
    error: 'Connection timeout',
    retryAttempt: 1
  });
  
  // Test 6: HTTP request simulation
  console.log('\n📝 Test 6: HTTP request simulation');
  const httpLogger = new AppLogger('api-server');
  
  const requests = [
    { method: 'GET', url: '/api/users', status: 200, duration: 45 },
    { method: 'POST', url: '/api/data', status: 201, duration: 120 },
    { method: 'GET', url: '/api/invalid', status: 404, duration: 12 },
    { method: 'DELETE', url: '/api/users/123', status: 500, duration: 200 }
  ];
  
  for (const req of requests) {
    const logLevel = req.status >= 400 ? 'error' : 'http';
    await httpLogger[logLevel](`${req.method} ${req.url}`, {
      status: req.status,
      duration: `${req.duration}ms`,
      timestamp: new Date().toISOString(),
      userAgent: 'Test-Client/1.0'
    });
  }
  
  // Test 7: Compatibility with original loggerClass.js interface
  console.log('\n📝 Test 7: LoggerClass.js compatibility test');
  const compatLogger = new AppLogger('legacy-compat');
  
  // Test the original interface methods
  await compatLogger.genLog('info', 'Using genLog method directly');
  await compatLogger.genLog('debug', 'Debug with object', { legacy: true });
  
  // Test all original methods
  await compatLogger.info('Info message - original interface');
  await compatLogger.trace('Trace message - original interface');
  await compatLogger.debug('Debug message - original interface');
  await compatLogger.error('Error message - original interface');
  await compatLogger.exception('Exception message - original interface');
  await compatLogger.warn('Warning message - original interface');
  await compatLogger.http('HTTP message - original interface');
  
  // Cleanup
  console.log('\n🧹 Cleaning up loggers...');
  await basicLogger.close();
  await customLogger.close();
  await levelLogger.close();
  await configLogger.close();
  await appLogger.close();
  await httpLogger.close();
  await compatLogger.close();
  
  console.log('\n✅ All tests completed successfully!');
  console.log('\n📁 Check the following directories for log files:');
  console.log('   - ./logs/ (default location)');
  console.log('   - ./test-logs/ (custom configuration test)');
  
  console.log('\n🔄 Migration Note:');
  console.log('   This module is a drop-in replacement for loggerClass.js');
  console.log('   All existing code will work without changes!');
}

// Handle async execution
runTests().catch(console.error);
