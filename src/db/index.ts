import { openDB } from 'idb';
import { Player } from '../types/team';
import { GameResult } from '../types/game';

const dbName = 'hockey-stats-db';
const playerStore = 'players';
const gameStore = 'games';

async function initDB() {
  const db = await openDB(dbName, 2, {
    upgrade(db, oldVersion) {
      // Create or update stores based on version
      if (oldVersion < 1 && !db.objectStoreNames.contains(playerStore)) {
        const store = db.createObjectStore(playerStore, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('teamType', 'teamType');
      }
      
      if (oldVersion < 2 && !db.objectStoreNames.contains(gameStore)) {
        const store = db.createObjectStore(gameStore, {
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('date', 'date');
        store.createIndex('homeTeam', 'homeTeam.name');
        store.createIndex('awayTeam', 'awayTeam.name');
      }
    },
  });
  return db;
}

// Player-related functions
export async function addPlayer(teamType: string, player: Omit<Player, 'id'>) {
  const db = await initDB();
  await db.add(playerStore, {
    ...player,
    teamType,
    createdAt: new Date().toISOString()
  });
}

export async function getPlayers(teamType: string): Promise<Player[]> {
  const db = await initDB();
  const tx = db.transaction(playerStore, 'readonly');
  const store = tx.objectStore(playerStore);
  const index = store.index('teamType');
  
  return await index.getAll(teamType);
}

export async function clearPlayers(teamType: string) {
  const db = await initDB();
  const tx = db.transaction(playerStore, 'readwrite');
  const store = tx.objectStore(playerStore);
  const index = store.index('teamType');
  
  const keys = await index.getAllKeys(teamType);
  for (const key of keys) {
    await store.delete(key);
  }
}

// Game-related functions
export async function saveGameResult(gameResult: Omit<GameResult, 'id'>) {
  const db = await initDB();
  return await db.add(gameStore, {
    ...gameResult,
    date: new Date().toISOString()
  });
}

export async function getAllGames(): Promise<GameResult[]> {
  const db = await initDB();
  return await db.getAll(gameStore);
}

export async function getGamesByTeam(teamName: string): Promise<GameResult[]> {
  const db = await initDB();
  const tx = db.transaction(gameStore, 'readonly');
  const store = tx.objectStore(gameStore);
  
  const allGames = await store.getAll();
  return allGames.filter(game => 
    game.homeTeam.name === teamName || game.awayTeam.name === teamName
  );
}

export async function deleteGame(id: number): Promise<void> {
  const db = await initDB();
  await db.delete(gameStore, id);
}