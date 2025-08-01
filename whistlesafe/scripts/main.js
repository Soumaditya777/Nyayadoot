document.addEventListener('DOMContentLoaded', function() {
    // Handle file upload display
    const fileInput = document.getElementById('evidence');
    const fileNameDisplay = document.getElementById('fileName');
    
    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
            } else {
                fileNameDisplay.textContent = 'Choose file';
            }
        });
    }
    
    // Handle form submission
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show processing modal
            const modal = document.getElementById('statusModal');
            modal.classList.remove('hidden');
            
            // Simulate AI analysis progress
            simulateAnalysis();
        });
    }
    
    // Handle copy report ID on success page
    const copyButton = document.getElementById('copyId');
    if (copyButton) {
        copyButton.addEventListener('click', function() {
            const reportId = document.getElementById('reportId').textContent;
            navigator.clipboard.writeText(reportId).then(() => {
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            });
        });
    }
    
    // Real-time credibility analysis as user types
    const descriptionField = document.getElementById('description');
    if (descriptionField) {
        descriptionField.addEventListener('input', function() {
            analyzeCredibility(this.value);
        });
    }
});

function simulateAnalysis() {
    const progressBar = document.getElementById('analysisProgress');
    const analysisDetails = document.getElementById('analysisDetails');
    const analysisResults = document.getElementById('analysisResults');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Show analysis results
            analysisDetails.classList.remove('hidden');
            
            // Simulate AI findings
            const findings = [
                "Report contains specific details (high credibility)",
                "No identifying information detected (safe)",
                "Similar reports found in database (possible pattern)",
                "Language analysis suggests genuine concern",
                "Forwarding to appropriate authorities"
            ];
            
            analysisResults.innerHTML = findings.map(f => `<li>${f}</li>`).join('');
            
            // Redirect to success page after delay
            setTimeout(() => {
                window.location.href = 'success.html';
            }, 3000);
        }
    }, 200);
}

function analyzeCredibility(text) {
    if (!text || text.length < 50) {
        document.getElementById('credibilityIndicator').classList.add('hidden');
        document.getElementById('duplicateWarning').classList.add('hidden');
        return;
    }
    
    // Show the credibility indicator
    const indicator = document.getElementById('credibilityIndicator');
    indicator.classList.remove('hidden');
    
    // Get NLP analysis
    const analysis = analyzeTextWithNLP(text);
    
    // Update credibility score
    const credibilityFill = document.querySelector('.credibility-fill');
    const credibilityPercentage = document.querySelector('.credibility-percentage');
    
    credibilityFill.style.width = `${analysis.score}%`;
    credibilityPercentage.textContent = `${analysis.score}%`;
    
    // Color coding based on score
    if (analysis.score >= 70) {
        credibilityFill.style.backgroundColor = '#27ae60'; // Green
    } else if (analysis.score >= 40) {
        credibilityFill.style.backgroundColor = '#f39c12'; // Orange
    } else {
        credibilityFill.style.backgroundColor = '#e74c3c'; // Red
    }
    
    // Show duplicate warning if needed
    const duplicateWarning = document.getElementById('duplicateWarning');
    if (analysis.isDuplicate) {
        duplicateWarning.classList.remove('hidden');
    } else {
        duplicateWarning.classList.add('hidden');
    }
}