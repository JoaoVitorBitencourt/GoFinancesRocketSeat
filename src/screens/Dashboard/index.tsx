import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components/native';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
    Container, 
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    LogoutButton,
    LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighLightProps {
    amount: string;
    lastTransaction: string;
}
interface HighlightData {
    entries: HighLightProps,
    expensives: HighLightProps,
    total: HighLightProps
}

export function Dashboard(){
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();

    const dataKey = '@gofinances:transactions';

    function getLastTransactionDate(
        transactions: DataListProps[],
        type: 'positive' | 'negative'
    ) {
        const date = new Date(Math.max.apply(Math, transactions
            .filter(transaction => transaction.type === type)
            .map(transaction => new Date(transaction.date).getTime())
        ));

        return `${date.getDate()} de ${date.toLocaleString('pt-BR', { month: 'long' })}`;
    }

    async function loadTransactions(){
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
        .map((transaction: DataListProps) => {
            if(transaction.type === 'positive'){
                entriesTotal += Number(transaction.amount);
            } else {
                expensiveTotal += Number(transaction.amount);
            }

            const amount = Number(transaction.amount)
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            }).format(new Date(transaction.date)); 

            return {
                id: transaction.id,
                name: transaction.name,
                amount,
                date,
                category: transaction.category,
                type: transaction.type
            }
        });

        setTransactions(transactionsFormatted);

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
        const totalInterval = `01 a ${lastTransactionExpensives}`;

        setHighlightData({
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                lastTransaction: `Última saída dia ${lastTransactionExpensives}`
            },
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                lastTransaction: `Última entrada dia ${lastTransactionEntries}`
            },
            total: {
                amount: (entriesTotal - expensiveTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                lastTransaction: totalInterval
            }
        });

        setIsLoading(false);
    }

    useEffect(() => {
        loadTransactions();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <Container>
            {
                isLoading 
                ? 
                <LoadContainer>
                    <ActivityIndicator 
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer> 
                :
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/68356307?v=4' }}/>
                                <User>
                                    <UserGreeting>Olá, </UserGreeting>
                                    <UserName>João Vitor</UserName>
                                </User>
                            </UserInfo>

                            <LogoutButton onPress={() => {}}>
                                <Icon name="power"/>
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlightCards>
                        <HighlightCard
                            type="up"
                            title="Entradas"
                            amount={highlightData.entries.amount}
                            lastTransaction={highlightData.entries.lastTransaction}
                        />
                        <HighlightCard
                        type="down"
                            title="Saídas"
                            amount={highlightData.expensives.amount}
                            lastTransaction={highlightData.expensives.lastTransaction}
                        />
                        <HighlightCard
                            type="total"
                            title="Total"
                            amount={highlightData.total.amount}
                            lastTransaction={highlightData.total.lastTransaction}
                        />
                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>
                        <TransactionsList 
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item}/>}
                        />
                    </Transactions>
                </>
            }
        </Container>
    );
}