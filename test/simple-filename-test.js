/**
 * Simple test to show actual log filenames being created
 */

const AppLogger = require('../src/index.js');
const fs = require('fs');
const path = require('path');

async function testFilenames() {
  console.log('🔍 Testing actual log filenames created...\n');

  // Test 1: Non-rotating file
  console.log('1️⃣ Creating non-rotating logger...');
  const nonRotatingLogger = new AppLogger('simple-test', {
    fileRotation: false,
    logPath: './test-logs-simple/'
  });
  
  console.log('   Writing test message...');
  await nonRotatingLogger.info('Test message');
  
  // Check immediately what files exist
  const logDir = './test-logs-simple/';
  const absoluteLogDir = path.resolve(logDir);
  console.log(`   Checking directory: ${absoluteLogDir}`);
  
  if (fs.existsSync(logDir)) {
    const files = fs.readdirSync(logDir);
    console.log(`   📁 Files found: ${files.length > 0 ? files.join(', ') : 'NONE'}\n`);
  } else {
    console.log('   📁 Directory does not exist yet\n');
  }
  
  // Test 2: Rotating file
  console.log('2️⃣ Creating rotating logger...');
  const rotatingLogger = new AppLogger('rotate-test', {
    fileRotation: true,
    logPath: './test-logs-simple/'
  });
  
  console.log('   Writing test message...');
  await rotatingLogger.info('Test message with rotation');
  
  // Wait a bit and check again
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (fs.existsSync(logDir)) {
    const files = fs.readdirSync(logDir);
    console.log(`   📁 Files after rotation test: ${files.length > 0 ? files.join(', ') : 'NONE'}\n`);
    
    // Analyze each file
    files.forEach(file => {
      const stats = fs.statSync(path.join(logDir, file));
      console.log(`   📄 File: ${file}`);
      console.log(`      Size: ${stats.size} bytes`);
      console.log(`      Modified: ${stats.mtime.toISOString()}`);
      
      // Check for double date pattern
      const doubleDate = /.*-\d{8}-\d{4}-\d{2}-\d{2}\.log$/.test(file);
      const singleDate = /.*-\d{4}-\d{2}-\d{2}\.log$/.test(file);
      const noDate = /.*\.log$/.test(file) && !/.*-\d/.test(file);
      
      if (doubleDate) {
        console.log(`      🚨 DOUBLE DATE DETECTED!`);
      } else if (singleDate) {
        console.log(`      ✅ Single date format`);
      } else if (noDate) {
        console.log(`      📝 No date in filename`);
      } else {
        console.log(`      ❓ Unknown format`);
      }
      console.log('');
    });
  }
  
  // Close loggers
  console.log('3️⃣ Closing loggers...');
  
  try {
    await nonRotatingLogger.close();
    console.log('   ✅ Non-rotating logger closed');
  } catch (err) {
    console.log('   ❌ Error closing non-rotating logger:', err.message);
  }
  
  try {
    await rotatingLogger.close();
    console.log('   ✅ Rotating logger closed');
  } catch (err) {
    console.log('   ❌ Error closing rotating logger:', err.message);
  }
  
  // Final check
  console.log('\n4️⃣ Final file listing:');
  if (fs.existsSync(logDir)) {
    const finalFiles = fs.readdirSync(logDir);
    finalFiles.forEach(file => {
      console.log(`   📄 ${file}`);
    });
    
    if (finalFiles.length === 0) {
      console.log('   (no files found)');
    }
  }
  
  console.log('\n✅ Test completed - check the output above for actual filenames');
  console.log('📁 Test files are left in ./test-logs-simple/ for inspection');
}

// Run the test
testFilenames().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});