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
    LogoutButton
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard(){
    const data: DataListProps[] = [
        {
            id: '1',
            type: "positive",
            title: "Teste",
            amount: "R$ 1000",
            category: {
                name: 'Teste',
                icon: 'dollar-sign',
            },
            date: "13/04/2020"
        },
        {
            id: '2',
            type: "negative",
            title: "Teste",
            amount: "R$ 1000",
            category: {
                name: 'Teste',
                icon: 'coffee',
            },
            date: "13/04/2020"
        },
        {
            id: '3',
            type: "positive",
            title: "Teste",
            amount: "R$ 1000",
            category: {
                name: 'Teste',
                icon: 'dollar-sign',
            },
            date: "13/04/2020"
        },
        {
            id: '4',
            type: "positive",
            title: "Teste",
            amount: "R$ 1000",
            category: {
                name: 'Teste',
                icon: 'shopping-bag',
            },
            date: "13/04/2020"
        },
    ]
    return (
        <Container>
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
                    amount="R$ 17.400,00"
                    lastTransaction="Teste"
                />
                <HighlightCard
                type="down"
                    title="Saídas"
                    amount="R$ 1.259,00"
                    lastTransaction="Teste"
                />
                <HighlightCard
                    type="total"
                    title="Total"
                    amount="R$ 16.141,00"
                    lastTransaction="Teste"
                />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>
                <TransactionsList 
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item}/>}
                />
            </Transactions>
        </Container>
    );
}