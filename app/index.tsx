import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const JogoDaVelha = () => {
  const [tabuleiro, setTabuleiro] = useState<string[]>(Array(9).fill(''));
  const [jogadorAtual, setJogadorAtual] = useState<'x' | 'o'>('x');
  const [vencedor, setVencedor] = useState<string | null>(null);
  const [empate, setEmpate] = useState(false);
  const [nomeJogador, setNomeJogador] = useState('');
  const [jogoIniciado, setJogoIniciado] = useState(false);


  const verificarFimDoJogo = (tabuleiroAtual: string[]) => {
    const combinacoesVitoria = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
      [0, 4, 8], [2, 4, 6]             // diagonais
    ];

    for (const combinacao of combinacoesVitoria) {
      const [a, b, c] = combinacao;
      if (tabuleiroAtual[a] && 
          tabuleiroAtual[a] === tabuleiroAtual[b] && 
          tabuleiroAtual[a] === tabuleiroAtual[c]) {
        setVencedor(tabuleiroAtual[a]);
        return;
      }
    }

    // Verifica empate
    if (!tabuleiroAtual.includes('') && !vencedor) {
      setEmpate(true);
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

  // Efeito para controlar a jogada da CPU
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
          
          {vencedor && (
            <Text style={styles.resultado}>
              {vencedor === 'x' ? `${nomeJogador} venceu!` : 'CPU venceu!'}
            </Text>
          )}
          
          {empate && !vencedor && (
            <Text style={styles.resultado}>Empate!</Text>
          )}
          
          {!vencedor && !empate && (
            <Text style={styles.turno}>
              {jogadorAtual === 'x' ? 'Sua vez (X)' : 'Vez da CPU (O)'}
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