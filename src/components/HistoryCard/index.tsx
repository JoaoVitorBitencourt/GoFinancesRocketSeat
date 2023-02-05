import { 
    Container,
    Title,
    Amount
} from "./styles";

interface Props {
    color: string;
    title: string;
    amount: string;
}

export function HistoryCard({
    color,
    title,
    amount,
    ...rest
}: Props) {
    return (
        <Container color={color} {...rest}>
            <Title>{title}</Title>
            <Amount>{amount}</Amount>
        </Container>
    );
}