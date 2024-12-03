import { GameSummaryData } from '../types/game';
import html2canvas from 'html2canvas';

const createGameSummaryElement = (data: GameSummaryData): HTMLDivElement => {
  const container = document.createElement('div');
  container.style.backgroundColor = '#1a1a1a';
  container.style.color = '#ffffff';
  container.style.padding = '20px';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.style.fontFamily = 'Arial, sans-serif';

  // Header
  const header = document.createElement('div');
  header.style.textAlign = 'center';
  header.style.marginBottom = '30px';
  header.innerHTML = `
    <h1 style="color: #f97316; font-size: 24px; margin-bottom: 10px;">Hockey Game Summary</h1>
    <div style="font-size: 18px; color: #e2e8f0;">
      ${data.homeTeam.name} vs ${data.awayTeam.name}
      <br>
      ${new Date(data.date).toLocaleDateString()}
    </div>
  `;
  container.appendChild(header);

  // Score Section
  const scoreSection = document.createElement('div');
  scoreSection.style.backgroundColor = '#27272a';
  scoreSection.style.padding = '20px';
  scoreSection.style.borderRadius = '8px';
  scoreSection.style.marginBottom = '30px';
  scoreSection.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="text-align: center; flex: 1;">
        <div style="font-size: 20px; color: #f97316;">${data.homeTeam.name}</div>
        <div style="font-size: 36px; font-weight: bold;">${data.homeTotal.goals}</div>
      </div>
      <div style="font-size: 24px; color: #6b7280;">vs</div>
      <div style="text-align: center; flex: 1;">
        <div style="font-size: 20px; color: #f97316;">${data.awayTeam.name}</div>
        <div style="font-size: 36px; font-weight: bold;">${data.awayTotal.goals}</div>
      </div>
    </div>
  `;
  container.appendChild(scoreSection);

  // Goalies Section
  const goaliesSection = document.createElement('div');
  goaliesSection.style.backgroundColor = '#27272a';
  goaliesSection.style.padding = '20px';
  goaliesSection.style.borderRadius = '8px';
  goaliesSection.style.marginBottom = '30px';
  goaliesSection.innerHTML = `
    <h2 style="color: #f97316; font-size: 20px; margin-bottom: 15px;">Goalies</h2>
    <div style="display: flex; justify-content: space-between;">
      <div>
        <div style="color: #e2e8f0; margin-bottom: 5px;">
          ${data.homeTeam.name}: ${data.selectedHomeGoalie ? `${data.selectedHomeGoalie.name} (#${data.selectedHomeGoalie.number})` : 'N/A'}
        </div>
        <div style="color: #22c55e;">Save %: ${data.homeSavePercentage}%</div>
      </div>
      <div>
        <div style="color: #e2e8f0; margin-bottom: 5px;">
          ${data.awayTeam.name}: ${data.selectedAwayGoalie ? `${data.selectedAwayGoalie.name} (#${data.selectedAwayGoalie.number})` : 'N/A'}
        </div>
        <div style="color: #22c55e;">Save %: ${data.awaySavePercentage}%</div>
      </div>
    </div>
  `;
  container.appendChild(goaliesSection);

  // Team Stats Section
  const statsSection = document.createElement('div');
  statsSection.style.backgroundColor = '#27272a';
  statsSection.style.padding = '20px';
  statsSection.style.borderRadius = '8px';
  statsSection.style.marginBottom = '30px';
  statsSection.innerHTML = `
    <h2 style="color: #f97316; font-size: 20px; margin-bottom: 15px;">Team Statistics</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      ${[
        { team: data.homeTeam.name, stats: data.homeTotal, hitPercentage: data.homeHitPercentage },
        { team: data.awayTeam.name, stats: data.awayTotal, hitPercentage: data.awayHitPercentage }
      ].map(({ team, stats, hitPercentage }) => `
        <div>
          <h3 style="color: #f97316; font-size: 18px; margin-bottom: 10px;">${team}</h3>
          <div style="color: #e2e8f0;">
            <div style="margin-bottom: 5px;">Goals: ${stats.goals}</div>
            <div style="margin-bottom: 5px;">Shots on Goal: ${stats.shotsOnGoal}</div>
            <div style="margin-bottom: 5px;">Covered: ${stats.covered}</div>
            <div style="margin-bottom: 5px;">Rebounds: ${stats.rebounds}</div>
            <div style="margin-bottom: 5px;">Blocked: ${stats.blocked}</div>
            <div style="margin-bottom: 5px;">Missed: ${stats.missed}</div>
            <div style="margin-bottom: 5px;">Total Shots: ${stats.totalShots}</div>
            <div style="color: #22c55e;">Hit %: ${hitPercentage}%</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  container.appendChild(statsSection);

  // Period Stats
  data.periodStats.forEach((period, index) => {
    const periodName = index === 3 ? 'Overtime' :
                      index === 4 ? 'Shootout' :
                      `Period ${index + 1}`;

    const periodSection = document.createElement('div');
    periodSection.style.backgroundColor = '#27272a';
    periodSection.style.padding = '20px';
    periodSection.style.borderRadius = '8px';
    periodSection.style.marginBottom = '20px';
    periodSection.innerHTML = `
      <h2 style="color: #f97316; font-size: 20px; margin-bottom: 15px;">${periodName}</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        ${[
          { team: data.homeTeam.name, stats: period.homeStats },
          { team: data.awayTeam.name, stats: period.awayStats }
        ].map(({ team, stats }) => `
          <div>
            <h3 style="color: #f97316; font-size: 18px; margin-bottom: 10px;">${team}</h3>
            <div style="color: #e2e8f0;">
              <div style="margin-bottom: 5px;">Goals: ${stats.goals}</div>
              <div style="margin-bottom: 5px;">Shots on Goal: ${stats.shotsOnGoal}</div>
              <div style="margin-bottom: 5px;">Covered: ${stats.covered}</div>
              <div style="margin-bottom: 5px;">Rebounds: ${stats.rebounds}</div>
              <div style="margin-bottom: 5px;">Blocked: ${stats.blocked}</div>
              <div style="margin-bottom: 5px;">Missed: ${stats.missed}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(periodSection);
  });

  // Footer
  const footer = document.createElement('div');
  footer.style.textAlign = 'center';
  footer.style.color = '#6b7280';
  footer.style.marginTop = '30px';
  footer.innerHTML = `
    <div>Generated by Hockey Stats Tracker</div>
  `;
  container.appendChild(footer);

  return container;
};

export const generateEmailHTML = async (data: GameSummaryData): Promise<string> => {
  const summaryElement = createGameSummaryElement(data);
  document.body.appendChild(summaryElement);

  try {
    const canvas = await html2canvas(summaryElement, {
      backgroundColor: '#1a1a1a',
      scale: 2,
      logging: false
    });

    const imageDataUrl = canvas.toDataURL('image/png');
    document.body.removeChild(summaryElement);

    return `
      <html>
        <body style="margin: 0; padding: 20px; background-color: #1a1a1a; color: #ffffff; font-family: Arial, sans-serif;">
          <div style="max-width: 800px; margin: 0 auto;">
            <img src="${imageDataUrl}" style="width: 100%; height: auto; display: block; margin: 0 auto;" alt="Game Summary" />
          </div>
        </body>
      </html>
    `;
  } catch (error) {
    console.error('Error generating email HTML:', error);
    document.body.removeChild(summaryElement);
    throw error;
  }
};