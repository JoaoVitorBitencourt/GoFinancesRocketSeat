import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { VictoryPie } from "victory-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { HistoryCard } from "../../components/HistoryCard";
import { categories } from "../../utils/categories";

import { 
    Container, 
    Header, 
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
} from "./styles";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ActivityIndicator } from "react-native";
import { useAuth } from "../../hooks/auth";

interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume(){
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategory, setTotalByCategory] = useState<CategoryData[]>([]);

    const theme = useTheme();
    const { user } = useAuth();

    const dataKey = `@gofinances:transactions_user:${user.id}`;

    function handleDateChange(action: 'next' | 'prev') {        
        if(action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1));
        } else {
            setSelectedDate(subMonths(selectedDate, 1));
        }
    }

    async function loadData() {
        setIsLoading(true);
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives: TransactionData[] = responseFormatted
            .filter((transaction: TransactionData) => 
                transaction.type === 'negative' &&
                new Date(transaction.date).getMonth() === selectedDate.getMonth() &&
                new Date(transaction.date).getFullYear() === selectedDate.getFullYear()
            );

        const expensivesTotal = expensives
            .reduce((total: number, transaction: TransactionData) => total + Number(transaction.amount), 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach(expensive => {
                if(expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                }
            });

            if(categorySum > 0) {
                const totalFormatted = categorySum
                    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                const percent = `${((categorySum / expensivesTotal) * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    totalFormatted,
                    color: category.color,
                    percent
                });
            }
        });

        setTotalByCategory(totalByCategory);

        const entries = responseFormatted.filter((transaction: TransactionData) => transaction.type === 'positive');

        setIsLoading(false);
    }

    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]));

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
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
                    <Content
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: useBottomTabBarHeight()
                        }}
                    >
                        <MonthSelect>
                            <MonthSelectButton onPress={() => handleDateChange("prev")}>
                                <MonthSelectIcon name="chevron-left" />
                            </MonthSelectButton>
                        
                            <Month>
                                { format(selectedDate, "MMMM, yyyy", {locale: ptBR}) }
                            </Month>

                            <MonthSelectButton onPress={() => handleDateChange("next")}>
                                <MonthSelectIcon name="chevron-right" />
                            </MonthSelectButton>
                        </MonthSelect>


                        <ChartContainer>
                            <VictoryPie 
                                data={totalByCategory}
                                colorScale={totalByCategory.map(category => category.color)}
                                style={{
                                    labels: {
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.shape
                                    }
                                }}
                                labelRadius={50}
                                x="percent"
                                y="total"
                            />
                        </ChartContainer>

                        {
                            totalByCategory.map(item => (
                                <HistoryCard 
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }
                    </Content>
            }
        </Container>
    );
}