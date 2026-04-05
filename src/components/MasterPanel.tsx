import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useGame } from '../context/GameContext';
import { stages, GAME_MASTER_PHONE } from '../data/stages';
import { subscribeToLocations, isFirebaseConfigured, removeTeam, sendSkipCommand } from '../firebase';
import type { TeamLocation } from '../types/game';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const stageIcon = new L.DivIcon({
  html: `<div style="
    width: 18px; height: 18px;
    background: radial-gradient(circle, #E8C875, #C4A265);
    border: 2px solid #0A1628;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(232, 200, 117, 0.5);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: bold; color: #0A1628;
  "></div>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const challengeIcon = new L.DivIcon({
  html: `<div style="
    width: 18px; height: 18px;
    background: radial-gradient(circle, #f97316, #ea580c);
    border: 2px solid #0A1628;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(249, 115, 22, 0.5);
  "></div>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const TEAM_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16'];

function makeTeamIcon(color: string, label: string) {
  return new L.DivIcon({
    html: `<div style="
      width: 28px; height: 28px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 10px ${color}88;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: bold; color: white;
    ">${label}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export function MasterPanel() {
  const { dispatch } = useGame();
  const [teams, setTeams] = useState<TeamLocation[]>([]);
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const [tab, setTab] = useState<'map' | 'stages'>('map');
  const firebaseOk = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseOk) return;
    const unsub = subscribeToLocations(setTeams);
    return unsub;
  }, [firebaseOk]);

  const center: [number, number] = [39.7950, 18.3500];

  return (
    <div className="parchment h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-sea-dark/95 backdrop-blur-sm border-b border-gold/30 px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: 'RESET_GAME' })}
          className="text-sand/60 text-sm"
        >
          &larr; Esci
        </button>
        <h1 className="text-gold-bright font-bold text-sm">GAME MASTER</h1>
        <span className="text-sand/40 text-xs">{teams.length} team online</span>
      </div>

      {/* Tabs */}
      <div className="fixed top-10 left-0 right-0 z-50 bg-sea-dark/90 flex border-b border-gold/20">
        <button
          onClick={() => setTab('map')}
          className={`flex-1 py-2 text-sm font-semibold ${tab === 'map' ? 'text-gold-bright border-b-2 border-gold' : 'text-sand/50'}`}
        >
          Mappa Live
        </button>
        <button
          onClick={() => setTab('stages')}
          className={`flex-1 py-2 text-sm font-semibold ${tab === 'stages' ? 'text-gold-bright border-b-2 border-gold' : 'text-sand/50'}`}
        >
          Tappe & Risposte
        </button>
      </div>

      <div className="pt-20 flex-1 overflow-y-auto">
        {tab === 'map' && (
          <div className="p-3 space-y-3">
            {/* Map */}
            <div className="w-full rounded-xl overflow-hidden border border-gold/20" style={{ height: '55vh' }}>
              <MapContainer
                center={center}
                zoom={15}
                minZoom={13}
                maxZoom={18}
                zoomControl={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* All stages */}
                {stages.map(s => (
                  <Marker
                    key={s.id}
                    position={[s.lat, s.lng]}
                    icon={s.puzzle.type === 'challenge' ? challengeIcon : stageIcon}
                  >
                    <Popup>
                      <strong>#{s.id} {s.name}</strong><br />
                      {s.puzzle.type === 'challenge' ? '🎬 Sfida' : '🧩 Enigma'}<br />
                      Raggio: {s.proximityRadius}m
                    </Popup>
                  </Marker>
                ))}

                {/* Stage proximity circles */}
                {stages.map(s => (
                  <Circle
                    key={`c-${s.id}`}
                    center={[s.lat, s.lng]}
                    radius={s.proximityRadius}
                    pathOptions={{
                      color: s.puzzle.type === 'challenge' ? 'rgba(249, 115, 22, 0.3)' : 'rgba(196, 162, 101, 0.3)',
                      fillOpacity: 0.1,
                    }}
                  />
                ))}

                {/* Team positions */}
                {teams.map((team, i) => (
                  <Marker
                    key={team.teamName}
                    position={[team.lat, team.lng]}
                    icon={makeTeamIcon(TEAM_COLORS[i % TEAM_COLORS.length], team.teamName.charAt(0).toUpperCase())}
                  >
                    <Popup>
                      <strong>{team.teamName}</strong><br />
                      Step: {team.currentStep || team.currentStage}/{stages.length} &middot; Percorso {team.route || 'A'}<br />
                      {team.timestamp && `Ultimo aggiornamento: ${new Date(team.timestamp).toLocaleTimeString('it-IT')}`}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Firebase status */}
            {!firebaseOk && (
              <div className="bg-brick/20 border border-brick/40 rounded-lg p-3 text-sand/80 text-xs text-center">
                Tracking live non attivo. Configura Firebase in <code>src/firebase.ts</code> per vedere i partecipanti in tempo reale.
              </div>
            )}

            {/* Teams list */}
            {teams.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-gold-bright font-bold text-sm">Squadre attive</h3>
                {teams.map((team, i) => (
                  <div key={team.teamName} className="parchment-card p-3 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: TEAM_COLORS[i % TEAM_COLORS.length] }}
                    >
                      {team.teamName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sand font-semibold text-sm">{team.teamName}</p>
                      <p className="text-sand/50 text-xs">
                        Step {team.currentStep || team.currentStage}/{stages.length} &middot; Percorso {team.route || 'A'} &middot; {stages.find(s => s.id === team.currentStage)?.name}
                      </p>
                    </div>
                    {team.timestamp && (
                      <span className="text-sand/30 text-xs flex-shrink-0">
                        {new Date(team.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Superare la tappa corrente per "${team.teamName}"? La squadra passerà alla tappa successiva senza punti.`)) {
                          sendSkipCommand(team.teamName);
                        }
                      }}
                      className="px-2 py-1 rounded bg-gold/20 border border-gold/40 text-gold-bright text-[10px] font-bold flex-shrink-0 active:bg-gold/40 transition-colors"
                      title={`Supera tappa per ${team.teamName}`}
                    >
                      Supera tappa
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Rimuovere "${team.teamName}" dal sistema?`)) {
                          removeTeam(team.teamName);
                        }
                      }}
                      className="w-7 h-7 rounded-full bg-brick/60 text-sand/80 text-sm font-bold flex items-center justify-center flex-shrink-0 active:bg-brick transition-colors"
                      title={`Rimuovi ${team.teamName}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {teams.length === 0 && firebaseOk && (
              <p className="text-sand/40 text-xs text-center">Nessuna squadra online al momento.</p>
            )}
          </div>
        )}

        {tab === 'stages' && (
          <div className="p-3 space-y-2">
            {/* Quick reference */}
            <div className="parchment-card p-3 mb-3">
              <p className="text-gold-bright font-bold text-xs mb-1">CODICI SFIDE RAPIDI</p>
              <div className="flex flex-wrap gap-2">
                {stages.filter(s => s.puzzle.type === 'challenge').map(s => (
                  <span key={s.id} className="bg-sea-medium border border-gold/30 rounded px-2 py-1 text-xs">
                    <span className="text-sand/60">#{s.id}</span>{' '}
                    <span className="text-gold-bright font-mono font-bold">{s.acceptedAnswers[0].toUpperCase()}</span>
                  </span>
                ))}
              </div>
              <p className="text-sand/40 text-xs mt-2">WhatsApp: +{GAME_MASTER_PHONE}</p>
            </div>

            {/* All stages */}
            {stages.map(s => {
              const isChallenge = s.puzzle.type === 'challenge';
              const isExpanded = expandedStage === s.id;

              return (
                <div
                  key={s.id}
                  className="parchment-card overflow-hidden"
                  onClick={() => setExpandedStage(isExpanded ? null : s.id)}
                >
                  {/* Header */}
                  <div className="p-3 flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isChallenge ? 'bg-orange-500/20 text-orange-400' : 'bg-gold/20 text-gold-bright'
                    }`}>
                      {s.id}
                    </span>
                    <div className="flex-1">
                      <p className="text-sand font-semibold text-sm">{s.name}</p>
                      <p className="text-sand/40 text-xs">
                        {isChallenge ? '🎬 Sfida' : `🧩 ${s.puzzle.type}`} &middot; {s.points} pt
                      </p>
                    </div>
                    <span className="text-sand/30 text-xs">{isExpanded ? '▲' : '▼'}</span>
                  </div>

                  {/* Details */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-2 border-t border-gold/10 pt-2">
                      {/* Hint */}
                      <div>
                        <p className="text-sand/40 text-xs font-bold mb-0.5">INDIZIO</p>
                        <p className="text-sand/70 text-xs italic">{s.hint}</p>
                      </div>

                      {/* Question */}
                      <div>
                        <p className="text-sand/40 text-xs font-bold mb-0.5">DOMANDA</p>
                        <p className="text-sand text-xs">{s.puzzle.question}</p>
                        {s.puzzle.type === 'quiz' && 'options' in s.puzzle && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {s.puzzle.options.map((opt, i) => (
                              <span key={i} className={`text-xs px-2 py-0.5 rounded ${
                                s.puzzle.type === 'quiz' && 'correctIndex' in s.puzzle && i === s.puzzle.correctIndex
                                  ? 'bg-green-600/30 text-green-400 font-bold'
                                  : 'bg-sea-medium text-sand/50'
                              }`}>
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}
                        {isChallenge && 'challengeDescription' in s.puzzle && (
                          <p className="text-orange-400 text-xs mt-1">{s.puzzle.challengeDescription}</p>
                        )}
                      </div>

                      {/* Answer */}
                      <div>
                        <p className="text-sand/40 text-xs font-bold mb-0.5">
                          {isChallenge ? 'CODICE SEGRETO' : 'RISPOSTE ACCETTATE'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {s.acceptedAnswers.map((a, i) => (
                            <span key={i} className="bg-green-600/20 text-green-400 font-mono font-bold text-xs px-2 py-0.5 rounded">
                              {a.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Story fragment preview */}
                      <div>
                        <p className="text-sand/40 text-xs font-bold mb-0.5">FRAMMENTO STORIA</p>
                        <p className="text-sand/50 text-xs italic line-clamp-3">{s.storyFragment}</p>
                      </div>

                      {/* Coordinates */}
                      <p className="text-sand/30 text-xs">
                        GPS: {s.lat}, {s.lng} &middot; Raggio: {s.proximityRadius}m
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
