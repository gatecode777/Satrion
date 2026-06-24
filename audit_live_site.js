const https = require('https');

const url = 'https://satrion.co.in/shop';

const req = https.get(url, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('--- LIVE STATUS AUDIT ---');
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Response Headers:`, JSON.stringify(res.headers, null, 2));
    console.log(`Response HTML length: ${body.length} bytes`);
    
    // Check if the HTML contains the getCachedData or client-side fetch or specific indicators
    const hasNextData = body.includes('__NEXT_DATA__');
    console.log(`Has __NEXT_DATA__: ${hasNextData}`);
    
    if (body.includes('/uploads/migrated-prod-')) {
      console.log('ALERT: The live site STILL contains "/uploads/migrated-prod-" paths in the HTML!');
    } else {
      console.log('No "/uploads/migrated-prod-" paths found.');
    }
    
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
