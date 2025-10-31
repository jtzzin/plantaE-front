// frontend/src/pages/Cronograma.jsx
import React, { useEffect, useState } from "react";
import { listPlants, getPlant, waterPlant } from "../api";
import { useNavigate } from "react-router-dom";

function formatDateTime(iso) {
  if (!iso) return "nunca";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calcularProximasRegas(base, intervalo, count = 5) {
  const datas = [];
  if (!base || !intervalo) return datas;
  let atual = new Date(base);
  for (let i = 0; i < count; i++) {
    datas.push(new Date(atual));
    atual = new Date(atual.getTime() + intervalo * 24 * 60 * 60 * 1000);
  }
  return datas;
}

function datasIguais(d1, d2) {
  const a = new Date(d1), b = new Date(d2);
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export default function Cronograma() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [feitoRegas, setFeitoRegas] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const ps = await listPlants();
        setPlants(Array.isArray(ps) ? ps : []);
      } catch {
        setPlants([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleFeito(plant, previsto, idx) {
    await waterPlant(plant._id || plant.id);
    const atualizado = await getPlant(plant._id || plant.id);
    setPlants((olds) =>
      olds.map((p) => (p._id === atualizado._id ? atualizado : p))
    );
    setFeitoRegas((cur) => ({
      ...cur,
      [plant._id || plant.id]: [
        ...(cur[plant._id || plant.id] || []),
        {
          feito: new Date().toISOString(),
          previsto,
        },
      ],
    }));
  }

  return (
    <div className="app-container">
      <header>
        <h1>📅 Cronograma de Regas</h1>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
          ⬅️ Voltar
        </button>
      </header>
      <div className="card">
        <h2>Próximas regas previstas</h2>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <p>Carregando plantas...</p>
          </div>
        ) : plants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🪴</div>
            <h3>Nenhuma planta cadastrada</h3>
          </div>
        ) : (
          plants.map((plant) => {
            const plantId = plant._id || plant.id;
            const intervalo = plant.water_interval_days ?? plant.waterintervaldays ?? 7;
            const history = (plant.water_history || [])
              .map((r) => ({ ...r, d: new Date(r.at) }))
              .sort((a, b) => b.d - a.d);
            const ultimaReal = history[0] ? history[0].at : (plant.last_watered ?? plant.lastwatered);
            const base = ultimaReal || (plant.water_history && plant.water_history[0]?.at);
            const proximas = calcularProximasRegas(base, intervalo, 5);

            const feitos = feitoRegas[plantId] || [];
            function getFeito(idx) {
              return feitos[idx] || null;
            }

            let mostrarProximas = proximas;
            if (feitos.length >= 5) {
              const dataNovaBase = history[0]?.at;
              mostrarProximas = calcularProximasRegas(dataNovaBase, intervalo, 5);
              setTimeout(() => {
                setFeitoRegas((old) => ({
                  ...old,
                  [plantId]: [],
                }));
              }, 300);
            }

            return (
              <div
                key={plant._id || plant.id}
                className="plant-card"
                style={{
                  marginBottom: 32,
                  border: "1px solid var(--color-border)",
                  position: "relative"
                }}
              >
                {/* Botão único no canto superior direito */}
                <button
                  className="btn btn-secondary"
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    zIndex: 2,
                    fontSize: 14
                  }}
                  onClick={() => navigate(`/plant/${plantId}`)}
                  title="Ir para detalhes da planta"
                >
                  👀 Ver planta
                </button>

                <div className="plant-card-header">
                  <h3>{plant.name} 🪴</h3>
                  <span className="plant-badge">💧 {intervalo}d</span>
                </div>
                <div>
                  <strong>Primeira rega: </strong>
                  {plant.water_history?.length > 0
                    ? formatDateTime(plant.water_history[0]?.at)
                    : "nunca"}
                </div>
                <div style={{ marginTop: 8 }}>
                  <strong>Próximos dias de rega:</strong>
                  <ul style={{ marginBottom: 0 }}>
                    {mostrarProximas.map((dt, idx) => {
                      const previstoISO = dt.toISOString();
                      const feitoObj = getFeito(idx);
                      const real = history.find((r) => datasIguais(r.at, previstoISO));
                      let isFeito = !!feitoObj;
                      let isAdiantado = false;
                      let diaReal = null;
                      if (!feitoObj && real) {
                        isFeito = true;
                        if (!datasIguais(real.at, previstoISO)) {
                          isAdiantado = true;
                          diaReal = formatDateTime(real.at);
                        }
                      }
                      return (
                        <li key={idx}>
                          {formatDateTime(previstoISO)}{" "}
                          {!isFeito ? (
                            <button
                              className="btn btn-secondary"
                              style={{ fontSize: 14, marginLeft: 4 }}
                              onClick={() => handleFeito(plant, previstoISO, idx)}
                            >
                              Marcar como feito
                            </button>
                          ) : isAdiantado || (feitoObj && !datasIguais(feitoObj.feito, previstoISO)) ? (
                            <>
                              ✅{" "}
                              <span style={{ fontSize: 13 }}>
                                ({diaReal || formatDateTime(feitoObj.feito)})
                              </span>
                            </>
                          ) : (
                            <span>✅</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
