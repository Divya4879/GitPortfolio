
import React from 'react';
import type { SingleRepoAnalysis } from '../types';
import { XIcon, DocumentTextIcon, CodeBracketIcon, LightBulbIcon, CheckCircleIcon } from './icons';

interface SingleRepoAnalysisViewProps {
    analysis: SingleRepoAnalysis | null;
    isLoading: boolean;
    onClose: () => void;
    repoName: string;
}

const RatingIndicator: React.FC<{ rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' }> = ({ rating }) => {
    const styles = {
        Excellent: 'text-green-400',
        Good: 'text-blue-400',
        Fair: 'text-yellow-400',
        'Needs Improvement': 'text-red-400',
    };
    return <span className={`font-bold ${styles[rating]}`}>{rating}</span>;
};

const SingleRepoAnalysisView: React.FC<SingleRepoAnalysisViewProps> = ({ analysis, isLoading, onClose, repoName }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="repo-analysis-title"
        >
            <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-purple-900/20">
                <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 id="repo-analysis-title" className="text-xl font-bold">Deep Dive: <span className="text-purple-400">{repoName}</span></h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close analysis view">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-64" aria-live="polite">
                            <div className="w-12 h-12 border-4 border-t-purple-400 border-r-purple-400 border-gray-700 rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-400">Performing deep-dive analysis...</p>
                        </div>
                    )}
                    {analysis && !isLoading && (
                        <div className="space-y-6 animate-fade-in">
                             <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><CheckCircleIcon className="w-6 h-6 text-green-400" /> Overall Impression</h3>
                                <p className="text-gray-300">{analysis.overallImpression}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                    <h4 className="font-semibold flex items-center gap-2 mb-2"><DocumentTextIcon className="w-5 h-5 text-blue-400" /> README Quality</h4>
                                    <p className="mb-2"><strong>Rating:</strong> <RatingIndicator rating={analysis.readmeQuality.rating} /></p>
                                    <p className="text-sm text-gray-400 mb-3">{analysis.readmeQuality.feedback}</p>
                                    <ul className="text-sm list-disc list-inside space-y-1 text-gray-300">
                                        {analysis.readmeQuality.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                 <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                    <h4 className="font-semibold flex items-center gap-2 mb-2"><CodeBracketIcon className="w-5 h-5 text-purple-400" /> Code & File Structure</h4>
                                    <p className="mb-2"><strong>Rating:</strong> <RatingIndicator rating={analysis.codeStructure.rating} /></p>
                                    <p className="text-sm text-gray-400">{analysis.codeStructure.feedback}</p>
                                </div>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><LightBulbIcon className="w-6 h-6 text-yellow-400" /> Key Improvement Areas</h3>
                                <div className="space-y-3">
                                    {analysis.potentialImprovements.map((item, i) => (
                                        <div key={i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                                            <p className="font-semibold text-purple-300">{item.area}</p>
                                            <p className="text-sm text-gray-400">{item.suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SingleRepoAnalysisView;
