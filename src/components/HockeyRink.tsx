{/* Previous imports and interface remain the same */}
import React from 'react';
import { Location } from '../types/team';

interface HockeyRinkProps {
  onRinkClick: (location: Location) => void;
  homeTeam: string;
  awayTeam: string;
  currentStats: any;
  selectedHomeGoalie: any;
  selectedAwayGoalie: any;
  sidesFlipped: boolean;
}

export const HockeyRink: React.FC<HockeyRinkProps> = ({
  onRinkClick,
  homeTeam,
  awayTeam,
  currentStats,
  selectedHomeGoalie,
  selectedAwayGoalie,
  sidesFlipped
}) => {
  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 200;
    const y = ((event.clientY - rect.top) / rect.height) * 85;
    onRinkClick({ x, y });
  };

  const getHomeGoalieText = () => {
    if (!selectedHomeGoalie) return homeTeam;
    const lastName = selectedHomeGoalie.name.split(' ').slice(-1)[0];
    return `${lastName} #${selectedHomeGoalie.number}`;
  };

  const getAwayGoalieText = () => {
    if (!selectedAwayGoalie) return awayTeam;
    const lastName = selectedAwayGoalie.name.split(' ').slice(-1)[0];
    return `${lastName} #${selectedAwayGoalie.number}`;
  };

  const renderShots = (teamName: string, type: string, stats: any, isHomeTeam: boolean) => {
    if (!stats[teamName] || !stats[teamName][type]) return null;

    return stats[teamName][type].map((shot: { location: Location }, index: number) => {
      const { x, y } = shot.location;
      const key = `${teamName}-${type}-${index}`;

      // Shot marker styles based on team and type
      let marker;
      if (isHomeTeam) {
        switch (type) {
          case 'goals':
            marker = <circle cx={x} cy={y} r="2" fill="#f97316" />; // Orange solid dot
            break;
          case 'covered':
          case 'rebounds':
            marker = <circle cx={x} cy={y} r="2" fill="none" stroke="#3b82f6" strokeWidth="0.3" />; // Blue circle
            break;
          case 'blocked':
            marker = (
              <g>
                <circle cx={x} cy={y} r="2" fill="none" stroke="#6b7280" strokeWidth="0.3" />
                <line x1={x-2} y1={y+3} x2={x+2} y2={y+3} stroke="#6b7280" strokeWidth="0.3" />
              </g>
            ); // Gray circle with underline
            break;
          case 'missed':
            marker = (
              <g>
                <line x1={x-2} y1={y-2} x2={x+2} y2={y+2} stroke="#ef4444" strokeWidth="0.3" />
                <line x1={x-2} y1={y+2} x2={x+2} y2={y-2} stroke="#ef4444" strokeWidth="0.3" />
              </g>
            ); // Red X
            break;
        }
      } else {
        switch (type) {
          case 'goals':
            marker = <circle cx={x} cy={y} r="2" fill="#a855f7" />; // Purple solid dot
            break;
          case 'covered':
            marker = <circle cx={x} cy={y} r="2" fill="none" stroke="#22c55e" strokeWidth="0.3" />; // Green circle
            break;
          case 'rebounds':
            marker = <circle cx={x} cy={y} r="2" fill="none" stroke="#dc2626" strokeWidth="0.3" />; // Simple crimson circle
            break;
          case 'blocked':
            marker = (
              <g>
                <circle cx={x} cy={y} r="2" fill="none" stroke="#22c55e" strokeWidth="0.3" />
                <line x1={x-2} y1={y+3} x2={x+2} y2={y+3} stroke="#22c55e" strokeWidth="0.3" />
              </g>
            ); // Green circle with underline
            break;
          case 'missed':
            marker = (
              <g>
                <line x1={x-2} y1={y-2} x2={x+2} y2={y+2} stroke="#6b7280" strokeWidth="0.3" />
                <line x1={x-2} y1={y+2} x2={x+2} y2={y-2} stroke="#6b7280" strokeWidth="0.3" />
              </g>
            ); // Gray X
            break;
        }
      }

      return <g key={key}>{marker}</g>;
    });
  };

  return (
    <svg
      viewBox="0 0 200 85"
      className="w-full h-auto cursor-crosshair"
      onClick={handleClick}
      style={{ backgroundColor: '#fff' }}
    >
      {/* Main rink outline with rounded corners */}
      <path
        d="M10,5 h180 a5,5 0 0 1 5,5 v65 a5,5 0 0 1 -5,5 h-180 a5,5 0 0 1 -5,-5 v-65 a5,5 0 0 1 5,-5"
        fill="none"
        stroke="#000"
        strokeWidth="1.2"
      />

      {/* Center red line */}
      <line x1="100" y1="5" x2="100" y2="80" stroke="#FF0000" strokeWidth="1.2" />

      {/* Blue lines */}
      <line x1="65" y1="5" x2="65" y2="80" stroke="#0000FF" strokeWidth="1.2" />
      <line x1="135" y1="5" x2="135" y2="80" stroke="#0000FF" strokeWidth="1.2" />

      {/* Goal lines */}
      <line x1="15" y1="5" x2="15" y2="80" stroke="#FF0000" strokeWidth="1.2" />
      <line x1="185" y1="5" x2="185" y2="80" stroke="#FF0000" strokeWidth="1.2" />

      {/* Goalie creases - centered vertically */}
      <rect x="15" y="37.5" width="6" height="10" fill="none" stroke="#FF0000" strokeWidth="0.6" />
      <rect x="179" y="37.5" width="6" height="10" fill="none" stroke="#FF0000" strokeWidth="0.6" />

      {/* Center ice circle */}
      <circle cx="100" cy="42.5" r="12" fill="none" stroke="#FF0000" strokeWidth="0.8" />
      <circle cx="100" cy="42.5" r="1" fill="#FF0000" />
      
      {/* Face-off circles in zones */}
      {/* Left zone */}
      <circle cx="35" cy="25" r="12" fill="none" stroke="#FF0000" strokeWidth="0.8" />
      <circle cx="35" cy="60" r="12" fill="none" stroke="#FF0000" strokeWidth="0.8" />
      <circle cx="35" cy="25" r="1" fill="#FF0000" />
      <circle cx="35" cy="60" r="1" fill="#FF0000" />
      
      {/* Right zone */}
      <circle cx="165" cy="25" r="12" fill="none" stroke="#FF0000" strokeWidth="0.8" />
      <circle cx="165" cy="60" r="12" fill="none" stroke="#FF0000" strokeWidth="0.8" />
      <circle cx="165" cy="25" r="1" fill="#FF0000" />
      <circle cx="165" cy="60" r="1" fill="#FF0000" />

      {/* Hash marks on face-off dots */}
      {/* Left zone dots */}
      <line x1="34" y1="24" x2="36" y2="24" stroke="#FF0000" strokeWidth="0.5" />
      <line x1="34" y1="26" x2="36" y2="26" stroke="#FF0000" strokeWidth="0.5" />
      <line x1="34" y1="59" x2="36" y2="59" stroke="#FF0000" strokeWidth="0.5" />
      <line x1="34" y1="61" x2="36" y2="61" stroke="#FF0000" strokeWidth="0.5" />
      
      {/* Right zone dots */}
      <line x1="164" y1="24" x2="166" y2="24" stroke="#FF0000" strokeWidth="0.5" />
      <line x1="164" y1="26" x2="166" y2="26" stroke="#FF0000" strokeWidth="0.5" />
      <line x1="164" y1="59" x2="166" y2="59" stroke="#FF0000" strokeWidth="0.5" />
      <line x1="164" y1="61" x2="166" y2="61" stroke="#FF0000" strokeWidth="0.5" />

      {/* Shot markers */}
      {Object.keys(currentStats).map(teamName => (
        <g key={teamName}>
          {renderShots(teamName, 'goals', currentStats, teamName === homeTeam)}
          {renderShots(teamName, 'covered', currentStats, teamName === homeTeam)}
          {renderShots(teamName, 'rebounds', currentStats, teamName === homeTeam)}
          {renderShots(teamName, 'blocked', currentStats, teamName === homeTeam)}
          {renderShots(teamName, 'missed', currentStats, teamName === homeTeam)}
        </g>
      ))}

      {/* Team labels */}
      <g transform={`translate(${sidesFlipped ? 188 : 12}, 42.5)`}>
        <text
          className="text-sm"
          fill="#f97316"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="3"
          transform="rotate(90)"
        >
          {getHomeGoalieText()}
        </text>
      </g>

      <g transform={`translate(${sidesFlipped ? 12 : 188}, 42.5)`}>
        <text
          className="text-sm"
          fill="#a855f7"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="3"
          transform="rotate(90)"
        >
          {getAwayGoalieText()}
        </text>
      </g>
    </svg>
  );
};