import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Componente da tela de listagem, busca e filtro das plantas do usuário
export default function MinhasPlantas({ token }) {
  // Estados principais
  const [plantas, setPlantas] = useState([]);
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("name");
  const [dir, setDir] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  // Carrega todas as plantas ao abrir a página
  useEffect(() => {
    carregarPlantas();
  }, []);

  // Busca geral de todas as plantas
  function carregarPlantas() {
    setLoading(true);
    fetch("/api/plants/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((data) => {
        setPlantas(data);
        setLoading(false);
      });
  }

  // Busca específica pelo nome
  function buscarPlantas() {
    setLoading(true);
    fetch(`/api/plants/search?nome=${busca}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((data) => {
        setPlantas(data);
        setLoading(false);
      });
  }

  // Ordena a lista de plantas conforme filtros do usuário
  function ordenarPlantas() {
    setLoading(true);
    fetch(`/api/plants/filter?order=${ordem}&dir=${dir}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((data) => {
        setPlantas(data);
        setLoading(false);
      });
  }

  // Registra rega na planta marcada pelo usuário
  function regarPlanta(id) {
    fetch(`/api/plants/${id}/water`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then(() => {
        setMsg("Planta regada com sucesso!");
        carregarPlantas();
      });
  }

  // Exclui uma planta do banco pelo ID
  function excluirPlanta(id) {
    fetch(`/api/plants/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then(() => {
        setMsg("Planta excluída!");
        carregarPlantas();
      });
  }

  // Renderização do componente completo
  return (
    <div>
      <h2>Minhas Plantas</h2>
      {/* Busca e filtros */}
      <div style={{ margin: "16px 0" }}>
        <input
          placeholder="Buscar planta..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button onClick={buscarPlantas}>Buscar</button>
        <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
          <option value="name">Nome</option>
          <option value="created_at">Criada em</option>
          <option value="last_watered">Próxima rega</option>
        </select>
        <select value={dir} onChange={(e) => setDir(e.target.value)}>
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option>
        </select>
        <button onClick={ordenarPlantas}>Ordenar</button>
      </div>
      {/* Feedbacks visuais */}
      {loading && <div>Carregando...</div>}
      {msg && <div style={{ color: "green" }}>{msg}</div>}
      {/* Lista em grid de cards das plantas */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {plantas.length === 0 ? (
          <div>Nenhuma planta encontrada.</div>
        ) : (
          plantas.map((planta) => (
            <div
              key={planta._id}
              style={{
                background: "#222",
                color: "#fff",
                borderRadius: 10,
                padding: 18,
                width: 250,
                boxShadow: "2px 2px 6px #111",
                marginBottom: 16,
              }}
            >
              <img
                src={
                  planta.photo
                    ? `/api/plants/photo/${planta.photo}`
                    : "/img/default.png"
                }
                width="80"
                alt=""
                style={{ borderRadius: 8 }}
              />
              <h4>{planta.name}</h4>
              <div>
                Intervalo: {planta.water_interval_days} dias
                <br />
                Última rega:{" "}
                {planta.last_watered
                  ? new Date(planta.last_watered).toLocaleString()
                  : "nunca"}
              </div>
              <button onClick={() => regarPlanta(planta._id)}>
                Regar agora
              </button>
              <button onClick={() => excluirPlanta(planta._id)}>
                Excluir
              </button>
              <button onClick={() => navigate(`/plant/${planta._id}/edit`)} style={{ marginLeft: 8 }}>
                Editar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
