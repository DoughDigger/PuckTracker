import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StartPage } from './components/StartPage';
import { GameSetup } from './components/GameSetup';
import { RosterEdit } from './components/RosterEdit';
import { Game } from './components/Game';
import { GameSummary } from './components/GameSummary';
import { GameStats } from './components/GameStats';
import { GameAnalysis } from './components/GameAnalysis';
import { JohnsMethod } from './components/JohnsMethod';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/roster" element={<GameSetup />} />
        <Route path="/roster-edit" element={<RosterEdit />} />
        <Route path="/game" element={<Game />} />
        <Route path="/summary" element={<GameSummary />} />
        <Route path="/stats" element={<GameStats />} />
        <Route path="/analysis" element={<GameAnalysis />} />
        <Route path="/johns-method" element={<JohnsMethod />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;