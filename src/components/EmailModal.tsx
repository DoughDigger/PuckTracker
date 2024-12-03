import React, { useState } from 'react';
import { GameSummaryData } from '../types/game';
import { generateEmailHTML } from '../utils/emailTemplate';

interface EmailModalProps {
  onClose: () => void;
  gameData: GameSummaryData;
}

export const EmailModal: React.FC<EmailModalProps> = ({ onClose, gameData }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const emailContent = await generateEmailHTML(gameData);
      const subject = `Hockey Game Summary: ${gameData.homeTeam.name} vs ${gameData.awayTeam.name}`;
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
      
      window.location.href = mailtoLink;
      setTimeout(onClose, 500);
    } catch (err) {
      console.error('Email error:', err);
      setError('Failed to generate email content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-xl shadow-2xl max-w-2xl w-full p-8 glass-effect">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-orange-400">Send Game Summary</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        <div className="mb-8">
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-3">Instructions:</h3>
            <ul className="text-gray-300 list-disc ml-6 space-y-3">
              <li>Click "Open Email Client" to compose a new email</li>
              <li>Your default email application will open automatically</li>
              <li>The game summary will be included as a visual report</li>
              <li>Add recipient email addresses and send</li>
            </ul>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-orange-400 mb-2">Game Summary Preview:</h3>
            <div className="text-gray-300 space-y-2">
              <p><strong>Teams:</strong> {gameData.homeTeam.name} vs {gameData.awayTeam.name}</p>
              <p><strong>Date:</strong> {new Date(gameData.date).toLocaleDateString()}</p>
              <p><strong>Final Score:</strong> {gameData.homeTotal.goals} - {gameData.awayTotal.goals}</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg hover-lift transition-all text-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            disabled={loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg hover-lift transition-all text-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Open Email Client'}
          </button>
        </div>
      </div>
    </div>
  );
};