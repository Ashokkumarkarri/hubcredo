const serpApiService = require('./services/serpApiService');
require('dotenv').config();

async function test() {
    console.log('Testing SerpAPI search...');
    try {
        // Test with a known company
        const query = 'Google'; 
        console.log(`Searching for: ${query}`);
        const result = await serpApiService.searchCompany(query);
        console.log('Result:', JSON.stringify(result, null, 2));

        if (result.keyPeople && result.keyPeople.length > 0) {
            console.log('\nKey People Found:');
            result.keyPeople.forEach(p => console.log(`- ${p.name} (${p.role}) ${p.link ? '- ' + p.link : ''}`));
        } else {
            console.log('\nNo Key People found.');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

test();
