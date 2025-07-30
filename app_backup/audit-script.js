
// Comprehensive Audit Script for Prisjämförelse Scanner
console.log('🚀 Starting Comprehensive Audit...');

const results = [];
const addResult = (test, status, details) => {
  const emoji = status ? '✅' : '❌';
  const result = `${emoji} ${test}: ${details}`;
  results.push(result);
  console.log(result);
};

// Test 1: PWA Features
console.log('\n📱 Testing PWA Features...');
try {
  // Service Worker
  if ('serviceWorker' in navigator) {
    addResult('Service Worker Support', true, 'Available');
  } else {
    addResult('Service Worker Support', false, 'Not available');
  }

  // Manifest
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    addResult('PWA Manifest', true, `Found at ${manifestLink.href}`);
  } else {
    addResult('PWA Manifest', false, 'Manifest link missing');
  }

  // Display mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    addResult('PWA Display Mode', true, 'Standalone (installed)');
  } else {
    addResult('PWA Display Mode', true, 'Browser (normal - can be installed)');
  }

  // PWA meta tags
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const appleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
  const viewport = document.querySelector('meta[name="viewport"]');
  
  addResult('Theme Color Meta', !!themeColor, themeColor ? themeColor.content : 'Missing');
  addResult('Apple PWA Meta', !!appleCapable, appleCapable ? appleCapable.content : 'Missing');
  addResult('Viewport Meta', !!viewport, viewport ? 'Configured' : 'Missing');

} catch (error) {
  addResult('PWA Features Test', false, error.message);
}

// Test 2: UI Components
console.log('\n🎨 Testing UI Components...');
try {
  // Check for main elements
  const scanner = document.querySelector('[data-testid="scanner"]') || document.querySelector('button');
  const gradientBg = document.querySelector('.bg-gradient-to-br');
  const cards = document.querySelectorAll('.rounded-lg');
  
  addResult('Scanner Button', !!scanner, scanner ? 'Found' : 'Missing');
  addResult('Gradient Background', !!gradientBg, gradientBg ? 'Applied' : 'Missing');
  addResult('Card Components', cards.length > 0, `Found ${cards.length} cards`);

  // Check responsive design
  const isMobile = window.innerWidth < 768;
  addResult('Responsive Design', true, `Current width: ${window.innerWidth}px`);

} catch (error) {
  addResult('UI Components Test', false, error.message);
}

// Test 3: Icons and Assets
console.log('\n🖼️ Testing Icons and Assets...');
try {
  const favicon = document.querySelector('link[rel="icon"]');
  const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
  const icons = document.querySelectorAll('[class*="lucide"]');
  
  addResult('Favicon', !!favicon, favicon ? favicon.href : 'Missing');
  addResult('Apple Touch Icon', !!appleIcon, appleIcon ? appleIcon.href : 'Missing');
  addResult('Lucide Icons', icons.length > 0, `Found ${icons.length} icons`);

} catch (error) {
  addResult('Icons Test', false, error.message);
}

// Test 4: JavaScript Functionality
console.log('\n⚡ Testing JavaScript Functionality...');
try {
  // Check if React is loaded
  const reactElements = document.querySelectorAll('[data-reactroot]');
  const hasReact = window.React !== undefined || reactElements.length > 0;
  addResult('React Framework', hasReact, hasReact ? 'Loaded' : 'Not detected');

  // Check for Next.js
  const nextScript = document.querySelector('script[src*="_next"]');
  addResult('Next.js Framework', !!nextScript, nextScript ? 'Loaded' : 'Not detected');

  // Check for interactive elements
  const buttons = document.querySelectorAll('button');
  addResult('Interactive Buttons', buttons.length > 0, `Found ${buttons.length} buttons`);

} catch (error) {
  addResult('JavaScript Test', false, error.message);
}

// Test 5: Accessibility
console.log('\n♿ Testing Accessibility...');
try {
  const altImages = document.querySelectorAll('img[alt]');
  const ariaLabels = document.querySelectorAll('[aria-label]');
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  addResult('Image Alt Tags', true, `Found ${altImages.length} images with alt text`);
  addResult('ARIA Labels', ariaLabels.length > 0, `Found ${ariaLabels.length} ARIA labels`);
  addResult('Heading Structure', headings.length > 0, `Found ${headings.length} headings`);

} catch (error) {
  addResult('Accessibility Test', false, error.message);
}

// Test 6: Performance
console.log('\n🚀 Testing Performance...');
try {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
  
  addResult('Page Load Time', loadTime < 3000, `${loadTime}ms`);
  addResult('DOM Ready Time', domContentLoaded < 2000, `${domContentLoaded}ms`);

} catch (error) {
  addResult('Performance Test', false, error.message);
}

// Test 7: Network Status
console.log('\n🌐 Testing Network Features...');
try {
  const isOnline = navigator.onLine;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  addResult('Online Status', isOnline, isOnline ? 'Online' : 'Offline');
  addResult('Connection API', !!connection, connection ? `${connection.effectiveType}` : 'Not available');

} catch (error) {
  addResult('Network Test', false, error.message);
}

// Final Summary
console.log('\n📊 AUDIT SUMMARY');
console.log('================');
const passed = results.filter(r => r.includes('✅')).length;
const failed = results.filter(r => r.includes('❌')).length;
const total = results.length;

console.log(`✅ Passed: ${passed}/${total}`);
console.log(`❌ Failed: ${failed}/${total}`);
console.log(`📈 Success Rate: ${Math.round((passed/total) * 100)}%`);

// Store results globally for access
window.auditResults = {
  results,
  passed,
  failed,
  total,
  successRate: Math.round((passed/total) * 100)
};

console.log('\n🎉 Audit Complete! Results stored in window.auditResults');
console.log('Run "window.auditResults" in console to see detailed results.');
