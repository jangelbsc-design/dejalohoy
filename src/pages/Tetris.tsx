import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  ChevronsDown,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';

const COLS = 10;
const ROWS = 20;

type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

interface PieceDef {
  color: string;
  shape: number[][];
}

const PIECES: Record<PieceType, PieceDef> = {
  I: { color: '#00E5FF', shape: [[1, 1, 1, 1]] },
  O: { color: '#FFD54F', shape: [[1, 1], [1, 1]] },
  T: { color: '#AB47BC', shape: [[0, 1, 0], [1, 1, 1]] },
  S: { color: '#66BB6A', shape: [[0, 1, 1], [1, 1, 0]] },
  Z: { color: '#EF5350', shape: [[1, 1, 0], [0, 1, 1]] },
  J: { color: '#42A5F5', shape: [[1, 0, 0], [1, 1, 1]] },
  L: { color: '#FFA726', shape: [[0, 0, 1], [1, 1, 1]] },
};

const TYPES = Object.keys(PIECES) as PieceType[];

const randomPiece = (): PieceType => TYPES[Math.floor(Math.random() * TYPES.length)];

type Cell = PieceType | '';

const emptyBoard = (): Cell[][] => Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(''));

interface ActivePiece {
  type: PieceType;
  shape: number[][];
  x: number;
  y: number;
}

interface GameState {
  board: Cell[][];
  piece: ActivePiece | null;
  next: PieceType;
  score: number;
  lines: number;
  level: number;
  status: 'idle' | 'playing' | 'paused' | 'over';
}

const rotateCW = (shape: number[][]): number[][] =>
  shape[0].map((_, col) => shape.map((row) => row[col]).reverse());

function collides(board: Cell[][], shape: number[][], x: number, y: number): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = x + c;
      const ny = y + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx]) return true;
    }
  }
  return false;
}

function spawnPiece(board: Cell[][], type: PieceType): ActivePiece | null {
  const shape = PIECES[type].shape.map((row) => [...row]);
  const x = Math.floor((COLS - shape[0].length) / 2);
  if (collides(board, shape, x, 0)) return null;
  return { type, shape, x, y: 0 };
}

function mergePiece(board: Cell[][], piece: ActivePiece): Cell[][] {
  const next = board.map((row) => [...row]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const ny = piece.y + r;
      const nx = piece.x + c;
      if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
        next[ny][nx] = piece.type;
      }
    }
  }
  return next;
}

function clearLines(board: Cell[][]): { board: Cell[][]; cleared: number } {
  const remaining = board.filter((row) => row.some((cell) => !cell));
  const cleared = ROWS - remaining.length;
  const fresh = Array.from({ length: cleared }, () => Array<Cell>(COLS).fill(''));
  return { board: [...fresh, ...remaining], cleared };
}

const LINE_SCORES = [0, 100, 300, 500, 800];
const levelFor = (lines: number): number => Math.floor(lines / 10) + 1;
const speedFor = (level: number): number => Math.max(100, 800 - (level - 1) * 70);

function tick(state: GameState): GameState {
  if (state.status !== 'playing' || !state.piece) return state;
  const { board, piece, next } = state;

  if (!collides(board, piece.shape, piece.x, piece.y + 1)) {
    return { ...state, piece: { ...piece, y: piece.y + 1 } };
  }

  const merged = mergePiece(board, piece);
  const { board: clearedBoard, cleared } = clearLines(merged);
  const lines = state.lines + cleared;
  const level = levelFor(lines);
  const score = state.score + (LINE_SCORES[cleared] ?? 0) * level;
  const newNext = randomPiece();
  const spawned = spawnPiece(clearedBoard, next);

  if (!spawned) {
    return {
      ...state,
      board: clearedBoard,
      piece: null,
      next: newNext,
      score,
      lines,
      level,
      status: 'over',
    };
  }

  return { ...state, board: clearedBoard, piece: spawned, next: newNext, score, lines, level };
}

function movePiece(state: GameState, dx: number): GameState {
  if (state.status !== 'playing' || !state.piece) return state;
  if (collides(state.board, state.piece.shape, state.piece.x + dx, state.piece.y)) return state;
  return { ...state, piece: { ...state.piece, x: state.piece.x + dx } };
}

function rotatePiece(state: GameState): GameState {
  if (state.status !== 'playing' || !state.piece) return state;
  const rotated = rotateCW(state.piece.shape);
  for (const kick of [0, -1, 1, -2, 2]) {
    if (!collides(state.board, rotated, state.piece.x + kick, state.piece.y)) {
      return { ...state, piece: { ...state.piece, shape: rotated, x: state.piece.x + kick } };
    }
  }
  return state;
}

function softDrop(state: GameState): GameState {
  if (state.status !== 'playing' || !state.piece) return state;
  if (!collides(state.board, state.piece.shape, state.piece.x, state.piece.y + 1)) {
    return { ...state, piece: { ...state.piece, y: state.piece.y + 1 }, score: state.score + 1 };
  }
  return tick(state);
}

function hardDrop(state: GameState): GameState {
  if (state.status !== 'playing' || !state.piece) return state;
  let y = state.piece.y;
  while (!collides(state.board, state.piece.shape, state.piece.x, y + 1)) y++;
  const dropDist = y - state.piece.y;
  const result = tick({ ...state, piece: { ...state.piece, y } });
  return { ...result, score: result.score + dropDist * 2 };
}

