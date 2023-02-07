import { TouchableOpacityProps } from "react-native";
import { SvgProps } from "react-native-svg";

import { 
    Button,
    ImageContainer,
    Text,
} from "./styles";

interface Props extends TouchableOpacityProps {
    title: string;
    svg: React.FC<SvgProps>;
}

export function SignInSocialButton({
    title,
    svg: Svg,
    onPress,
    ...rest
}: Props){
    return (
        <Button onPress={onPress}>
            <ImageContainer>
                <Svg />
            </ImageContainer>

            <Text>{title}</Text>
        </Button>
    );
}