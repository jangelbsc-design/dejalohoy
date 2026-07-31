import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useWishlistStore, WishlistGoal } from '../store/wishlistStore';
import { calculateMoneySaved, calculateFreeTimeInDays } from '../core/utils/calculations';
import { PiggyBank, Plus, Edit3, Trash2, ArrowLeft, Check, X } from 'lucide-react';

export default function Wishlist() {
  const navigate = useNavigate();
  const profile = useStore((state) => state.profile);
  const { goals, addGoal, editGoal, removeGoal } = useWishlistStore();

  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const startDate = profile?.startDate ? new Date(profile.startDate) : new Date();
  const freeDays = calculateFreeTimeInDays(startDate);
  const moneySaved = calculateMoneySaved(
    freeDays,
    profile?.cigsPerDay ?? 0,
    profile?.cigsPerPack ?? 20,
    profile?.pricePerPack ?? 0
  );

  const handleEdit = (goal: WishlistGoal) => {
    setEditingId(goal.id);
    setEditName(goal.name);
    setEditAmount(String(goal.targetAmount));
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim() && Number(editAmount) > 0) {
      editGoal(editingId, editName.trim(), Number(editAmount));
      setEditingId(null);
    }
  };

  const handleAdd = () => {
    if (editName.trim() && Number(editAmount) > 0) {
      addGoal(editName.trim(), Number(editAmount));
      setEditName('');
      setEditAmount('');
      setShowAdd(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <button className="wishlist-back" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="wishlist-title">Mis Metas</h1>
        <div className="wishlist-total">
          <PiggyBank size={20} />
          <span>Bs {moneySaved.toFixed(2)} ahorrados</span>
        </div>
      </div>

      <p className="wishlist-subtitle">
        Cada centavo que no gastas en cigarrillos se acerca a tus sueños.
      </p>

      <div className="wishlist-goals">
        {goals.map((goal) => {
          const progress = Math.min((moneySaved / goal.targetAmount) * 100, 100);
          const isEditing = editingId === goal.id;

          return (
            <div key={goal.id} className="goal-card">
              <div className="goal-top">
                {isEditing ? (
                  <div className="goal-edit-form">
                    <input
                      className="goal-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nombre"
                    />
                    <div className="goal-amount-row">
                      <span className="goal-bs">Bs</span>
                      <input
                        className="goal-input goal-input-amount"
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        placeholder="Monto"
                        min="1"
                      />
                    </div>
                    <div className="goal-edit-actions">
                      <button className="goal-icon-btn goal-icon-btn-success" onClick={handleSaveEdit}>
                        <Check size={18} />
                      </button>
                      <button className="goal-icon-btn" onClick={cancelEdit}>
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="goal-info">
                      <span className="goal-name">{goal.name}</span>
                      <span className="goal-target">Meta: Bs {goal.targetAmount.toFixed(2)}</span>
                      <span className="goal-progress-text">
                        Bs {Math.min(moneySaved, goal.targetAmount).toFixed(2)} / Bs {goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="goal-actions">
                      <button className="goal-icon-btn" onClick={() => handleEdit(goal)}>
                        <Edit3 size={16} />
                      </button>
                      <button className="goal-icon-btn goal-icon-btn-danger" onClick={() => removeGoal(goal.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {!isEditing && (
                <div className="goal-bar-track">
                  <div
                    className="goal-bar-fill"
                    style={{ width: `${progress}%` }}
                  />
                  <span className="goal-bar-label">{progress.toFixed(1)}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAdd ? (
        <div className="goal-card goal-card-add">
          <div className="goal-edit-form">
            <input
              className="goal-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nombre de la meta"
            />
            <div className="goal-amount-row">
              <span className="goal-bs">Bs</span>
              <input
                className="goal-input goal-input-amount"
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                placeholder="Monto a ahorrar"
                min="1"
              />
            </div>
            <div className="goal-edit-actions">
              <button className="goal-icon-btn goal-icon-btn-success" onClick={handleAdd}>
                <Check size={18} />
              </button>
              <button className="goal-icon-btn" onClick={() => { setShowAdd(false); setEditName(''); setEditAmount(''); }}>
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button className="goal-add-btn" onClick={() => { setShowAdd(true); setEditName(''); setEditAmount(''); }}>
          <Plus size={20} />
          Agregar meta
        </button>
      )}
    </div>
  );
}
