import { Alert, StatusBar, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { PageHeader } from "../../components/PageHeader";
import { CurrencyInput } from "../../components/CurrencyInput";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { TransactionType } from "../../components/TransactionType";
import { useState } from "react";
import { TransactionTypes } from "../../utils/TransactionTypes";
import { useTransactionsDatabase } from "../../database/useTransactionsDatabase";

export default function Transaction() {
  const params = useLocalSearchParams<{ id: string }>();
  const [type, setType] = useState(TransactionTypes.Input)
  const [amount, setAmount] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [observation, setObservation] = useState('')

  const transactionsDatabase = useTransactionsDatabase()

  async function handleCreate() {
    try {
      if (amount <= 0) {
        return Alert.alert(
          'Atenção!',
          'A transação deve ser maior que zero.',
        )
      }

      setIsCreating(true)

      await transactionsDatabase.create({
        target_id: Number(params.id),
        amount: type === TransactionTypes.Output ? amount * -1 : amount,
        observation,
      })

      Alert.alert('Sucesso', 'Transação foi salva com sucesso!', [
        {
          text: 'Ok',
          onPress: router.back,
        },
      ])
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a transação')
      console.log(error)
      setIsCreating(false)
    }
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <StatusBar barStyle="dark-content" />
      <PageHeader
        title="Nova transação"
        subtitle="A cada valor guardado você fica mais próximo da sua meta. Se esforce para guardar e evitar retirar."
      />
      <View style={{ marginTop: 32, gap: 24 }}>
        <TransactionType onChange={setType} selected={type} />
        <CurrencyInput label="Valor (R$)" value={amount} onChangeValue={setAmount} />
        <Input label="Motivo (opcional)" placeholder="Ex: Investir em CDB de 110% no banco XPTO" onChangeText={setObservation} />
        <Button title="Salvar" onPress={handleCreate} isProcessing={isCreating} />
      </View>
    </View>
  );
}