const startState = (): GameState => ({
  board: emptyBoard(),
  piece: spawnPiece(emptyBoard(), randomPiece()),
  next: randomPiece(),
  score: 0,
  lines: 0,
  level: 1,
  status: 'playing',
});

export default function Tetris() {
  const navigate = useNavigate();
  const [state, setState] = useState<GameState>(startState);

  useEffect(() => {
    if (state.status !== 'playing') return;
    const id = window.setInterval(() => setState((s) => tick(s)), speedFor(state.level));
    return () => window.clearInterval(id);
  }, [state.status, state.level]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setState((s) => movePiece(s, -1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setState((s) => movePiece(s, 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setState((s) => softDrop(s));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setState((s) => rotatePiece(s));
      } else if (e.key === ' ') {
        e.preventDefault();
        setState((s) => hardDrop(s));
      } else if (e.key === 'p' || e.key === 'P') {
        setState((s) =>
          s.status === 'playing'
            ? { ...s, status: 'paused' }
            : s.status === 'paused'
              ? { ...s, status: 'playing' }
              : s
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const cellColor = (r: number, c: number): string | null => {
    const boardCell = state.board[r][c];
    if (boardCell) return PIECES[boardCell].color;
    const p = state.piece;
    if (p) {
      const pr = r - p.y;
      const pc = c - p.x;
      if (pr >= 0 && pr < p.shape.length && pc >= 0 && pc < p.shape[pr].length && p.shape[pr][pc]) {
        return PIECES[p.type].color;
      }
    }
    return null;
  };

  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const color = cellColor(r, c);
      cells.push(
        <div
          key={`${r}-${c}`}
          className={`tetris-cell ${color ? 'tetris-cell-filled' : ''}`}
          style={{ background: color ?? 'rgba(255, 255, 255, 0.04)' }}
        />
      );
    }
  }

  const nextShape = PIECES[state.next].shape;
  const nextCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const filled = !!nextShape[r] && !!nextShape[r][c];
      nextCells.push(
        <div
          key={`n-${r}-${c}`}
          className="tetris-next-cell"
          style={{ background: filled ? PIECES[state.next].color : 'rgba(255, 255, 255, 0.06)' }}
        />
      );
    }
  }

  const togglePause = () =>
    setState((s) =>
      s.status === 'playing' ? { ...s, status: 'paused' } : s.status === 'paused' ? { ...s, status: 'playing' } : s
    );

  return (
    <div className="tetris-page">
      <div className="health-header">
        <button className="health-back" onClick={() => navigate('/games')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="health-title">Tetris</h1>
      </div>

      <div className="tetris-hud">
        <div className="tetris-panel">
          <span className="tetris-panel-title">Puntos</span>
          <span className="tetris-stat">{state.score}</span>
        </div>
        <div className="tetris-panel">
          <span className="tetris-panel-title">Nivel</span>
          <span className="tetris-stat">{state.level}</span>
        </div>
        <div className="tetris-panel">
          <span className="tetris-panel-title">Líneas</span>
          <span className="tetris-stat">{state.lines}</span>
        </div>
        <div className="tetris-panel">
          <span className="tetris-panel-title">Siguiente</span>
          <div className="tetris-next">{nextCells}</div>
        </div>
      </div>

      <div className="tetris-board-wrap">
        <div className="tetris-board">{cells}</div>
        {state.status !== 'playing' && (
          <div className="tetris-overlay">
            {state.status === 'idle' && (
              <>
                <span className="tetris-overlay-title">Tetris</span>
                <span className="tetris-overlay-text">Completa líneas y sube de nivel</span>
                <button className="btn-primary" onClick={() => setState(startState())}>
                  Jugar
                </button>
              </>
            )}
            {state.status === 'paused' && (
              <>
                <span className="tetris-overlay-title">Pausa</span>
                <button className="btn-primary" onClick={togglePause}>
                  Continuar
                </button>
              </>
            )}
            {state.status === 'over' && (
              <>
                <span className="tetris-overlay-title">¡Juego terminado!</span>
                <span className="tetris-overlay-text">
                  Puntos: {state.score} · Líneas: {state.lines}
                </span>
                <button className="btn-primary" onClick={() => setState(startState())}>
                  Jugar de nuevo
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="tetris-controls">
        <button className="tetris-btn" onClick={() => setState((s) => movePiece(s, -1))} aria-label="Izquierda">
          <ChevronLeft size={22} />
        </button>
        <button className="tetris-btn" onClick={() => setState((s) => rotatePiece(s))} aria-label="Rotar">
          <RotateCw size={22} />
        </button>
        <button className="tetris-btn" onClick={() => setState((s) => movePiece(s, 1))} aria-label="Derecha">
          <ChevronRight size={22} />
        </button>
        <button className="tetris-btn" onClick={() => setState((s) => softDrop(s))} aria-label="Bajar">
          <ArrowDown size={22} />
        </button>
        <button className="tetris-btn" onClick={() => setState((s) => hardDrop(s))} aria-label="Soltar">
          <ChevronsDown size={22} />
        </button>
      </div>

      <div className="tetris-actions">
        <button className="btn-primary" onClick={togglePause}>
          {state.status === 'paused' ? <Play size={18} /> : <Pause size={18} />}
          {state.status === 'paused' ? 'Continuar' : 'Pausa'}
        </button>
        <button className="btn-primary tetris-restart" onClick={() => setState(startState())}>
          <RotateCcw size={18} />
          Reiniciar
        </button>
      </div>
    </div>
  );
}
