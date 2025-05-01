import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const JogoDaVelha = () => {
  const [tabuleiro, setTabuleiro] = useState<string[]>(Array(9).fill(''));
  const [jogadorAtual, setJogadorAtual] = useState<'x' | 'o'>('x');
  const [vencedor, setVencedor] = useState<string | null>(null);
  const [empate, setEmpate] = useState(false);
  const [nomeJogador, setNomeJogador] = useState('');
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [placar, setPlacar] = useState({ jogador: 0, cpu: 0, empates: 0 });


  const verificarFimDoJogo = (tabuleiroAtual: string[]) => {
    const combinacoesVitoria = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const combinacao of combinacoesVitoria) {
      const [a, b, c] = combinacao;
      if (tabuleiroAtual[a] &&
        tabuleiroAtual[a] === tabuleiroAtual[b] &&
        tabuleiroAtual[a] === tabuleiroAtual[c]) {
        setVencedor(tabuleiroAtual[a]);

        setPlacar(prev => ({
          ...prev,
          jogador: tabuleiroAtual[a] === 'x' ? prev.jogador + 1 : prev.jogador,
          cpu: tabuleiroAtual[a] === 'o' ? prev.cpu + 1 : prev.cpu
        }));

        return;
      }

      if (!tabuleiroAtual.includes('') && !vencedor) {
        setEmpate(true);
        setPlacar(prev => ({ ...prev, empates: prev.empates + 1 }));
      }
    }
  };

  const fazerJogada = (index: number) => {
    if (jogoIniciado && !tabuleiro[index] && !vencedor && !empate && jogadorAtual === 'x') {
      const novoTabuleiro = [...tabuleiro];
      novoTabuleiro[index] = 'x';
      setTabuleiro(novoTabuleiro);
      setJogadorAtual('o');
      verificarFimDoJogo(novoTabuleiro);
    }
  };

  const jogadaCPU = () => {
    if (jogoIniciado && !vencedor && !empate && jogadorAtual === 'o') {
      const indicesVazios = tabuleiro
        .map((celula, index) => celula === '' ? index : -1)
        .filter(index => index !== -1);

      if (indicesVazios.length > 0) {
        const indiceAleatorio = indicesVazios[Math.floor(Math.random() * indicesVazios.length)];
        setTimeout(() => {
          const novoTabuleiro = [...tabuleiro];
          novoTabuleiro[indiceAleatorio] = 'o';
          setTabuleiro(novoTabuleiro);
          setJogadorAtual('x');
          verificarFimDoJogo(novoTabuleiro);
        }, 500); // Delay para parecer que a CPU está "pensando"
      }
    }
  };

  useEffect(() => {
    if (jogadorAtual === 'o' && jogoIniciado && !vencedor && !empate) {
      jogadaCPU();
    }
  }, [jogadorAtual, jogoIniciado]);

  const reiniciarJogo = () => {
    setTabuleiro(Array(9).fill(''));
    setJogadorAtual('x');
    setVencedor(null);
    setEmpate(false);
  };

  const iniciarJogo = () => {
    if (nomeJogador.trim()) {
      setJogoIniciado(true);
      reiniciarJogo();
    } else {
      alert('Por favor, insira seu nome!');
    }
  };

  // Renderizar célula do tabuleiro
  const renderCelula = (index: number) => {
    return (
      <TouchableOpacity
        style={styles.celula}
        onPress={() => fazerJogada(index)}
        disabled={!!vencedor || empate || jogadorAtual !== 'x'}
      >
        <Text style={styles.textoCelula}>{tabuleiro[index]}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {!jogoIniciado ? (
        <View style={styles.telaInicio}>
          <Text style={styles.titulo}>Jogo da Velha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            value={nomeJogador}
            onChangeText={setNomeJogador}
          />
          <TouchableOpacity style={styles.botao} onPress={iniciarJogo}>
            <Text style={styles.textoBotao}>Iniciar Jogo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.telaJogo}>
          <Text style={styles.titulo}>Bem-vindo, {nomeJogador}!</Text>

          <View style={styles.placarContainer}>
            <Text style={styles.tituloPlacar}>Placar</Text>

            <View style={styles.placarLinha}>
              <View style={styles.placarItem}>
                <Text style={styles.placarLabel}>Você</Text>
                <Text style={styles.placarValue}>{placar.jogador}</Text>
              </View>

              <View style={styles.placarItem}>
                <Text style={styles.placarLabel}>Empates</Text>
                <Text style={styles.placarValue}>{placar.empates}</Text>
              </View>

              <View style={styles.placarItem}>
                <Text style={styles.placarLabel}>CPU</Text>
                <Text style={styles.placarValue}>{placar.cpu}</Text>
              </View>
            </View>

            <View style={styles.turnoContainer}>
              <Text style={[
                styles.turnoText,
                jogadorAtual === 'x' && styles.turnoAtivo
              ]}>
                Sua vez (X)
              </Text>
              <Text style={[
                styles.turnoText,
                jogadorAtual === 'o' && styles.turnoAtivo
              ]}>
                Vez da CPU (O)
              </Text>
            </View>
          </View>

          {/* Indicador de turno */}
          <View style={styles.turnoContainer}>
            <Text style={[
              styles.turnoText,
              jogadorAtual === 'x' && styles.turnoAtivo
            ]}>
              Sua vez (X)
            </Text>
            <Text style={[
              styles.turnoText,
              jogadorAtual === 'o' && styles.turnoAtivo
            ]}>
              Vez da CPU (O)
            </Text>
          </View>

          {(vencedor || empate) && (
            <Text style={styles.resultado}>
              {vencedor === 'x' ? `${nomeJogador} venceu!` :
                vencedor === 'o' ? 'CPU venceu!' : 'Empate!'}
            </Text>
          )}

          <View style={styles.tabuleiro}>
            <View style={styles.linha}>
              {renderCelula(0)}
              {renderCelula(1)}
              {renderCelula(2)}
            </View>
            <View style={styles.linha}>
              {renderCelula(3)}
              {renderCelula(4)}
              {renderCelula(5)}
            </View>
            <View style={styles.linha}>
              {renderCelula(6)}
              {renderCelula(7)}
              {renderCelula(8)}
            </View>
          </View>

          {(vencedor || empate) && (
            <TouchableOpacity style={styles.botao} onPress={reiniciarJogo}>
              <Text style={styles.textoBotao}>Jogar Novamente</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  placarContainer: {
    width: '50%',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  tituloPlacar: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  placarLinha: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  placarItem: {
    alignItems: 'center',
  },
  placarLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  placarValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  turnoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  turnoText: {
    fontSize: 16,
    color: '#95a5a6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  turnoAtivo: {
    color: '#fff',
    backgroundColor: '#3498db',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  telaInicio: {
    width: '100%',
    alignItems: 'center',
  },
  telaJogo: {
    width: '100%',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  tabuleiro: {
    marginVertical: 20,
  },
  linha: {
    flexDirection: 'row',
  },
  celula: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  textoCelula: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  turno: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  resultado: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green',
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  textoBotao: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JogoDaVelha;