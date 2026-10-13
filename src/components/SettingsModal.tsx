import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import {
  setApiSettings,
  setLocation,
  addVipRule,
  removeVipRule,
  toggleVipRule,
} from '../store/flightSlice';
import {
  X,
  Key,
  MapPin,
  Shield,
  Smartphone,
  Plus,
  Trash2,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Info,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { apiSettings, location, vipRules } = useSelector((state: RootState) => state.flight);

  const [activeTab, setActiveTab] = useState<'api' | 'location' | 'vip' | 'pwa'>('api');

  // Form states
  const [primaryKey, setPrimaryKey] = useState(apiSettings.primaryKey);
  const [fallbackKey, setFallbackKey] = useState(apiSettings.fallbackKey);
  const [demoMode, setDemoMode] = useState(apiSettings.demoMode);

  const [addressInput, setAddressInput] = useState(location.addressName);
  const [useGps, setUseGps] = useState(location.useGps);
  const [latInput, setLatInput] = useState(location.latitude.toString());
  const [lonInput, setLonInput] = useState(location.longitude.toString());

  // New VIP Rule input
  const [ruleType, setRuleType] = useState<'model' | 'airline' | 'registration'>('model');
  const [ruleVal, setRuleVal] = useState('');
  const [ruleLabel, setRuleLabel] = useState('');

  if (!isOpen) return null;

  const handleSaveApi = () => {
    dispatch(
      setApiSettings({
        primaryKey,
        fallbackKey,
        useFallback: false,
        demoMode,
      })
    );
  };

  const handleSaveLocation = () => {
    dispatch(
      setLocation({
        latitude: parseFloat(latInput) || 48.8566,
        longitude: parseFloat(lonInput) || 2.3522,
        addressName: addressInput || 'Paris, France',
        useGps,
      })
    );
  };

  const handleGetGpsLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatInput(pos.coords.latitude.toFixed(4));
          setLonInput(pos.coords.longitude.toFixed(4));
          setAddressInput(`GPS (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
          setUseGps(true);
        },
        (err) => {
          alert(`Erreur de géolocalisation: ${err.message}`);
        }
      );
    } else {
      alert("Géolocalisation non supportée par votre navigateur.");
    }
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleVal.trim()) return;
    dispatch(
      addVipRule({
        type: ruleType,
        value: ruleVal.trim().toUpperCase(),
        label: ruleLabel.trim() || `${ruleType.toUpperCase()}: ${ruleVal.trim().toUpperCase()}`,
        enabled: true,
      })
    );
    setRuleVal('');
    setRuleLabel('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 md:p-6 select-none animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#121214] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2 font-sans-ui">
            <span>Configuration AirMalo</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#8E8E93] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-white/10 bg-black/20 px-6">
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'api'
                ? 'border-[#0A84FF] text-[#0A84FF]'
                : 'border-transparent text-[#8E8E93] hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Clés API (BYOK)</span>
          </button>

          <button
            onClick={() => setActiveTab('location')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'location'
                ? 'border-[#0A84FF] text-[#0A84FF]'
                : 'border-transparent text-[#8E8E93] hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Position GPS</span>
          </button>

          <button
            onClick={() => setActiveTab('vip')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'vip'
                ? 'border-[#0A84FF] text-[#0A84FF]'
                : 'border-transparent text-[#8E8E93] hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Radar VIP</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'pwa'
                ? 'border-[#0A84FF] text-[#0A84FF]'
                : 'border-transparent text-[#8E8E93] hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mode Tablette / PWA</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* TAB 1: API KEYS & DEMO MODE */}
          {activeTab === 'api' && (
            <div className="space-y-5">
              <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/30 p-4 rounded-2xl flex items-start space-x-3">
                <Info className="w-5 h-5 text-[#0A84FF] shrink-0 mt-0.5" />
                <p className="text-xs text-[#F2F2F7] leading-relaxed">
                  Activez le <strong>Mode Simulation/Démo</strong> pour profiter d'un trafic d'avions réaliste en continu sans quota, ou renseignez vos clés d'API OpenSky pour le suivi du ciel réel.
                </p>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-white/10">
                <div>
                  <span className="font-bold text-white block">Mode Simulation / Démo</span>
                  <span className="text-xs text-[#8E8E93]">Génère un trafic fluide et des vols VIP instantanément</span>
                </div>
                <button
                  onClick={() => {
                    setDemoMode(!demoMode);
                    dispatch(setApiSettings({ ...apiSettings, demoMode: !demoMode }));
                  }}
                  className="text-2xl text-[#0A84FF]"
                >
                  {demoMode ? <ToggleRight className="w-10 h-10 text-[#0A84FF]" /> : <ToggleLeft className="w-10 h-10 text-[#8E8E93]" />}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#8E8E93] mb-1.5">
                  Clé API Principale (OpenSky Base64 User:Pass)
                </label>
                <input
                  type="password"
                  value={primaryKey}
                  onChange={(e) => setPrimaryKey(e.target.value)}
                  placeholder="ex: dXNlcm5hbWU6cGFzc3dvcmQ="
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-[#8E8E93]/50 focus:border-[#0A84FF] outline-none font-mono-telemetry"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#8E8E93] mb-1.5">
                  Clé API de Secours (Fallback)
                </label>
                <input
                  type="password"
                  value={fallbackKey}
                  onChange={(e) => setFallbackKey(e.target.value)}
                  placeholder="ex: dXNlcjI6cGFzczI="
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-[#8E8E93]/50 focus:border-[#0A84FF] outline-none font-mono-telemetry"
                />
                <span className="text-[11px] text-[#8E8E93] mt-1 block">
                  En cas d'erreur HTTP 429 (Too Many Requests), le système basculera automatiquement sur cette clé.
                </span>
              </div>

              <button
                onClick={handleSaveApi}
                className="w-full py-3 bg-[#0A84FF] hover:bg-[#0A84FF]/80 text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Enregistrer la Configuration API</span>
              </button>
            </div>
          )}

          {/* TAB 2: LOCATION */}
          {activeTab === 'location' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-white/10">
                <div>
                  <span className="font-bold text-white block">GPS de la Tablette</span>
                  <span className="text-xs text-[#8E8E93]">Utiliser la géolocalisation automatique du navigateur</span>
                </div>
                <button
                  onClick={handleGetGpsLocation}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs transition-colors flex items-center space-x-1.5"
                >
                  <MapPin className="w-4 h-4 text-[#0A84FF]" />
                  <span>Obtenir la position</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#8E8E93] mb-1.5">
                  Nom du lieu / Adresse
                </label>
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder="ex: Paris, France"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-[#8E8E93]/50 focus:border-[#0A84FF] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#8E8E93] mb-1.5">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono-telemetry focus:border-[#0A84FF] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#8E8E93] mb-1.5">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={lonInput}
                    onChange={(e) => setLonInput(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono-telemetry focus:border-[#0A84FF] outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveLocation}
                className="w-full py-3 bg-[#0A84FF] hover:bg-[#0A84FF]/80 text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mettre à jour la position de l'observateur</span>
              </button>
            </div>
          )}

          {/* TAB 3: VIP RULES */}
          {activeTab === 'vip' && (
            <div className="space-y-5">
              <div className="bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 p-4 rounded-2xl flex items-start space-x-3">
                <Shield className="w-5 h-5 text-[#FF9F0A] shrink-0 mt-0.5" />
                <p className="text-xs text-[#F2F2F7] leading-relaxed">
                  Si un avion détecté correspond à l'une de ces règles, l'écran affichera une bordure d'<strong>Alerte Ambre pulsante</strong> et verrouillera le focus exclusif sur cet appareil.
                </p>
              </div>

              {/* Add New VIP Rule Form */}
              <form onSubmit={handleAddRule} className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-3">
                <span className="font-bold text-white text-xs uppercase tracking-wider block">Ajouter une Règle VIP</span>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={ruleType}
                    onChange={(e: any) => setRuleType(e.target.value)}
                    className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#0A84FF] outline-none text-xs"
                  >
                    <option value="model">Modèle d'avion (ex: A388)</option>
                    <option value="airline">Compagnie (ex: UAE)</option>
                    <option value="registration">Immatriculation (ex: F-HBMO)</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Valeur (ex: A388)"
                    value={ruleVal}
                    onChange={(e) => setRuleVal(e.target.value)}
                    className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white placeholder-[#8E8E93]/50 focus:border-[#0A84FF] outline-none text-xs font-mono-telemetry"
                  />

                  <input
                    type="text"
                    placeholder="Description (ex: Airbus A380)"
                    value={ruleLabel}
                    onChange={(e) => setRuleLabel(e.target.value)}
                    className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white placeholder-[#8E8E93]/50 focus:border-[#0A84FF] outline-none text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#FF9F0A] hover:bg-[#FF9F0A]/80 text-black font-bold rounded-xl transition-colors text-xs flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter la règle VIP</span>
                </button>
              </form>

              {/* List of active VIP rules */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase text-[#8E8E93] block">
                  Règles VIP Actives ({vipRules.length})
                </span>
                {vipRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between bg-black/30 px-4 py-3 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => dispatch(toggleVipRule(rule.id))}
                        className="text-lg"
                      >
                        {rule.enabled ? (
                          <ToggleRight className="w-8 h-8 text-[#FF9F0A]" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-[#8E8E93]" />
                        )}
                      </button>
                      <div>
                        <span className="font-bold text-white text-sm block">{rule.label}</span>
                        <span className="text-xs font-mono-telemetry text-[#8E8E93]">
                          {rule.type.toUpperCase()}: <span className="text-[#FF9F0A]">{rule.value}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => dispatch(removeVipRule(rule.id))}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PWA / KIOSK GUIDE */}
          {activeTab === 'pwa' && (
            <div className="space-y-5 text-xs leading-relaxed text-[#F2F2F7]">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
                <h3 className="font-bold text-sm text-[#0A84FF] flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Comment épingler l'application sur la tablette (Mode Kiosk)</span>
                </h3>

                <div className="space-y-2 text-[#8E8E93]">
                  <p className="text-white font-medium">Sur iPad (Safari) :</p>
                  <ol className="list-decimal list-inside space-y-1 pl-2">
                    <li>Touchez l'icône de partage dans Safari.</li>
                    <li>Sélectionnez <strong>"Sur l'écran d'accueil"</strong>.</li>
                    <li>Ouvrez l'application depuis l'icône créée : elle s'affichera en plein écran sans barre d'adresse Safari.</li>
                  </ol>

                  <p className="text-white font-medium pt-2">Sur Tablette Android (Chrome) :</p>
                  <ol className="list-decimal list-inside space-y-1 pl-2">
                    <li>Ouvrez le menu <strong>⋮</strong> de Chrome.</li>
                    <li>Touchez <strong>"Ajouter à l'écran d'accueil"</strong> ou <strong>"Installer l'application"</strong>.</li>
                    <li>Utilisez le mode <em>Pin App / Verrouillage d'application</em> dans les paramètres Android pour la bloquer en Kiosk.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
