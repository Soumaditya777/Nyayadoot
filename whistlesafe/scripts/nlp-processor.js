// Simulated NLP analysis for credibility and duplicate detection
function analyzeTextWithNLP(text) {
    // This is a simplified simulation - in a real app, you'd call an actual NLP API
    
    // Calculate score based on text characteristics
    let score = 50; // Base score
    
    // Increase score for specific details
    const detailIndicators = [
        { pattern: /\d{1,2}\/\d{1,2}\/\d{4}/g, weight: 10 }, // Dates
        { pattern: /\d{1,2}:\d{2}\s*(AM|PM)?/gi, weight: 5 }, // Times
        { pattern: /(Rs\.?|₹)\s*\d+/g, weight: 15 }, // Monetary amounts
        { pattern: /(meeting|email|document|contract)/gi, weight: 5 }, // Evidence types
        { pattern: /(saw|heard|observed|witnessed)/gi, weight: 8 }, // First-hand accounts
        { pattern: /(manager|officer|director|supervisor)/gi, weight: 7 }, // Position mentions
    ];
    
    detailIndicators.forEach(indicator => {
        const matches = text.match(indicator.pattern);
        if (matches) {
            score += Math.min(matches.length * indicator.weight, indicator.weight * 3);
        }
    });
    
    // Decrease score for vague language
    const vagueIndicators = [
        { pattern: /(someone|somebody|they)/gi, weight: -5 },
        { pattern: /(maybe|perhaps|I think)/gi, weight: -3 },
        { pattern: /(rumor|heard that)/gi, weight: -8 }
    ];
    
    vagueIndicators.forEach(indicator => {
        const matches = text.match(indicator.pattern);
        if (matches) {
            score += matches.length * indicator.weight;
        }
    });
    
    // Check for duplicates (simplified)
    const isDuplicate = checkForSimilarReports(text);
    
    // Ensure score is within bounds
    score = Math.max(10, Math.min(score, 95));
    
    return {
        score: Math.round(score),
        isDuplicate,
        keywords: extractKeywords(text)
    };
}

function checkForSimilarReports(text) {
    // In a real app, this would compare against a database
    // Here we simulate with some common phrases
    
    const commonPhrases = [
        "misuse of funds",
        "financial irregularity",
        "fake invoices",
        "bribe",
        "corruption",
        "kickback",
        "fraud",
        "embezzlement"
    ];
    
    const matches = commonPhrases.filter(phrase => 
        text.toLowerCase().includes(phrase.toLowerCase())
    );
    
    return matches.length > 2;
}

function extractKeywords(text) {
    // Simple keyword extraction - real app would use proper NLP
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'and', 'that', 'this', 'with', 'for', 'was', 'were', 'have', 'has']);
    
    const wordCounts = {};
    words.forEach(word => {
        if (!stopWords.has(word) && word.length > 3) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
    });
    
    return Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);
}