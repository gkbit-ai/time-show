let baterias = [];
let tempoDecorrido = 0;
let intervalo;
let proximaIndex = 0;

// Navegar entre telas
function mostrarTela(tela) {
    document.getElementById('configuracao').classList.add('hidden');
    document.getElementById('execucao').classList.add('hidden');
    document.getElementById(tela).classList.remove('hidden');
}

// Adicionar bateria
document.getElementById('adicionar').addEventListener('click', () => {
    const nome = document.getElementById('nome').value;
    const canal = parseInt(document.getElementById('canal').value);
    const tempo = parseInt(document.getElementById('tempo').value);

    if (nome && !isNaN(canal) && !isNaN(tempo)) {
        baterias.push({ nome, canal, tempo });
        atualizarLista();
        document.getElementById('nome').value = '';
        document.getElementById('canal').value = '';
        document.getElementById('tempo').value = '';
    } else {
        alert('Preencha todos os campos corretamente.');
    }
});

// Atualizar lista de baterias
function atualizarLista() {
    const lista = document.getElementById('lista-baterias');
    lista.innerHTML = '';

    baterias.forEach((bateria, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            Nome: ${bateria.nome}, Canal: ${bateria.canal}, Tempo: ${bateria.tempo}s
            <button class="button-remover" onclick="removerBateria(${index})">Remover</button>
        `;
        lista.appendChild(li);
    });
}

// Remover bateria
function removerBateria(index) {
    baterias.splice(index, 1);
    atualizarLista();
}

// Salvar projeto
document.getElementById('salvar-projeto').addEventListener('click', () => {
    localStorage.setItem('projetoFogos', JSON.stringify(baterias));
    alert('Projeto salvo com sucesso!');
});

// Carregar projeto
document.getElementById('carregar-projeto').addEventListener('click', () => {
    const projetoSalvo = localStorage.getItem('projetoFogos');
    if (projetoSalvo) {
        baterias = JSON.parse(projetoSalvo);
        atualizarLista();
        alert('Projeto carregado com sucesso!');
    } else {
        alert('Nenhum projeto salvo encontrado.');
    }
});

// Iniciar show
document.getElementById('iniciar-show').addEventListener('click', () => {
    const tempoInicial = parseInt(document.getElementById('tempo-inicial').value);
    if (isNaN(tempoInicial)) {
        alert('Defina um tempo inicial válido.');
        return;
    }

    mostrarTela('execucao');
    iniciarExecucao(tempoInicial);
});

// Função de execução
function iniciarExecucao(delay) {
    tempoDecorrido = 0;
    proximaIndex = 0;

    intervalo = setInterval(() => {
        const horarioAtual = new Date().toLocaleTimeString();
        document.getElementById('horario').textContent = horarioAtual;

        // Exibir e reduzir a contagem do delay
        if (delay > 0) {
            document.getElementById('contagem-delay').textContent = `${delay}s`;
            delay--;
            return;
        } else if (delay === 0) {
            document.getElementById('info-delay').textContent = "Próximo Acionamento";
        }

        tempoDecorrido++;
        document.getElementById('tempo-decorrido').textContent = `${tempoDecorrido}s`;

        if (proximaIndex < baterias.length) {
            const bateriaAtual = baterias[proximaIndex];
            const tempoRestante = bateriaAtual.tempo - tempoDecorrido;

            if (tempoRestante <= 0) {
                document.getElementById('log-acionamentos').innerHTML += `<li>Acionando ${bateriaAtual.nome} no canal ${bateriaAtual.canal}</li>`;
                proximaIndex++;
            } else {
                document.getElementById('proxima-bateria').textContent = `Próxima: Canal ${bateriaAtual.canal}, Bateria ${bateriaAtual.nome}`;
                document.getElementById('contagem-delay').textContent = `Faltam: ${tempoRestante}s`;
            }
        } else {
            clearInterval(intervalo);
            document.getElementById('proxima-bateria').textContent = "Show Finalizado!";
            document.getElementById('contagem-delay').textContent = "---";
        }
    }, 1000);
}
