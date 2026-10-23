
import { useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import "./App.css";

export default function App() {
  const [veiculo, setVeiculo] = useState("");
  const [placa, setPlaca] = useState("");
  const [parte, setParte] = useState("");
  const [gravidade, setGravidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fotos, setFotos] = useState([]);

  async function abrirCamera(origem) {
    try {
      let foto;

      if (Capacitor.isNativePlatform()) {
        foto = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri,
          source: origem,
          saveToGallery: false,
        });
      } else {
        // No navegador, usa o seletor de arquivos.
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.capture = origem === CameraSource.Camera ? "environment" : "";
        input.click();

        input.onchange = () => {
          const arquivo = input.files?.[0];
          if (!arquivo) return;

          const url = URL.createObjectURL(arquivo);
          setFotos((atuais) => [
            ...atuais,
            { nome: arquivo.name, url },
          ]);
        };
        return;
      }

      if (foto?.webPath) {
        setFotos((atuais) => [
          ...atuais,
          {
            nome: `Avaria ${atuais.length + 1}`,
            url: foto.webPath,
          },
        ]);
      }
    } catch (erro) {
      console.error("Erro ao abrir câmera ou galeria:", erro);

      if (erro?.message) {
        alert(`Não foi possível abrir a imagem: ${erro.message}`);
      }
    }
  }

  function removerFoto(index) {
    setFotos((atuais) => {
      const foto = atuais[index];

      if (foto?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(foto.url);
      }

      return atuais.filter((_, i) => i !== index);
    });
  }

  function finalizar(event) {
    event.preventDefault();

    if (!veiculo.trim() || !placa.trim()) {
      alert("Preencha o modelo do veículo e a placa.");
      return;
    }

    alert(
      `Vistoria preenchida!\n\nVeículo: ${veiculo}\nPlaca: ${placa}\nParte: ${parte || "Não informada"}\nGravidade: ${gravidade || "Não informada"}\nFotos: ${fotos.length}\n\nObservações: ${descricao || "Nenhuma"}`
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#inicio">
          <span className="brand-icon">V</span>
          <span>Vistoria <b>Auto</b></span>
        </a>

        <span className="nav-description">
          Inspeção e registro de avarias veiculares
        </span>

        <span className="status">
          <i /> Sistema online
        </span>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-content">
          <span className="eyebrow">REGISTRO DE AVARIAS</span>
          <h1>Vistoria <span>Auto</span></h1>

          <p>
            Registre as avarias do veículo com fotos e descrições,
            mantendo todas as informações organizadas.
          </p>

          <div className="benefits">
            <div><span>◎</span><p>Registro<br />fotográfico</p></div>
            <div><span>◇</span><p>Mais segurança<br />no processo</p></div>
            <div><span>◷</span><p>Inspeção<br />organizada</p></div>
          </div>
        </div>

        <div className="hero-art">
          <div className="car-glow" />
          <div className="car-symbol">✧</div>
          <span className="car-label">INSPEÇÃO VEICULAR</span>
        </div>
      </section>

      <main className="layout">
        <section className="panel form-panel">
          <div className="section-heading">
            <div className="heading-icon">▤</div>
            <div>
              <h2>Nova vistoria</h2>
              <p>Preencha os dados e registre as avarias encontradas.</p>
            </div>
          </div>

          <form onSubmit={finalizar}>
            <label htmlFor="veiculo">Modelo do veículo</label>
            <input
              id="veiculo"
              value={veiculo}
              onChange={(e) => setVeiculo(e.target.value)}
              placeholder="Ex.: Honda Civic"
              required
            />

            <label htmlFor="placa">Placa do veículo</label>
            <input
              id="placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              placeholder="Ex.: ABC1D23"
              required
            />

            <div className="field-grid">
              <div>
                <label htmlFor="parte">Parte do veículo</label>
                <select
                  id="parte"
                  value={parte}
                  onChange={(e) => setParte(e.target.value)}
                >
                  <option value="">Selecione a parte</option>
                  <option>Para-choque dianteiro</option>
                  <option>Para-choque traseiro</option>
                  <option>Porta</option>
                  <option>Capô</option>
                  <option>Teto</option>
                  <option>Farol ou lanterna</option>
                  <option>Retrovisor</option>
                  <option>Roda ou pneu</option>
                  <option>Outra parte</option>
                </select>
              </div>

              <div>
                <label htmlFor="gravidade">Gravidade</label>
                <select
                  id="gravidade"
                  value={gravidade}
                  onChange={(e) => setGravidade(e.target.value)}
                >
                  <option value="">Selecione a gravidade</option>
                  <option>Leve</option>
                  <option>Moderada</option>
                  <option>Grave</option>
                </select>
              </div>
            </div>

            <div className="label-line">
              <label htmlFor="descricao">Descrição da avaria</label>
              <span>{descricao.length}/500</span>
            </div>

            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value.slice(0, 500))}
              placeholder="Descreva os arranhões, amassados ou outros danos..."
              rows={4}
            />

            <div className="photo-heading">
              <span className="camera-icon">◎</span>
              <div>
                <h3>Fotos das avarias</h3>
                <p>Escolha uma imagem da galeria ou utilize a câmera.</p>
                <p className="muted">
                  No aplicativo Android, você poderá recortar a imagem
                  antes de adicioná-la, se o sistema oferecer essa opção.
                </p>
              </div>
            </div>

            <div className="photo-actions">
              <button
                type="button"
                className="button button-outline"
                onClick={() => abrirCamera(CameraSource.Photos)}
              >
                <span>▧</span> Escolher da galeria
              </button>

              <button
                type="button"
                className="button button-primary"
                onClick={() => abrirCamera(CameraSource.Camera)}
              >
                <span>◎</span> Tirar foto
              </button>
            </div>

            {fotos.length === 0 ? (
              <div className="empty-photos">
                <span className="empty-icon">▧</span>
                <strong>Nenhuma foto adicionada</strong>
                <p>As imagens selecionadas aparecerão aqui.</p>
              </div>
            ) : (
              <div className="photo-grid">
                {fotos.map((foto, index) => (
                  <article
                    className="photo-card"
                    key={`${foto.nome}-${index}`}
                  >
                    <img src={foto.url} alt={`Avaria ${index + 1}`} />
                    <p>{foto.nome}</p>
                    <button
                      type="button"
                      onClick={() => removerFoto(index)}
                    >
                      Remover imagem
                    </button>
                  </article>
                ))}
              </div>
            )}

            <button className="button button-primary finish" type="submit">
              ▣ <span>Finalizar vistoria</span> <b>→</b>
            </button>
          </form>
        </section>

        <aside className="sidebar">
          <section className="panel crop-panel">
            <div className="phone-preview">
              <div className="phone-top" />
              <div className="phone-image">
                <span className="focus-corners">＋</span>
                <div className="focus-box" />
              </div>
              <div className="phone-controls">
                <span>↻</span><span>⌗</span>
              </div>
            </div>

            <div className="crop-info">
              <span className="crop-icon">⌗</span>
              <h3>Detalhe da imagem</h3>
              <p>
                Registre os danos com fotos para documentar a inspeção
                do veículo.
              </p>
              <ul>
                <li>✓ Fotos organizadas</li>
                <li>✓ Mais precisão</li>
                <li>✓ Melhor visualização</li>
              </ul>
            </div>
          </section>

          <section className="panel tips-panel">
            <div className="tips-title">
              <span>◇</span>
              <h3>Dicas para uma boa vistoria</h3>
            </div>

            <div className="tip"><span>◎</span><p>Tire fotos com boa iluminação</p></div>
            <div className="tip"><span>▧</span><p>Mostre os detalhes da avaria</p></div>
            <div className="tip"><span>▤</span><p>Descreva o dano com clareza</p></div>
            <div className="tip"><span>✓</span><p>Revise os dados antes de finalizar</p></div>
          </section>
        </aside>
      </main>

      <footer className="footer">
        <span className="footer-mark">V</span>
        <strong>Vistoria <b>Auto</b></strong>
        <span className="footer-divider" />
        <span>Registro visual de avarias veiculares</span>
      </footer>
    </div>
  );
}
