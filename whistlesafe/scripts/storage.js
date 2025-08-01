// Simulated storage for reports
class ReportStorage {
    constructor() {
        this.reports = JSON.parse(localStorage.getItem('whistleSafeReports')) || [];
    }
    
    saveReport(report) {
        // Generate a random ID
        const reportId = 'WS-' + Math.floor(100000 + Math.random() * 900000);
        
        // Add timestamp (not shown to user to preserve anonymity)
        const timestamp = new Date().toISOString();
        
        // Store report without any identifiable information
        const reportData = {
            id: reportId,
            category: report.category,
            location: report.location || 'Not specified',
            description: report.description,
            keywords: analyzeTextWithNLP(report.description).keywords,
            credibilityScore: analyzeTextWithNLP(report.description).score,
            status: 'pending',
            timestamp: timestamp
        };
        
        this.reports.push(reportData);
        localStorage.setItem('whistleSafeReports', JSON.stringify(this.reports));
        
        return reportId;
    }
    
    getSimilarReports(text) {
        if (!text) return [];
        
        const currentKeywords = analyzeTextWithNLP(text).keywords;
        if (!currentKeywords.length) return [];
        
        return this.reports.filter(report => {
            const commonKeywords = report.keywords.filter(kw => 
                currentKeywords.includes(kw)
            ).length;
            return commonKeywords >= 2;
        });
    }
}

// Initialize storage
const reportStorage = new ReportStorage();

// Helper function to save report from form
function saveReportFromForm(formData) {
    const report = {
        category: formData.get('category'),
        location: formData.get('location'),
        description: formData.get('description')
    };
    
    return reportStorage.saveReport(report);
}