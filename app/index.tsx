import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react'

const JogoDaVelha = () => {
  const [tabuleiro, setTabuleiro] = useState<string[]>(Array(9).fill(''));
  const [resultado, setResultado] = useState<boolean>();
  const [turno, setTurno] = useState<'x' | 'o'>('x');

  // adicionar alert
  //  

  // Transformar o tabuleiro 1D em linhas 2D para mapeamento
  const linhas = () => [
    tabuleiro.slice(0, 3),
    tabuleiro.slice(3, 6),
    tabuleiro.slice(6, 9),
  ]

  const handlePress = (index: number) => {
    if (tabuleiro[index] === '' && resultado === undefined) {
      const novoTabuleiro = [...tabuleiro];
      novoTabuleiro[index] = turno;
      setTabuleiro(novoTabuleiro);

      setTurno(turno === 'x' ? 'o' : 'x');

      verificaVencedor(novoTabuleiro);
    }
  };

  const verificaVencedor = (tabuleiro: string[]) => {
    const combinacoes = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas (corrigido)
      [0, 4, 8], [2, 4, 6]             // diagonais
    ]

    for (const combinacao of combinacoes) {
      const [a, b, c] = combinacao;
      if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
        setResultado(true);
        return;
      }
    }

    if (tabuleiro.every(celula => celula !== '')) {
      setResultado(false);
    }
  }

  return (
    <View style={styles.container}>
       <Text style={styles.turnoText}>Turno: {turno.toUpperCase()}</Text>
        <Text style={styles.resultado}>
          {resultado !== undefined ? (resultado ? 'Vencedor!' : 'Empate') : ''}
        </Text>
      <View style={styles.botoes}>
        {linhas().map((linha: string[], i: number) => (
          <View key={i} style={styles.row}>
            {linha.map((celula, j) => (
              <TouchableOpacity
                key={j}
                style={styles.botao}
                onPress={() => handlePress(i * 3 + j)} //calculo do indice no tabuleiro 1d
              >
                <Text style={styles.botaoTexto}>{celula}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faebd7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  turnoText: {
    fontSize: 24,
    color: '#a52a2a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  botoes: {
    width: '30%', // Controla a largura total do grid
    aspectRatio: 1, // Mantém quadrado
    maxWidth: 400, // Limite máximo de tamanho
    maxHeight: 400
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
  },
  botao: {
    flex: 1,
    backgroundColor: '#a52a2a',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    aspectRatio: 1, // Mantém os botões quadrados
    maxWidth: 100,
  },
  resultado: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    height: 40,
    color: '#a52a2a',
  },
  botaoTexto: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 16,
    marginTop: 16,
  }
});

const header = () => {
  return (
    <View style={styles.header}>
      <Text></Text>
    </View>
  );
}

export default JogoDaVelha;
