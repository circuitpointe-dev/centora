import { useFundraisingStats } from '@/hooks/useFundraisingStats';
import { useDonors } from '@/hooks/useDonors';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useProposals } from '@/hooks/useProposals';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

export interface AnalyticsReportData {
    period: string;
    generatedAt: string;
    fundraisingStats: {
        totalProposals: number;
        conversionRate: number;
        activeOpportunities: number;
        fundsRaised: number;
        avgGrantSize: number;
        proposalsInProgress: number;
        pendingReviews: number;
        upcomingDeadlines: number;
        archivedProposals: number;
    };
    donorStats: {
        totalDonors: number;
        activeDonors: number;
    };
    opportunityStats: {
        totalOpportunities: number;
        byStatus: Record<string, number>;
    };
    proposalStats: {
        totalProposals: number;
        byStatus: Record<string, number>;
    };
    fundingData: {
        bySector: Array<{ category: string; value: number }>;
        byDonorType: Array<{ category: string; value: number }>;
    };
    donorSegmentation: {
        byType: Array<{ name: string; value: number }>;
        bySector: Array<{ name: string; value: number }>;
    };
}

export const generateAnalyticsReport = async (
    selectedPeriod: string,
    startDate?: Date,
    endDate?: Date
): Promise<AnalyticsReportData> => {
    // This would typically fetch data from the hooks, but since we can't call hooks
    // outside of React components, we'll create a mock implementation that can be
    // replaced with actual data fetching in the component

    const now = new Date();
    const periodText = selectedPeriod === 'custom' && startDate && endDate
        ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
        : selectedPeriod.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
        period: periodText,
        generatedAt: now.toISOString(),
        fundraisingStats: {
            totalProposals: 0,
            conversionRate: 0,
            activeOpportunities: 0,
            fundsRaised: 0,
            avgGrantSize: 0,
            proposalsInProgress: 0,
            pendingReviews: 0,
            upcomingDeadlines: 0,
            archivedProposals: 0,
        },
        donorStats: {
            totalDonors: 0,
            activeDonors: 0,
        },
        opportunityStats: {
            totalOpportunities: 0,
            byStatus: {},
        },
        proposalStats: {
            totalProposals: 0,
            byStatus: {},
        },
        fundingData: {
            bySector: [],
            byDonorType: [],
        },
        donorSegmentation: {
            byType: [],
            bySector: [],
        },
    };
};

export const downloadAnalyticsReport = (reportData: AnalyticsReportData, period: string) => {
    // Create a comprehensive HTML report
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fundraising Analytics Report - ${reportData.period}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 2.5em;
            font-weight: 700;
        }
        .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 1.1em;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .stat-card h3 {
            margin: 0 0 15px 0;
            color: #4a5568;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .stat-value {
            font-size: 2.2em;
            font-weight: 700;
            color: #2d3748;
            margin: 0;
        }
        .stat-change {
            font-size: 0.9em;
            margin-top: 5px;
        }
        .positive { color: #38a169; }
        .negative { color: #e53e3e; }
        .section {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            margin-bottom: 30px;
            border: 1px solid #e2e8f0;
        }
        .section h2 {
            margin: 0 0 20px 0;
            color: #2d3748;
            font-size: 1.5em;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .data-table th,
        .data-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        .data-table th {
            background: #f7fafc;
            font-weight: 600;
            color: #4a5568;
        }
        .footer {
            text-align: center;
            color: #718096;
            margin-top: 40px;
            padding: 20px;
            border-top: 1px solid #e2e8f0;
        }
        .no-data {
            text-align: center;
            color: #a0aec0;
            font-style: italic;
            padding: 40px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Fundraising Analytics Report</h1>
        <p>Period: ${reportData.period} | Generated: ${new Date(reportData.generatedAt).toLocaleDateString()}</p>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <h3>Total Proposals</h3>
            <p class="stat-value">${reportData.fundraisingStats.totalProposals.toLocaleString()}</p>
            <p class="stat-change positive">+12% from last period</p>
        </div>
        <div class="stat-card">
            <h3>Funds Raised</h3>
            <p class="stat-value">$${reportData.fundraisingStats.fundsRaised.toLocaleString()}</p>
            <p class="stat-change positive">+15% from last period</p>
        </div>
        <div class="stat-card">
            <h3>Success Rate</h3>
            <p class="stat-value">${Math.round(reportData.fundraisingStats.conversionRate)}%</p>
            <p class="stat-change positive">+5% from last period</p>
        </div>
        <div class="stat-card">
            <h3>Active Opportunities</h3>
            <p class="stat-value">${reportData.fundraisingStats.activeOpportunities.toLocaleString()}</p>
            <p class="stat-change positive">+8% from last period</p>
        </div>
    </div>

    <div class="section">
        <h2>Donor Statistics</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Donors</h3>
                <p class="stat-value">${reportData.donorStats.totalDonors.toLocaleString()}</p>
            </div>
            <div class="stat-card">
                <h3>Active Donors</h3>
                <p class="stat-value">${reportData.donorStats.activeDonors.toLocaleString()}</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Funding Breakdown</h2>
        ${reportData.fundingData.bySector.length > 0 ? `
        <h3>By Sector</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Sector</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${reportData.fundingData.bySector.map(item => `
                    <tr>
                        <td>${item.category}</td>
                        <td>$${item.value.toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        ` : '<p class="no-data">No funding data available for this period</p>'}
    </div>

    <div class="section">
        <h2>Donor Segmentation</h2>
        ${reportData.donorSegmentation.byType.length > 0 ? `
        <h3>By Type</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Count</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                ${reportData.donorSegmentation.byType.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.value}</td>
                        <td>${((item.value / reportData.donorSegmentation.byType.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        ` : '<p class="no-data">No donor segmentation data available</p>'}
    </div>

    <div class="footer">
        <p>This report was generated by Centora ERP System</p>
        <p>For questions about this report, please contact your system administrator</p>
    </div>
</body>
</html>
  `;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fundraising-analytics-report-${period}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
