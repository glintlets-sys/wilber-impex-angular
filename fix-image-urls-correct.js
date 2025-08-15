const fs = require('fs');
const path = require('path');

// Read the final CSV file
const csvPath = path.join(__dirname, 'src', 'assets', 'data', 'products-final.csv');
const outputPath = path.join(__dirname, 'src', 'assets', 'data', 'products-final-correct.csv');

try {
  // Read the CSV file
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n');
  
  // Process each line
  const updatedLines = lines.map((line, index) => {
    if (index === 0) {
      // Keep header as is
      return line;
    }
    
    // Parse the CSV line
    const matches = line.match(/"([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)"/);
    if (matches) {
      const name = matches[1];
      const code = matches[2];
      const price = matches[3];
      let productImage = matches[4];
      const variationSize = matches[5];
      const variationColor = matches[6];
      
      // Fix the image URL by properly encoding only the filename part
      if (productImage && productImage.includes('https://www.wilber.co.in/assets/')) {
        // Extract the path part after the base URL
        const baseUrl = 'https://www.wilber.co.in/assets/';
        const pathPart = productImage.replace(baseUrl, '');
        
        // Split the path into directory and filename
        const lastSlashIndex = pathPart.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
          const directory = pathPart.substring(0, lastSlashIndex + 1); // Include the slash
          const filename = pathPart.substring(lastSlashIndex + 1);
          
          // Only encode the filename, not the directory
          const encodedFilename = encodeURIComponent(filename);
          
          // Reconstruct the full URL
          productImage = baseUrl + directory + encodedFilename;
        }
      }
      
      return `"${name}","${code}","${price}","${productImage}","${variationSize}","${variationColor}"`;
    }
    
    return line; // Return original line if parsing fails
  });
  
  // Write updated content to new file
  const updatedContent = updatedLines.join('\n');
  fs.writeFileSync(outputPath, updatedContent, 'utf8');
  
  console.log('✅ Successfully fixed image URLs:');
  console.log('   - Preserved folder structure exactly as in JSON');
  console.log('   - Only encoded filenames with spaces/special characters');
  console.log('   - Maintained accurate paths from original data');
  console.log(`📁 Updated file: ${outputPath}`);
  
  // Show some examples
  console.log('\n📊 Sample data with correct URLs:');
  const sampleLines = updatedLines.slice(1, 6); // First 5 data rows
  sampleLines.forEach(line => {
    console.log(`   ${line}`);
  });
  
} catch (error) {
  console.error('❌ Error fixing image URLs:', error.message);
}

