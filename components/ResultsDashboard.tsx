import React, { useState } from 'react';
import type { PortfolioAnalysis, UserInput, GithubRepo } from '../types';
import ScoreGauge from './ScoreGauge';
import AnalysisCard from './AnalysisCard';
import RecommendationItem from './RecommendationItem';
import ProgressBar from './ProgressBar';
import SkillsMapping from './SkillsMapping';
import ProjectSuggestions from './ProjectSuggestions';
import { CodeBracketIcon, DocumentTextIcon, ChartBarIcon, LightBulbIcon, DownloadIcon, BookOpenIcon, BeakerIcon } from './icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultsDashboardProps {
  analysis: PortfolioAnalysis;
  userInput: UserInput;
  allRepos: GithubRepo[];
  onReset: () => void;
  onSelectRepo: (repo: GithubRepo) => void;
}

// Fix: Defined TechBadge as a React.FC to correctly handle the 'key' prop in lists.
const TechBadge: React.FC<{ text: React.ReactNode }> = ({ text }) => (
    <span className="font-mono inline-block bg-gray-700/80 text-gray-300 text-xs font-semibold mr-2 mb-2 px-3 py-1 rounded-full">
        {text}
    </span>
);


const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ analysis, userInput, allRepos, onReset, onSelectRepo }) => {
    const { 
        overallScore, 
        summary, 
        scoreBreakdown, 
        recommendations, 
        commitAnalysis,
        techStackAnalysis,
    } = analysis;
    
    const [isDownloading, setIsDownloading] = useState(false);
    
    const downloadPdfRoadmap = async () => {
        setIsDownloading(true);
        try {
            const doc = new jsPDF('p', 'pt', 'a4');
            const margin = 40;
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const contentWidth = pageWidth - margin * 2;
            let yPos = margin;

            const addPageBackground = () => {
                const numPages = doc.internal.pages.length;
                for (let i = 1; i <= numPages; i++) {
                    doc.setPage(i);
                    doc.setFillColor(3, 7, 18);
                    doc.rect(0, 0, pageWidth, pageHeight, 'F');
                }
                doc.setPage(numPages);
            };

            const addPageHeader = (title: string) => {
                yPos = margin;
                doc.setFontSize(10);
                doc.setTextColor(150);
                doc.text('PortfolioPilot AI Analysis', margin, margin / 2);
                doc.setFontSize(24);
                doc.setTextColor(200, 160, 255);
                doc.setFont('helvetica', 'bold');
                doc.text(title, margin, yPos);
                yPos += 40;
            };

            const addSectionTitle = (title: string) => {
                if (yPos > pageHeight - 80) { doc.addPage(); yPos = margin; }
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(255, 255, 255);
                doc.text(title, margin, yPos);
                yPos += 20;
                doc.setDrawColor(55, 65, 81);
                doc.line(margin, yPos - 10, margin + contentWidth, yPos - 10);
            };
            
            // Fix: Added a specific type for the 'options' parameter to resolve the arithmetic operation error.
            const addBodyText = (text: string, options: { size?: number; style?: string; color?: any; spacing?: number } = {}) => {
                if (yPos > pageHeight - 60) { doc.addPage(); yPos = margin; }
                doc.setFontSize(options.size || 10);
                doc.setFont('helvetica', options.style || 'normal');
                doc.setTextColor(options.color || 200);
                const splitText = doc.splitTextToSize(text, contentWidth);
                doc.text(splitText, margin, yPos);
                yPos += (splitText.length * (options.size || 10) * 1.2) + (options.spacing || 10);
            };
            
            addPageHeader(`Analysis for ${userInput.username}`);
            
            const gaugeElement = document.querySelector('#score-gauge-wrapper');
            if (gaugeElement) {
                const canvas = await html2canvas(gaugeElement as HTMLElement, { backgroundColor: '#1f2937', scale: 3 });
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 150;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                const xPos = (pageWidth / 2) - (imgWidth / 2);
                doc.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
                yPos += imgHeight + 20;
            }

            addSectionTitle('AI Summary');
            addBodyText(summary);

            addSectionTitle('Score Breakdown');
            scoreBreakdown && Object.entries(scoreBreakdown).forEach(([key, value]) => {
                if (yPos > pageHeight - 40) { doc.addPage(); yPos = margin; }
                const capitalizedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const barMaxWidth = contentWidth * 0.6;
                const numValue = Number(value) || 0;
                const barFilledWidth = (barMaxWidth * numValue) / 100;

                doc.setFontSize(10);
                doc.setTextColor(220);
                doc.text(capitalizedKey, margin, yPos);
                doc.text(String(numValue), pageWidth - margin - 20, yPos);
                yPos += 15;
                
                doc.setFillColor(55, 65, 81);
                doc.rect(margin, yPos, barMaxWidth, 8, 'F');
                doc.setFillColor(168, 85, 247);
                doc.rect(margin, yPos, barFilledWidth, 8, 'F');
                yPos += 25;
            });

            doc.addPage();
            addPageHeader('Top Recommendations');
            recommendations.forEach(rec => {
                if (yPos > pageHeight - 100) { doc.addPage(); yPos = margin; }
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(255);
                const titleText = doc.splitTextToSize(`[${rec.priority}] ${rec.title}`, contentWidth);
                doc.text(titleText, margin, yPos);
                yPos += (titleText.length * 12 * 1.2) + 5;
                addBodyText(rec.description, { spacing: 25 });
            });
            
            if(yPos > pageHeight - 200) doc.addPage();
            addPageHeader('Deeper Insights');

            addSectionTitle('Technology Stack');
            addBodyText(techStackAnalysis.summary, {spacing: 15});
            
            const formatList = (title: string, items: string[]) => {
                if (items && items.length > 0) {
                    addBodyText(`${title}: ${items.join(', ')}`, { size: 9, color: 220, spacing: 15 });
                }
            };
            formatList('Languages', techStackAnalysis.languages);
            formatList('Frameworks', techStackAnalysis.frameworks);
            formatList('Tools', techStackAnalysis.tools);
            yPos += 20;

            addSectionTitle('Commit Patterns');
            addBodyText(commitAnalysis.summary, {spacing: 15});
            addBodyText(`Consistency: ${commitAnalysis.consistency}`, { size: 9, color: 220, spacing: 5 });
            addBodyText(`Message Quality: ${commitAnalysis.messageQuality}`, { size: 9, color: 220, spacing: 5 });
            addBodyText(`Frequency: ${commitAnalysis.frequency}`, { size: 9, color: 220, spacing: 5 });

            addPageBackground();
            doc.save(`PortfolioPilot_Analysis_${userInput.username}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Sorry, there was an error creating the PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };


    return (
        <div id="results-dashboard" className="w-full max-w-7xl mx-auto p-2 sm:p-4 animate-fade-in" role="main">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Analysis for <span className="text-purple-400">{userInput.username}</span></h2>
                    <p className="text-gray-400">Targeting a <span className="font-semibold">{userInput.targetRole}</span> role.</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <button 
                        onClick={() => window.print()} 
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        Save Analysis
                    </button>
                </div>
            </header>

            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <AnalysisCard title="Overall Portfolio Score" icon={<ChartBarIcon className="w-6 h-6 text-purple-400"/>} noPadding>
                            <div id="score-gauge-wrapper" className="flex flex-col items-center p-6 bg-gray-800">
                               <ScoreGauge score={overallScore} />
                            </div>
                        </AnalysisCard>
                    </div>
                    <div className="lg:col-span-2">
                         <AnalysisCard title="AI Summary & Score Breakdown" icon={<DocumentTextIcon className="w-6 h-6 text-green-400"/>}>
                            <p className="text-gray-400 mb-6 text-sm">{summary}</p>
                            <h4 className="font-semibold text-base text-white mb-3">Score Breakdown</h4>
                             <ul className="space-y-3">
                                {Object.entries(scoreBreakdown).map(([key, value]) => (
                                    <li key={key} className="flex justify-between items-center text-sm">
                                        <span className="capitalize text-gray-300">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-gray-700 rounded-full h-2">
                                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${value}%` }}></div>
                                            </div>
                                            <span className="font-semibold text-white w-8 text-right">{value}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </AnalysisCard>
                    </div>
                </div>

                <AnalysisCard title="Top Recommendations" icon={<LightBulbIcon className="w-6 h-6 text-yellow-400"/>}>
                    <div className="space-y-3">
                        {recommendations.slice(0, 5).map((rec, i) => <RecommendationItem key={rec.id} recommendation={rec} index={i} />)}
                    </div>
                </AnalysisCard>

                {/* Enhanced Metrics with Industry Benchmarks */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6">Performance vs Industry Standards</h3>
                    <div className="space-y-6">
                        <ProgressBar 
                            score={analysis.overallScore} 
                            label="Overall Portfolio Score" 
                            benchmark={75}
                        />
                        <ProgressBar 
                            score={analysis.scoreBreakdown.codeQuality} 
                            label="Code Quality" 
                            benchmark={80}
                        />
                        <ProgressBar 
                            score={analysis.scoreBreakdown.documentation} 
                            label="Documentation Quality" 
                            benchmark={70}
                        />
                        <ProgressBar 
                            score={analysis.scoreBreakdown.projectDiversity} 
                            label="Project Diversity" 
                            benchmark={65}
                        />
                    </div>
                </div>

                {/* Skills Analysis */}
                <SkillsMapping 
                    detectedSkills={analysis.detectedSkills.map(skill => ({
                        name: skill.name,
                        level: skill.level,
                        inDemand: true, // Could be enhanced with real market data
                        projects: skill.evidence,
                        concepts: skill.concepts,
                        interviewTopics: skill.interviewTopics
                    }))}
                    targetRole={userInput.targetRole}
                />

                {/* Project Recommendations */}
                <ProjectSuggestions 
                    targetRole={userInput.targetRole}
                    experienceLevel={userInput.experienceLevel}
                    missingSkills={analysis.missingSkills}
                />

                <AnalysisCard title="Explore Repositories" icon={<BookOpenIcon className="w-6 h-6 text-blue-400"/>}>
                    <p className="text-sm text-gray-400 mb-4">Click on any repository to perform a deep-dive analysis of its structure and README.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
                       {allRepos.map(repo => (
                            <div key={repo.name} className="bg-gray-900/70 p-4 rounded-lg border border-gray-700 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
                                <div>
                                    <h4 className="font-bold text-purple-400 truncate">{repo.name}</h4>
                                    <p className="text-sm text-gray-400 mt-1 mb-3 line-clamp-2">{repo.description || "No description provided."}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                     <span className="text-xs font-mono bg-gray-700/80 text-gray-300 px-2 py-1 rounded-md">{repo.language || 'N/A'}</span>
                                    <button onClick={() => onSelectRepo(repo)} aria-label={`Analyze repository ${repo.name}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-1 px-3 rounded-md transition-colors">
                                       Analyze
                                    </button>
                                </div>
                            </div>
                       ))}
                    </div>
                </AnalysisCard>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnalysisCard title="Technology Stack" icon={<BeakerIcon className="w-6 h-6 text-teal-400"/>}>
                        <div className="space-y-4 text-sm">
                             <p className="text-gray-400 mb-3">{techStackAnalysis.summary}</p>
                             <div>
                                <h5 className="font-semibold text-gray-200 mb-2">Languages</h5>
                                <div className="flex flex-wrap">{techStackAnalysis.languages.map(l => <TechBadge key={l} text={l} />)}</div>
                             </div>
                              <div>
                                <h5 className="font-semibold text-gray-200 mb-2">Frameworks</h5>
                                <div className="flex flex-wrap">{techStackAnalysis.frameworks.map(f => <TechBadge key={f} text={f} />)}</div>
                             </div>
                              <div>
                                <h5 className="font-semibold text-gray-200 mb-2">Tools</h5>
                                <div className="flex flex-wrap">{techStackAnalysis.tools.map(t => <TechBadge key={t} text={t} />)}</div>
                             </div>
                        </div>
                    </AnalysisCard>
                    <AnalysisCard title="Commit Patterns" icon={<ChartBarIcon className="w-6 h-6 text-indigo-400"/>}>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-400 mb-3">{commitAnalysis.summary}</p>
                            <p className="text-gray-300"><strong>Consistency:</strong> {commitAnalysis.consistency}</p>
                            <p className="text-gray-300"><strong>Message Quality:</strong> {commitAnalysis.messageQuality}</p>
                            <p className="text-gray-300"><strong>Frequency:</strong> {commitAnalysis.frequency}</p>
                        </div>
                    </AnalysisCard>
                </div>
            </div>
        </div>
    );
};

export default ResultsDashboard;